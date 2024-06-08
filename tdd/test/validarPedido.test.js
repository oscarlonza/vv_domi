const { validarCantidadPedido, validarCarrito } = require("../src/pedidos/crearPedido");

describe("validarCantidad", () => {
    test('Valida cantidad a comprar por producto', () => {
        expect(validarCantidadPedido(1)).toBe(true);
    });

    test('Valida cantidad a comprar por producto nula', () => {
        expect(validarCantidadPedido()).toBe(false);
    });

    test('Valida cantidad a comprar por producto negativa', () => {
        expect(validarCantidadPedido(-1)).toBe(false);
    });

    test('Valida cantidad a comprar por producto 0', () => {
        expect(validarCantidadPedido(0)).toBe(false);
    });

    test('Valida cantidad a comprar por producto texto', () => {
        expect(validarCantidadPedido('uno')).toBe(false);
    });

    test('Valida cantidad a comprar mayor a stock', () => {
        expect(validarCantidadPedido(1000)).toBe(false);
    });
});

describe("validarCarrito", () => {
    test('Valida carrito con productos', () => {
        expect(validarCarrito([{
            id: 1,
            cantidad: 1
        }])).toBe(true);
    });

    test('Valida carrito sin productos', () => {
        expect(validarCarrito([])).toBe(false);
    });

    test('Valida carrito nulo', () => {
        expect(validarCarrito()).toBe(false);
    });

    test('Valida carrito con productos nulos', () => {
        expect(validarCarrito([null])).toBe(true);
    });

    test('Valida carrito con productos vacios', () => {
        expect(validarCarrito([{}])).toBe(true);
    });
});
