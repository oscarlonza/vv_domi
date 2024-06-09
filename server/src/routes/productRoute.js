/*
Las rutas para consumir el controlador de productos
*/

import { Router } from "express";
import { createMultipleProducts, getPaginatedProducts, getProductById/*, createProduct, createDefaultImage*/ } from "../controllers/productController.js";
import validateToken from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const productRouter = Router();

productRouter.post('/dummies', createMultipleProducts);

productRouter.get('/paginated', getPaginatedProducts);

productRouter.get('/:id', getProductById);

//productRouter.post('/createdefaultimage', createDefaultImage);

//productRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createProduct);

// endpoint para validar usuario autenticado y verificado.
//router.get('/profile', validateToken, validateUserExits, validateUserIsVerified, profile);

export default productRouter;