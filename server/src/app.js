import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import productRouter from './routes/productRoute.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

export default app;