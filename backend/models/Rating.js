const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  userId: {
    type: String, // Clerk user ID (email or clerk ID)
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    default: '',
  },
  comment: {
    type: String,
    default: '',
  },
  helpful: {
    type: Number,
    default: 0,
  },
  unhelpful: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false, // Whether user purchased the product
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique constraint: one rating per user per product
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Update updatedAt before saving
ratingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rating', ratingSchema);
