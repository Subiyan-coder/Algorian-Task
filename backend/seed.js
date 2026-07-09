require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  await connectDB();

  try {
    
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
    }

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      contact: '9876543210',
      role: 'admin'
    });

    console.log(`Admin created successfully: ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error(`Seeding failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

seedAdmin();