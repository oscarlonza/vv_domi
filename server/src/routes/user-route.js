import { Router } from "express";
import { registerController, 
    loginController, 
    logoutController, profileController } from "../controllers/userController.js";
import validateToken from "../middlewares/validateToken.js";

const router = Router()

// ruta abierta
router.post('/register', registerController)

// ruta abierta
router.post('/login', loginController)

// ruta abierta
router.post('/logout', logoutController)

// ruta protegida el profile es un ejemplo
router.get('/profile', validateToken, profileController)

export default router