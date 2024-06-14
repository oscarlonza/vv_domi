import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Pruebas de login > Post api/auth/login', () => {

    it('Validar login', async function () {

        //const login = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo1#.'};
        const req = { email: 'o.lon.za+domi1@hotmail.com', password: 'Camilo1#.' };
        console.log('req:' + JSON.stringify(req));

        const res = await request(app)
            .post('/api/auth/login')
            .send(req);
        
        expect(res.status).to.equal(200);
        //const { message } = JSON.parse(res.text);
        //expect(message).to.equal("debe escribir usuario y contraseña");
    });
});