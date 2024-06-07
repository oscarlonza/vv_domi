import { Router } from "express";
import { register, login, logout, profile, verify } from "../controllers/authController.js";
import validateToken from "../middlewares/validateToken.js";
import {validateUserIsVerified, validateUserAlreadyExists} from "../middlewares/validateUser.js";

const router = Router();

// ruta abierta
router.post('/register', validateUserAlreadyExists, register);

// ruta abierta
router.post('/login', login);

// ruta abierta
router.post('/logout', logout);

// ruta protegida para verificar el usuario
router.post('/verify', validateToken, verify);

// ruta protegida el profile es un ejemplo
router.get('/profile', validateToken, validateUserIsVerified, profile);

export default router;