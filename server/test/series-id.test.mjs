import * as chai from 'chai';
import {it, describe} from 'mocha';
import pkg from 'supertest';
import app from '../api.mjs';

const request = pkg;
const expect = chai.expect;
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
  numAwards: int,
}
*/

describe('Testing the /api/series{id} endpoint', ()=>{
  it('should respond to /series/1 ', async ()=>{
    const response = await request(app).get('/api/series/1');

    assert(response.statusCode).to.equal(200);
    assert.isArray(response.body);
  
    const body = response.body;
  
    assert.isNotNull(body);
  
  });

});

