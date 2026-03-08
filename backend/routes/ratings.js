const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Logger utility
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, data);
};

/**
 * GET /api/ratings/product/:productId
 * Get all ratings for a product with statistics
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    // Get all ratings for product
    const ratings = await Rating.find({ productId }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
      : 0;

    // Count ratings by star
    const ratingCounts = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length,
    };

    res.json({
      success: true,
      data: {
        ratings,
        statistics: {
          averageRating: parseFloat(averageRating),
          totalRatings,
          ratingCounts,
          percentages: {
            5: totalRatings > 0 ? ((ratingCounts[5] / totalRatings) * 100).toFixed(0) : 0,
            4: totalRatings > 0 ? ((ratingCounts[4] / totalRatings) * 100).toFixed(0) : 0,
            3: totalRatings > 0 ? ((ratingCounts[3] / totalRatings) * 100).toFixed(0) : 0,
            2: totalRatings > 0 ? ((ratingCounts[2] / totalRatings) * 100).toFixed(0) : 0,
            1: totalRatings > 0 ? ((ratingCounts[1] / totalRatings) * 100).toFixed(0) : 0,
          }
        }
      }
    });
  } catch (error) {
    log('error', 'Get product ratings error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
  }
});

/**
 * GET /api/ratings/user/:productId/:userId
 * Get user's rating for a specific product
 */
router.get('/user/:productId/:userId', async (req, res) => {
  try {
    const { productId, userId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const userRating = await Rating.findOne({ productId, userId });

    res.json({
      success: true,
      data: userRating || null
    });
  } catch (error) {
    log('error', 'Get user rating error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch rating' });
  }
});

/**
 * POST /api/ratings
 * Create a new rating
 */
router.post('/', async (req, res) => {
  try {
    const { productId, userId, userName, userEmail, rating, title, comment } = req.body;

    // Validation
    if (!productId || !userId || !userName || !userEmail || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productId, userId, userName, userEmail, rating'
      });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already rated this product
    const existingRating = await Rating.findOne({ productId, userId });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this product. Use update endpoint to change your rating.'
      });
    }

    // Create rating
    const newRating = new Rating({
      productId,
      userId,
      userName,
      userEmail,
      rating: parseInt(rating),
      title: title || '',
      comment: comment || '',
    });

    await newRating.save();

    log('info', 'Rating created', { productId, userId, rating });

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: newRating
    });
  } catch (error) {
    log('error', 'Create rating error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to create rating' });
  }
});

/**
 * PUT /api/ratings/:ratingId
 * Update a rating
 */
router.put('/:ratingId', async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { userId, rating, title, comment } = req.body;

    if (!isValidObjectId(ratingId)) {
      return res.status(400).json({ success: false, message: 'Invalid rating ID' });
    }

    // Find the rating
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    // Verify ownership
    if (existingRating.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this rating' });
    }

    // Update allowed fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      existingRating.rating = parseInt(rating);
    }

    if (title !== undefined) existingRating.title = title;
    if (comment !== undefined) existingRating.comment = comment;

    await existingRating.save();

    log('info', 'Rating updated', { ratingId, userId });

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: existingRating
    });
  } catch (error) {
    log('error', 'Update rating error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to update rating' });
  }
});

/**
 * DELETE /api/ratings/:ratingId
 * Delete a rating
 */
router.delete('/:ratingId', async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(ratingId)) {
      return res.status(400).json({ success: false, message: 'Invalid rating ID' });
    }

    // Find the rating
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    // Verify ownership
    if (rating.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this rating' });
    }

    await Rating.findByIdAndDelete(ratingId);

    log('info', 'Rating deleted', { ratingId, userId });

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    log('error', 'Delete rating error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to delete rating' });
  }
});

/**
 * POST /api/ratings/:ratingId/helpful
 * Mark rating as helpful/unhelpful
 */
router.post('/:ratingId/helpful', async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { helpful } = req.body; // true = helpful, false = unhelpful

    if (!isValidObjectId(ratingId)) {
      return res.status(400).json({ success: false, message: 'Invalid rating ID' });
    }

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    if (helpful === true) {
      rating.helpful += 1;
    } else if (helpful === false) {
      rating.unhelpful += 1;
    }

    await rating.save();

    res.json({
      success: true,
      data: { helpful: rating.helpful, unhelpful: rating.unhelpful }
    });
  } catch (error) {
    log('error', 'Mark helpful error:', { message: error.message });
    res.status(500).json({ success: false, message: 'Failed to mark rating' });
  }
});

module.exports = router;
