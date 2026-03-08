const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  items: [{
    productId: String,
    productName: String,
    sku: String,
    quantity: Number,
    price: Number,
    image: String,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'paypal', 'cod'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  // Razorpay Payment Details
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  // Refund tracking
  refundId: {
    type: String,
    default: null,
  },
  refundAmount: {
    type: Number,
    default: 0,
  },
  refundStatus: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
