// Core types for the fabric e-commerce platform
// Product, CartItem, Order, Coupon, Banner types are now in database.ts and re-exported from AppContext

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'dyeable-Jewellery',
    name: 'Dyeable Jewellery',
    subCategories: [
      { id: 'silk', name: 'Silk' },
      { id: 'linen', name: 'Linen' },
      { id: 'cotton', name: 'Cotton' },
      { id: 'viscose', name: 'Viscose' },
      { id: 'modal', name: 'Modal' }
    ]
  },
  {
    id: 'lining-Jewellery',
    name: 'Lining Jewellery',
    subCategories: [
      { id: 'cotton-lining', name: 'Cotton' },
      { id: 'viscose-lining', name: 'Viscose' }
    ]
  },
  {
    id: 'printed-Jewellery',
    name: 'Printed Jewellery',
    subCategories: [
      { id: 'handblock-print', name: 'Handblock Print' },
      { id: 'digital-print', name: 'Digital Print' }
    ]
  },
  {
    id: 'embroidered-Jewellery',
    name: 'Embroidered Jewellery',
    subCategories: [
      { id: 'beaded-sequin', name: 'Beaded & Sequin Embroidery' },
      { id: 'traditional-embroidery', name: 'Traditional Embroidery' }
    ]
  }
];