const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper: Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * POST /api/admin/login
 * Admin login endpoint
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (admin.isAccountLocked()) {
      const lockMinutes = Math.ceil((admin.lockUntil - new Date()) / (1000 * 60));
      return res.status(429).json({
        success: false,
        message: `Account locked. Try again in ${lockMinutes} minutes.`,
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    // Verify password
    const isPasswordValid = await admin.matchPassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate token
    const token = generateToken(admin._id);

    // Return response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    });
  } catch (error) {
    console.error('[Admin Auth] Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

/**
 * POST /api/admin/verify
 * Verify admin token
 * Headers: Authorization: Bearer <token>
 */
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Get admin details
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    });
  } catch (error) {
    console.error('[Admin Auth] Verify error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
    });
  }
});

/**
 * POST /api/admin/logout
 * Admin logout (client-side, just for logging)
 */
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
});

module.exports = router;
