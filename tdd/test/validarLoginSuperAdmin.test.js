/*
Login de superAdmin
campo usuario debe aceptar mínimo 5 caracteres y máximo 10 caracteres, no se permiten caracteres especiales ni espacios en blanco.
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
*/
const {validarUsuario, validarPassword} = require("../src/utilsLogin");

describe("validarUsuario", ()=> {

    test('Valida nombres de usuario correcto', () => {
        expect(validarUsuario('userBien')).toBe(true);
    });

    test('Valida nombres de usuario null', () => {
        expect(validarUsuario(null)).toBe(false);
    });
    
    test('Valida nombres de usuario con menos de 5 caracteres', () => {
        expect(validarUsuario('user')).toBe(false);
    });
    
    test('Valida nombres de usuario con mas de 10 caracteres', () => {
        expect(validarUsuario('userconmasdediez')).toBe(false);
    });
    
    test('Valida nombres de usuario no tenga caracteres especiales ', () => {
        expect(validarUsuario('user#123')).toBe(false);
    });
    
    test('Valida nombres de usuario no tenga espacion en blanco ', () => {
        expect(validarUsuario('user 123')).toBe(false);
    });

});

describe("validarPassword", ()=> {

    test('Valida contraseña correcta', () => {
        expect(validarPassword('ValidPass1#')).toBe(true);
    });
    
    test('valida Contraseña null', () => {
        expect(validarPassword(null)).toBe(false);
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
