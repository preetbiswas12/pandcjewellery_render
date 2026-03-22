const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
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

    console.log(`[Products] === REQUEST DEBUG ===`);
    console.log(`[Products] Query params:`, req.query);
    console.log(`[Products] minPrice param: ${req.query.minPrice} (type: ${typeof req.query.minPrice})`);
    console.log(`[Products] maxPrice param: ${req.query.maxPrice} (type: ${typeof req.query.maxPrice})`);

    // ⚠️ DEFENSIVE: Build filter query with validation
    const filter = {};
    
    // Filter by category - handle both slug (lookup ID) and direct ID
    if (req.query.category && typeof req.query.category === 'string' && req.query.category.trim()) {
      const categorySlug = req.query.category.trim();
      
      // Try to find category by slug first
      const foundCategory = await Category.findOne({ slug: categorySlug });
      
      if (foundCategory) {
        filter.category = foundCategory._id.toString();
      } else if (isValidObjectId(categorySlug)) {
        // If not found by slug and it's a valid ObjectId, use it directly
        filter.category = categorySlug;
      }
      // If neither slug nor ID matches, filter will be empty (no products)
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
    const hasMinPrice = req.query.minPrice !== undefined && req.query.minPrice !== null && req.query.minPrice !== '';
    const hasMaxPrice = req.query.maxPrice !== undefined && req.query.maxPrice !== null && req.query.maxPrice !== '';
    
    if (hasMinPrice || hasMaxPrice) {
      filter.price = {};
      
      if (hasMinPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          filter.price.$gte = minPrice;
          console.log(`[Products] ✓ Applied minPrice filter: $gte ${minPrice}`);
        }
      }
      
      if (hasMaxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          filter.price.$lte = maxPrice;
          console.log(`[Products] ✓ Applied maxPrice filter: $lte ${maxPrice}`);
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

    // 🔍 DEBUG: Log actual products returned and their prices
    if (products.length > 0) {
      console.log(`[Products] ✓ Query returned ${products.length} products`);
      const priceRange = {
        min: Math.min(...products.map(p => p.price || 0)),
        max: Math.max(...products.map(p => p.price || 0))
      };
      console.log(`[Products] Price range in results: ₹${priceRange.min} - ₹${priceRange.max}`);
      console.log(`[Products] Sample products (first 3):`, products.slice(0, 3).map(p => ({
        name: p.name?.substring(0, 30),
        price: p.price
      })));
    } else {
      console.log(`[Products] ⚠️ Query returned 0 products with filter:`, JSON.stringify(filter));
    }

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
    
    // ⚠️ FIXED: Use runValidators: false for partial updates to avoid validating required fields not included in update
    // This allows patching individual fields without requiring all required fields
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    console.log(`[Products] ✓ Updated product ${req.params.id}`);
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

// 🔍 DEBUG ENDPOINT: Check all product prices in database
router.get('/debug/verify-prices', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    
    // Query all products to check price distribution
    const allProducts = await Product.find({}).select('name price').lean().exec();
    
    // Calculate price statistics
    const prices = allProducts.map(p => p.price || 0);
    const stats = {
      totalProducts: allProducts.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    };
    
    // Get products in the requested range (if provided)
    let filteredProducts = allProducts;
    if (minPrice !== undefined && maxPrice !== undefined) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      filteredProducts = allProducts.filter(p => p.price >= min && p.price <= max);
    }
    
    // Get price distribution buckets
    const buckets = {
      '0-1000': allProducts.filter(p => p.price <= 1000).length,
      '1000-5000': allProducts.filter(p => p.price > 1000 && p.price <= 5000).length,
      '5000-10000': allProducts.filter(p => p.price > 5000 && p.price <= 10000).length,
      '10000+': allProducts.filter(p => p.price > 10000).length,
    };
    
    res.json({
      success: true,
      stats,
      priceDistribution: buckets,
      filteredCount: filteredProducts.length,
      sampleProducts: filteredProducts.slice(0, 5).map(p => ({
        name: p.name?.substring(0, 40),
        price: p.price
      }))
    });
  } catch (err) {
    console.error('[Products] Debug error:', err.message);
    res.status(500).json({ success: false, message: 'Debug error: ' + err.message });
  }
});

module.exports = router;
