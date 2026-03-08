const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    default: 'Admin',
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  permissions: {
    type: [String],
    default: ['view-dashboard', 'manage-products', 'manage-orders', 'manage-coupons', 'manage-banners', 'manage-categories', 'manage-users'],
  },
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    return false;
  }
};

// Method to check if account is locked
adminSchema.methods.isAccountLocked = function() {
  return this.lockUntil && this.lockUntil > new Date();
};

// Method to increment login attempts
adminSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  // Otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTimeHours = 1;
  
  // Lock the account after 5 attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isAccountLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + lockTimeHours * 60 * 60 * 1000) };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
adminSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 }
  });
};

module.exports = mongoose.model('Admin', adminSchema);
