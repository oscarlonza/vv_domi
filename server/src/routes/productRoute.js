/*
Las rutas para consumir el controlador de productos
*/

import { Router } from "express";
import { setProductsImageToDefault, getPaginatedProducts, getProductById, createProduct, updateProduct, deleteProduct, createComment, getPaginatedCommentsByProductId } from "../controllers/productController.js";
import { validateToken, addToken } from "../middlewares/validateToken.js";
import { addUser, validateUserExits, validateUserIsVerified, validateUserIsAdmin } from "../middlewares/validateUser.js";

const productRouter = Router();

productRouter.post('/originDefaultimage', setProductsImageToDefault);

productRouter.get('/paginated', addToken, addUser, getPaginatedProducts);

productRouter.get('/:id', getProductById);

productRouter.post('/', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, createProduct);

productRouter.put('/:id', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, updateProduct);

productRouter.delete('/:id', validateToken, validateUserExits, validateUserIsVerified, validateUserIsAdmin, deleteProduct);

productRouter.post('/:id/comments', validateToken, validateUserExits, validateUserIsVerified, createComment);

productRouter.get('/:id/comments/paginated', getPaginatedCommentsByProductId);

export default productRouter;