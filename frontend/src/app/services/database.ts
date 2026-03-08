// Database service with real-time synchronization
// Mimics MongoDB structure for easy backend migration

export interface Product {
  _id: string;
  sku: string;
  name: string;
  price: number;
  offerPercentage: number;
  quantity: number;
  category: string;
  subCategory: string;
  fabricType: string;
  careInstructions: string;
  description: string;
  images: string[];
  colors: string[];
  features: string[]; // Added features field
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
  type: 'hero-main' | 'hero-side' | 'casual-inspiration'; // Banner position type
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

class DatabaseService {
  private listeners: Map<CollectionName, Set<(data: any[]) => void>> = new Map();

  constructor() {
    // Initialize collections if they don't exist
    this.initializeCollections();
    
    // Listen for storage events from other tabs
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
    // Manually trigger listeners for same-tab updates
    const data = this.getAll(collection);
    this.notifyListeners(collection, data);
  }

  // Subscribe to real-time updates
  subscribe(collection: CollectionName, callback: (data: any[]) => void) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    this.listeners.get(collection)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(collection);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  // CRUD Operations
  getAll<T>(collection: CollectionName): T[] {
    const data = localStorage.getItem(collection);
    return data ? JSON.parse(data) : [];
  }

  getById<T>(collection: CollectionName, id: string): T | null {
    const items = this.getAll<T & { _id: string }>(collection);
    return items.find(item => item._id === id) || null;
  }

  create<T extends { _id?: string }>(collection: CollectionName, data: T): T & { _id: string } {
    const items = this.getAll(collection);
    const newItem = {
      ...data,
      _id: data._id || this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(collection, JSON.stringify(items));
    this.triggerStorageEvent(collection);
    return newItem as T & { _id: string };
  }

  update<T extends { _id: string }>(collection: CollectionName, id: string, data: Partial<T>): T | null {
    const items = this.getAll<T>(collection);
    const index = items.findIndex((item: any) => item._id === id);
    
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      _id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(collection, JSON.stringify(items));
    this.triggerStorageEvent(collection);
    return items[index];
  }

  delete(collection: CollectionName, id: string): boolean {
    const items = this.getAll(collection);
    const filteredItems = items.filter((item: any) => item._id !== id);
    
    if (filteredItems.length === items.length) return false;

    localStorage.setItem(collection, JSON.stringify(filteredItems));
    this.triggerStorageEvent(collection);
    return true;
  }

  query<T>(collection: CollectionName, filter: (item: T) => boolean): T[] {
    const items = this.getAll<T>(collection);
    return items.filter(filter);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility: Clear all data (for testing)
  clearAll() {
    localStorage.removeItem('products');
    localStorage.removeItem('orders');
    localStorage.removeItem('coupons');
    localStorage.removeItem('banners');
    localStorage.removeItem('categories');
    this.initializeCollections();
  }
}

export const db = new DatabaseService();