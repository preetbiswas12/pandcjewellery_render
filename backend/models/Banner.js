const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hero-main', 'hero-side', 'casual-inspiration'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Banner', bannerSchema);
