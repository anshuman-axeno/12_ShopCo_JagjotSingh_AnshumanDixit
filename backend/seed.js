const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data for fresh seed...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // 1. Create Users (Admin & Customer)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shop.co',
      password: adminPassword,
      phone: 9876543210,
      role: 'admin',
      address: 'ShopCo HQ, 100 Fashion Street, New York, NY'
    });

    const customer = await User.create({
      name: 'Anshuman Dixit',
      email: 'anshuman@example.com',
      password: customerPassword,
      phone: 9123456780,
      role: 'customer',
      address: '221B Baker Street, London, UK'
    });

    console.log('Users created:', admin.email, customer.email);

    // 2. Create Categories
    const categoryNames = ['T-Shirts', 'Jeans', 'Shirts', 'Shorts', 'Casual', 'Formal', 'Party', 'Gym'];
    const categoriesMap = {};

    for (const name of categoryNames) {
      const cat = await Category.create({ name });
      categoriesMap[name] = cat._id;
    }

    console.log('Categories created:', Object.keys(categoriesMap));

    // 3. Create Products
    const productsData = [
      {
        name: 'T-shirt with Tape Details',
        description: 'A comfortable and stylish t-shirt featuring tape details for a modern everyday look.',
        price: 120,
        quantity: 15,
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/tshirt1.png'],
        category: categoriesMap['T-Shirts']
      },
      {
        name: 'Skinny Fit Jeans',
        description: 'Classic skinny fit jeans designed with a comfortable stretch and a sleek modern silhouette.',
        price: 240,
        quantity: 12,
        rating: 3.5,
        status: 'active',
        images: ['/assets/images/Frame 33.png'],
        category: categoriesMap['Jeans']
      },
      {
        name: 'Checkered Shirt',
        description: 'A timeless checkered shirt that adds a casual and versatile touch to your wardrobe.',
        price: 180,
        quantity: 8,
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/Frame 34.png'],
        category: categoriesMap['Shirts']
      },
      {
        name: 'Sleeve Striped T-shirt',
        description: 'A classic sleeve striped t-shirt made for effortless everyday styling and comfortable wear.',
        price: 130,
        quantity: 4, // Low stock <= 10
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/Frame 38.png'],
        category: categoriesMap['T-Shirts']
      },
      {
        name: 'Vertical Striped Shirt',
        description: 'A smart vertical striped shirt with a clean design that works well for both casual and polished outfits.',
        price: 212,
        quantity: 10, // Low stock <= 10
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/arrivals-1.png'],
        category: categoriesMap['Shirts']
      },
      {
        name: 'Courage Graphic T-shirt',
        description: 'A bold graphic t-shirt designed to bring personality and confidence to your everyday style.',
        price: 145,
        quantity: 7, // Low stock <= 10
        rating: 3.5,
        status: 'active',
        images: ['/assets/images/arrivals-2.png'],
        category: categoriesMap['T-Shirts']
      },
      {
        name: 'Loose Fit Bermuda Shorts',
        description: 'Comfortable Bermuda shorts with a relaxed fit, perfect for casual days and warm weather.',
        price: 80,
        quantity: 0, // OUT OF STOCK
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/arrivals-3.png'],
        category: categoriesMap['Shorts']
      },
      {
        name: 'Faded Skinny Jeans',
        description: 'Faded skinny jeans with a modern fit and versatile wash, perfect for everyday outfits.',
        price: 210,
        quantity: 3, // Low stock <= 10
        rating: 4.5,
        status: 'active',
        images: ['/assets/images/arrivals-4.png'],
        category: categoriesMap['Jeans']
      }
    ];

    await Product.insertMany(productsData);
    console.log(`Successfully seeded ${productsData.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();

