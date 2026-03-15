const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true, // Index for search
  },
  price: {
    type: Number,
    required: true,
    index: true, // Index for price range filtering
  },
  offerPercentage: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true, // Index for category filtering
  },
  subCategory: {
    type: String,
    required: true,
    index: true, // Index for subcategory filtering
  },
  jewelleryType: {
    type: String,
    required: true,
  },
  careInstructions: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  colors: [{
    type: String,
    index: true, // Index for color filtering
  }],
  features: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Create compound indexes for common query patterns
productSchema.index({ category: 1, subCategory: 1 }); // For category + subcategory filtering
productSchema.index({ category: 1, price: 1 }); // For category + price range
productSchema.index({ price: 1, createdAt: -1 }); // For price sorting
productSchema.index({ createdAt: -1 }); // For newest first sorting
productSchema.index({ name: 'text', description: 'text' }); // For text search (future feature)

module.exports = mongoose.model('Product', productSchema);
