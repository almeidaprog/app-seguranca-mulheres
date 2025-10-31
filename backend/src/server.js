import 'dotenv/config.js';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  try {
    // 1. Conectar ao banco primeiro
    await connectDatabase();

    app.listen(5000, () => {
    console.log('Access http://localhost:5000');
    console.log('Server running on port 5000');
  });
  }catch(e){
    console.log('Error starting server',e);
    process.exit(1);
  }}
  
  startServer();
