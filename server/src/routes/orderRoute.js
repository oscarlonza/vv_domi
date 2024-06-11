/*
Las rutas para consumir el controlador de ordenes
*/

import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import validateToken from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const orderRouter = Router();

orderRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, createOrder);

orderRouter.get('/', validateToken, validateUserExits, validateUserIsVerified, getOrders);

//orderRouter.get('/', getOrders);

export default orderRouter;