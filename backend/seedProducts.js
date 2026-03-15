const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');

// Helper function to create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for product seeding...');

    // Ensure essential categories exist
    const essentialCategories = [
      {
        name: 'Earrings',
        slug: 'earrings',
        subCategories: [
          { name: 'Studs', slug: 'studs' },
          { name: 'Drops', slug: 'drops' },
          { name: 'Hoops', slug: 'hoops' },
          { name: 'Clip-On', slug: 'clip-on' }
        ],
        isActive: true
      },
      {
        name: 'Necklace',
        slug: 'necklace',
        subCategories: [
          { name: 'Choker', slug: 'choker' },
          { name: 'Pendant', slug: 'pendant' },
          { name: 'Long Chain', slug: 'long-chain' }
        ],
        isActive: true
      },
      {
        name: 'Heavy Necklace',
        slug: 'heavy-necklace',
        subCategories: [
          { name: 'Kundan', slug: 'kundan' },
          { name: 'Polki', slug: 'polki' },
          { name: 'Statement', slug: 'statement' }
        ],
        isActive: true
      }
    ];

    // Upsert categories
    for (const cat of essentialCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
    }
    console.log('✓ Categories ensured/created');

    // Fetch all categories for mapping
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
      categoryMap[cat.slug] = cat._id;
    });

    // Read and parse CSV file
    const csvPath = '../pandc.products.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('CSV Headers:', headers);

    // Parse data rows
    const products = [];
    const categoriesSet = new Set();
    
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

      // Get category ID from mapping (or create mapping entry)
      const categoryName = row.category || 'Other';
      categoriesSet.add(categoryName);
      
      let categoryId = categoryMap[categoryName];
      if (!categoryId) {
        // Try slug-based lookup
        const slug = createSlug(categoryName);
        categoryId = categoryMap[slug];
      }

      // Create product object with category ID
      const product = {
        sku: row.id || `SKU-${Date.now()}`,
        name: row.name || 'Untitled Product',
        price: price,
        offerPercentage: offerPercentage,
        quantity: parseInt(row.stock) || 0,
        category: categoryId || categoryName, // Use ID if found, otherwise name
        subCategory: row.category || 'General',
        jewelleryType: 'Premium',
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
      console.log(`✓ Parsed: ${product.name} (Category: ${categoryName})`);
    }

    console.log('\nUnique categories found:', Array.from(categoriesSet));

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
