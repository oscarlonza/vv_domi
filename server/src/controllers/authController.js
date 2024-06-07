import { User, UserPassword, ChangePassword } from '../models/user.js';
import bcrypt from 'bcryptjs';
import createAccessToken from '../libs/jwt.js';
import { sendEmail } from '../libs/emailSender.js';

import { getVerificationCodeMailFormatted } from '../libs/verificationCodeMailFormat.js';
import { getResetPasswordMailFormatted } from '../libs/resetPasswordMailFormat.js';

export async function register(req, res) {
    try {
        const { name, email, address, password } = req.body;

        const userValid = new UserPassword({ name, email, address, password });
        await userValid.validate();

        const newUser = new User({
            name,
            email,
            address,
            password: await bcrypt.hash(password || '', 10)
        });

        let userSaved = await newUser.save();

        return res.json({
            name: userSaved.name,
            email: userSaved.email,
            address: userSaved.address
        });

    } catch (error) {
        return res.status(500).json({ message: error.message.replace('User validation failed: ', '').replace('UserPassword validation failed: ', '') });
    }

}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ message: "Correo requerido" });
        if (!password) return res.status(400).json({ message: "Contraseña requerida" });

        const userFound = await User.findOne({ email });

        const message = 'Correo o contraseña inválidos';
        if (!userFound) return res.status(400).json({ message });
        const passwordGood = await bcrypt.compare(password, userFound.password);
        if (!passwordGood) return res.status(400).json({ message });

        const token = await createAccessToken({ id: userFound._id });
        res.cookie('token', token);

        const user = {
            name: userFound.name,
            email: userFound.email,
            address: userFound.address,
            role: userFound.role
        };

        //El usuario requiere verificación
        if (!userFound.is_verified) {
            sendVerificationCode(userFound);
            return res.status(403).json(user);
        }

        return res.json(user);

    } catch (error) {
        res.cookie('token', '', { expires: new Date(0) });
        return res.status(500).json({ message: error.message });
    }
}

export function logout(req, res) {
    res.cookie('token', '', { expires: new Date(0) });

    const { internal } = req.body;
    
    if (internal)
        return res.status(200);
    else
        return res.sendStatus(200);
}

export async function verify(req, res) {

    try {
        const { ping } = req.body;
        if (!ping) return res.status(400).json({ message: "Código de verificación requerido" });

        const { id, verification_code } = req.user;
        if (verification_code !== ping)
            return res.status(400).json({ message: 'Ping inválido' });

        const userFound = await User.findById(id);
        userFound.is_verified = true;
        userFound.verification_code = null;
        userFound.save();

        req.body.internal = true;
        return logout(req, res).json({ message: 'Usuario verificado' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function profile(req, res) {
    try {
        return res.send(req.user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function resendcode(req, res) {
    try {

        sendVerificationCode(req.user);

        return res.status(200).json({ message: 'Nuevo código enviado' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        const model = new ChangePassword({ oldPassword, newPassword });
        await model.validate();

        const userFound = await User.findById(req.user.id);

        if (!await bcrypt.compare(oldPassword, userFound.password))
            return res.status(400).json({ message: "Contraseña incorrecta" });

        userFound.password = await bcrypt.hash(newPassword || '', 10);
        userFound.is_verified = false;
        await userFound.save();

        req.body.internal = true;
        return logout(req, res).json({ message: 'Contraseña actualizada satisfactoriamente' });

    } catch (error) {
        return res.status(500).json({ message: error.message.replace('User validation failed: ', '').replace('ChangePassword validation failed: ', '') });
    }

}

export async function resetPassword(req, res) {
    try {

        const { email } = req.body;
        const newPassword = generatePassword();

        const userFound = await User.findOne({ email });

        userFound.password = await bcrypt.hash(newPassword || '', 10);
        userFound.is_verified = false;
        await userFound.save();

        const html = getResetPasswordMailFormatted(newPassword);
        sendEmail(email,
            'Domi Store - Nueva contraseña',
            `Tu nueva contraseña es: ${newPassword}`,
            html);

        return res.status(200).json({ message: 'Será enviada una nueva contraseña al correo' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function sendVerificationCode(localUser) {

    const user = await User.findById(localUser.id);
    user.verification_code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    const userSaved = await user.save();

    const { email, verification_code } = userSaved;

    const html = getVerificationCodeMailFormatted(verification_code);

    sendEmail(email,
        'Domi Store - Código de verificación',
        `Tu código de verificación es: ${verification_code}`,
        html,
        (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
                setTimeout(async () => {
                    try {
                        const email = info.accepted[0];
                        const userFound = await User.findOne({ email });
                        userFound.verification_code = null;
                        await userFound.save();
                        console.log("Verification code removed");
                    } catch (error) {
                        console.log(error);
                    }

                }, 2 * 60 * 1000);
            }
        }
    );

}

function generatePassword() {
    var length = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';
    var password = '';
    var requirements = [false, false, false, false]; // minúsculas, mayúsculas, números, caracteres especiales

    while (!requirements.every(Boolean) || password.length < length) {
        var caracter = characters.charAt(Math.floor(Math.random() * characters.length));
        password += caracter;

        if ('abcdefghijklmnopqrstuvwxyz'.includes(caracter)) {
            requirements[0] = true;
        } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(caracter)) {
            requirements[1] = true;
        } else if ('0123456789'.includes(caracter)) {
            requirements[2] = true;
        } else if ('#$%&'.includes(caracter)) {
            requirements[3] = true;
        }
    }

    return password;
}
