import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import productRouter from './routes/productRoute.js';
import cors from 'cors';
//import fileUpload from 'express-fileupload';


const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(express.static('public'));
////FileUpload
//app.use(fileUpload({
//    useTempFiles: true,
//    tempFileDir: '/tmp/',
//    createParentPath: true
//}));

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

export default app;