/*
Las rutas para consumir el controlador de productos
*/

import { Router } from "express";
import { createMultipleProducts, getPaginatedProducts, getProductById, createProduct, updateProduct, deleteProduct, createComment, getPaginatedCommentsByProductId } from "../controllers/productController.js";
import validateToken from "../middlewares/validateToken.js";
import { validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const productRouter = Router();

productRouter.post('/dummies', createMultipleProducts);

productRouter.get('/paginated', getPaginatedProducts);

productRouter.get('/:id', getProductById);

productRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createProduct);

productRouter.put('/:id', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, updateProduct);

productRouter.delete('/:id', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, deleteProduct);

productRouter.post('/:id/comments', validateToken, validateUserExits, validateUserIsVerified, createComment);

productRouter.get('/:id/comments/paginated', getPaginatedCommentsByProductId);

// endpoint para validar usuario autenticado y verificado.
//router.get('/profile', validateToken, validateUserExits, validateUserIsVerified, profile);

export default productRouter;