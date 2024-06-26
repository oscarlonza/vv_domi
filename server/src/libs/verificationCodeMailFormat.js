
export const getVerificationCodeMailFormatted = (verificationCode) => {
    return `
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0
    }

    .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .1)
    }

    .header {
    
        background-color: #3f51b5;
        color: #fff;
        padding: 10px;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px
    }

    .content {
        padding: 20px;
        text-align: center
    }

    .code {
        font-size: 24px;
        margin: 20px 0;
        padding: 10px;
        border: 1px dashed #3f51b5;
        display: inline-block
    }

    .footer {
        background-color: #eee;
        color: #333;
        padding: 10px;
        text-align: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px
    }
</style>
<div class=container>
    <div class=header>
        <h1>¡Bienvenido a Domi Store!</h1>
    </div>
    <div class=content>
        <p>Estamos emocionados de tenerte con nosotros. Para completar tu acceso, por favor usa el siguiente código de verificación:</p>
        <div class=code>${verificationCode}</div>
        <p>Este código es válido por 2 minutos y solo puede ser usado una vez.</p>
    </div>
    <div class=footer>
        <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Felices compras!</p>
    </div>
</div>
    `;
}
