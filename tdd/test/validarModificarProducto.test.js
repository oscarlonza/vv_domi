/*
Modificar producto

- Validar que el producto exista
*/

function validarModificarProducto(idProducto) {

    if (idProducto == 10){
        return true;
    }
}


describe("validarModificarProducto", ()=> {

    test('Valida modificar producto correctamente', () => {
        expect(validarModificarProducto('10')).toBe(true);
    });
    
    test('Producto no encontrado', () => {
        expect(validarModificarProducto('5')).toBe(false);
    });

});