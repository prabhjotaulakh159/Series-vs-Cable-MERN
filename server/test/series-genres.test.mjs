import * as chai from 'chai';
import { describe, it, before } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';
import { db } from '../db/db.mjs';
import * as sinon from 'sinon';

const stubGetgetFilteredGenres = sinon.stub(db, 'getAllGenres');

const request  = pkg;

const expect = chai.expect;
const assert = chai.assert;

describe('Test getting series with and without query parameters', () => {
  before(() => {
    // these are real examples from the database i copied over
    stubGetgetFilteredGenres.resolves({
      'uniqueGenres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance']
    });
  });

  it('Should return an array with a status of 200', async () => {
    const response = await request(app).get('/api/series/genres');
    
    expect(response.status).to.be.equal(200);

    assert.isObject(response.body);
  });

  it('Should have an array of genres with the appropriate key', async () => {
    const response = await request(app).get('/api/series/genres');
    const body = response.body;
    const genres = body;

    assert.isNotNull(genres);

    expect(genres.uniqueGenres).to.deep.equal(
      ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance']
    );  
  });
});