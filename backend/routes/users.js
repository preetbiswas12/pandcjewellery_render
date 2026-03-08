const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    console.error('[Users] Get all error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('[Users] Get single error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    // Prevent password updates via this endpoint
    if (req.body.password) {
      return res.status(400).json({ success: false, message: 'Cannot update password via this endpoint' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error('[Users] Update error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to update user: ' + err.message });
  }
});

module.exports = router;
