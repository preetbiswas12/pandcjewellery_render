// Frontend Shiprocket Integration Service
// Calculates real-time shipping charges based on user's pincode

import { config } from '../config/env';

// API base URL from environment - prioritize production HTTPS
const API_BASE_URL = (() => {
  // If explicitly set to a custom value and not http:// localhost, use it
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.startsWith('http://')) {
    return envUrl;
  }
  
  // For localhost development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Default to production HTTPS
  return 'https://pandcjewellery.com/api';
})();

/**
 * Validate pincode format (6 digits for India)
 */
export const validatePincodeFormat = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode);
};

/**
 * Check if a pincode is serviceable and get available courier options
 * @param {string} pincode - User's pincode
 * @returns {Promise<Object>} - Serviceability data
 */
export const checkServiceability = async (pincode: string): Promise<any> => {
  try {
    if (!validatePincodeFormat(pincode)) {
      return {
        success: false,
        serviceable: false,
        message: 'Invalid pincode format. Please enter a 6-digit pincode.',
      };
    }

    const response = await fetch(`${API_BASE_URL}/shipping/check/${pincode}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Serviceability check error:', error);
    return {
      success: false,
      serviceable: false,
      message: 'Unable to check serviceability. Please try again.',
    };
  }
};

/**
 * Calculate shipping charge for checkout
 * STRICT: Only returns shipping cost for valid pincodes
 * @param {string} destinationPincode - User's pincode (must be 6 digits)
 * @param {number} weight - Package weight in kg (unused)
 * @param {number} subtotal - Order subtotal (unused)
 * @returns {Promise<Object>} - Shipping cost and details
 */
export const calculateShippingCharge = async (
  destinationPincode: string,
  weight: number = 0.5,
  subtotal: number = 0
): Promise<{
  available: boolean;
  cost: number | null;
  message: string;
}> => {
  try {
    // STRICT: Reject empty pincodes
    if (!destinationPincode || !destinationPincode.trim()) {
      return {
        available: false,
        cost: null,
        message: 'Enter pincode to calculate shipping',
      };
    }

    // STRICT: Reject invalid format (must be exactly 6 digits)
    if (!validatePincodeFormat(destinationPincode)) {
      return {
        available: false,
        cost: null,
        message: 'Invalid pincode format (6 digits required)',
      };
    }

    // Call backend shipping API
    const response = await fetch(`${API_BASE_URL}/shipping/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinationPincode,
        weight,
        amount: subtotal,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Handle response
    if (result.success && result.available) {
      return {
        available: true,
        cost: result.cost,
        message: result.message || `Shipping: ₹${result.cost}`,
      };
    } else {
      // NOT serviceable - don't show anything
      return {
        available: false,
        cost: null,
        message: result.message || 'Cannot calculate shipping for this location',
      };
    }
  } catch (error) {
    console.error('Shipping calculation error');

    // On error, don't show any shipping cost
    return {
      available: false,
      cost: null,
      message: 'Unable to calculate shipping',
    };
  }
};

/**
 * Get all available shipping options for a pincode
 * @param {string} pincode - User's pincode
 * @param {number} weight - Package weight in kg
 * @returns {Promise<Array>} - Array of shipping options
 */
export const getShippingOptions = async (
  pincode: string,
  weight: number = 0.5
): Promise<any[]> => {
  try {
    if (!validatePincodeFormat(pincode)) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/shipping/rates/${pincode}?weight=${weight}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.shippingOptions) {
      return data.shippingOptions;
    }

    return [];
  } catch (error) {
    console.error('Get shipping options error:', error);
    return [];
  }
};

/**
 * Validate pincode and return serviceability status
 * @param {string} pincode - User's pincode
 * @returns {Promise<Object>} - Validation result with serviceability
 */
export const validatePincode = async (
  pincode: string
): Promise<{
  valid: boolean;
  format: boolean;
  serviceable: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/validate-pincode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pincode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      valid: data.valid,
      format: data.format !== false,
      serviceable: data.serviceable,
      message: data.message,
    };
  } catch (error) {
    console.error('Pincode validation error:', error);
    return {
      valid: false,
      format: false,
      serviceable: false,
      message: 'Unable to validate pincode',
    };
  }
};

/**
 * Format shipping cost for display
 */
export const formatShippingCost = (cost: number): string => {
  return `₹${cost.toFixed(0)}`;
};

/**
 * Get estimated delivery message
 */
export const getDeliveryMessage = (deliveryDays?: number, zipCode?: string): string => {
  if (!deliveryDays) {
    return 'Delivery time varies by location';
  }

  if (deliveryDays <= 2) {
    return `🚚 Express Delivery - ${deliveryDays} days`;
  } else if (deliveryDays <= 5) {
    return `📦 Standard Delivery - ${deliveryDays} days`;
  } else {
    return `🐢 Economy Delivery - ${deliveryDays} days`;
  }
};

export default {
  validatePincodeFormat,
  checkServiceability,
  calculateShippingCharge,
  getShippingOptions,
  validatePincode,
  formatShippingCost,
  getDeliveryMessage,
};
