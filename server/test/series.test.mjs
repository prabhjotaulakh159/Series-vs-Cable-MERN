import * as chai from 'chai';
import { describe, it } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';

const request  = pkg;

const expect = chai.expect;
const assert = chai.assert;

/*
{
  'id': int,
  'name': string,
  'score': int,
  'numberOfSeasons': int,
  'genres': list,
  'company': string,
  'artwork': string,
  'year': int
}
*/

describe('Test getting series with and without query parameters', () => {
  it('Should return an array with a status of 200', async () => {
    const response = await request(app).get('/api/series');
    
    expect(response.status).to.be.equal(200);

    assert.isArray(response.body);
  });

  it('Should have atleast 1 series with the appropriate keys', async () => {
    const response = await request(app).get('/api/series');
    const body = response.body;
    const series = body[0];

    assert.isNotNull(series);

    expect(series).to.have.property('id');  
    expect(series).to.have.property('name');    
    expect(series).to.have.property('score');    
    expect(series).to.have.property('numberOfSeasons');    
    expect(series).to.have.property('genres');
    expect(series).to.have.property('company');    
    expect(series).to.have.property('artwork');    
    expect(series).to.have.property('year');    

    assert.typeOf(body.id, 'number');
    assert.typeOf(body.name, 'string');
    assert.typeOf(body.score, 'number');
    assert.typeOf(body.numberOfSeasons, 'number');
    assert.typeOf(body.genres, 'array');
    assert.typeOf(body.company, 'string');
    assert.typeOf(body.artWork, 'string');
    assert.typeOf(body.year, 'number');
  });

  it('Should return an error with status 400 because name query parameter is empty ', async () => {
    const response = await request(app).get(`/api/series?name=''`);
    const body = response.body;

    assert.isObject(body);

    expect(response.status).to.be.equal(400);
    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'Name cannot be empty');
  });

  it('Should return an error with status 400 because year query parameter is below 1980', 
    async () => {
      const response = await request(app).get(`/api/series?year=1979`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is above 2024', 
    async () => {
      const response = await request(app).get(`/api/series?year=2025`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?year=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });
  
  it('Should return an error with status 400 because type query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?type=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });

  it('Should return an error with status 400 because type query is not cable/streaming', 
    async () => {
      const response = await request(app).get(`/api/series?type='television'`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });
});