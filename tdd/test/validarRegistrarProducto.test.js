/*
Registar producto

*/

function validarNombreProducto(nombreProducto) {

    return nombreProducto && nombreProducto.length <= 100; 
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

  function validareImagen(file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB en bytes
  
    if (!file || !allowedMimeTypes.includes(file.mimetype) || file.size > maxFileSize) {
      return false;
    }
    return true;
  }


describe("validarNombreProducto", ()=> {

    test('Valida nombres de productos validos', () => {
        expect(validarNombreProducto('Celular Motorola')).toBe(true);
    });

    test('Valida campo null o vacio', () => {
        expect(validarNombreProducto('')).toBe(false);
        expect(validarNombreProducto(null)).toBe(false);
        expect(validarNombreProducto(undefined)).toBe(false);
      });

    test('Valida nombre de producto con mas de 100 caracteres', () => {
        expect(validarNombreProducto('nombre de producto con mas de 100 caracteres nombre, nombre, nombre, nombre, nombre, nombre, nombre, nombre ')).toBe(true);
      });
});

describe("validarDescProducto", ()=> {

    test('Valida descripcion de productos validos', () => {
        expect(validarDescProducto('El Motorola Moto G Power, es un smartphone diseñado para ofrecer un rendimiento excepcional y una duración de batería inigualable a un precio asequible, con características avanzadas y robustas.')).toBe(true);
      });

    test('Valida descripcion de producto con mas de 200 caracteres', () => {
        expect(validarDescProducto('descripcion del producto con mas de 200 caracteres, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion')).toBe(true);
      });
});

describe("validarPrecio", ()=> {

    test('Valida precios correctos', () => {
        expect(validarPrecio(10000)).toBe(true);
      });

     test('Valida precios no correctos', () => {
        expect(validarPrecio(-1)).toBe(false);
      });
});

describe("validarCantidad", ()=> {

    test('Valida cantidad de productos correctos', () => {
        expect(validarCantidad(30)).toBe(true);
      });

     test('Valida cantidad de productos no correctos', () => {
        expect(validarCantidad(-1)).toBe(false);
      });
});

describe("validareImagen", ()=> {

    test('Valida que la imagen sea formato jpeg y peso menor a 5 MB', () => {
        const file = {
          mimetype: 'image/jpeg',
          size: 4 * 1024 * 1024 // 4 MB
        };
        expect(validareImagen(file)).toBe(true);
      });

      test('Valida que la imagen sea formato png y peso menor a 5 MB', () => {
        const file = {
          mimetype: 'image/png',
          size: 3 * 1024 * 1024 // 3 MB
        };
        expect(validateImage(file)).toBe(true);
      });
});
