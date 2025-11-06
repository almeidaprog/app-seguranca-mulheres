import express from 'express';
import {login, logout, checkAuth} from '../controllers/authController.js';
import {requireAuth, attachUser} from '../middlewares/authMiddleware.js';

const authRouter = express.Router();
//public
authRouter.post('/login', login);
//protected
authRouter.post('/logout', requireAuth,logout);
//public
authRouter.get('/check', attachUser,checkAuth);

export default authRouter;
