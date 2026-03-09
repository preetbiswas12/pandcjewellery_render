import { db, Product, Banner, Coupon, Category } from './database';

export function seedDatabase() {
  // Seed Products
  const products = db.getAll<Product>('products');
  if (products.length === 0) {
    const fabricProducts: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
      {
        sku: 'SLK-001',
        name: 'Pure Silk Dyeable Fabric',
        price: 2499,
        offerPercentage: 15,
        quantity: 50,
        category: 'dyeable-Jewellery',
        subCategory: 'silk',
        jewelleryType: 'Gold Plated Bracelet',
        careInstructions: 'Dry clean only. Iron on low heat.',
        description: 'Premium quality pure mulberry silk fabric, perfect for dyeing. Soft, luxurious texture with natural sheen.',
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800', 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800'],
        colors: ['natural', 'ivory'],
        features: ['100% Pure Mulberry Silk', 'Natural Sheen', 'Highly Breathable', 'Hypoallergenic', 'Accepts Dyes Beautifully']
      },
      {
        sku: 'LIN-002',
        name: 'Premium Linen Blend',
        price: 1899,
        offerPercentage: 10,
        quantity: 75,
        category: 'dyeable-Jewellery',
        subCategory: 'linen',
        jewelleryType: 'Silver Pendant',
        careInstructions: 'Machine wash cold. Tumble dry low.',
        description: 'Breathable and durable linen fabric, ideal for summer wear. Natural texture with excellent draping quality.',
        images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800'],
        colors: ['beige', 'cream', 'white'],
        features: ['100% Pure Linen', 'Naturally Anti-bacterial', 'Temperature Regulating', 'Eco-Friendly', 'Long Lasting']
      },
      {
        sku: 'CTN-003',
        name: 'Organic Cotton Dyeable',
        price: 899,
        offerPercentage: 20,
        quantity: 100,
        category: 'dyeable-Jewellery',
        subCategory: 'cotton',
        jewelleryType: 'Diamond Ring',
        careInstructions: 'Machine wash warm. Tumble dry medium.',
        description: 'Soft organic cotton fabric, GOTS certified. Perfect for natural dyeing and eco-friendly garments.',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'],
        colors: ['white', 'off-white'],
        features: ['GOTS Certified Organic', 'Soft & Comfortable', 'Chemical-Free', 'Highly Absorbent', 'Easy Care']
      },
      {
        sku: 'VIS-004',
        name: 'Viscose Dyeable Fabric',
        price: 1299,
        offerPercentage: 12,
        quantity: 80,
        category: 'dyeable-Jewellery',
        subCategory: 'viscose',
        jewelleryType: 'Pearl Earrings',
        careInstructions: 'Hand wash or dry clean. Do not wring.',
        description: 'Silky smooth viscose fabric with excellent dye absorption. Drapes beautifully for flowy garments.',
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
        colors: ['natural'],
        features: ['Silky Smooth Texture', 'Excellent Drape', 'Breathable', 'Moisture Absorbent', 'Vibrant Color Retention']
      },
      {
        sku: 'MDL-005',
        name: 'Modal Stretch Fabric',
        price: 1599,
        offerPercentage: 8,
        quantity: 60,
        category: 'dyeable-Jewellery',
        subCategory: 'modal',
        jewelleryType: 'Gold Necklace',
        careInstructions: 'Machine wash cold. Hang dry.',
        description: 'Soft modal fabric with 5% spandex for comfort stretch. Excellent color retention and breathability.',
        images: ['https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800'],
        colors: ['ivory', 'cream'],
        features: ['95% Modal, 5% Spandex', 'Comfort Stretch', 'Wrinkle Resistant', 'Color Fast', 'Eco-Friendly Production']
      },
      {
        sku: 'LIN-CTN-006',
        name: 'Cotton Lining Fabric',
        price: 599,
        offerPercentage: 15,
        quantity: 120,
        category: 'lining-Jewellery',
        subCategory: 'cotton',
        jewelleryType: 'Gemstone Brooch',
        careInstructions: 'Machine wash cold. Iron if needed.',
        description: 'Lightweight cotton voile perfect for garment lining. Breathable and comfortable against skin.',
        images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800'],
        colors: ['white', 'black', 'nude'],
        features: ['Lightweight', 'Breathable', 'Skin-Friendly', 'Easy to Sew', 'Multiple Color Options']
      },
      {
        sku: 'LIN-VIS-007',
        name: 'Viscose Lining Fabric',
        price: 699,
        offerPercentage: 10,
        quantity: 90,
        category: 'lining-Jewellery',
        subCategory: 'viscose',
        jewelleryType: 'Silver Anklet',
        careInstructions: 'Dry clean recommended.',
        description: 'Smooth viscose taffeta lining with subtle sheen. Ideal for formal wear and structured garments.',
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
        colors: ['black', 'navy', 'burgundy'],
        features: ['Smooth Finish', 'Subtle Sheen', 'Anti-Static', 'Wrinkle Resistant', 'Perfect for Formal Wear']
      },
      {
        sku: 'PRT-HB-008',
        name: 'Handblock Printed Cotton',
        price: 1799,
        offerPercentage: 18,
        quantity: 45,
        category: 'printed-Jewellery',
        subCategory: 'handblock',
        jewelleryType: 'Gold with CZ',
        careInstructions: 'Hand wash cold. Dry in shade.',
        description: 'Traditional handblock printed cotton with intricate floral motifs. Each piece is unique and artisan-made.',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'],
        colors: ['multi'],
        features: ['Handblock Printed', 'Artisan Made', 'Natural Dyes', 'Unique Patterns', 'Traditional Craftsmanship']
      },
      {
        sku: 'PRT-DG-009',
        name: 'Digital Print Silk',
        price: 2899,
        offerPercentage: 10,
        quantity: 35,
        category: 'printed-Jewellery',
        subCategory: 'digital-print',
        jewelleryType: 'Hand-Crafted Gold',
        careInstructions: 'Dry clean only.',
        description: 'Vibrant digital print on premium silk. Modern geometric patterns with fade-resistant colors.',
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800'],
        colors: ['multi'],
        features: ['High Resolution Print', 'Fade Resistant', 'Vibrant Colors', 'Modern Patterns', 'Premium Silk Base']
      },
      {
        sku: 'EMB-BQ-010',
        name: 'Beaded & Sequin Fabric',
        price: 3999,
        offerPercentage: 20,
        quantity: 25,
        category: 'embroidered-Jewellery',
        subCategory: 'beaded-sequin',
        jewelleryType: 'Beaded Ornament',
        careInstructions: 'Dry clean only. Handle with care.',
        description: 'Luxurious net fabric with intricate beading and sequin work. Perfect for bridal and evening wear.',
        images: ['https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800'],
        colors: ['gold', 'silver', 'rose-gold'],
        features: ['Hand Beaded', 'Sequin Embellishment', 'Luxurious Look', 'Perfect for Special Occasions', 'High-Quality Craftsmanship']
      },
      {
        sku: 'EMB-TR-011',
        name: 'Traditional Embroidered Silk',
        price: 3499,
        offerPercentage: 15,
        quantity: 30,
        category: 'embroidered-Jewellery',
        subCategory: 'traditional',
        jewelleryType: 'Kundan Jewellery',
        careInstructions: 'Dry clean only.',
        description: 'Hand embroidered silk with traditional paisley motifs. Rich colors and fine threadwork.',
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800'],
        colors: ['red', 'green', 'blue'],
        features: ['Hand Embroidered', 'Traditional Motifs', 'Fine Threadwork', 'Rich Color Palette', 'Heritage Craft']
      },
      {
        sku: 'SLK-012',
        name: 'Tussar Silk Dyeable',
        price: 2199,
        offerPercentage: 12,
        quantity: 40,
        category: 'dyeable-Jewellery',
        subCategory: 'silk',
        jewelleryType: 'Gold-Plated Silver',
        careInstructions: 'Dry clean recommended.',
        description: 'Natural tussar silk with rich texture and golden sheen. Eco-friendly and biodegradable.',
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
        colors: ['natural', 'golden'],
        features: ['Natural Tussar Silk', 'Golden Sheen', 'Eco-Friendly', 'Biodegradable', 'Rich Texture']
      }
    ];

    fabricProducts.forEach(product => {
      db.create('products', product);
    });
  }

  // Seed Banners
  const existingBanners = db.getAll<Banner>('banners');
  if (existingBanners.length === 0) {
    const banners: Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: 'hero-main',
        title: 'Timeless\nElegance\nAwaits',
        subtitle: 'Discover our exquisite collection of premium jewellery crafted with passion and precision',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
        link: '/shop',
        buttonText: 'EXPLORE JEWELLERY',
        isActive: true,
        order: 1
      },
      {
        type: 'hero-side',
        title: 'Luxury\nBracelets',
        image: 'https://images.unsplash.com/photo-1515562141207-5dca89f11e5e?w=800',
        link: '/shop',
        isActive: true,
        order: 2
      },
      {
        type: 'hero-side',
        title: 'Golden\nNecklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        link: '/shop',
        isActive: true,
        order: 3
      },
      {
        type: 'casual-inspiration',
        title: 'Statement\nEarrings',
        image: 'https://images.unsplash.com/photo-1540632066927-08ff05865a84?w=800',
        link: '/shop',
        isActive: true,
        order: 4
      },
      {
        type: 'casual-inspiration',
        title: 'Precious\nRings',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        link: '/shop',
        isActive: true,
        order: 5
      }
    ];

    banners.forEach(banner => {
      db.create('banners', banner);
    });
  }

  // Seed Coupons
  const coupons: Omit<Coupon, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 1000,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      usageLimit: 100,
      usedCount: 0,
      isActive: true
    },
    {
      code: 'SAVE500',
      discountType: 'fixed',
      discountValue: 500,
      minOrderValue: 3000,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      usageLimit: 50,
      usedCount: 0,
      isActive: true
    },
    {
      code: 'SUMMER20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 2000,
      maxDiscount: 1000,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days
      usageLimit: 200,
      usedCount: 0,
      isActive: true
    }
  ];

  coupons.forEach(coupon => {
    db.create('coupons', coupon);
  });

  // Seed Categories
  const existingCategories = db.getAll<Category>('categories');
  if (existingCategories.length === 0) {
    const categories: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Dyeable Jewellery',
        slug: 'dyeable-Jewellery',
        subCategories: [
          { name: 'Silk', slug: 'silk' },
          { name: 'Linen', slug: 'linen' },
          { name: 'Cotton', slug: 'cotton' },
          { name: 'Viscose', slug: 'viscose' },
          { name: 'Modal', slug: 'modal' }
        ],
        isActive: true
      },
      {
        name: 'Lining Jewellery',
        slug: 'lining-Jewellery',
        subCategories: [
          { name: 'Cotton', slug: 'cotton' },
          { name: 'Viscose', slug: 'viscose' }
        ],
        isActive: true
      },
      {
        name: 'Printed Jewellery',
        slug: 'printed-Jewellery',
        subCategories: [
          { name: 'Handblock', slug: 'handblock' },
          { name: 'Digital Print', slug: 'digital-print' }
        ],
        isActive: true
      },
      {
        name: 'Embroidered Jewellery',
        slug: 'embroidered-Jewellery',
        subCategories: [
          { name: 'Beaded & Sequin', slug: 'beaded-sequin' },
          { name: 'Traditional', slug: 'traditional' }
        ],
        isActive: true
      }
    ];

    categories.forEach(category => {
      db.create('categories', category);
    });
  }

  console.log('✅ Database seeded successfully!');
}