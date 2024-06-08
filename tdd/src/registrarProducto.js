function validarNombreProducto(nombreProducto) {

    return (nombreProducto && nombreProducto !== '' && nombreProducto.length <= 100) ? true : false || false;
}

function validarDescProducto(descProducto) {
    return descProducto.length <= 200;
}

function validarPrecio(precio) {

    return typeof precio === 'number' && precio > 0;
}

function validarCantidad(cantidad) {

    return typeof cantidad === 'number' && cantidad > 0;
}

function validarImagen(file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB en bytes

    if (!file || !allowedMimeTypes.includes(file.mimetype) || file.size > maxFileSize) {
        return false;
    }

    return true;
}

module.exports = {
    validarNombreProducto,
    validarDescProducto,
    validarPrecio,
    validarCantidad,
    validarImagen
};
