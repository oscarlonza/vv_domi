import User from '../models/user.js';

export const validateUserIsVerified = async (req, res, next) => {
    const { id } = req.user;
    const userFound = await User.findById(id);

    if (!userFound)
        return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!userFound.is_verified)
        return res.status(404).json({ message: 'Usuario no verificado' });

    next();
}

export const validateUserAlreadyExists = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user)
        return res.status(404).json({ message: 'El correo electrónico ya se encuentra registrado' });

    next();

}

export const validateUserIsAdmin = async (req, res, next) => {
    const { id } = req.user;
    const userFound = await User.findById(id);

    if (!userFound)
        return res.status(404).json({ message: 'Usuario no encontrado' });
    
    if(userFound.role !== 'superadmin')
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });

}