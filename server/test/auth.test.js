import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';


import { addFileToRepository } from '../src/libs/fileManager.js';

/**
 * Pruebas automatizadas de api/
 */
describe('Pruebas de tienda domi> Post api/', () => {

    it('Validar registrar usuario exitosamente--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Yunelis Gutierrez', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(200);

    });

    it('Validar registrar usuario duplicado --> /registrar', async function () {

        const req = { name: 'Yunelis Gutierrez', email: `hanspeluffodiaz@hotmail.com`, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(404);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("El correo electrónico ya se encuentra registrado");
    });

    it('Validar registrar usuario, falta nombre--> /registrar', async function () {
        const date = Date.now();
        const req = { name: '', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("name: Nombre requerido");
    });

    it('Validar registrar usuario, nombre no cumple criterio--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'ffff', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("name: El nombre debe tener al menos 3 caracteres");
    });


    it('Validar registrar usuario, falta email--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: ``, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("email: Correo electrónico requerido");
    });

    it('Validar registrar usuario, email no cumple criterio--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: `dfdf@`, address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("email: Correo electrónico inválido");
    });

    it('Validar registrar usuario, falta contraseña--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'Avenida siempre viva', password: '' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("password: Contraseña requerida");
    });

    it('Validar registrar usuario, contraseña no cumple criterios --> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'Avenida siempre viva', password: 'gh' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("password: La contraseña debe tener como mínimo una letra mayúscula, una minúscula, un numero, un carácter especial  # $ % &, no se permiten espacios en blanco, y debe tener como mínimo 8 caracteres y máximo 15 caracteres.");
    });

    it('Validar registrar usuario, falta dirección--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: `hanspeluffodiaz+${date}@hotmail.com`, address: '', password: 'Hmmsdm55.1#' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("address: Dirección requerida");
    });

    it('Validar registrar usuario, dirección no cumple criterio--> /registrar', async function () {
        const date = Date.now();
        const req = { name: 'Juan Jose Ppolo', email: `hanspeluffodiaz+${date}@hotmail.com`, address: 'gh', password: 'Hmmsdm55.1#' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("address: La dirección debe tener al menos 10 caracteres");
    });

    it('Validar registrar usuario, falta nombre, email, direccion y contraseña--> /registrar', async function () {
        const date = Date.now();
        const req = { name: '', email: ``, address: '', password: '' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);

        expect(res.status).to.equal(500);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("name: Nombre requerido, email: Correo electrónico requerido, password: Contraseña requerida, address: Dirección requerida");
    });


    it('Validar login correcto --> /login', async function () {

        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo2#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(200);
    });

    it('Validar login falta usuario --> /login', async function () {

        const req = { email: '', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("email: Correo requerido");
    });

    it('Validar login falta contraseña --> /login', async function () {

        const req = { email: 'o.lon.za+domi1@hotmail.com', password: '' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("password: Contraseña requerida");
    });

    it('Validar login falta usuario y contraseña --> /login', async function () {

        const req = { email: '', password: '' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("email: Correo requerido");
    });

    it('Validar login invalido --> /login', async function () {

        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Cfddjjd123.#' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Correo o contraseña inválidos");
    });

    /*it('Validar verificar ping', async function () {

        const req = { ping: ''};

        const res = await request(app)
            .post('/api/auth/verify')
            .send(req);

            console.log('resp: ' + JSON.stringify(res));
        
        expect(res.status).to.equal(401);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("No hay token, Autorización denegada");
    });*/


    it('Validar restablecer contraseña valido--> /resetpassword', async function () {

        const req = { email: 'hpeluffo@uninorte.edu.co' };

        const res = await request(app)
            .post('/api/auth/resetpassword')
            .send(req);

        expect(res.status).to.equal(200);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Será enviada una nueva contraseña al correo");
    });

    it('Validar restablecer contraseña no exiete usuario--> /resetpassword', async function () {

        const req = { email: '' };

        const res = await request(app)
            .post('/api/auth/resetpassword')
            .send(req);

        expect(res.status).to.equal(404);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("El correo electrónico no existe");
    });

    it('Validar reenviar codigo exitoso --> /api/resendcode', async function () {

        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo2#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const resRenviar = await request(app)
            .post('/api/auth/resendcode')
            .set('Cookie', cookie)
            .send(req);

        expect(resRenviar.status).to.equal(404);
        const { message } = JSON.parse(resRenviar.text);
        expect(message).to.equal("Usuario verificado");

    });

    it('Validar reenviar codigo fallido sin token--> /resendcode', async function () {

        const req = {};

        const res = await request(app)
            .post('/api/auth/resendcode')
            .send(req);

        expect(res.status).to.equal(401);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("No hay token, Autorización denegada");
    });

    it('Validar cerrar sesion exitoso --> /api/auth/logout', async function () {

        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo2#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const resRenviar = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', cookie)
            .send(req);

        expect(resRenviar.status).to.equal(200);
        const { message } = JSON.parse(resRenviar.text);
        expect(message).to.equal("Sesión cerrada");

    });

    it('Validar cerrar sesion fallido --> /api/auth/logout', async function () {

        const req = {};
        const cookie = '';

        const resRenviar = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', cookie)
            .send(req);

        //expect(resRenviar.status).to.equal(400);

    });

    it('Validar ver perfil exitoso--> /api/auth/profile', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const resRenviar = await request(app)
            .get('/api/auth/profile')
            .set('Cookie', cookie)
            .send(req);

        expect(resRenviar.status).to.equal(200);

    });

    it('Validar ver perfil fallido--> /api/auth/profile', async function () {

        const req = {};

        const resRenviar = await request(app)
            .get('/api/auth/profile')
            .send(req);

        expect(resRenviar.status).to.equal(401);
        const { message } = JSON.parse(resRenviar.text);
        expect(message).to.equal("No hay token, Autorización denegada");

    });

    /*it('Validar cambiar contraseña, contraseña incorrecta --> /changepassword', async function () {

        const req = { email: 'hanspeluffodiaz+1718408500022@hotmail.com', password: 'Camilo145#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(200);
        //const { message } = JSON.parse(res.text);
        //expect(message).to.equal("Correo o contraseña inválidos");

        const reqCamPass= { oldPassword: 'Camilo145#.', password: 'Cambiar495.#'};

        const resCambPass = await request(app)
            .post('/api/auth/changepassword')
            .send(reqCamPass);

            console.log('respppp: ' + JSON.stringify(resCambPass))
        
        expect(resCambPass.status).to.equal(200);
        const { message } = JSON.parse(resCambPass.text);
        expect(message).to.equal("Contraseña actualizada satisfactoriamente");
    });*/

    it('Validar registrar producto exitosamente --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "Nevera", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5, image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        expect(resSaveProducto.status).to.equal(201);
    });

    it('Validar registrar producto sin permiso de admin --> /api/products', async function () {

        const dataProducto = { name: "Nevera", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5, image: "" };

        const resSaveProducto = await request(app)
            .post('/api/products')
            .send(dataProducto);

        expect(resSaveProducto.status).to.equal(401);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("No hay token, Autorización denegada");
    });

    it('Validar registrar producto sin nombre --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5, image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("name: Nombre requerido");
    });

    it('Validar registrar producto con precio negativo --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "Televisor", description: "LCD", price: -1, quantity: 5, image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("price: El precio no puede ser negativo");
    });

    it('Validar registrar producto con precio en letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "Televisor", description: "LCD", price: "mil", quantity: 5, image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resSaveProducto));

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");
    });

    it('Validar registrar producto cantidad den letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "Televisor", description: "LCD", price: 10, quantity: "cinco", image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resSaveProducto));

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("quantity: Cast to Number failed for value \"cinco\" (type string) at path \"quantity\"");
    });

    it('Validar registrar producto sin nombre, precio en letras y cantidad den letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];
        const dataProducto = { name: "Televisor", description: "LCD", price: "mill", quantity: "cinco", image: "" };

        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resSaveProducto));

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        //expect(message).to.equal("price: Cast to Number failed for value \"mil\" (type string) at path \"price\", quantity: Cast to Number failed for value \"cinco\" (type string) at path \"quantity\", name: Nombre requerido");
    });


    it('Validar actualizar produto exitosamente --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "Nevera BBBB", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5 };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66691131778cbb35bfaaefb7')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(200);

    });

    it('Validar actualizar produto no existente --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "Nevera BBBB", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5 };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66664351264bc70811f3298d')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(404);
        const { message } = JSON.parse(resUptProducto.text);
        expect(message).to.equal("Producto no encontrado");

    });

    it('Validar actualizar produto sin nombre --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5 };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66691131778cbb35bfaaefb7')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(500);
        const { message } = JSON.parse(resUptProducto.text);
        expect(message).to.equal("Product validation failed: name: Nombre requerido");

    });

    it('Validar actualizar produto con precio en letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "Nevera ", description: "Nevera eficiente con refrigerador y congelador", price: "mil", quantity: 5 };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66691131778cbb35bfaaefb7')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(500);
        const { message } = JSON.parse(resUptProducto.text);
        //expect(message).to.equal("Product validation failed: price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");

    });

    it('Validar actualizar produto con cantidad en letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "Nevera ", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: "dos" };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66691131778cbb35bfaaefb7')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(500);
        const { message } = JSON.parse(resUptProducto.text);
        //expect(message).to.equal("Product validation failed: price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");

    });

    it('Validar actualizar produto sin nombre, con precio en letras y cantidad en letras --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "", description: "Nevera eficiente con refrigerador y congelador", price: "mill", quantity: "dos" };

        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/66691131778cbb35bfaaefb7')
            .set('Cookie', cookie)
            .send(dataProducto);
        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(500);
        const { message } = JSON.parse(resUptProducto.text);
        //expect(message).to.equal("Product validation failed: price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");

    });

    it('Validar origen de imagen exitoso --> /api/products/origindefaultimage', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = {};
        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/origindefaultimage')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(500);
        const { message } = JSON.parse(resUptProducto.text);
        //expect(message).to.equal("Product validation failed: price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");

    });

    it('Validar origen de imagen fallido --> /api/products/origindefaultimage', async function () {

        const dataProducto = {};
        //console.log(`Cookie >> ${cookie}`);

        const resUptProducto = await request(app)
            .put('/api/products/origindefaultimage')
            .send(dataProducto);

        //console.log(JSON.stringify(resUptProducto));

        expect(resUptProducto.status).to.equal(401);
        const { message } = JSON.parse(resUptProducto.text);
        //expect(message).to.equal("Product validation failed: price: Cast to Number failed for value \"mil\" (type string) at path \"price\"");

    });

    /*it('Eliminar producto  producto exitosamente --> /api/products/:id', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const deleteProduct = await request(app)
            .delete('/api/products/6669110b778cbb35bfaaeccd')
            .set('Cookie', cookie)

        expect(deleteProduct.status).to.equal(200);
        const { message } = JSON.parse(deleteProduct.text);
        //expect(message).to.equal("Producto no encontrado");

    });*/

    it('Eliminar producto  producto no existe--> /api/products/:id', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const deleteProduct = await request(app)
            .delete('/api/products/6669110b778cbb35bfaaeccd')
            .set('Cookie', cookie)

        expect(deleteProduct.status).to.equal(404);
        const { message } = JSON.parse(deleteProduct.text);
        expect(message).to.equal("Producto no encontrado");

    });

    /*it('Validar buscar producto exitosamente --> /api/products/:id', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const deleteProduct = await request(app)
            .get('/api/products/6669103c778cbb35bfaadcc6')
            .set('Cookie', cookie)

        expect(deleteProduct.status).to.equal(200);
        //const { message } = JSON.parse(deleteProduct.text);
        //expect(message).to.equal("Producto no encontrado");

    });*/


    it('Validar registrar pedido exitosamente--> /api/products', async function () {

        //const req = { email: 'admin@email.com', password: 'admin' };
        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo2#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = {
            products: [
                {
                    id: "666910f5778cbb35bfaaeb07",
                    price: 242,
                    quantity: 1
                },
                {
                    id: "66691086778cbb35bfaae283",
                    price: 84,
                    quantity: 1
                }
            ]
        }


        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/orders')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resSaveProducto));

        expect(resSaveProducto.status).to.equal(201);
        const { message } = JSON.parse(resSaveProducto.text);
        //expect(message).to.equal("products[0].price: Precio del producto incorrecto");
    });


    it('Validar registrar pedido fallido--> /api/products', async function () {

        //const req = { email: 'admin@email.com', password: 'admin' };
        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo2#.' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = {
            products: [
                {
                    id: "666910f5778cbb35bfaaeb07",
                    price: 33,
                    quantity: 1
                },
                {
                    id: "66691086778cbb35bfaae283",
                    price: 3,
                    quantity: 1
                }
            ]
        }


        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/orders')
            .set('Cookie', cookie)
            .send(dataProducto);

        //console.log(JSON.stringify(resSaveProducto));

        expect(resSaveProducto.status).to.equal(400);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("products[0].price: Precio del producto incorrecto");
    });


});