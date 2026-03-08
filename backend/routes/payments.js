const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const {
  createOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  refundPayment,
  fetchRefundDetails,
} = require('../services/razorpayService');

// Logger utility
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, data);
};

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for the given items
 * Public endpoint - users can create orders
 */
router.post('/create-order', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, subtotal, discount = 0, shipping = 0, shippingAddress, notes = {} } = req.body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required customer information',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subtotal',
      });
    }

    // Calculate total
    const total = subtotal - discount + shipping;

    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order total must be greater than 0',
      });
    }

    // Create order in database first (before creating Razorpay order)
    const orderNumber = `ORD-${Date.now()}`;
    const dbOrder = new Order({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      discount,
      shipping,
      total,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      status: 'pending',
    });

    await dbOrder.save();
    log('info', 'Database order created', { orderId: dbOrder._id, orderNumber });

    // Create Razorpay order
    const razorpayResult = await createOrder(
      total,
      'INR',
      {
        orderId: dbOrder._id.toString(),
        orderNumber,
        customerEmail,
      }
    );

    if (!razorpayResult.success) {
      // Delete the database order if Razorpay order creation fails
      await Order.findByIdAndDelete(dbOrder._id);
      log('error', 'Razorpay order creation failed', { orderId: dbOrder._id });
      return res.status(400).json(razorpayResult);
    }

    // Update database order with Razorpay order ID
    dbOrder.razorpayOrderId = razorpayResult.data.orderId;
    await dbOrder.save();

    log('info', 'Razorpay order created successfully', {
      orderId: dbOrder._id,
      razorpayOrderId: razorpayResult.data.orderId,
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: dbOrder._id,
        orderNumber: dbOrder.orderNumber,
        razorpayOrderId: razorpayResult.data.orderId,
        amount: razorpayResult.data.amount,
        currency: razorpayResult.data.currency,
      },
    });
  } catch (error) {
    log('error', 'Create order error', { message: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

/**
 * POST /api/payments/verify
 * Verify payment signature and update order status
 * Called by frontend after successful payment callback
 */
router.post('/verify', async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Validation
    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data',
      });
    }

    // Fetch order from database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify signature using Razorpay's verification method
    const isSignatureValid = verifyPaymentSignature(
      order.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      log('warn', 'Payment signature verification failed', {
        orderId,
        razorpayPaymentId,
      });
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Payment not verified.',
      });
    }

    // Verify payment with Razorpay API (double verification for security)
    const paymentDetails = await fetchPaymentDetails(razorpayPaymentId);
    if (!paymentDetails.success) {
      log('error', 'Failed to fetch payment details', { razorpayPaymentId });
      return res.status(400).json({
        success: false,
        message: 'Failed to verify payment with Razorpay',
      });
    }

    // Check if payment status is captured/authorized
    if (!['captured', 'authorized'].includes(paymentDetails.data.status)) {
      log('warn', 'Payment not captured/authorized', {
        orderId,
        status: paymentDetails.data.status,
      });
      return res.status(400).json({
        success: false,
        message: 'Payment not completed. Status: ' + paymentDetails.data.status,
      });
    }

    // Verify amount matches
    if (Math.abs(paymentDetails.data.amount - order.total) > 0.01) {
      log('error', 'Payment amount mismatch', {
        orderId,
        expectedAmount: order.total,
        receivedAmount: paymentDetails.data.amount,
      });
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
      });
    }

    // Update order with payment details
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentStatus = 'completed';
    order.status = 'processing';
    await order.save();

    log('info', 'Payment verified successfully', {
      orderId,
      razorpayPaymentId,
      amount: order.total,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    });
  } catch (error) {
    log('error', 'Payment verification error', { message: error.message });
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

/**
 * POST /api/payments/webhook
 * Razorpay webhook endpoint
 * Should be configured in Razorpay dashboard
 * Events: payment.authorized, payment.failed, payment.captured
 */
router.post('/webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;

    log('info', 'Webhook received', { event });

    // Verify webhook signature if Razorpay provides it
    // (Optional: Add webhook signature verification for additional security)

    // Handle different payment events
    switch (event) {
      case 'payment.authorized':
      case 'payment.captured': {
        const razorpayPaymentId = payload.payment.entity.id;
        const razorpayOrderId = payload.payment.entity.order_id;

        // Find order by Razorpay order ID
        const order = await Order.findOne({ razorpayOrderId });
        if (!order) {
          log('warn', 'Order not found for webhook payment', { razorpayOrderId });
          return res.status(404).json({ received: true });
        }

        // Update order if not already updated
        if (order.paymentStatus !== 'completed') {
          order.razorpayPaymentId = razorpayPaymentId;
          order.paymentStatus = 'completed';
          order.status = 'processing';
          await order.save();

          log('info', 'Order updated via webhook', {
            orderId: order._id,
            event,
          });
        }

        res.json({ received: true });
        break;
      }

      case 'payment.failed': {
        const razorpayPaymentId = payload.payment.entity.id;
        const razorpayOrderId = payload.payment.entity.order_id;

        const order = await Order.findOne({ razorpayOrderId });
        if (!order) {
          log('warn', 'Order not found for failed payment webhook', { razorpayOrderId });
          return res.status(404).json({ received: true });
        }

        // Update order status
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
        await order.save();

        log('warn', 'Payment failed webhook processed', {
          orderId: order._id,
          razorpayPaymentId,
        });

        res.json({ received: true });
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const refundId = payload.refund.entity.id;
        const razorpayPaymentId = payload.refund.entity.payment_id;

        const order = await Order.findOne({ razorpayPaymentId });
        if (!order) {
          log('warn', 'Order not found for refund webhook', { razorpayPaymentId });
          return res.status(404).json({ received: true });
        }

        // Update refund details
        order.refundId = refundId;
        order.refundStatus = event === 'refund.processed' ? 'full' : 'partial';
        await order.save();

        log('info', 'Refund webhook processed', {
          orderId: order._id,
          refundId,
        });

        res.json({ received: true });
        break;
      }

      default:
        log('info', 'Unhandled webhook event', { event });
        res.json({ received: true });
    }
  } catch (error) {
    log('error', 'Webhook processing error', { message: error.message });
    // Always return 200 to acknowledge webhook receipt
    res.status(200).json({ received: false });
  }
});

