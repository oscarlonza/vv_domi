/*
Login de superAdmin
campo usuario debe aceptar mínimo 5 caracteres y máximo 10 caracteres, no se permiten caracteres especiales ni espacios en blanco.
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
*/

function validarUsuarioSA(username) {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(username);
}

function validarPasswordSA(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#\$%&])(?!.*\s).{8,15}$/;
    return regex.test(password);
}


describe("validarUsuarioSA", ()=> {

    test('Valida nombres de usuario valido', () => {
        expect(validarUsuarioSA('userBien')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga menos de 5 caracteres', () => {
        expect(validarUsuarioSA('user')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga mas de 10 caracteres', () => {
        expect(validarUsuarioSA('userconmasdediez')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga caracteres especiales ', () => {
        expect(validarUsuarioSA('user#123')).toBe(true);
    });
    
    test('Valida nombres de usuario no tenga espacion en blanco ', () => {
        expect(validarUsuario('user 123')).toBe(true);
    });

});

describe("validarPasswordSA", ()=> {

    test('Valida contraseña valida', () => {
        expect(validarPasswordSA('ValidPass1#')).toBe(true);
        expect(validarPasswordSA('Pass1234$')).toBe(true);
    });
    
    test('valida Contraseña sin mayuscula', () => {
        expect(validarPasswordSA('invalidpass1#')).toBe(true);
    });
    
    test('Valida contraseña sin minuscula', () => {
        expect(validarPasswordSA('INVALID1#')).toBe(true);
    });
        
    test('valida contraseña sin numero', () => {
        expect(validarPasswordSA('NoNumber#')).toBe(true);
    });
    
    test('Valida constraseña sin caracter especial', () => {
        expect(validarPasswordSA('NoSpecial1')).toBe(true);
    });
    
    test('Valida contraseña con espacio en blanco', () => {
        expect(validarPasswordSA('With space1#')).toBe(true);
    });
    
    test('valida contraseña con menos de 8 caracteres', () => {
        expect(validarPasswordSA('Short1#')).toBe(true);
    });
    
    test('valida contraseña con mas de 15 caracteres', () => {
        expect(validarPasswordSA('ThisIsAVeryLongPassword1#')).toBe(true);
    });

});
