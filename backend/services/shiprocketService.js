// Zone-based fallback shipping (no external API required)
// Minimum shipping charge: ₹70

// Shipping rates by zone (in rupees)
const SHIPPING_RATES = {
  metro: 70,
  tier1: 75,
  tier2: 85,
  tier3: 95,
  northEast: 120,
  remote: 130,
};

/**
 * Check if a pincode is serviceable
 * Only services valid, complete 6-digit pincodes
 * @param {string} pincode - 6-digit pincode
 * @returns {object} Serviceability result
 */
const checkServiceability = async (pincode) => {
  try {
    // STRICT: Only accept valid, complete 6-digit pincodes
    if (!validatePincode(pincode)) {
      return {
        serviceable: false,
        message: 'Invalid or incomplete pincode',
      };
    }

    console.log('[Shipping] Valid pincode:', pincode);
    return {
      serviceable: true,
      message: 'Location is serviceable',
    };
  } catch (error) {
    console.error('[Shipping] Error:', error.message);
    
    // On error, return NOT serviceable (fail-safe)
    return {
      serviceable: false,
      message: 'Unable to check serviceability',
    };
  }
};

/**
 * Calculate shipping charges for a given pincode
 * STRICT: Only calculates for valid, complete pincodes
 * Minimum shipping: ₹70
 * @param {string} pincode - Destination pincode (must be 6 digits)
 * @param {number} weight - Package weight (unused, for compatibility)
 * @param {number} amount - Order amount (unused, for compatibility)
 * @returns {object} Shipping calculation result
 */
const calculateShippingCharges = async (pincode, weight = 0.5, amount = 0) => {
  try {
    // STRICT VALIDATION: Reject invalid or incomplete pincodes
    if (!validatePincode(pincode)) {
      return {
        cost: null,
        available: false,
        message: 'Invalid pincode. Cannot calculate shipping.',
      };
    }

    // Calculate cost based on zone
    const cost = getFallbackShippingCost(pincode);
    console.log(`[Shipping] Pincode ${pincode} - Cost: ₹${cost}`);
    
    return {
      cost,
      available: true,
      message: `Shipping: ₹${cost}`,
    };
  } catch (error) {
    console.error('[Shipping] Error:', error.message);
    
    // Return NO cost on error (fail-safe - don't show anything)
    return {
      cost: null,
      available: false,
      message: 'Cannot calculate shipping at this time',
    };
  }
};

/**
 * Get shipping cost - wrapper for backwards compatibility
 * @param {string} pincode - Destination pincode
 * @param {number} weight - Package weight
 * @returns {object} Shipping cost result
 */
const getShippingCost = async (pincode, weight = 0.5) => {
  return calculateShippingCharges(pincode, weight);
};

/**
 * Validate pincode format (Indian format: 6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} Validation result
 */
const validatePincode = (pincode) => {
  if (!pincode) return false;
  
  const pincodeStr = String(pincode).trim();
  
  // Check if it's a 6-digit number
  const isValid = /^\d{6}$/.test(pincodeStr);
  
  return isValid;
};

/**
 * Get shipping cost based on pincode pattern
 * Zone-based pricing with minimum ₹70
 * Warehouse location: 201304 (Noida, NCR)
 * @param {string} pincode - Destination pincode (6 digits)
 * @returns {number} Shipping cost in rupees (minimum ₹70)
 */
const getFallbackShippingCost = (pincode) => {
  const pincodeStr = String(pincode).substring(0, 3);
  
  // ZONE 1: Delhi, NCR, Noida (Warehouse location) - CLOSEST
  const zone1Patterns = ['110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210'];
  if (zone1Patterns.includes(pincodeStr)) {
    return 70; // Minimum: Local delivery
  }

  // ZONE 2: Jaipur & Rajasthan (500-600 km)
  const zone2Patterns = ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310'];
  if (zone2Patterns.includes(pincodeStr)) {
    return 75;
  }

  // ZONE 3: Haryana, Himachal Pradesh (300-400 km)
  const zone3Patterns = ['121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179'];
  if (zone3Patterns.includes(pincodeStr)) {
    return 80;
  }

  // ZONE 4: Punjab & Chandigarh (300-350 km)
  const zone4Patterns = ['140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '160', '161', '162', '163', '164'];
  if (zone4Patterns.includes(pincodeStr)) {
    return 85;
  }

  // ZONE 5: Uttar Pradesh (200-400 km)
  const zone5Patterns = ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229'];
  if (zone5Patterns.includes(pincodeStr)) {
    return 80;
  }

  // ZONE 6: Madhya Pradesh & Indore (900-1000 km)
  const zone6Patterns = ['452', '453', '454', '455', '456', '457', '458', '459', '460', '461'];
  if (zone6Patterns.includes(pincodeStr)) {
    return 95;
  }

  // ZONE 7: Maharashtra & Pune (1100-1200 km)
  const zone7Patterns = ['410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '440', '441', '442', '443', '444', '445', '446', '447', '448', '449'];
  if (zone7Patterns.includes(pincodeStr)) {
    return 100;
  }

  // ZONE 8: Mumbai & Maharashtra coast (1200-1300 km)
  const zone8Patterns = ['400', '401', '402', '403', '404', '405', '406', '407', '408', '409'];
  if (zone8Patterns.includes(pincodeStr)) {
    return 110;
  }

  // ZONE 9: Gujarat & Ahmedabad (1500-1600 km)
  const zone9Patterns = ['362', '363', '364', '365', '380', '381', '382', '383', '384', '385', '386', '387', '388', '389', '390', '391', '392', '393', '394', '395', '396'];
  if (zone9Patterns.includes(pincodeStr)) {
    return 105;
  }

  // ZONE 10: West Bengal & Kolkata (1500-1600 km)
  const zone10Patterns = ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '710', '711', '712', '713', '714', '715', '716', '717', '718', '719'];
  if (zone10Patterns.includes(pincodeStr)) {
    return 110;
  }

  // ZONE 11: North-East India (1800-2200 km)
  const zone11Patterns = ['794', '788', '797', '798', '799', '761', '762', '763', '764', '765'];
  if (zone11Patterns.includes(pincodeStr)) {
    return 125;
  }

  // ZONE 12: Bangalore & South India (2200-2500 km)
  const zone12Patterns = ['560', '561', '562', '563', '564', '565', '566', '567', '568', '569', '570'];
  if (zone12Patterns.includes(pincodeStr)) {
    return 130;
  }

  // DEFAULT: Rest of India (average distance)
  return 95;
};

module.exports = {
  checkServiceability,
  calculateShippingCharges,
  getShippingCost,
  validatePincode,
};
