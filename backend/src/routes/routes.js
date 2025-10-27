import express from 'express';
import {home, homePost} from '../controllers/homeController.js';
const routes = express.Router();

// Rotas da home

routes.get('/', home);
routes.post('/', homePost);

export default routes;