const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, data: banners, count: banners.length });
  } catch (err) {
    console.error('[Banners] Get all error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid banner ID format' });
    }
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.json({ success: true, data: banner });
  } catch (err) {
    console.error('[Banners] Get single error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch banner' });
  }
});

// Create banner
router.post('/', async (req, res) => {
  try {
    const { type, title, image, link } = req.body;
    
    if (!type || !['hero-main', 'hero-side', 'casual-inspiration'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid banner type' });
    }
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    if (!image || image.trim() === '') {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    
    if (!link || link.trim() === '') {
      return res.status(400).json({ success: false, message: 'Link is required' });
    }
    
    const banner = new Banner(req.body);
    const newBanner = await banner.save();
    res.status(201).json({ success: true, data: newBanner });
  } catch (err) {
    console.error('[Banners] Create error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to create banner: ' + err.message });
  }
});

// Update banner
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid banner ID format' });
    }
    
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBanner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.json({ success: true, data: updatedBanner });
  } catch (err) {
    console.error('[Banners] Update error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to update banner: ' + err.message });
  }
});

// Delete banner
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid banner ID format' });
    }
    
    const banner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.json({ success: true, message: 'Banner deleted successfully', data: banner });
  } catch (err) {
    console.error('[Banners] Delete error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
});

module.exports = router;
