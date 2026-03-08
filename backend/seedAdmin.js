const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'pandctexfab@gmail.com' });

    if (existingAdmin) {
      // Optionally update password if different
      const updatePassword = process.argv.includes('--reset-password');
      if (updatePassword) {
        existingAdmin.password = 'naturelover1215';
        await existingAdmin.save();
      }
    } else {
      // Create new admin
      const newAdmin = new Admin({
        email: 'pandctexfab@gmail.com',
        password: 'naturelover1215',
        name: 'Dasparna Admin',
        role: 'super-admin',
        permissions: [
          'view-dashboard',
          'manage-products',
          'manage-orders',
          'manage-coupons',
          'manage-banners',
          'manage-categories',
          'manage-users',
        ],
      });

      await newAdmin.save();
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
