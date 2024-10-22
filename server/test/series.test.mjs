import * as chai from 'chai';
import { describe, it } from 'mocha';
import { request } from 'supertest';
import app from '../api.mjs';

const expect = chai.expect;
const assert = chai.assert;

```
{
  id : int,
  name : string,
  genre: string,
  artwork : string,
  companyID: int,
  score: int,
  numberOfSeasons: int,
  numAwards: int,
}
```;

describe('Test getting series with and without query parameters', () => {
  it('Should return an array with a status of 200', async () => {
    const response = await request(app).get('/api/series/');
    
    expect(response.status).to.be(200);
    
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
    expect(series).to.have.property('numAwards');    

    assert.typeOf(series.id, 'number');
    assert.typeOf(series.name, 'string');
    assert.typeOf(series.genre, 'string');
    assert.typeOf(series.artwork, 'string');
    assert.typeOf(series.companyID, 'number');
    assert.typeOf(series.score, 'number');
    assert.typeOf(series.numberOfSeasons, 'number');
    assert.typeOf(series.numAwards, 'number');
  });
});