const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
