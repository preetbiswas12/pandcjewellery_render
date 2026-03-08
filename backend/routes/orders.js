const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    console.error('[Orders] Get all error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('[Orders] Get single error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { items, shippingAddress, total } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order must contain at least one item' 
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shipping address is required' 
      });
    }
    
    if (!total || typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Total must be a positive number' 
      });
    }
    
    const order = new Order(req.body);
    const newOrder = await order.save();
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    console.error('[Orders] Create error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to create order: ' + err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    // Validate ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format' });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!req.body.status || !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('[Orders] Update status error:', err.message);
    res.status(400).json({ success: false, message: 'Failed to update order status' });
  }
});

module.exports = router;