/**
 * POST /api/payments/refund
 * Process refund for an order
 */
router.post('/refund', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Validation
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!order.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this order',
      });
    }

    if (order.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded',
      });
    }

    // Check refund amount
    const refundAmount = amount || order.total;
    if (refundAmount <= 0 || refundAmount > order.total) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund amount',
      });
    }

    // Process refund
    const refundResult = await refundPayment(order.razorpayPaymentId, refundAmount);

    if (!refundResult.success) {
      log('error', 'Refund processing failed', { orderId });
      return res.status(400).json(refundResult);
    }

    // Update order with refund details
    order.refundId = refundResult.data.refundId;
    order.refundAmount = refundResult.data.amount;
    order.refundStatus = refundAmount >= order.total ? 'full' : 'partial';
    order.status = 'cancelled';
    await order.save();

    log('info', 'Refund processed successfully', {
      orderId,
      refundId: refundResult.data.refundId,
      amount: refundAmount,
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: refundResult.data,
    });
  } catch (error) {
    log('error', 'Refund processing error', { message: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

/**
 * GET /api/payments/:orderId
 * Get payment details for an order
 */
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        paymentStatus: order.paymentStatus,
        total: order.total,
        refundId: order.refundId,
        refundAmount: order.refundAmount,
        refundStatus: order.refundStatus,
      },
    });
  } catch (error) {
    log('error', 'Get payment details error', { message: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
    });
  }
});

module.exports = router;
