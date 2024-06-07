import { Router } from "express";
import { register, login, logout, profile, verify, resendcode, changePassword } from "../controllers/authController.js";
import validateToken from "../middlewares/validateToken.js";
import {validateUserExits, validateUserIsVerified, validateEmailAlreadyExists, validateUserIsNotVerified} from "../middlewares/validateUser.js";

const router = Router();

// endpoint de registro de usuario.
router.post('/register', validateEmailAlreadyExists, register);

// endpoint de inicio de sesión.
router.post('/login', login);

// endpoint para cerrar sesión.
router.post('/logout', logout);

// endpoint para verificar el correo del usuario.
router.post('/verify', validateToken, validateUserExits, verify);

// endpoint para cambiar la constraseña del usuario.
router.post('/changepassword', validateToken, validateUserExits, validateUserIsVerified, changePassword);

// endpoint para reenviar código de verificación.
router.post('/resendcode', validateToken, validateUserExits, validateUserIsNotVerified, resendcode);

// endpoint para validar usuario autenticado y verificado.
router.get('/profile', validateToken, validateUserExits, validateUserIsVerified, profile);

export default router;