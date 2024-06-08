/*
Regsitar cliente
campo usuario debe aceptar mínimo 5 caracteres y máximo 10 caracteres, no se permiten caracteres especiales ni espacios en blanco.
campo contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.
El campo email debe cumplir con los criterios mínimos, máximo 100 caracteres
El campo dirección de aceptar como mínimo 10 caracteres y máximo 50 caracteres.
*/

function validarUsuario(username) {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(username);
}

function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#\$%&])(?!.*\s).{8,15}$/;
    return regex.test(password);
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length >= 15 && email.length <= 60;
}

function validarDireccion(address) {
  return address.length >= 10 && address.length <= 50;
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

describe("validarEmail", ()=> {

    test('Valida correo electronico correcto', () => {
        expect(validarEmail('mi.email@example.com')).toBe(true);
    });

    test('Valida correo con menos de 15 caracteres', () => {
        expect(validarEmail('short@ex.co')).toBe(false);
    });
    
    test('Valida correo con mas de 60 caracteres', () => {
        expect(validarEmail('verylongemailaddressmorethansixtychars@example.com')).toBe(false);
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