const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
  },
  subCategory: {
    type: String,
    required: true,
  },
  fabricType: {
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
  }],
  features: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
