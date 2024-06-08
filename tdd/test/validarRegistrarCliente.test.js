/*
Regsitar cliente
campo nombre del cliente debe aceptar mínimo 5 caracteres y máximo 50 caracteres..
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
Valida que un email cumpla con los criterios mínimos de formato de correo electrónico y tenga minimo 10 caracteres y maximo 60 caracteres
El campo dirección de aceptar como mínimo 10 caracteres y máximo 50 caracteres.
*/


const {validarUsuario, validarPassword, validarNombreCliente, validarEmail, validarDireccion} = require("../src/utilsUser");

describe("validarNombreCliente", ()=> {

    test('Valida nombres del cliente correcto', () => {
        expect(validarNombreCliente('Miguel Antonio Galvis')).toBe(true);
    });

    test('Valida nombres del cliente con menos de 5 caracteres', () => {
        expect(validarNombreCliente('Jose')).toBe(false);
    });

    test('Valida nombres del cliente con mas de 50 caracteres', () => {
        expect(validarNombreCliente('Jose Miguel Antonio del Carmen Padilla Sotomayor Verenzuela')).toBe(false);
    });
});

describe("validarPassword", ()=> {

    test('Valida contraseña valida', () => {
        expect(validarPassword('ValidPass1#')).toBe(true);
        expect(validarPassword('Pass1234$')).toBe(true);
    });
    
    test('valida Contraseña sin mayuscula', () => {
        expect(validarPassword('invalidpass1#')).toBe(false);
    });
    
    test('Valida contraseña sin minuscula', () => {
        expect(validarPassword('INVALID1#')).toBe(false);
    });
        
    test('valida contraseña sin numero', () => {
        expect(validarPassword('NoNumber#')).toBe(false);
    });
    
    test('Valida constraseña sin caracter especial', () => {
        expect(validarPassword('NoSpecial1')).toBe(false);
    });
    
    test('Valida contraseña con espacio en blanco', () => {
        expect(validarPassword('With space1#')).toBe(false);
    });
    
    test('valida contraseña con menos de 8 caracteres', () => {
        expect(validarPassword('Short1#')).toBe(false);
    });
    
    test('valida contraseña con mas de 15 caracteres', () => {
        expect(validarPassword('ThisIsAVeryLongPassword1#')).toBe(false);
    });

});

describe("validarEmail", ()=> {

    test('Valida correo electronico correcto', () => {
        expect(validarEmail('mi.email@example.com')).toBe(true);
    });

    test('Valida correo con menos de 10 caracteres', () => {
        expect(validarEmail('s@ex.co')).toBe(false);
    });
    
    test('Valida correo con mas de 60 caracteres', () => {
        expect(validarEmail('correoelectronicopersonaconmasdesesentacaracteres@example.com')).toBe(false);
    });
    
    test('Valida correo con espacios en blanco', () => {
        expect(validarEmail('invalid email@example.com')).toBe(false);
        expect(validarEmail('invalidemail@ example.com')).toBe(false);
        expect(validarEmail('invalidemail@example .com')).toBe(false);
    });
    
    test('Valida correo con formato invalido', () => {
        expect(validarEmail('plainaddress')).toBe(false);
        expect(validarEmail('@gmail.com')).toBe(false);
    });

});

describe("validarDireccion", ()=> {

    test('Valida direccion correcta', () => {
        expect(validarDireccion('Calle 84 # 45 - 56')).toBe(true);
    });
        
    test('Valida direccion con menos de 10', () => {
        expect(validarDireccion('Calle 3')).toBe(false);
    });
    
    test('Valida direccion con mas de 50 caracteres', () => {
        expect(validarDireccion('Calle 45 B SUR # 34 A1 - 45 apartamento 3002 torre A piso 3')).toBe(false);
    });

});
