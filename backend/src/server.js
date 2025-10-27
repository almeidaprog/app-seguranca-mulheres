import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';

import routes from './routes/routes.js';

import { globalMiddleware } from './middlewares/middleware.js';

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log('Connection whit database established');
    app.emit('Conecction established');
  })
  .catch(e => console.log('MongoDB connection error:', e));


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(globalMiddleware);
app.use(routes);

app.on('Conecction established', () => {
  app.listen(5000, () => {
    console.log('Access http://localhost:5000');
    console.log('Server running on port 5000');
  });
});


/*

app.use(cors({
  origin: 'http://localhost:3000', // URL do frontend
  credentials: true
}));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port 5000: http://localhost:${PORT}`);
});

*/