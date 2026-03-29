const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let compression;
try {
  compression = require('compression');
} catch {
  // compression middleware is optional - return a no-op middleware function
  compression = () => (req, res, next) => next();
}
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(compression()); // ⚠️ OPTIMIZED: Enable gzip compression for faster responses
app.use(express.json());

// Cache-busting headers for production
// HTML files: never cache - users always see fresh content
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/') {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// JS/CSS/Image files: cache for 1 year (safe because Vite adds version hashes)
app.use((req, res, next) => {
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

// Serve static files from the frontend build directory
const staticFilePath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticFilePath));

// Health check endpoints - BEFORE DB middleware so they always work
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = mongoose.connection.readyState === 1;
  res.status(isHealthy ? 200 : 503).json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'P&C Jewellery Store API is running...' });
});

// Database connection check middleware (after health checks)
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

// Serve index.html for all non-API routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilePath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Page not found' });
    }
  });
});

// Global error handling middleware (catch-all for route errors)
app.use((err, req, res, next) => {
  console.error('❌ Route Error:', err.message, err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB Connection with proper error handling
let isDBConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    isDBConnected = true;
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    isDBConnected = false;
    console.error('✗ MongoDB connection error:', err.message);
    setTimeout(connectDB, 5000);
  }
};

// Start MongoDB connection in background (don't wait for it)
connectDB();

// MongoDB connection event listeners for debugging
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('✓ MongoDB reconnected successfully');
});

// Start server immediately for Render health checks
const server = app.listen(PORT, '0.0.0.0', () => {
  // Server started silently
});

// Global error handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally: send this to error tracking service (e.g., Sentry)
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Optionally: send this to error tracking service (e.g., Sentry)
  // In production, you might want to gracefully restart after logging
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📍 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📍 SIGINT received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
