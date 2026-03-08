const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for product seeding...');

    // Read and parse CSV file
    const csvPath = '../pandc.products.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('CSV Headers:', headers);

    // Parse data rows
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) continue;

      // Create object from headers and values
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });

      // Extract images
      const images = [];
      for (let j = 0; j < 4; j++) {
        const imgKey = `images[${j}]`;
        if (headers.includes(imgKey) && row[imgKey]) {
          images.push(row[imgKey]);
        }
      }

      // Calculate offer percentage
      const mrp = parseFloat(row.mrp) || 0;
      const price = parseFloat(row.price) || 0;
      const offerPercentage = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

      // Create product object
      const product = {
        sku: row.id || `SKU-${Date.now()}`,
        name: row.name || 'Untitled Product',
        price: price,
        offerPercentage: offerPercentage,
        quantity: parseInt(row.stock) || 0,
        category: row.category || 'Other',
        subCategory: row.category || 'General',
        fabricType: 'Jewelry',
        careInstructions: 'Store in a dry, soft pouch. Avoid contact with water, perfume, and harsh chemicals.',
        description: row.description || '',
        images: images,
        colors: ['Gold', 'Silver'],
        features: [
          'Premium jewelry',
          'Handcrafted design',
          'Durable finish',
          'Lightweight & comfortable'
        ]
      };

      products.push(product);
      console.log(`✓ Parsed: ${product.name}`);
    }

    // Clear existing products and insert new ones
    const result = await Product.deleteMany({});
    console.log(`\nCleared ${result.deletedCount} existing products.`);

    const inserted = await Product.insertMany(products);
    console.log(`\n✅ Successfully seeded ${inserted.length} products!`);

    console.log('\nDatabase seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedProducts();
