require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  await connectDB();

  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@algorian.com',
      password: 'Admin@1234',
      contact: '9876543210',
      role: 'admin'
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();