import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dummyRouter  from './routes/dummyRoute.js';
import authRouter from './routes/authRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Credentials', true);
    next();
});

if('development' === process.env.NODE_ENV) {
    app.use('/api/dummy', dummyRouter);
}

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

export default app;