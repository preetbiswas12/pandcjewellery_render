// Razorpay Payment Integration Utility
import { config } from '../config/env';

// Define Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (1 rupee = 100 paise)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
    on: (event: string, handler: (response: any) => void) => void;
  };
}

declare const window: Window & typeof globalThis;

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Payment options interface
export interface PaymentOptions {
  amount: number; // Amount in rupees
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDetails?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentId: string, response: RazorpayResponse) => void;
  onFailure: (error: any) => void;
  onDismiss?: () => void;
}

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (options: PaymentOptions): Promise<void> => {
  // Load Razorpay script
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    options.onFailure(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    return;
  }

  // Check if Razorpay key is configured
  const razorpayKey = config.razorpay.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!razorpayKey) {
    // Show detailed error with instructions
    const errorMessage = `
⚠️ Razorpay is not configured!

To enable payments, please follow these steps:

1. Sign up for Razorpay at: https://razorpay.com
2. Get your Test API Key from: https://dashboard.razorpay.com/app/website-app-settings/api-keys
3. Add this to your .env file:
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
4. Restart the development server

For testing, you can use this test key: rzp_test_1234567890
(This is a demo key - replace with your actual key for real payments)
    `.trim();
    
    console.error(errorMessage);
    options.onFailure(new Error('Razorpay key is not configured. Please check console for setup instructions.'));
    return;
  }

  // Convert amount to paise (Razorpay expects amount in paise)
  const amountInPaise = Math.round(options.amount * 100);

  // Razorpay options
  const razorpayOptions: RazorpayOptions = {
    key: razorpayKey,
    amount: amountInPaise,
    currency: config.currency.code,
    name: config.app.name,
    description: options.orderDetails || 'Order Payment',
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    notes: options.notes || {},
    theme: {
      color: '#000000', // Black theme matching your store
    },
    handler: (response: RazorpayResponse) => {
      // Payment successful
      options.onSuccess(response.razorpay_payment_id, response);
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  };

  // Create Razorpay instance
  const razorpay = new window.Razorpay(razorpayOptions);

  // Handle payment failure
  razorpay.on('payment.failed', (response: any) => {
    options.onFailure(response.error);
  });

  // Open Razorpay checkout
  razorpay.open();
};

// Backend payment integration interface
export interface BackendPaymentOptions {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  onSuccess: (orderId: string) => void;
  onFailure: (error: any) => void;
  onDismiss?: () => void;
}

// Backend API base URL - prioritize production HTTPS
export const API_BASE_URL = (() => {
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

// Create order via backend and open Razorpay checkout
export const initiateBackendRazorpayPayment = async (
  options: BackendPaymentOptions
): Promise<void> => {
  try {
    // Step 1: Create order on backend
    console.log('Creating order on backend...');
    const createOrderResponse = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: options.customerName,
        customerEmail: options.customerEmail,
        customerPhone: options.customerPhone,
        items: options.items,
        shippingAddress: options.shippingAddress,
        subtotal: options.subtotal,
        discount: options.discount,
        shipping: options.shipping,
        tax: options.tax,
        total: options.total,
        couponCode: options.couponCode,
      }),
    });

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const orderData = await createOrderResponse.json();
    const { orderId, razorpayOrderId } = orderData;

    console.log('Order created:', { orderId, razorpayOrderId });

    // Step 2: Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    // Step 3: Check if Razorpay key is configured
    const razorpayKey = config.razorpay.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error('Razorpay key is not configured. Please check your environment setup.');
    }

    // Step 4: Open Razorpay checkout
    const amountInPaise = Math.round(options.total * 100);

    const razorpayOptions: RazorpayOptions = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: config.currency.code,
      name: config.app.name,
      description: `Order Payment - ${orderId}`,
      order_id: razorpayOrderId,
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      notes: {
        orderId: orderId,
      },
      theme: {
        color: '#000000',
      },
      handler: async (response: RazorpayResponse) => {
        // Step 5: Verify payment on backend
        await verifyPaymentOnBackend(
          orderId,
          response.razorpay_payment_id,
          response.razorpay_signature,
          options
        );
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) {
            options.onDismiss();
          }
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);

    // Handle payment failure
    razorpay.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      options.onFailure(response.error);
    });

    // Open Razorpay checkout
    razorpay.open();
  } catch (error) {
    console.error('Payment initiation error:', error);
    options.onFailure(error);
  }
};

// Verify payment with backend
export const verifyPaymentOnBackend = async (
  orderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string | undefined,
  options: BackendPaymentOptions
): Promise<void> => {
  try {
    if (!razorpaySignature) {
      throw new Error('Payment signature missing. Payment cannot be verified.');
    }

    console.log('Verifying payment on backend...');

    const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        razorpayPaymentId,
        razorpaySignature,
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.message || 'Payment verification failed');
    }

    const verificationResult = await verifyResponse.json();
    console.log('Payment verified successfully:', verificationResult);

    // Payment verified - call success callback with orderId
    options.onSuccess(orderId);
  } catch (error) {
    console.error('Payment verification error:', error);
    options.onFailure(error);
  }
};

// Verify payment on backend (this should ideally be done on server-side)
// For now, we'll just validate that we have a payment ID
export const verifyPayment = (paymentId: string): boolean => {
  // In production, this should make an API call to your backend
  // to verify the payment signature using Razorpay's key_secret
  return !!paymentId && paymentId.startsWith('pay_');
};

// Format amount for display
export const formatCurrency = (amount: number): string => {
  return `${config.currency.symbol}${amount.toFixed(2)}`;
};