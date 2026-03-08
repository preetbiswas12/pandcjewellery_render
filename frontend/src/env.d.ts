/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_MONGODB_URI: string;
  readonly VITE_MONGODB_DATABASE: string;
  readonly VITE_PAYMENT_GATEWAY_KEY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_EMAIL_SERVICE_API_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;
  readonly VITE_FREE_SHIPPING_THRESHOLD: string;
  readonly VITE_STANDARD_SHIPPING_COST: string;
  readonly VITE_TAX_RATE: string;
  readonly VITE_CURRENCY_SYMBOL: string;
  readonly VITE_ENABLE_WISHLIST: string;
  readonly VITE_ENABLE_REVIEWS: string;
  readonly VITE_ENABLE_CHAT_SUPPORT: string;
  readonly VITE_ENABLE_LOYALTY_PROGRAM: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_MOCK_PAYMENTS: string;
  readonly VITE_SOCIAL_FACEBOOK: string;
  readonly VITE_SOCIAL_INSTAGRAM: string;
  readonly VITE_SOCIAL_TWITTER: string;
  readonly VITE_SOCIAL_LINKEDIN: string;
  readonly VITE_BUSINESS_EMAIL: string;
  readonly VITE_BUSINESS_PHONE: string;
  readonly VITE_BUSINESS_ADDRESS: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
