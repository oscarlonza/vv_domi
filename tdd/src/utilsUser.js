
/*
campo usuario debe aceptar mínimo 5 caracteres y máximo 10 caracteres, no se permiten caracteres especiales ni espacios en blanco.
*/
function validarUsuario(username) {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(username);
}

/*
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
*/
function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#\$%&])(?!.*\s).{8,15}$/;
    return regex.test(password);
}

/*
Valida que el nombre de cliente tenga como mínimo 5 caracteres y máximo 50 caracteres.
*/
function validarNombreCliente(nombreCliente) {
    return nombreCliente && nombreCliente.length >= 5 && nombreCliente.length <= 50;
}

/*
Valida que un email cumpla con los criterios mínimos de formato de correo electrónico y tenga minimo 10 caracteres y maximo 60 caracteres
*/
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length >= 10 && email.length <= 60;
}

/*
Valida que una dirección tenga como mínimo 10 caracteres y máximo 50 caracteres.
*/
function validarDireccion(address) {
    return address.length >= 10 && address.length <= 50;
}

module.exports = {
    validarUsuario,
    validarPassword,
    validarNombreCliente,
    validarEmail,
    validarDireccion
};
