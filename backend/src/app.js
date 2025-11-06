import express from 'express';
import userRouter from './routes/userRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';

//Configurations
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Sessions and cookies
app.use(session({
  secret: 'key-app-seguranca-para-mulheres',
  resave: false,
  saveUninitialized:false,
  cookie:{
    secure:false,
    httpOnly: true,
    maxAge: 1000* 60* 60 * 24 * 7,
    sameSite: 'lax'
  },
  name:'app-seguranca.sid'
}));
  
//Routes
app.use('/api/users',userRouter);
app.use('/api/auth', authRoutes);

//Errors
app.use(notFound);
app.use(errorHandler);

export default app;
