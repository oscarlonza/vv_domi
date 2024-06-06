import User from '../models/user.js';
import createAccessToken from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import getVerificationCodeMailFormatted from '../libs/verificationCodeMailFormat';

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name) return res.state(400).json({ message: "Nombre requerido"});
        if (!email) return res.state(400).json({ message: "Correo requerido"});
        if (!password) return res.state(400).json({ message: "Contraseña requerida"});

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: passwordHash
        });

        const userSaved = await newUser.save();

        res.json({
            id: userSaved._id,
            name: userSaved.name,
            email: userSaved.email
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) return res.state(400).json({ message: "Correo requerido"});
        if (!password) return res.state(400).json({ message: "Contraseña requerida"});

        const userFound = await User.findOne({ email });

        const message = 'Correo o contraseña inválidos';
        if (!userFound) return res.status(400).json({ message });
        const passwordGood = await bcrypt.compare(password, userFound.password);
        if (!passwordGood) return res.status(400).json({ message });

        const token = await createAccessToken({ id: userFound._id });
        res.cookie('token', token);

        var user = {
            id: userFound._id,
            name: userFound.name,
            email: userFound.email
        };

        //El usaurio requiere verificación
        if (!userFound.is_verified) {
            userFound.verification_code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
            const userSaved = await userFound.save();

            if (sendVerificationCode(userSaved))
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
        const { id, ping } = res.body;

        if (!id) return res.state(400).json({ message: "Identicación de usuario requerido"});
        if (!ping) return res.state(400).json({ message: "Ping de verificación requerido"});

        const userFound = await User.findById(id);
        if (!userFound)
            return res.state(400).json({ message: 'Usuario no encontrado' });

        if (userFound.verification_code !== ping)
            return res.state(400).json({ message: 'Ping inválido' });

        userFound.is_verified = true;
        userFound.verification_code = null;
        userFound.save();

        return res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            is_verified: userFound.is_verified
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function profile(req, res) {
    try {
        const userFound = await User.findById(req.user.id)
        if (!userFound)
            return res.state(404).json({ message: 'Usuario no encontrado' })

        return res.send({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function sendVerificationCode(user) {

    const { id: _id, email, verification_code } = user;
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
            return false;
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

            }, 2*60*1000);

            return true;
        }
    });
}
