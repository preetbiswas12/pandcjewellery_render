const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const Coupon = require('./models/Coupon');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Cleared existing collections.');

    // Seed Categories
    const categories = [
      {
        name: 'Cotton',
        slug: 'cotton',
        subCategories: [
          { name: 'Plain Cotton', slug: 'plain-cotton' },
          { name: 'Printed Cotton', slug: 'printed-cotton' }
        ],
        isActive: true,
        description: 'Breathable and comfortable cotton fabrics perfect for everyday wear and crafting'
      },
      {
        name: 'Silk',
        slug: 'silk',
        subCategories: [
          { name: 'Kanjivaram', slug: 'kanjivaram' },
          { name: 'Banarasi', slug: 'banarasi' }
        ],
        isActive: true,
        description: 'Luxurious silk fabrics known for elegance and smooth texture'
      }
    ];
    await Category.insertMany(categories);
    console.log('Categories seeded.');

    // Seed Banners
    const banners = [
      {
        type: 'hero-main',
        title: 'Premium Fabric Collections',
        subtitle: 'Finest selection of cotton, silk, and specialty fabrics for your creative projects',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
        link: '/shop',
        buttonText: 'EXPLORE FABRICS',
        isActive: true,
        order: 1
      },
      {
        type: 'hero-side',
        title: 'Traditional Handloom',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
        link: '/shop',
        buttonText: 'Shop Now',
        isActive: true,
        order: 2
      },
      {
        type: 'hero-side',
        title: 'Lightweight Comfort',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
        link: '/shop',
        buttonText: 'Explore',
        isActive: true,
        order: 3
      },
      {
        type: 'casual-inspiration',
        title: 'Printed Collections',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
        link: '/shop',
        buttonText: 'Shop Now',
        isActive: true,
        order: 4
      },
      {
        type: 'casual-inspiration',
        title: 'Artisan Designs',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        link: '/shop',
        buttonText: 'Shop Now',
        isActive: true,
        order: 5
      }
    ];
    await Banner.insertMany(banners);
    console.log('Banners seeded.');

    // Seed Products
    const products = [
      {
        sku: 'COT-001',
        name: 'Indigo Handblock Print Cotton',
        price: 350,
        offerPercentage: 10,
        quantity: 500,
        category: 'Cotton',
        subCategory: 'Printed Cotton',
        fabricType: 'Pure Cotton',
        careInstructions: 'Gentle hand wash in cold water. Dry in shade to maintain color vibrancy.',
        description: 'Beautiful traditional indigo handblock printed fabric made from 100% pure cotton. Perfect for clothing, home décor, and craft projects. Features authentic artisan prints that add character to any project. Minimum order: 5 meters.',
        images: ['https://images.unsplash.com/photo-1594913785162-e6785b42dfdc?q=80&w=2071'],
        colors: ['Indigo', 'White'],
        features: ['100% Pure Cotton', 'Hand-blocked Prints', 'Breathable & Soft', 'Color-fast Dyes', 'Eco-friendly', 'Skin-friendly', 'Perfect for Sewing & Crafts']
      }
    ];
    await Product.insertMany(products);
    console.log('Products seeded.');

    // Seed Coupons
    const coupons = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 500,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 1000,
        isActive: true
      }
    ];
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
