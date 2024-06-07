import nodemailer from 'nodemailer';

export const sendEmail = async (toEmail, subject, text, html, callback) => {
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

    const mailOptions = {
        from: smtp_email,
        to: toEmail,
        subject: subject,
        text: text,
        html: html
    };

    const transporter = nodemailer.createTransport(transportOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if (callback)
            callback(error, info);
    });

}