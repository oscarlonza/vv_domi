/*
Las rutas para consumir el controlador de ordenes
*/

import { Router } from "express";
import { createOrder, getOrders, updateOrder, getPaginatedProductsPurchasedByUser, getOrdersBetweenDates, getTopTenProducts } from "../controllers/orderController.js";
import validateToken from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const orderRouter = Router();

orderRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, createOrder);

orderRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, createOrder);

orderRouter.get('/', validateToken, validateUserExits, validateUserIsVerified, getOrders);

orderRouter.put('/:id', validateToken, validateUserExits, validateUserIsVerified, updateOrder);

orderRouter.get('/products', validateToken, validateUserExits, validateUserIsVerified, getPaginatedProductsPurchasedByUser);

orderRouter.get('/resume', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, getOrdersBetweenDates);

orderRouter.get('/topten', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, getTopTenProducts);



export default orderRouter;