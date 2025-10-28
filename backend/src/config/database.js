import 'dotenv/config.js';
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTIONSTRING);
        console.log('Connection whit database established');
    }catch(e){ console.log('MongoDB connection error:', e)};
};