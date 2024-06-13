import { Router } from "express";
import { createDummyUsers, createDummyProducts, createDummyOrders, deleteDummyOrders, alterCreateAtOrder, alterStatusOrder } from "../controllers/dummyController.js";
import validateToken from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const dummyRouter = Router();

dummyRouter.post('/users', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyUsers);
dummyRouter.post('/products', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyProducts);
dummyRouter.post('/orders', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyOrders);
dummyRouter.post('/deleteorders', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, deleteDummyOrders);
dummyRouter.post('/altercreateatOrder', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, alterCreateAtOrder);
dummyRouter.post('/alterstatusorder', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, alterStatusOrder);

export default dummyRouter;