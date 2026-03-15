import mongoose from 'mongoose';
import Admin from './src/models/admin.model.js';
import { MONGODB_URI } from './src/config/env.js';
import logger from './src/utils/logger.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      logger.info('Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      username: 'admin',
      password: 'adminpassword123',
    });

    await admin.save();
    logger.info('Admin user created successfully');
    process.exit();
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();