import request from 'supertest';
import { expect as _expect } from 'chai';
import app from '../src/app.js';

const expect = _expect;


describe('Pruebas de login > Post api/auth/login', () => {

    it('Validar login', async function () {

        //const login = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo1#.'};
        const req = { body: { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo1#.' } };
        console.log('req:' + req);

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);

        //expect(res.status).to.equal(400);
        //const { message } = JSON.parse(res.text);
        //expect(message).to.equal("debe escribir usuario y contraseña");
    });
});