/*
Eliminar producto
validar que el producto exista
*/

function validarEliminarProducto(idProducto) {

    if (idProducto == 1){
        return true;
    }
}


describe("validarEliminarProducto", ()=> {

    test('Valida eliminar producto correctamente', () => {
        expect(validarEliminarProducto('1')).toBe(true);
    });
    
    test('Producto no encontrado', () => {
        expect(validarEliminarProducto('12')).toBe(false);
    });

});