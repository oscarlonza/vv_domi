import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import createAccessToken from '../libs/jwt.js';
import nodemailer from 'nodemailer';
import getVerificationCodeMailFormatted from '../libs/verificationCodeMailFormat';

export async function register(req, res) {
    try {
        const { name, email, address, password } = req.body;

        if(!name) return res.status(400).json({ message: "Nombre requerido" });
        if (!email) return res.status(400).json({ message: "Correo requerido" });
        if (!address) return res.status(400).json({ message: "Dirección requerida" });
        if (!password) return res.status(400).json({ message: "Contraseña requerida" });
        if (!isPasswordValid(password)) {
            return res.status(400).json({ message: 'La contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.' });
        }

        const newUser = new User({
            name,
            email,
            address,
            password: await bcrypt.hash(password || '', 10)
        });

        let userSaved = await newUser.save();

        res.json({
            name: userSaved.name,
            email: userSaved.email,
            address: userSaved.address
        });

    } catch (error) {
        res.status(500).json({ message: error.message.replace('User validation failed: ', '') });
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
            role: userFound.role
        };

        //El usaurio requiere verificación
        if (!userFound.is_verified) {
            userFound.verification_code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
            const userSaved = await userFound.save();
            sendVerificationCode(userSaved);
            return res.status(403).json(user);
        }

        res.json(user);

    } catch (error) {
        res.cookie('token', '', { expires: new Date(0) });
        res.status(500).json({ message: error.message });
    }
}

export function logout(req, res) {
    res.cookie('token', '', { expires: new Date(0) });
    res.sendStatus(200);
}

export async function verify(req, res) {

    try {
        const { id } = req.user;
        const { ping } = req.body;

        if (!id) return res.status(400).json({ message: "Identificación de usuario requerido" });
        if (!ping) return res.status(400).json({ message: "Código de verificación requerido" });

        const userFound = await User.findById(id);
        if (!userFound)
            return res.status(400).json({ message: 'Usuario no encontrado' });

        if (userFound.verification_code !== ping)
            return res.status(400).json({ message: 'Ping inválido' });

        userFound.is_verified = true;
        userFound.verification_code = null;
        userFound.save();

        return res.json({ message: 'Usuario verificado'});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function profile(req, res) {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound)
            return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.send({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function isPasswordValid(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$%&])[^\s]{8,15}$/;
    return passwordRegex.test(password);
}

async function sendVerificationCode(user) {

    const { email, verification_code } = user;
    const smtp_host = process.env.SMTP_HOST;
    const smtp_port = process.env.SMTP_PORT;
    const smtp_tls = process.env.SMTP_TLS;
    const smtp_secure = process.env.SMTP_SECURE_CONNECTION;
    const smtp_email = process.env.SMTP_EMAIL;
    const smtp_password = process.env.SMTP_PASSWORD;

    let transportOptions = {
        host: smtp_host,
        port: smtp_port,
        secureConnection: smtp_secure,
        auth: {
            user: smtp_email,
            pass: smtp_password
        },
    };
    if (smtp_tls) {
        transportOptions.tls = {
            ciphers: smtp_tls
        };
    }

    const transporter = nodemailer.createTransport(transportOptions);
    const html = getVerificationCodeMailFormatted(verification_code);
    const mailOptions = {
        from: smtp_email,
        to: email,
        subject: 'Domi Store - Código de verificación',
        text: `Tu código de verificación es: ${verification_code}`,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
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
    });
}
