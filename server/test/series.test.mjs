import * as chai from 'chai';
import { describe, it } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';

const request  = pkg;

const expect = chai.expect;
const assert = chai.assert;

/*
{
  id : int,
  name : string,
  genre: string,
  artwork : string,
  companyID: int,
  score: int,
  numberOfSeasons: int,
}
*/

describe('Test getting series with and without query parameters', () => {
  it('Should return an array with a status of 200', async () => {
    const response = await request(app).get('/api/series/');
    
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
    expect(series).to.have.property('genre');    
    expect(series).to.have.property('artwork');    
    expect(series).to.have.property('companyID');    
    expect(series).to.have.property('score');    
    expect(series).to.have.property('numberOfSeasons');    

    assert.typeOf(series.id, 'number');
    assert.typeOf(series.name, 'string');
    assert.typeOf(series.genre, 'string');
    assert.typeOf(series.artwork, 'string');
    assert.typeOf(series.companyID, 'number');
    assert.typeOf(series.score, 'number');
    assert.typeOf(series.numberOfSeasons, 'number');
  });

  it('Should return an error with status 400 because name query parameter is empty ', async () => {
    const response = await request(app).get(`/api/series?name=''`);
    const body = response.body;

    assert.isObject(body);

    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'Name cannot be empty');
  });

  it('Should return an error with status 400 because year query parameter is below 1980', 
    async () => {
      const response = await request(app).get(`/api/series?year=1979`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is above 2024', 
    async () => {
      const response = await request(app).get(`/api/series?year=2025`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?year=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');

      assert.strictEqual(body.message, 'Year must be between 1980 and 2024');
    });
  
  it('Should return an error with status 400 because type query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?type=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });

  it('Should return an error with status 400 because type query is not cable/streaming', 
    async () => {
      const response = await request(app).get(`/api/series?type='television'`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });
});