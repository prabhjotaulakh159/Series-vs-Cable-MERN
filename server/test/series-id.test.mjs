import * as chai from 'chai';
import {it, describe} from 'mocha';
import pkg from 'supertest';
import app from '../api.mjs';

const request = pkg;
const assert = chai.assert;

/*
Expect data from db to look like this
{
  name : string,
  genre: string,
  artwork : string,
  companyID: int,
  score: int,
  numberOfSeasons: int,
}
*/

describe('Testing the /api/series{id} endpoint', ()=>{
  it('should respond to /series/1 ', async ()=>{
    const response = await request(app).get('/api/series/73593');

    assert(response.statusCode).to.equal(200);
    assert.isArray(response.body);
  
    const body = response.body;
  
    assert.isNotNull(body);
  
  });

  it('check body of response has valid data types', async ()=>{
    const response = await request(app).get('/api/series/73593');
    const body = response.body;
    const series = body[0];

    assert.typeOf(series['name'], 'string');
    assert.typeOf(series['genre'], 'string');
    assert.typeOf(series['artwork'], 'string');
    assert.typeOf(series['companyID'], 'number');
    assert.typeOf(series['score'], 'number');
    assert.typeOf(series['numberOfSeasons'], 'number');

  });

});

