import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';
import { db } from '../db/db.mjs';
import * as sinon from 'sinon';

// https://dawsoncollege.gitlab.io/520JS/520-Web/exercises/09_2_mongo_express.html


// stub the db function associated with my route
const stubGetgetFilteredSeries = sinon.stub(db, 'getFilteredSeries');

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
  'companyId': int,
  'companyType': string
  'artwork': string,
  'year': int
}
*/

describe('Test getting series with and without query parameters', () => {
  before(() => {
    // these are real examples from the database i copied over
    stubGetgetFilteredSeries.resolves([
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2014
      },
      {
        'id': 70328,
        'name': 'The Young and the Restless',
        'score': 34583,
        'numberOfSeasons': 36,
        'genres': ['Soap', 'Drama', 'Romance'],
        'companyId': 56,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/v4/series/70328/posters/62996ec6e5ab4.jpg',
        'year': 2024
      }
      
    ]);
  });

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
    expect(series).to.have.property('companyId');
    expect(series).to.have.property('companyType');    
    expect(series).to.have.property('artwork');    
    expect(series).to.have.property('year');    

    assert.typeOf(series.id, 'number');
    assert.typeOf(series.name, 'string');
    assert.typeOf(series.score, 'number');
    assert.typeOf(series.numberOfSeasons, 'number');
    assert.typeOf(series.genres, 'array');
    assert.typeOf(series.companyId, 'number');
    assert.typeOf(series.companyType, 'string');
    assert.typeOf(series.artwork, 'string');
    assert.typeOf(series.year, 'number');
  });

  it('Should return an error with status 400 because name query parameter is empty ', async () => {
    const response = await request(app).get(`/api/series?name=`);
    const body = response.body;

    assert.isObject(body);

    expect(response.status).to.be.equal(400);
    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'Name cannot be empty');
  });

  it('Should return an error with status 400 because genre query parameter is empty ', async () => {
    const response = await request(app).get(`/api/series?genre=`);
    const body = response.body;

    assert.isObject(body);

    expect(response.status).to.be.equal(400);
    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'Genre cannot be empty');
  });

  it('Should return an error with status 400 because year query parameter is below 2010', 
    async () => {
      const response = await request(app).get(`/api/series?year=2009`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is above 2024', 
    async () => {
      const response = await request(app).get(`/api/series?year=2025`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?year=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
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

  it('Should return an array of series in the year 2010', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 70327,
          'name': 'Buffy the Vampire Slayer',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2010
        },
        {
          'id': 70327,
          'name': 'Buffy the Vampire Slayer',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2010
        },
      ]);
      const response = await request(app).get('/api/series?year=2010');
      const body = response.body;
      expect(response.status).to.be.equal(200);
      expect(body).to.be.an('array');
      expect(body.length).to.be.equal(2);
      expect(body[0]['year']).to.be.equal(2010);
      expect(body[1]['year']).to.be.equal(2010);
    });

  it('Should return an array of series of only type cable', async () => {
    stubGetgetFilteredSeries.resolves([
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2014
      },
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2024
      },
    ]);
    const response = await request(app).get('/api/series?type=cable');
    const body = response.body;
    expect(response.status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body.length).to.be.equal(2);
    expect(body[0]['companyType']).to.be.equal('cable');
    expect(body[1]['companyType']).to.be.equal('cable');
  });

  it('Should return an array of series of only type streaming', async () => {
    stubGetgetFilteredSeries.resolves([
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'streaming',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2014
      },
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'streaming',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2024
      },
    ]);
    const response = await request(app).get('/api/series?type=streaming');
    const body = response.body;
    expect(response.status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body.length).to.be.equal(2);
    expect(body[0]['companyType']).to.be.equal('streaming');
    expect(body[1]['companyType']).to.be.equal('streaming');
  });

  it('Should return an array of series whose name have the word \'office\' inside it', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 70327,
          'name': 'The Office',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2014
        },
        {
          'id': 452362,
          'name': 'Inside the office of mr.office',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2024
        },
        {
          'id': 38563,
          'name': 'Officer, arrest him !',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'streaming',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2024
        },
      ]);
      const response = await request(app).get('/api/series?name=office');
      const body = response.body;
      expect(response.status).to.be.equal(200);
      expect(body).to.be.an('array');
      expect(body.length).to.be.equal(3);
      expect(body[0]['name']).to.be.equal('The Office');
      expect(body[1]['name']).to.be.equal('Inside the office of mr.office');
      expect(body[2]['name']).to.be.equal('Officer, arrest him !');
    });

  it('Should return an array of series with the word \'office\' inside from streaming companies', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 38563,
          'name': 'Officer, arrest him !',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'streaming',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2024
        },
      ]);
      const response = await request(app).get('/api/series?name=office&type=streaming');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(1);
      expect(response.body[0]['name']).to.be.equal('Officer, arrest him !');
      expect(response.body[0]['companyType']).to.be.equal('streaming');
    });
  
  it('Should return an array of series with the word \'office\' inside from cable companies', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 70327,
          'name': 'The Office',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2014
        },
        {
          'id': 452362,
          'name': 'Inside the office of mr.office',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2024
        },
      ]);
      const response = await request(app).get('/api/series?name=office?type=streaming');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(2);
      expect(response.body[0]['name']).to.be.equal('The Office');
      expect(response.body[0]['companyType']).to.be.equal('cable');
      expect(response.body[1]['name']).to.be.equal('Inside the office of mr.office');
      expect(response.body[1]['companyType']).to.be.equal('cable');
    });
    
  it('Should return an array of series with the word office, only cable and in the year 2024', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 452362,
          'name': 'Inside the office of mr.office',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'cable',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2024
        },
      ]);
      const response = await request(app).get('/api/series?name=office?type=streaming');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(1);
      expect(response.body[0]['name']).to.be.equal('Inside the office of mr.office');
      expect(response.body[0]['companyType']).to.be.equal('cable');
      expect(response.body[0]['year']).to.be.equal(2024);
    });
  
  it('Should return an array of series in the year 2011 who are from streaming companies', 
    async () => {
      stubGetgetFilteredSeries.resolves([
        {
          'id': 452362,
          'name': 'John Joh McGee',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'streaming',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2011
        },
        {
          'id': 38563,
          'name': 'I hate apples',
          'score': 491166,
          'numberOfSeasons': 8,
          'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
          'companyId': 2178,
          'companyType': 'streaming',
          'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
          'year': 2011
        },
      ]);
      const response = await request(app).get('/api/series?year=2011&type=streaming');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(2);
      expect(response.body[0]['year']).to.be.equal(2011);
      expect(response.body[0]['companyType']).to.be.equal('streaming');
      expect(response.body[1]['year']).to.be.equal(2011);
      expect(response.body[1]['companyType']).to.be.equal('streaming');
    });

  it('Should return an empty array of series because search is too specific', async () => {
    stubGetgetFilteredSeries.resolves([]);
    const response = await request(app).get(
      '/api/series?name=way_to_specific&year=2024&type=streaming');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.equal(0);
  });
  after(() => {
    stubGetgetFilteredSeries.restore();
  });

  
  it('Should return an array of series of genre Horror', async () => {
    stubGetgetFilteredSeries.resolves([
      {
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'streaming',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2014
      }
    ]);
    const response = await request(app).get('/api/series?genre=Horror');
    const body = response.body;
    expect(response.status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body.length).to.be.equal(1);
    expect(body[0]['genres']).to.deep.equal(
      ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance']
    );
  });

});