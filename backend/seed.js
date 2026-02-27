const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel-mgmt');
    console.log('Connected to MongoDB');

    // Clear existing users (optional - comment out to keep existing data)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Test users data
    const testUsers = [
      {
        name: 'Jaya Kumar',
        email: 'jaya@gmail.com',
        password: 'admin123',
        role: 'admin',
        roomNumber: 'ADMIN-001'
      },
      {
        name: 'Nithin R',
        email: 'student@gmail.com',
        password: 'student123',
        role: 'student',
        roomNumber: '101'
      },
      {
        name: 'Demo Student',
        email: 'demo@gmail.com',
        password: 'demo123',
        role: 'student',
        roomNumber: '102'
      },
      {
        name: 'Warden Admin',
        email: 'warden@gmail.com',
        password: 'warden123',
        role: 'admin',
        roomNumber: 'ADMIN-002'
      }
    ];

    // Hash passwords and create users
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          roomNumber: userData.roomNumber
        });
        await newUser.save();
        console.log(`✓ Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`✓ User already exists: ${userData.email}`);
      }
    }

    console.log('\n=== Test Credentials ===');
    console.log('\nAdmin Account:');
    console.log('  Email: jaya@gmail.com');
    console.log('  Password: admin123');
    console.log('  Role: Admin (Warden)');
    
    console.log('\nStudent Account:');
    console.log('  Email: student@gmail.com');
    console.log('  Password: student123');
    console.log('  Role: Student');
    
    console.log('\n=== Seed completed successfully ===\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
