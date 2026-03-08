const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend build directory
const staticFilePath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticFilePath));

// API Routes
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected' });
  }
  next();
});

// Import middleware
const { adminAuth, adminPermission } = require('./middleware/adminAuth');

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const bannerRoutes = require('./routes/banners');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const shippingRoutes = require('./routes/shipping');
const ratingRoutes = require('./routes/ratings');
const adminAuthRoutes = require('./routes/adminAuth');

// Public routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/ratings', ratingRoutes);

// Admin Authentication Routes (public for login, verify, logout)
app.use('/api/admin/auth', adminAuthRoutes);

// Protected Admin Routes (require authentication)
app.use('/api/admin/products', adminAuth, productRoutes);
app.use('/api/admin/orders', adminAuth, orderRoutes);
app.use('/api/admin/coupons', adminAuth, couponRoutes);
app.use('/api/admin/banners', adminAuth, bannerRoutes);
app.use('/api/admin/categories', adminAuth, categoryRoutes);
app.use('/api/admin/users', adminAuth, userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Fabric Store API is running...' });
});

// Serve index.html for all non-API routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilePath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Page not found' });
    }
  });
});

// MongoDB Connection with proper error handling
let isDBConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
    });
    isDBConnected = true;
  } catch (err) {
    isDBConnected = false;
    setTimeout(connectDB, 5000);
  }
};

// Start MongoDB connection in background (don't wait for it)
connectDB();

// Start server immediately for Render health checks
const server = app.listen(PORT, '0.0.0.0', () => {
  // Server started silently
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
