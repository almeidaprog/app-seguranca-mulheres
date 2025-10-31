import express from 'express';
import {globalMiddleware} from './middlewares/middleware.js'
import routes from './routes/routes.js';

//Configurations
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(globalMiddleware);

app.use(routes);

export default app;
