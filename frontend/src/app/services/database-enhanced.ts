// Enhanced Database Service
// Uses MongoDB API directly - no localStorage fallback to ensure real-time data sync

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Always use MongoDB API (set to false to completely remove localStorage)
const USE_LOCAL_STORAGE = false;

export interface Product {
  _id: string;
  sku: string;
  name: string;
  price: number;
  offerPercentage: number;
  quantity: number;
  category: string;
  subCategory: string;
  jewelleryType: string;
  careInstructions: string;
  description: string;
  images: string[];
  colors: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  type: 'hero-main' | 'hero-side' | 'casual-inspiration';
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  subCategories: {
    name: string;
    slug: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type CollectionName = 'products' | 'orders' | 'coupons' | 'banners' | 'categories';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Local Storage Service (for development without backend)
class LocalStorageService {
  private listeners: Map<CollectionName, Set<(data: any[]) => void>> = new Map();

  constructor() {
    this.initializeCollections();
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  private initializeCollections() {
    const collections: CollectionName[] = ['products', 'orders', 'coupons', 'banners', 'categories'];
    collections.forEach(collection => {
      if (!localStorage.getItem(collection)) {
        localStorage.setItem(collection, JSON.stringify([]));
      }
    });
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key && ['products', 'orders', 'coupons', 'banners', 'categories'].includes(event.key)) {
      const collection = event.key as CollectionName;
      const newData = event.newValue ? JSON.parse(event.newValue) : [];
      this.notifyListeners(collection, newData);
    }
  }

  private notifyListeners(collection: CollectionName, data: any[]) {
    const listeners = this.listeners.get(collection);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private triggerStorageEvent(collection: CollectionName) {
    this.getAll(collection).then(data => {
      this.notifyListeners(collection, data);
    });
  }

  subscribe(collection: CollectionName, callback: (data: any[]) => void) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    this.listeners.get(collection)!.add(callback);

    return () => {
      const listeners = this.listeners.get(collection);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  async getAll<T>(collection: CollectionName): Promise<T[]> {
    const data = localStorage.getItem(collection);
    return Promise.resolve(data ? JSON.parse(data) : []);
  }

  async getById<T>(collection: CollectionName, id: string): Promise<T | null> {
    const items = await this.getAll<T & { _id: string }>(collection);
    return items.find(item => item._id === id) || null;
  }

  async create<T extends { _id?: string }>(collection: CollectionName, data: T): Promise<T & { _id: string }> {
    const items = await this.getAll(collection);
    const newItem = {
      ...data,
      _id: data._id || this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as T & { _id: string; createdAt: string; updatedAt: string };
    items.push(newItem);
    localStorage.setItem(collection, JSON.stringify(items));
    this.triggerStorageEvent(collection);
    return Promise.resolve(newItem);
  }

  async update<T extends { _id: string }>(collection: CollectionName, id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.getAll<T>(collection);
    const index = items.findIndex((item: any) => item._id === id);
    
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      _id: id,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(collection, JSON.stringify(items));
    this.triggerStorageEvent(collection);
    return Promise.resolve(items[index]);
  }

  async delete(collection: CollectionName, id: string): Promise<boolean> {
    const items = await this.getAll(collection);
    const filteredItems = items.filter((item: any) => item._id !== id);
    
    if (filteredItems.length === items.length) return false;

    localStorage.setItem(collection, JSON.stringify(filteredItems));
    this.triggerStorageEvent(collection);
    return Promise.resolve(true);
  }

  async query<T>(collection: CollectionName, filter: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll<T>(collection);
    return items.filter(filter);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  clearAll() {
    localStorage.removeItem('products');
    localStorage.removeItem('orders');
    localStorage.removeItem('coupons');
    localStorage.removeItem('banners');
    localStorage.removeItem('categories');
    this.initializeCollections();
  }
}

// MongoDB API Service (for production with backend)
class MongoDBService {
  private listeners: Map<CollectionName, Set<(data: any[]) => void>> = new Map();

  subscribe(collection: CollectionName, callback: (data: any[]) => void) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    this.listeners.get(collection)!.add(callback);

    return () => {
      const listeners = this.listeners.get(collection);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  private notifyListeners(collection: CollectionName, data: any[]) {
    const listeners = this.listeners.get(collection);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  async getAll<T>(collection: CollectionName, params?: Record<string, any>): Promise<T[]> {
    try {
      let url = `${API_URL}/${collection}`;
      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }
      const response = await fetch(url);
      const result: ApiResponse<T[]> = await response.json();
      if (result.success && result.data) {
        this.notifyListeners(collection, result.data);
        return result.data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      return [];
    }
  }

  async getById<T>(collection: CollectionName, id: string): Promise<T | null> {
    try {
      const response = await fetch(`${API_URL}/${collection}/${id}`);
      const result: ApiResponse<T> = await response.json();
      return result.success ? result.data || null : null;
    } catch (error) {
      console.error(`Error fetching ${collection}/${id}:`, error);
      return null;
    }
  }

  async create<T extends { _id?: string }>(collection: CollectionName, data: T): Promise<T & { _id: string }> {
    try {
      const response = await fetch(`${API_URL}/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result: ApiResponse<T & { _id: string }> = await response.json();
      if (result.success && result.data) {
        const allData = await this.getAll(collection);
        this.notifyListeners(collection, allData);
        return result.data;
      }
      // Include the backend error message in the thrown error
      const errorMessage = result.error || result.message || 'Failed to create item';
      throw new Error(errorMessage);
    } catch (error) {
      console.error(`Error creating ${collection}:`, error);
      throw error;
    }
  }

  async update<T extends { _id: string }>(collection: CollectionName, id: string, data: Partial<T>): Promise<T | null> {
    try {
      const response = await fetch(`${API_URL}/${collection}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result: ApiResponse<T> = await response.json();
      if (result.success && result.data) {
        const allData = await this.getAll(collection);
        this.notifyListeners(collection, allData);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      return null;
    }
  }

  async delete(collection: CollectionName, id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${collection}/${id}`, {
        method: 'DELETE'
      });
      const result: ApiResponse<null> = await response.json();
      if (result.success) {
        const allData = await this.getAll(collection);
        this.notifyListeners(collection, allData);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting ${collection}:`, error);
      return false;
    }
  }

  async query<T>(collection: CollectionName, filter: Record<string, any>): Promise<T[]> {
    try {
      const queryString = new URLSearchParams(filter).toString();
      const response = await fetch(`${API_URL}/${collection}?${queryString}`);
      const result: ApiResponse<T[]> = await response.json();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      console.error(`Error querying ${collection}:`, error);
      return [];
    }
  }

  // ⚠️ OPTIMIZED: New method for paginated queries with comprehensive error handling
  async getPaginated<T>(collection: CollectionName, params: {
    page?: number;
    limit?: number;
    category?: string;
    subCategory?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasMore: boolean;
    };
  }> {
    // ⚠️ DEFENSIVE: Set safe defaults
    const pageNum = Math.max(1, params.page || 1);
    const limitNum = Math.max(1, Math.min(50, params.limit || 24));

    try {
      // ⚠️ DEFENSIVE: Build query params, filtering out undefined/null/empty values
      const queryParams = new URLSearchParams();
      
      // Always include pagination params
      queryParams.append('page', String(pageNum));
      queryParams.append('limit', String(limitNum));

      // Conditionally add filter params only if they have values
      if (params.category && String(params.category).trim()) {
        queryParams.append('category', String(params.category).trim());
      }

      if (params.subCategory && String(params.subCategory).trim()) {
        queryParams.append('subCategory', String(params.subCategory).trim());
      }

      if (params.color && String(params.color).trim()) {
        queryParams.append('color', String(params.color).trim());
      }

      // Handle price range - only add if meaningful
      if (typeof params.minPrice === 'number' && !isNaN(params.minPrice) && params.minPrice !== 5000) {
        // Always send minPrice if it's set (even if 0), but skip if it's the default max value
        queryParams.append('minPrice', String(Math.max(0, params.minPrice)));
      }
      if (typeof params.maxPrice === 'number' && !isNaN(params.maxPrice) && params.maxPrice !== 5000) {
        // Always send maxPrice if it's set and not the default max
        queryParams.append('maxPrice', String(Math.max(0, params.maxPrice)));
      }

      if (params.sortBy && String(params.sortBy).trim()) {
        queryParams.append('sortBy', String(params.sortBy).trim());
      }

      const url = `${API_URL}/${collection}?${queryParams.toString()}`;
      console.log(`[API] Fetching: ${url}`);

      // ⚠️ DEFENSIVE: Create a timeout signal for the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ⚠️ DEFENSIVE: Check response status
      if (!response.ok) {
        console.warn(`[API] Non-200 status: ${response.status}`);
        throw new Error(`HTTP ${response.status}`);
      }

      const result: any = await response.json();

      // ⚠️ DEFENSIVE: Validate response structure
      if (!result || typeof result !== 'object') {
        console.warn('[API] Invalid response format');
        throw new Error('Invalid response format');
      }

      // ⚠️ DEFENSIVE: Check for success flag
      if (!result.success) {
        console.warn('[API] Success flag is false', result);
        throw new Error(result.message || 'API returned success: false');
      }

      // ⚠️ DEFENSIVE: Validate data is an array
      const data = Array.isArray(result.data) ? result.data : [];

      // ⚠️ DEFENSIVE: Validate pagination object
      const pagination = result.pagination || {};
      if (
        typeof pagination !== 'object' ||
        typeof pagination.page !== 'number' ||
        typeof pagination.limit !== 'number' ||
        typeof pagination.total !== 'number'
      ) {
        console.warn('[API] Invalid pagination structure', pagination);
        // Fallback to safe pagination values
        return {
          data,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: data.length,
            pages: 1,
            hasMore: false,
          }
        };
      }

      return {
        data,
        pagination: {
          page: Math.max(1, pagination.page || pageNum),
          limit: Math.max(1, pagination.limit || limitNum),
          total: Math.max(0, pagination.total || 0),
          pages: Math.max(0, pagination.pages || 1),
          hasMore: Boolean(pagination.hasMore),
        }
      };
    } catch (error) {
      // ⚠️ DEFENSIVE: Log error and return safe empty response
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[API] Error fetching paginated ${collection}: ${errorMsg}`);
      
      return {
        data: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0,
          hasMore: false
        }
      };
    }
  }

  clearAll(): Promise<void> {
    console.warn('ClearAll not implemented for MongoDB service');
    return Promise.resolve();
  }
}

// Export appropriate service based on environment
const localService = new LocalStorageService();
const mongoService = new MongoDBService();

export const db = USE_LOCAL_STORAGE ? localService : mongoService;

// Status function to check which database is in use
export const getDatabaseStatus = () => ({
  type: USE_LOCAL_STORAGE ? 'localStorage (Development)' : 'MongoDB API (Production)',
  apiUrl: API_URL,
  message: USE_LOCAL_STORAGE 
    ? 'Using localStorage. Set up backend for MongoDB integration.' 
    : 'Connected to MongoDB via API'
});
