import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db');
    console.log('MongoDB Connected');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@indiatourism.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Delete and recreate to ensure clean hash
      await User.deleteOne({ email: adminEmail });
    }

    // Create fresh — bypass pre-save hook by hashing manually
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created successfully');

    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
