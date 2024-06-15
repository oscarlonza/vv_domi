import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';


import { addFileToRepository } from '../src/libs/fileManager.js';

/**
 * Pruebas automatizadas de api/auth/
 */
describe('Pruebas de > Post api/auth/', () => {

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


    it('Validar restablecer contraseña --> /resetpassword', async function () {

        const req = { email: 'hpeluffo@uninorte.edu.co' };

        const res = await request(app)
            .post('/api/auth/resetpassword')
            .send(req);

        expect(res.status).to.equal(200);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Será enviada una nueva contraseña al correo");
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
        const dataProducto = { name: "Nevera", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5, image: ""};
        
        //console.log(`Cookie >> ${cookie}`);

        const resSaveProducto = await request(app)
            .post('/api/products')
            .set('Cookie', cookie)
            .send(dataProducto);
        
        expect(resSaveProducto.status).to.equal(201);
    });

    it('Validar registrar producto sin permiso de admin --> /api/products', async function () {

        const dataProducto = { name: "Nevera", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5, image: ""};

        const resSaveProducto = await request(app)
            .post('/api/products')
            .send(dataProducto);
        
        expect(resSaveProducto.status).to.equal(401);
        const { message } = JSON.parse(resSaveProducto.text);
        expect(message).to.equal("No hay token, Autorización denegada");
    });

    it('Validar actualizar produto exitosamente --> /api/products', async function () {

        const req = { email: 'admin@email.com', password: 'admin' };

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //console.log(`Response ${JSON.stringify(res)}`);
        expect(res.status).to.equal(200);

        const cookie = res.headers["set-cookie"];

        const dataProducto = { name: "Nevera BBBB", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5};
        
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

        const dataProducto = { name: "Nevera BBBB", description: "Nevera eficiente con refrigerador y congelador", price: 10000, quantity: 5};
        
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
    
});