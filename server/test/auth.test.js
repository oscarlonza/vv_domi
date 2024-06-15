import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';


import { addFileToRepository } from '../src/libs/fileManager.js';

/**
 * Pruebas automatizadas de api/auth/
 */
describe('Pruebas de > Post api/auth/', () => {

    /*it('Validar registrar usuario --> /login', async function () {

        const req = { name:'Yunelis Gutierrez', email: 'ygutierrez@barranquilla.gov.co', address: 'Avenida siempre viva', password: 'Camilo1#.' };

        const res = await request(app)
            .post('/api/auth/register')
            .send(req);
        
        expect(res.status).to.equal(200);
        //const { message } = JSON.parse(res.text);
        expect(message).to.equal(req.name);
        expect(message).to.equal(req.email);
        expect(message).to.equal(req.address);
    });*/

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

        const req = { email: 'hpeluffo@uninorte.edu.co'};

        const res = await request(app)
            .post('/api/auth/resetpassword')
            .send(req);
        
        expect(res.status).to.equal(200);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Será enviada una nueva contraseña al correo");
    });

    /*it('Validar cambiar contraseña, contraseña incorrecta --> /changepassword', async function () {

        const req = { oldPassword: 'Mipass987.#', password: 'Cambiar45.#'};

        const res = await request(app)
            .post('/api/auth/changepassword')
            .send(req);
        
        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Contraseña incorrecta");
    });*/

    

});