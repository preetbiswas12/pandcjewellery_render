// Environment configuration utility
// Access environment variables with type safety and defaults

export const config = {
  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'P&C Jewellery',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },

  // API
  api: {
    // Production: Use environment variable (set in Render)
    // Local dev: Defaults to localhost:5000
    url: import.meta.env.VITE_API_URL || (
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : 'https://pandcjewellery.com/api' // Production fallback
    ),
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },

  // Payment Gateway
  payment: {
    gatewayKey: import.meta.env.VITE_PAYMENT_GATEWAY_KEY || '',
    gatewaySecret: import.meta.env.VITE_PAYMENT_GATEWAY_SECRET || '',
  },

  // Razorpay
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
  },

  // Image Storage
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  },

  // Google Services
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  },

  // Email
  email: {
    serviceApiKey: import.meta.env.VITE_EMAIL_SERVICE_API_KEY || '',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
    facebookPixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID || '',
  },

  // Social Media
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL || '',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
    twitter: import.meta.env.VITE_TWITTER_URL || '',
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  },

  // Business
  business: {
    email: import.meta.env.VITE_BUSINESS_EMAIL || 'pandctexfab@gmail.com',
    phone: import.meta.env.VITE_BUSINESS_PHONE || '+91-9876543210',
    address: import.meta.env.VITE_BUSINESS_ADDRESS || '123 Fabric Street, Mumbai, India',
  },

  // Shipping
  shipping: {
    freeThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 2000,
    standardCost: Number(import.meta.env.VITE_STANDARD_SHIPPING_COST) || 100,
    expressCost: Number(import.meta.env.VITE_EXPRESS_SHIPPING_COST) || 200,
  },

  // Tax
  tax: {
    rate: Number(import.meta.env.VITE_TAX_RATE) || 0,
    gstNumber: import.meta.env.VITE_GST_NUMBER || '',
  },

  // Currency
  currency: {
    symbol: import.meta.env.VITE_CURRENCY_SYMBOL || '₹',
    code: import.meta.env.VITE_CURRENCY_CODE || 'INR',
  },

  // Feature Flags
  features: {
    wishlist: import.meta.env.VITE_ENABLE_WISHLIST === 'true',
    reviews: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
    chatSupport: import.meta.env.VITE_ENABLE_CHAT_SUPPORT === 'true',
  },

  // Admin
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@Jewellerytore.com',
  },

  // Development
  dev: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    mockPayments: import.meta.env.VITE_MOCK_PAYMENTS === 'true',
  },
};

// Helper function to check if required env variables are set
export const validateEnv = () => {
  const warnings: string[] = [];

  // Check critical variables
  if (!config.payment.gatewayKey && !config.dev.mockPayments) {
    warnings.push('Payment gateway key is not set. Payments will not work.');
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
};

// Auto-validate on import in development
if (import.meta.env.DEV) {
  validateEnv();
}