import { Router } from "express";
import { createDummyUsers, createDummyProducts, importDummyProducts, createDummyOrders, deleteDummyOrders, alterCreateAtOrder, alterStatusOrder, replaceImageContentProducts } from "../controllers/dummyController.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const dummyRouter = Router();

dummyRouter.post('/users', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyUsers);
dummyRouter.post('/products', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyProducts);
dummyRouter.post('/importdummyproducts', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, importDummyProducts);
dummyRouter.post('/orders', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createDummyOrders);
dummyRouter.post('/deleteorders', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, deleteDummyOrders);
dummyRouter.post('/altercreateatOrder', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, alterCreateAtOrder);
dummyRouter.post('/alterstatusorder', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, alterStatusOrder);
dummyRouter.post('/replaceimage', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, replaceImageContentProducts);




export default dummyRouter;