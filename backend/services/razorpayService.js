const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (1 rupee = 100 paise)
 * @param {string} currency - Currency code (e.g., 'INR')
 * @param {object} notes - Additional notes/metadata
 * @returns {object} Order creation result
 */
const createOrder = async (amount, currency = 'INR', notes = {}) => {
  try {
    // Convert rupees to paise
    const amountInPaise = Math.round(amount * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency,
      notes: {
        ...notes,
        createdAt: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    console.log('[Razorpay] Order created:', {
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    return {
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        amountInRupees: amount,
        currency: order.currency,
        status: order.status,
      },
    };
  } catch (error) {
    console.error('[Razorpay] Create order error:', error.message);
    return {
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    };
  }
};

/**
 * Verify payment signature to ensure payment authenticity
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature from payment response
 * @returns {boolean} Verification result
 */
const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    // Create signature body
    const signatureBody = `${razorpayOrderId}|${razorpayPaymentId}`;
    
    // Generate expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest('hex');

    // Compare signatures
    const isSignatureValid = expectedSignature === razorpaySignature;

    if (isSignatureValid) {
      console.log('[Razorpay] Payment signature verified successfully');
    } else {
      console.warn('[Razorpay] Payment signature verification failed', {
        expected: expectedSignature,
        received: razorpaySignature,
      });
    }

    return isSignatureValid;
  } catch (error) {
    console.error('[Razorpay] Signature verification error:', error.message);
    return false;
  }
};

/**
 * Fetch payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {object} Payment details
 */
const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);

    return {
      success: true,
      data: {
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        amountInRupees: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        description: payment.description,
        createdAt: new Date(payment.created_at * 1000),
      },
    };
  } catch (error) {
    console.error('[Razorpay] Fetch payment error:', error.message);
    return {
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message,
    };
  }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (optional, full refund if not provided)
 * @param {string} reason - Refund reason
 * @returns {object} Refund result
 */
const refundPayment = async (paymentId, amount = null, reason = '') => {
  try {
    const refundOptions = {
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
      notes: {
        reason,
        refundedAt: new Date().toISOString(),
      },
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    console.log('[Razorpay] Refund created:', {
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount,
      status: refund.status,
    });

    return {
      success: true,
      data: {
        refundId: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount,
        amountInRupees: refund.amount / 100,
        status: refund.status,
        createdAt: new Date(refund.created_at * 1000),
      },
    };
  } catch (error) {
    console.error('[Razorpay] Refund error:', error.message);
    return {
      success: false,
      message: 'Failed to process refund',
      error: error.message,
    };
  }
};

/**
 * Fetch refund details
 * @param {string} refundId - Razorpay refund ID
 * @returns {object} Refund details
 */
const fetchRefundDetails = async (refundId) => {
  try {
    const refund = await razorpay.refunds.fetch(refundId);

    return {
      success: true,
      data: {
        refundId: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount,
        amountInRupees: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        createdAt: new Date(refund.created_at * 1000),
      },
    };
  } catch (error) {
    console.error('[Razorpay] Fetch refund error:', error.message);
    return {
      success: false,
      message: 'Failed to fetch refund details',
      error: error.message,
    };
  }
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  refundPayment,
  fetchRefundDetails,
};
