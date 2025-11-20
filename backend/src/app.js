import express from 'express';
import userRouter from './routes/userRoutes.js';
import contactRoute from './routes/emergencyContactsRoutes.js';
import aiRoute from './routes/aiRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';

//Configurations
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',//FRONT URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));


//Sessions and cookies
app.use(session({
  secret: 'key-app-seguranca-para-mulheres',
  resave: false,
  saveUninitialized:false,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTIONSTRING,
    collectionName:'sessions',
    ttl:1000* 60* 60 * 24 * 7,
    autoRemove: 'native'
  }),
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
app.use('/api/emergency-contacts',contactRoute);
app.use('/api/ai',aiRoute);

//Errors
app.use(notFound);
app.use(errorHandler);

export default app;
