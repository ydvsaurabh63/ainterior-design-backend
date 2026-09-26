import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const usersToEnsure = [
  {
    name: 'Studio Chief Superadmin',
    email: 'superadmin@studio.com',
    password: 'admin123',
    role: 'superadmin',
    phone: '+91 99999 11111'
  },
  {
    name: 'Studio Principal Admin',
    email: 'admin@studio.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98888 22222'
  },
  {
    name: 'Kabir Malhotra (Client)',
    email: 'client@studio.com',
    password: 'client123',
    role: 'client',
    phone: '+91 98201 45678'
  }
];

const initUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interior_design';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    for (const u of usersToEnsure) {
      let existing = await Admin.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const newUser = new Admin(u);
        await newUser.save();
        console.log(`[CREATED] ${u.role}: ${u.email} / ${u.password}`);
      } else {
        // Update role and password to match
        existing.role = u.role;
        existing.status = 'active';
        existing.password = u.password; // pre-save hook will hash it
        await existing.save();
        console.log(`[UPDATED] ${u.role}: ${u.email} / ${u.password}`);
      }
    }

    console.log('All roles (superadmin, admin, client) are active and ready!');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing users:', err.message);
    process.exit(1);
  }
};

initUsers();
