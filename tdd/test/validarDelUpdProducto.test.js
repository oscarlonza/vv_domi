/*
Eliminar y actualizar producto
validar que el producto exista para poder ser eliminado o actualizado
*/

const {validarEliminarProducto, validarModificarProducto} = require("../src/registrarProducto");

describe("validarEliminarProducto", ()=> {

    test('Valida eliminar producto correctamente', () => {
        expect(validarEliminarProducto('1')).toBe(true);
    });
    
    test('Producto no encontrado', () => {
        expect(validarEliminarProducto('12')).toBe(false);
    });

});

describe("validarModificarProducto", ()=> {

    test('Valida modificar producto correctamente', () => {
        expect(validarModificarProducto('10')).toBe(true);
    });
    
    test('Producto no encontrado', () => {
        expect(validarModificarProducto('5')).toBe(false);
    });

});
