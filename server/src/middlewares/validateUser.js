import { User } from '../models/user.js';

export const validateUserExits = async (req, res, next) => {
    const { id } = req.user;
    const userFound = await User.findById(id);

    if (!userFound)
        return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = {
        id,
        is_verified: userFound.is_verified,
        role: userFound.role,
        verification_code : userFound.verification_code
    }

    req.user = user;

    next();
}

export const validateUserIsVerified = async (req, res, next) => {
    const { is_verified } = req.user;

    if (!is_verified)
        return res.status(404).json({ message: 'Usuario no verificado' });

    next();
}

export const validateUserIsNotVerified = async (req, res, next) => {
    const { is_verified } = req.user;
    
    if (is_verified)
        return res.status(404).json({ message: 'Usuario verificado' });

    next();
}

export const validateUserIsAdmin = async (req, res, next) => {
    const { role } = req.user;

    if (role !== 'superadmin')
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });

    next();
}

export const validateEmailDoesntExists = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user)
        return res.status(404).json({ message: 'El correo electrónico ya se encuentra registrado' });

    next();
}

export const validateEmailAlreadyExists = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        return res.status(404).json({ message: 'El correo electrónico no existe' });

    next();
}
