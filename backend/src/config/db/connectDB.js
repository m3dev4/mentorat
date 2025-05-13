import mongoose from 'mongoose';
import { envConfig } from '../env/env.config.js';

const ConnectDb = async () => {
  try {
    const conn = await mongoose.connect(envConfig.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default ConnectDb;