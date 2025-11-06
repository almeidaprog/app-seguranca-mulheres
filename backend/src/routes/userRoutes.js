//userRoutes
import express from 'express';
import {createUser, getUser, updateUser, deleteUser} from '../controllers/userController.js';
import {login, logout, checkAuth} from '../controllers/authController.js';
import {requireAuth, attachUser} from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.get('/profile',requireAuth,getUser);
userRouter.put('/profile',requireAuth,updateUser);
userRouter.delete('/account',requireAuth,deleteUser);
userRouter.post('/login', login);
userRouter.post('/logout', requireAuth,logout);
userRouter.get('/check', attachUser,checkAuth);

export default userRouter;