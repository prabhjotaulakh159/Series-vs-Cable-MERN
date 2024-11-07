import * as chai from 'chai';
import { describe, it, after, before } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';
import { db } from '../db/db.mjs';
import * as sinon from 'sinon';

const stubGetCompanyById = sinon.stub(db, 'getCompanyById');
const stubGetFilteredCompanies = sinon.stub(db, 'getFilteredCompanies');

// https://dawsoncollege.gitlab.io/520JS/520-Web/exercises/09_2_mongo_express.html

const request  = pkg;

const expect = chai.expect;

describe('GET /api/companies', () => {
  before(() => {
    stubGetFilteredCompanies.resolves([{
      'id': 49209,
      'name': 'History Hit',
      'averageScore': 30,
      'type': 'streaming'
    },
    {
      'id': 48047,
      'name': 'HGTV (UK)',
      'averageScore': 45,
      'type': 'cable'
    },
    {
      'id': 49,
      'name': 'Canal+',
      'averageScore': 4,
      'type': 'cable'
    },
    {
      'id': 48230,
      'name': 'Binge',
      'averageScore': 25,
      'type': 'streaming'
    }]);

    stubGetFilteredCompanies.withArgs('cable').resolves([{
      'id': 48047,
      'name': 'HGTV (UK)',
      'averageScore': 45,
      'type': 'cable'
    },
    {
      'id': 49,
      'name': 'Canal+',
      'averageScore': 4,
      'type': 'cable'
    }]);

    stubGetFilteredCompanies.withArgs('streaming').resolves([{
      'id': 49209,
      'name': 'History Hit',
      'averageScore': 30,
      'type': 'streaming'
    },
    {
      'id': 48230,
      'name': 'Binge',
      'averageScore': 25,
      'type': 'streaming'
    }]);
  });

  it('should return 400 for incorrect type', async () => {
    const response = await request(app).get('/api/companies?type=something');
    expect(response.body).to.deep.equal(
      {message: 'Not a valid type'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 400 for empty type', async () => {
    const response = await request(app).get('/api/companies?type=');
    expect(response.body).to.deep.equal(
      {message: 'Not a valid type'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 200 for no type included', async () => {
    const response = await request(app).get('/api/companies');
    expect(response.status).to.equal(200);
  });

  it('should return 200 for all companies', async () => {
    const response = await request(app).get('/api/companies');
    expect(response.body[0]).to.deep.equal(
      {
        'id': 49209,
        'name': 'History Hit',
        'averageScore': 30,
        'type': 'streaming'
      },
    );

    expect(response.body.length).to.equal(4);
    expect(response.status).to.equal(200);
  });

  it('should return 200 for companies with type "cable"', async () => {
    const response = await request(app).get('/api/companies?type=cable');
    expect(response.body).to.deep.equal(
      [{
        'id': 48047,
        'name': 'HGTV (UK)',
        'averageScore': 45,
        'type': 'cable'
      },
      {
        'id': 49,
        'name': 'Canal+',
        'averageScore': 4,
        'type': 'cable'
      }]
    );

    expect(response.body.length).to.equal(2);
    expect(response.status).to.equal(200);
  });

  it('should return 200 for companies with type "streaming"', async () => {
    const response = await request(app).get('/api/companies?type=streaming');
    expect(response.body).to.deep.equal(
      [{
        'id': 49209,
        'name': 'History Hit',
        'averageScore': 30,
        'type': 'streaming'
      },
      {
        'id': 48230,
        'name': 'Binge',
        'averageScore': 25,
        'type': 'streaming'
      }]
    );

    expect(response.body.length).to.equal(2);
    expect(response.status).to.equal(200);
  });

});

describe('GET /api/companies/:id', () => {
  before(() => {
    stubGetCompanyById.resolves({
      id: 1,
      name: 'Test Name',
      averageScore: 89,
      type: 'cable'
    });
  });
  
  it('should return 400 for incorrect id type', async () => {
    const response = await request(app).get('/api/companies/notanid');
    expect(response.body).to.deep.equal(
      {message: 'Id must be an integer'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 200 for valid id type', async () => {
    const response = await request(app).get('/api/companies/1');
    expect(response.status).to.equal(200);
    chai.assert.isObject(response.body);
  });

  it('should have the proper keys for the company object', async () => {
    const response = await request(app).get('/api/companies/1');
    const body = response.body;
    
    expect(response.status).to.equal(200);

    expect(body).to.not.be.null;
    expect(body).to.be.an('object');

    expect(body).to.have.property('id');
    expect(body).to.have.property('name');
    expect(body).to.have.property('averageScore');
    expect(body).to.have.property('type');

    expect(body.id).to.be.a('number');
    expect(body.name).to.be.a('string');
    expect(body.averageScore).to.be.a('number');
    expect(body.type).to.be.a('string');

    expect(body.id).to.be.equal(1);    
    expect(body.name).to.be.equal('Test Name');
    expect(body.averageScore).to.be.equal(89);
    expect(body.type).to.be.equal('cable');
  });

  it('Should return 404 if a company is not found', async () => {
    stubGetCompanyById.resolves(null);
    const response = await request(app).get('/api/companies/4');
    const body = response.body;

    expect(response.status).to.be.equal(404);
    expect(body).to.not.be.null;
    expect(body).to.be.an('object');
    expect(body).to.have.property('message');
    expect(body.message).to.deep.equal('Company ID not found');
  });

  after(() => stubGetCompanyById.restore());
});