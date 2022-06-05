import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';

import { app } from '../app';
import User from '../database/models/UserModel';
import Team from '../database/models/TeamModel';
import Matche from '../database/models/MatcheModel';

import { Response } from 'superagent';
import TokenGenerate from '../helpers/TokenGenerate';


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
      const serverError = new Error();
      sinon
        .stub(User, 'findOne')
        .throws(serverError);
    });
  
    after(() => {
      (User.findOne as sinon.SinonStub).restore();
    });

    it('Com retorno de erro', async () => {
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

describe('testar a integridade da rota /teams', () => {
  describe('Em caso de sucesso', () => {
    const teamsArray = [
      {
        id: 1,
        teamName: "Avaí/Kindermann"
      },
      {
        id: 2,
        teamName: "Bahia"
      },
      {
        id: 3,
        teamName: "Botafogo"
      },
    ];

    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(Team, 'findAll')
        .resolves(teamsArray as Team[]);
    });

    after(() => {
      (Team.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se status code 200 e propriedades dos objetos do array', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams')

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body[0]).to.have.property('id');
      expect(chaiHttpResponse.body[0]).to.have.property('teamName');
    });
  });
  describe('Testar a integridade da rota /teams/id', () => {
        
    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(Team, 'findByPk')
        .resolves({
          id: 1,
          teamName: "Avaí/Kindermann" 
        } as Team);
    });

    after(() => {
      (Team.findByPk as sinon.SinonStub).restore();
    });

    it('Verifica se status code 200 e propriedades dos objetos do array', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams/:id')
        .set('params', 'id: 1')

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.have.property('id');
      expect(chaiHttpResponse.body).to.have.property('teamName');
    });
  })

  describe('Testar integridade da rota /matches com o método Get', () => {
    const matchesArray = [
      {
        id: 1,
        homeTeam: 16,
        homeTeamGoals: 1,
        awayTeam: 8,
        awayTeamGoals: 1,
        inProgress: false,
        teamHome: {
          teamName: "São Paulo"
        },
        teamAway: {
          teamName: "Grêmio"
        }
      },
      {
        id: 41,
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 9,
        awayTeamGoals: 0,
        inProgress: true,
        teamHome: {
          teamName: "São Paulo"
        },
        teamAway: {
          teamName: "Internacional"
        }
      },
    ];

    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(Matche, 'findAll')
        .resolves(matchesArray as unknown as Matche[]);
    });

    after(() => {
      (Matche.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se status code 200 e propriedades dos objetos do array', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches')

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body[0]).to.have.property('id');
      expect(chaiHttpResponse.body[0]).to.have.property('homeTeam');
      expect(chaiHttpResponse.body[0]).to.have.property('homeTeamGoals');
      expect(chaiHttpResponse.body[0]).to.have.property('awayTeam');
      expect(chaiHttpResponse.body[0]).to.have.property('awayTeamGoals');
      expect(chaiHttpResponse.body[0]).to.have.property('inProgress');
      expect(chaiHttpResponse.body[0]).to.have.property('teamHome');
      expect(chaiHttpResponse.body[0]).to.have.property('teamAway');

    });

    it('Verifica se com parametro de pesquisa por partidas em andamento retorna estatus 200', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=true')

      expect(chaiHttpResponse.status).to.be.equal(200);
    })

    it('Verifica se com parametro de pesquisa por partidas finalizadas retorna estatus 200', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=false')

      expect(chaiHttpResponse.status).to.be.equal(200);
    })
  });
  describe('Testar integridade da rota /matches com o método Post', () => {

    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(Matche, 'create')
        .resolves({
            id: 1,
            homeTeam: 16,
            homeTeamGoals: 2,
            awayTeam: 8,
            awayTeamGoals: 2,
            inProgress: true,
          } as unknown as Matche);
      sinon.stub(jwt, 'verify').resolves({ id: 1 })
    });

    after(() => {
      (Matche.create as sinon.SinonStub).restore();
      (jwt.verify as sinon.SinonStub).restore();
    });
    it('Requisição retorna com status code 201', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/matches')
        .set('authorization', 'token')
        .send({
          homeTeam: 16,
          awayTeam: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
          inProgress: true
    });
      expect(chaiHttpResponse.status).to.be.equal(201);
    });
  });
  describe('Testar integridade da rota /matches/:id/finish com o método Patch', () => {

    let chaiHttpResponse: Response;

    before(async () => {
      sinon
        .stub(Matche, 'update')
        .resolves({ message: "Finished" } as any);
    });

    after(() => {
      (Matche.update as sinon.SinonStub).restore();
    });

    it('Requisição retorna com status code 200', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .patch('/matches/48/finish')
        .set('params', 'id: 48')

      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  });
});


