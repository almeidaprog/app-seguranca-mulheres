import 'dotenv/config.js';
import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTIONSTRING);
    console.log('Connection whit database established');

    mongoose.connection.on('error', (err) => {
      console.error('Error on MongoDB:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconected');
    });
  }catch(err){ console.log('MongoDB connection error:', err);};
};