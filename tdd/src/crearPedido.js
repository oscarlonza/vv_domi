function validarCantidadPedido(cantidad) {
    let stock = 999
    return cantidad >= 1 && cantidad <= stock && typeof cantidad === 'number';
}

function validarCarrito(productos) {   
    return productos?.length > 0;
}

module.exports = {
    validarCantidadPedido,
    validarCarrito
};
