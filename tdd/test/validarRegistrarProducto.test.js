/*
Registar producto

*/

const { validarNombreProducto, validarDescProducto, validarPrecio, validarCantidad, validarImagen } = require('../src/productos/registrarProducto');

describe("validarNombreProducto", () => {

    test('Valida nombres de productos validos', () => {
        expect(validarNombreProducto('Celular Motorola')).toBe(true);
    });

    test('Valida campo null o vacio', () => {
        expect(validarNombreProducto('')).toBe(false);
        expect(validarNombreProducto(null)).toBe(false);
        expect(validarNombreProducto(undefined)).toBe(false);
    });

    test('Valida nombre de producto con mas de 100 caracteres', () => {
        expect(
            validarNombreProducto('nombre de producto con mas de 100 caracteres nombre, nombre, nombre, nombre, nombre, nombre, nombre, nombre ')
        ).toBe(false);
    });
});

describe("validarDescProducto", () => {

    test('Valida descripcion de productos validos', () => {
        expect(validarDescProducto('El Motorola Moto G Power, es un smartphone diseñado para ofrecer un rendimiento excepcional y una duración de batería inigualable a un precio asequible, con características avanzadas y robustas.')).toBe(true);
    });

    test('Valida descripcion de producto con mas de 200 caracteres', () => {
        expect(validarDescProducto('descripcion del producto con mas de 200 caracteres, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion, descripcion')).toBe(false);
    });
});

describe("validarPrecio", () => {

    test('Valida precios correctos', () => {
        expect(validarPrecio(10000)).toBe(true);
    });

    test('Valida precios 0', () => {
        expect(validarPrecio(0)).toBe(false);
    });

    test('Valida precios no correctos', () => {
        expect(validarPrecio(-1)).toBe(false);
    });

    test('Valida precios nulo', () => {
        expect(validarPrecio()).toBe(false);
    });

    test('Valida precios texto', () => {
        expect(validarPrecio('cien pesos')).toBe(false);
    });
});

describe("validarCantidad", () => {

    test('Valida cantidad de productos correctos', () => {
        expect(validarCantidad(30)).toBe(true);
    });

    test('Valida cantidad de productos no correctos', () => {
        expect(validarCantidad(-1)).toBe(false);
    });
    test('Valida cantidad nulo', () => {
        expect(validarCantidad()).toBe(false);
    });

    test('Valida cantidad texto', () => {
        expect(validarCantidad('treinta y uno')).toBe(false);
    });
});

describe("validarImagen", () => {

    test('Valida que la imagen sea formato jpeg y peso menor a 5 MB', () => {
        const file = {
            mimetype: 'image/jpeg',
            size: 4 * 1024 * 1024 // 4 MB
        };
        expect(validarImagen(file)).toBe(true);
    });

    test('Valida que la imagen sea formato png y peso menor a 5 MB', () => {
        const file = {
            mimetype: 'image/png',
            size: 3 * 1024 * 1024 // 3 MB
        };
        expect(validarImagen(file)).toBe(true);
    });

    test('Valida que la imagen sea formato png y peso menor a 5 MB', () => {
        const file = {
            mimetype: 'image/png',
            size: 10 * 1024 * 1024 // 3 MB
        };
        expect(validarImagen(file)).toBe(false);
    });
});
