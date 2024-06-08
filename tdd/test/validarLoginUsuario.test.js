/*
Login de usuario
campo usuario debe aceptar mínimo 5 caracteres y máximo 10 caracteres, no se permiten caracteres especiales ni espacios en blanco.
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
*/

function validarUsuario(username) {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(username);
}

function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#\$%&])(?!.*\s).{8,15}$/;
    return regex.test(password);
}


describe("validarUsuario", ()=> {

    test('Valida nombres de usuario valido', () => {
        expect(validarUsuario('userBien')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga menos de 5 caracteres', () => {
        expect(validarUsuario('user')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga mas de 10 caracteres', () => {
        expect(validarUsuario('userconmasdediez')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga caracteres especiales ', () => {
        expect(validarUsuario('user#123')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga espacion en blanco ', () => {
        expect(validarUsuario('user 123')).toBe(true);
    });

});

describe("validarPassword", ()=> {

    test('Valida contraseña valida', () => {
        expect(validarPassword('ValidPass1#')).toBe(true);
        expect(validarPassword('Pass1234$')).toBe(true);
    });
    
    test('valida Contraseña sin mayuscula', () => {
        expect(validarPassword('invalidpass1#')).toBe(true);
    });
    
    test('Valida contraseña sin minuscula', () => {
        expect(validarPassword('INVALID1#')).toBe(true);
    });
        
    test('valida contraseña sin numero', () => {
        expect(validarPassword('NoNumber#')).toBe(true);
    });
    
    test('Valida constraseña sin caracter especial', () => {
        expect(validarPassword('NoSpecial1')).toBe(true);
    });
    
    test('Valida contraseña con espacio en blanco', () => {
        expect(validarPassword('With space1#')).toBe(true);
    });
    
    test('valida contraseña con menos de 8 caracteres', () => {
        expect(validarPassword('Short1#')).toBe(true);
    });
    
    test('valida contraseña con mas de 15 caracteres', () => {
        expect(validarPassword('ThisIsAVeryLongPassword1#')).toBe(true);
    });

});
