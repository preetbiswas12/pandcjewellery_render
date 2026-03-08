const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const Category = require('./models/Category');

const clearSeedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear collections except banners
    const productResult = await Product.deleteMany({});
    console.log(`✓ Deleted ${productResult.deletedCount} products`);

    const orderResult = await Order.deleteMany({});
    console.log(`✓ Deleted ${orderResult.deletedCount} orders`);

    const couponResult = await Coupon.deleteMany({});
    console.log(`✓ Deleted ${couponResult.deletedCount} coupons`);

    const categoryResult = await Category.deleteMany({});
    console.log(`✓ Deleted ${categoryResult.deletedCount} categories`);

    console.log('\n✅ Successfully cleared seed data! (Banners preserved)');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing data:', err.message);
    process.exit(1);
  }
};

clearSeedData();
