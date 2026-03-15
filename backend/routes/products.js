const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all products with pagination and filtering (optimized for fast loading)
router.get('/', async (req, res) => {
  try {
    // ⚠️ DEFENSIVE: Validate and sanitize pagination parameters
    const pageParam = parseInt(req.query.page) || 1;
    const limitParam = parseInt(req.query.limit) || 24;
    
    const page = Math.max(1, pageParam);
    const limit = Math.min(50, Math.max(1, limitParam));
    const skip = (page - 1) * limit;

    // ⚠️ DEFENSIVE: Build filter query with validation
    const filter = {};
    
    // Filter by category if provided and not empty
    if (req.query.category && typeof req.query.category === 'string' && req.query.category.trim()) {
      filter.category = req.query.category.trim();
    }
    
    // Filter by subCategory if provided and not empty
    if (req.query.subCategory && typeof req.query.subCategory === 'string' && req.query.subCategory.trim()) {
      filter.subCategory = req.query.subCategory.trim();
    }

    // Filter by color if provided and not empty
    if (req.query.color && typeof req.query.color === 'string' && req.query.color.trim()) {
      filter.colors = { $in: [req.query.color.trim()] };
    }

    // ⚠️ DEFENSIVE: Validate and apply price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          filter.price.$gte = minPrice;
        }
      }
      
      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          filter.price.$lte = maxPrice;
        }
      }
    }

    // ⚠️ DEFENSIVE: Parse and validate sort options
    let sortBy = req.query.sortBy || '-createdAt'; // Default to newest
    const sortOptions = {};
    
    if (typeof sortBy === 'string') {
      if (sortBy.startsWith('-')) {
        // Handle descending order (-field)
        const field = sortBy.substring(1);
        // Whitelist allowed fields to prevent injection
        const allowedFields = ['createdAt', 'price', 'quantity', 'name'];
        if (allowedFields.includes(field)) {
          sortOptions[field] = -1;
        } else {
          sortOptions['createdAt'] = -1; // Fallback
        }
      } else {
        // Handle ascending order (field)
        // Whitelist allowed fields to prevent injection
        const allowedFields = ['createdAt', 'price', 'quantity', 'name'];
        if (allowedFields.includes(sortBy)) {
          sortOptions[sortBy] = 1;
        } else {
          sortOptions['createdAt'] = -1; // Fallback to default
        }
      }
    }

    console.log(`[Products] Filter: ${JSON.stringify(filter)}, Sort: ${JSON.stringify(sortOptions)}, Page: ${page}, Limit: ${limit}`);

    // ⚠️ OPTIMIZED: Use lean() for faster queries - we don't need Mongoose document features
    const products = await Product.find(filter)
      .select('name price offerPercentage quantity category subCategory images colors createdAt sku _id')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean() // Returns plain JS objects instead of Mongoose documents
      .exec();

    // ⚠️ DEFENSIVE: Get total count for pagination info with error handling
    let total = 0;
    try {
      total = await Product.countDocuments(filter);
    } catch (countErr) {
      console.error('[Products] Count error:', countErr.message);
      total = products.length; // Fallback: use returned products length
    }

    // ⚠️ DEFENSIVE: Ensure data is valid before returning
    const safeProducts = Array.isArray(products) ? products : [];
    const pages = Math.ceil(total / limit) || 1;
    const hasMore = skip + limit < total;

    // Add cache headers for better client-side performance
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json({ 
      success: true, 
      data: safeProducts,
      pagination: {
        page,
        limit,
        total: Math.max(0, total), // Ensure total is never negative
        pages,
        hasMore
      }
    });
  } catch (err) {
    console.error('[Products] Get all error:', err.message);
    // ⚠️ DEFENSIVE: Return safe error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get single product (with full details)
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    
    // Use lean() for faster query performance
    const product = await Product.findById(req.params.id).lean().exec();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Add cache header for single product pages (24 hours)
    res.set('Cache-Control', 'public, max-age=86400');
    res.json({ success: true, data: product });
  } catch (err) {
    console.error('[Products] Get single error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, price, category } = req.body;
    if (!name || price === undefined || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, price, category' 
      });
    }
    
    // Validate price is positive
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price must be a positive number' 
      });
    }
    
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error('[Products] Create error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to create product: ' + err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    
    // Validate price if provided
    if (req.body.price !== undefined) {
      if (typeof req.body.price !== 'number' || req.body.price < 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Price must be a positive number' 
        });
      }
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error('[Products] Update error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to update product: ' + err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully', data: product });
  } catch (err) {
    console.error('[Products] Delete error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

module.exports = router;
