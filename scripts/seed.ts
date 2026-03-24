import mongoose from 'mongoose';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import Item from '@/lib/models/Item';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[v0] Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@lostfound.com',
      password: 'admin123',
      phone: '+1-555-0100',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1-555-0101',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1-555-0102',
      role: 'user',
    });

    console.log('[v0] Created 3 users');

    // Create categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Mobile phones, laptops, earphones, etc.',
      icon: 'Smartphone',
      color: '#3b82f6',
    });

    const accessories = await Category.create({
      name: 'Accessories',
      description: 'Bags, watches, jewelry, belts, etc.',
      icon: 'Watch',
      color: '#8b5cf6',
    });

    const documents = await Category.create({
      name: 'Documents',
      description: 'ID cards, passports, licenses, etc.',
      icon: 'FileText',
      color: '#ef4444',
    });

    const clothing = await Category.create({
      name: 'Clothing',
      description: 'Jackets, shirts, hats, shoes, etc.',
      icon: 'ShirtIcon',
      color: '#ec4899',
    });

    const others = await Category.create({
      name: 'Others',
      description: 'Any other items',
      icon: 'Package',
      color: '#6366f1',
    });

    console.log('[v0] Created 5 categories');

    // Create sample found items
    const item1 = await Item.create({
      title: 'Apple iPhone 14 Pro',
      description: 'Black iPhone 14 Pro found near the mall. Device is locked.',
      category: electronics._id,
      itemType: 'found',
      location: 'Shopping Mall - Near entrance',
      foundDate: new Date('2024-03-20'),
      status: 'open',
      submittedBy: adminUser._id,
      images: [],
      tags: ['phone', 'apple', 'black'],
      contact: {
        name: 'Security Desk',
        email: 'security@mall.com',
        phone: '+1-555-1000',
      },
    });

    const item2 = await Item.create({
      title: 'Silver Watch',
      description: 'Elegant silver watch with leather band found at the park.',
      category: accessories._id,
      itemType: 'found',
      location: 'Central Park - Near lake',
      foundDate: new Date('2024-03-19'),
      status: 'open',
      submittedBy: user1._id,
      images: [],
      tags: ['watch', 'silver', 'leather'],
      contact: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0101',
      },
    });

    const item3 = await Item.create({
      title: 'Passport - Indian',
      description: 'Indian passport with name ARUN KUMAR. Found at airport.',
      category: documents._id,
      itemType: 'found',
      location: 'Airport - Terminal 2',
      foundDate: new Date('2024-03-18'),
      status: 'open',
      submittedBy: adminUser._id,
      images: [],
      tags: ['passport', 'document', 'indian'],
      contact: {
        name: 'Airport Lost & Found',
        email: 'lostfound@airport.com',
        phone: '+1-555-2000',
      },
    });

    const item4 = await Item.create({
      title: 'Blue Jacket',
      description: 'Navy blue winter jacket with name tag. Size M.',
      category: clothing._id,
      itemType: 'lost',
      location: 'City Bus Station',
      lostDate: new Date('2024-03-17'),
      status: 'open',
      submittedBy: user2._id,
      images: [],
      tags: ['jacket', 'blue', 'winter'],
      contact: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1-555-0102',
      },
    });

    const item5 = await Item.create({
      title: 'Leather Wallet',
      description: 'Brown leather wallet with multiple cards. Contains business cards.',
      category: accessories._id,
      itemType: 'lost',
      location: 'Downtown - Near coffee shop',
      lostDate: new Date('2024-03-16'),
      status: 'open',
      submittedBy: user1._id,
      images: [],
      tags: ['wallet', 'leather', 'brown'],
      contact: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0101',
      },
    });

    const item6 = await Item.create({
      title: 'MacBook Pro 15"',
      description: 'Silver MacBook Pro found in a taxi. 2023 model.',
      category: electronics._id,
      itemType: 'found',
      location: 'Taxi Depot',
      foundDate: new Date('2024-03-15'),
      status: 'open',
      submittedBy: adminUser._id,
      images: [],
      tags: ['laptop', 'macbook', 'silver'],
      contact: {
        name: 'Taxi Service',
        email: 'taxi@service.com',
        phone: '+1-555-3000',
      },
    });

    console.log('[v0] Created 6 sample items');

    await mongoose.disconnect();
    console.log('[v0] Seed completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Email: admin@lostfound.com');
    console.log('  Password: admin123');
  } catch (error) {
    console.error('[v0] Seed error:', error);
    process.exit(1);
  }
}

seed();
