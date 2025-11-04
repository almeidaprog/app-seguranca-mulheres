import express from 'express';
import userRouter from './routes/userRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

//Configurations
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/users',userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
