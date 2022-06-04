import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';

import { app } from '../app';
import User from '../database/models/UserModel';

import { Response } from 'superagent';
import TokenGenerate from '../helpers/TokenGenerate';

import { invalid } from 'joi';

chai.use(chaiHttp);

const { expect } = chai;

describe('testar a integridade da rota /login', () => {
  describe('Em caso de sucesso', () => { 

    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .resolves({
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
        } as User);
    });

    after(() => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Com email e password corretos', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin'
        });

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.have.property('user');
      expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  describe('Em casos de erros', () => {
    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(User, 'findOne')
        .resolves();
    });

    after(() => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Em caso da requisição vir com email inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          password: 'secret_admin',
          email: 'adm@admin.com'
        });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('Em caso da requisição vir com Password inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          password: 'sect_admin',
          email: 'admin@admin.com'
        });
      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('Em caso da requisição vir sem o campo email', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          password: 'secret_admin'
        });
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('Em caso da requisição vir sem o campo password', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com'
         });
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Em caso de haver erro no tipo de dado na requisição', () => {

    let chaiHttpResponse: Response;

    before(async () => {
      const error = new Error();
      sinon
        .stub(User, 'findOne')
        .throws(error);
    });
  
    after(() => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin'
        });
      expect(chaiHttpResponse.status).to.be.equal(500);
      expect(chaiHttpResponse.body.message).to.be.equal('Wow! Something is wrong');
    });
  });
});


describe('testar a rota /loginValidate da rota login', () => {
    describe('Em casos de sucesso', () => {

      let chaiHttpResponse: Response;

      before(async () => {
        sinon
          .stub(User, 'findByPk')
          .resolves({
              id: 1,
              username: 'Admin',
              role: 'admin',
              email: 'admin@admin',
              password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
          } as User);
        sinon.stub(jwt, 'verify').resolves({ id: 1 })
      });
    
      after(() => {
        (User.findByPk as sinon.SinonStub).restore();
        (jwt.verify as sinon.SinonStub).restore();
      });

      it('Requisição com o token correto', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .get('/login/validate')
          .set('authorization', 'token')
          .send();
        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.equal('admin');
      });
    });

    describe('Em casos de erro', () => {

      let chaiHttpResponse: Response;

      before(async () => {
        sinon
          .stub(User, 'findByPk')
          .resolves({
            id: 1,
            username: 'Admin',
            role: 'admin',
            email: 'admin@admin',
            password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
        } as User);
      });
    
      after(() => {
        (User.findByPk as sinon.SinonStub).restore();
      });

      it('Em caso da requisição vir sem o token', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .get('/login/validate')
          .set('authorization', '')
          .send();
        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
      });

      it('Em caso da requisição vir com o token inválido', async () => {

        chaiHttpResponse = await chai
          .request(app)
          .get('/login/validate')
          .set('authorization', 'token')
          .send();
        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Invalid token');
      });
    });
});


