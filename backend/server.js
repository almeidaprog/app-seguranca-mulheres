require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose')
//process.env.CONNECTIONSTRING
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('Conecction established');
  })
  .catch(e => console.log(e));

const path = require('path');
const routes = require(path.resolve(__dirname,'src','routes','routes'));
const { globalMiddleware } = require('./src/middlewares/middleware');

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