import { Router } from "express";
import { register, login, logout, profile, verify } from "../controllers/authController.js";
import validateToken from "../middlewares/validateToken.js";

const router = Router();

// ruta abierta
router.post('/register', register);

// ruta abierta
router.post('/login', login);

// ruta abierta
router.post('/logout', logout);

// ruta protegida para verificar el usuario
router.get('/verify', validateToken, verify);

// ruta protegida el profile es un ejemplo
router.get('/profile', validateToken, profile);

export default router;