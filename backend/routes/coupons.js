const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons, count: coupons.length });
  } catch (err) {
    console.error('[Coupons] Get all error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

// Validate coupon
router.get('/validate/:code', async (req, res) => {
  try {
    if (!req.params.code || req.params.code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }
    
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase().trim(),
      isActive: true 
    });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });
    }
    
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validTo) {
      return res.status(400).json({ success: false, message: 'Coupon expired' });
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    
    res.json({ success: true, data: coupon });
  } catch (err) {
    console.error('[Coupons] Validate error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
});

// Create coupon
router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue } = req.body;
    
    if (!code || code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }
    
    if (!discountType || !['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({ success: false, message: 'Invalid discount type' });
    }
    
    if (discountValue === undefined || typeof discountValue !== 'number' || discountValue <= 0) {
      return res.status(400).json({ success: false, message: 'Discount value must be positive' });
    }
    
    const coupon = new Coupon(req.body);
    const newCoupon = await coupon.save();
    res.status(201).json({ success: true, data: newCoupon });
  } catch (err) {
    console.error('[Coupons] Create error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to create coupon: ' + err.message });
  }
});

// Update coupon
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid coupon ID format' });
    }
    
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    
    res.json({ success: true, data: updatedCoupon });
  } catch (err) {
    console.error('[Coupons] Update error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to update coupon: ' + err.message });
  }
});

// Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
