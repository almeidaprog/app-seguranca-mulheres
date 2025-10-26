const express = require('express');
const routes = express.Router();
const homeController = require('../controllers/homeController.js');

// Rotas da home

routes.get('/', homeController.home);
routes.post('/', homeController.homePost);

module.exports = routes;