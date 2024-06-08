//const {} = require('jest');
//const{validarPrecio} = require('validarPrecio')

/*
Entero Número no negativo
Máximo 10.000.000
Obligatorio
*/

const validarPrecio = (value ) => {
    return value >= 0 && value <= 10000000;
}

describe("Validar precio", () => {
    test("Mayor que cero", () => {
        expect(validarPrecio(5)).toBe(true);
    });
    test("Menor que cero", () => {
        expect(validarPrecio(-5)).toBe(false);
    });
    test("Menor o igual que 10 Millones", () => {
        expect(validarPrecio(90000000)).toBe(false);
    });
});
