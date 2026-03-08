// Shipping routes - Calculate shipping charges using Shiprocket
// Endpoint: POST/GET /api/shipping/calculate
// Endpoint: GET /api/shipping/check/:pincode

const express = require('express');
const router = express.Router();
const {
  checkServiceability,
  calculateShippingCharges,
  getShippingCost,
  validatePincode,
} = require('../services/shiprocketService');

/**
 * POST /api/shipping/calculate
 * Calculate shipping charges based on destination pincode
 * STRICT: Only returns cost for valid pincodes
 * Minimum shipping: ₹70
 * 
 * Request body:
 * {
 *   "destinationPincode": "400001",
 *   "weight": 1,
 *   "amount": 5000
 * }
 */
router.post('/calculate', async (req, res) => {
  try {
    const { destinationPincode, weight = 1, amount = 0 } = req.body;

    // Validate pincode - STRICT
    if (!destinationPincode) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Pincode is required',
      });
    }

    if (!validatePincode(destinationPincode)) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Invalid pincode format',
      });
    }

    // Get shipping cost
    const shippingResult = await calculateShippingCharges(destinationPincode, weight, amount);

    // Only return cost if available
    if (shippingResult.available && shippingResult.cost) {
      console.log(`[Shipping] Pincode ${destinationPincode} → ₹${shippingResult.cost}`);
      
      return res.json({
        success: true,
        available: true,
        cost: shippingResult.cost,
        message: shippingResult.message,
      });
    } else {
      // NOT serviceable or invalid
      console.log(`[Shipping] Pincode ${destinationPincode} → Not available`);
      
      return res.json({
        success: false,
        available: false,
        cost: null,
        message: shippingResult.message || 'Shipping not available for this location',
      });
    }
  } catch (error) {
    console.error('[Shipping] Calculate error:', error.message);
    
    return res.status(500).json({
      success: false,
      available: false,
      cost: null,
      message: 'Unable to calculate shipping',
      // Do NOT expose error details in production
    });
  }
});

/**
 * GET /api/shipping/check/:pincode
 * Check if location is serviceable and get shipping options
 * 
 * Example: /api/shipping/check/400001
 */
router.get('/check/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate pincode
    if (!validatePincode(pincode)) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        message: 'Invalid pincode format. Please enter a 6-digit pincode.',
      });
    }

    // Check serviceability
    const serviceability = await checkServiceability(pincode);

    console.log(`[Shipping] Serviceability check for pincode ${pincode}: ${serviceability.serviceable}`);

    return res.json({
      success: true,
      pincode,
      serviceable: serviceability.serviceable,
      data: serviceability.data || null,
      couriers: serviceability.couriers || [],
      message: serviceability.message,
    });
  } catch (error) {
    console.error('[Shipping] Check error:', error.message);
    
    return res.status(500).json({
      success: false,
      serviceable: false,
      message: 'Failed to check serviceability',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

/**
 * GET /api/shipping/rates/:pincode
 * Get detailed shipping rates for a pincode
 * 
 * Example: /api/shipping/rates/400001
 */
router.get('/rates/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { weight = 1 } = req.query;

    if (!validatePincode(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pincode format',
      });
    }

    const result = await calculateShippingCharges(pincode, parseFloat(weight));

    return res.json({
      success: result.available,
      pincode,
      weight: parseFloat(weight),
      available: result.available,
      shippingOptions: result.shippingOptions || [],
      recommendedOption: result.recommendedOption || null,
      message: result.message,
    });
  } catch (error) {
    console.error('[Shipping] Rates error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping rates',
    });
  }
});

/**
 * POST /api/shipping/validate-pincode
 * Validate pincode format and serviceability
 * 
 * Request:
 * {
 *   "pincode": "400001"
 * }
 */
router.post('/validate-pincode', async (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Pincode is required',
      });
    }

    // Check format
    if (!validatePincode(pincode)) {
      return res.json({
        success: true,
        valid: false,
        format: false,
        message: 'Invalid pincode format. Please enter a 6-digit pincode.',
      });
    }

    // Check serviceability
    const serviceability = await checkServiceability(pincode);

    return res.json({
      success: true,
      valid: serviceability.serviceable,
      format: true,
      serviceable: serviceability.serviceable,
      message: serviceability.serviceable ? 'Pincode is serviceable' : serviceability.message,
    });
  } catch (error) {
    console.error('[Shipping] Validate pincode error:', error.message);
    
    return res.status(500).json({
      success: false,
      valid: false,
      message: 'Failed to validate pincode',
    });
  }
});

module.exports = router;
