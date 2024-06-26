import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const validateToken = (req, res, next) => {
    const { token } = req.cookies;
    const KEY = process.env.TOKEN_SECRET;
    if (!token)
        return res.status(401).json({ message: 'No hay token, Autorización denegada' });
    jwt.verify(
        token,
        KEY, (err, user) => {
            if (err) return res.status(401).json({ message: 'Token inválido' });
            req.user = user;
            next();
        }
    );
}

export const addToken = (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        next();
        return;
    }
    validateToken(req, res, next);
}
