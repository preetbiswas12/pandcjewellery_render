const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('[Products] Get all error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
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
