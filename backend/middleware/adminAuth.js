const jwt = require('jsonwebtoken');

/**
 * Middleware to verify admin authentication
 * Protects admin routes by checking JWT token
 */
const adminAuth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for admin (not regular user)
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin access required',
      });
    }

    // Attach admin ID to request for later use
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
};

/**
 * Middleware to check admin permissions
 * Optional: can restrict specific admin routes to certain permissions
 */
const adminPermission = (permissions = []) => {
  return async (req, res, next) => {
    try {
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(req.adminId);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found',
        });
      }

      // If no specific permissions required, proceed
      if (permissions.length === 0) {
        return next();
      }

      // Check if admin has required permissions
      const hasPermission = permissions.some((perm) =>
        admin.permissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Permission check failed',
      });
    }
  };
};

module.exports = { adminAuth, adminPermission };
