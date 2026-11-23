import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const dbURI = `${process.env.MONGODB_STRING}${process.env.DB_NAME}`;
      await mongoose.connect(dbURI);
      console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    } else {
      console.log('Database already connected');
    }
  } catch (error) {
    console.error('DataBase connection error!!!', error);
    throw error;
  }
};

export { ConnectDB };




// 