import { describe, it, beforeEach, afterEach } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as DataInit from '../data-init.mjs';

chai.use(chaiAsPromised);

const expect = chai.expect;

// Code/concepts fetched from here:
// https://gist.github.com/lkrych/ad537915c69f09ad597767655d2b9211
// https://sinonjs.org/releases/latest/stubs/
// https://stackoverflow.com/questions/42401724/sinon-js-how-can-i-get-arguments-from-a-stub

/**
 * Note: The expected response bodies are from this link:
 * https://thetvdb.github.io/v4-api/
 */

describe('Test fetchAllSeries', () => {
  let fetchedStubFunction;

  beforeEach(() => {
    // global is the nodejs global scope
    // it has the fetch function inside it
    fetchedStubFunction = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    fetchedStubFunction.restore();
  });

  // I apologize in advance. - Prabhjot
  it('Should return an array of series', async () => {
    // mock response from not extended endpoint
    const expectedResponseNotExtended = {
      // pretend each response.json() returns the 1 series for each of the 319 pages
      json: async () => {
        return { 
          'data': [
            {
              'id': 70908,
              'name': 'The Fall and Rise of Reginald Perrin',
              'slug': 'the-fall-and-rise-of-reginald-perrin',
              'image': '/banners/posters/70908-1.jpg',
              'nameTranslations': [
                'eng',
                'spa'
              ],
              'overviewTranslations': [
                'eng'
              ],
              'aliases': [],
              'firstAired': '2015-09-08',
              'lastAired': '2015-01-24',
              'nextAired': '',
              'score': 245,
              'status': {
                'id': null,
                'name': null,
                'recordType': '',
                'keepUpdated': false
              },
              'originalCountry': 'can',
              'originalLanguage': 'eng',
              'defaultSeasonType': 1,
              'isOrderRandomized': false,
              'lastUpdated': '2020-04-29 08:20:08',
              'averageRuntime': 30,
              'episodes': null,
              'overview': 'Something overview',
              'year': '1976'
            }
          ]
        };
      } 
    };

    // mock response from extended endpoint
    const extendedResponse = {
      // pretend each response.json() returns the same series each time for extended series call
      // Normally, a response from extended series has a lot more fields, 
      // but this mock response only has what we need for tesing purposes.
      json: async () => {
        return {
          'status': 'success',
          'data': {
            'id': 84946,
            'name': 'Treme',
            'score': 26149,
            'firstAired': '2010-04-11',
            'genres': [
              {
                'id': 12,
                'name': 'Drama',
                'slug': 'drama'
              }
            ],
            'originalNetwork': {
              'id': 328,
              'parentCompany': {
                'id': null
              },
              'tagOptions': [
                {
                  'id': 494,
                  'tag': 24,
                  'tagName': 'Company Type',
                  'name': 'Premium Cable',
                  'helpText': 'Subscription based premium networks. Examples: HBO, Starz, Showtime'
                }
              ]
            },
            'image': 'https://artworks.thetvdb.com/banners/posters/84946-5.jpg',
            'seasons': [
              {
                'id': 40350,
                'type': {
                  'id': 1,
                  'name': 'Aired Order'
                }
              },
              {
                'id': 40351,
                'type': {
                  'id': 1,
                  'name': 'Aired Order'
                }
              },
              {
                'id': 463743,
                'type': {
                  'id': 1,
                  'name': 'Aired Order'
                }
              },
              {
                'id': 484551,
                'type': {
                  'id': 1,
                  'name': 'Aired Order'
                }
              },
              {
                'id': 504385,
                'type': {
                  'id': 1,
                  'name': 'Aired Order'
                }
              }
            ]
          }
        };        
      }
    };

    // the first 319 calls to fetch should return the first response.
    // i got this number because inside the method, theres 319 pages
    // that we are fetching. For simplicity, i am assuming 
    // that each page only returns the 1 series i mentionned above.
    for (let i = 0; i < 319; i++) {
      fetchedStubFunction.onCall(i).resolves(expectedResponseNotExtended);
    }

    // for now, we are pretending there are only 319 series, aka 1 per page
    // for each 319 series, we make another request. 
    // hence, the next 319 calls should resolve to the extended series
    for (let j = 319; j < 319 * 2; j++) {
      fetchedStubFunction.onCall(j).resolves(extendedResponse);
    }

    const series = await DataInit.fetchAllSeries('some-token');

    // we expect it to be an array
    expect(series).to.be.an('array');
    expect(series.length).to.be.equal(319);

    // we expect 319 calls (each page) + 319 calls (the single extended series per page) 
    expect(fetchedStubFunction.callCount).to.be.equal(319 * 2);

    // check if we got the valid keys
    expect(series[0]).to.have.property('id');
    expect(series[0]).to.have.property('name');
    expect(series[0]).to.have.property('score');
    expect(series[0]).to.have.property('numberOfSeasons');
    expect(series[0]).to.have.property('genres');
    expect(series[0]).to.have.property('companyId');
    expect(series[0]).to.have.property('companyType');
    expect(series[0]).to.have.property('year');

    // although it doesnt check all the series, we can check if the fetch request,
    // gets the expected fields, and uses them approprietly, and spits 
    // out the result like the one above.
  });
});

describe('Test fetching all companies', () => {
  let fetchedStubFunction;

  beforeEach(() => {
    // global is the nodejs global scope
    // it has the fetch function inside it
    fetchedStubFunction = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    fetchedStubFunction.restore();
  });

  it('Should return an array of companies', async () => {
    // pass into the function cause we are using their companyId
    // imagine we only have 3 series and 3 companies
    const series = [
      {
        'id': 0,
        'name': 'bob',
        'score': 3,
        'numberOfSeasons': 3,
        'genres': ['john'],
        'companyId': 1,
        'companyType': 'cable',
        'artwork': 'http://something',
        'year': 2010
      },
      {
        'id': 0,
        'name': 'bob',
        'score': 3,
        'numberOfSeasons': 3,
        'genres': ['john'],
        'companyId': 2,
        'companyType': 'cable',
        'artwork': 'http://something',
        'year': 2010
      },
      {
        'id': 0,
        'name': 'bob',
        'score': 3,
        'numberOfSeasons': 3,
        'genres': ['john'],
        'companyId': 3,
        'companyType': 'cable',
        'artwork': 'http://something',
        'year': 2010
      }
    ];

    // we should expect 3 fetch request for 3 series
    // the first 3 API calls should resolve to 3 different companies
    // since there are 3 different company ID's in the series array

    // first call resolves to company with id 1
    fetchedStubFunction.onCall(0).resolves({
      json: async () => {
        return {
          'status': 'success',
          'data': {
            'id': 1,
            'name': 'AAG TV',
            'slug': 'aag-tv',
            'nameTranslations': [
              'eng'
            ],
            'overviewTranslations': [],
            'aliases': [],
            'country': 'pak',
            'primaryCompanyType': 1,
            'activeDate': null,
            'inactiveDate': null,
            'companyType': {
              'companyTypeId': 1,
              'companyTypeName': 'Network'
            },
            'parentCompany': {
              'id': null,
              'name': null,
              'relation': {
                'id': null,
                'typeName': null
              }
            },
            'tagOptions': null
          }
        };
      }
    });

    // second call resolves to company with id 2
    fetchedStubFunction.onCall(1).resolves({
      json: async () => {
        return {
          'status': 'success',
          'data': {
            'id': 2,
            'name': 'AAG TV',
            'slug': 'aag-tv',
            'nameTranslations': [
              'eng'
            ],
            'overviewTranslations': [],
            'aliases': [],
            'country': 'pak',
            'primaryCompanyType': 1,
            'activeDate': null,
            'inactiveDate': null,
            'companyType': {
              'companyTypeId': 1,
              'companyTypeName': 'Network'
            },
            'parentCompany': {
              'id': null,
              'name': null,
              'relation': {
                'id': null,
                'typeName': null
              }
            },
            'tagOptions': null
          }
        };
      }
    });

    // third call resolved to company with id 3
    fetchedStubFunction.onCall(2).resolves({
      json: async () => {
        return {
          'status': 'success',
          'data': {
            'id': 3,
            'name': 'AAG TV',
            'slug': 'aag-tv',
            'nameTranslations': [
              'eng'
            ],
            'overviewTranslations': [],
            'aliases': [],
            'country': 'pak',
            'primaryCompanyType': 1,
            'activeDate': null,
            'inactiveDate': null,
            'companyType': {
              'companyTypeId': 1,
              'companyTypeName': 'Network'
            },
            'parentCompany': {
              'id': null,
              'name': null,
              'relation': {
                'id': null,
                'typeName': null
              }
            },
            'tagOptions': null
          }
        };
      }
    });

    // fetching comapnies
    const companies = await DataInit.fetchAllCompanies(series, 'some-token');
    
    // we expect 3 API calls
    expect(fetchedStubFunction.callCount).to.be.equal(3);

    // we expect the API call URL to be made with 3 distinct ID's
    expect(fetchedStubFunction.getCall(0).args[0]).
      to.be.equal('https://api4.thetvdb.com/v4/companies/1');
    expect(fetchedStubFunction.getCall(1).args[0]).
      to.be.equal('https://api4.thetvdb.com/v4/companies/2');
    expect(fetchedStubFunction.getCall(2).args[0]).
      to.be.equal('https://api4.thetvdb.com/v4/companies/3');

    // we expect an array of companies
    expect(companies).to.be.an('array');
    expect(companies.length).to.be.equal(3);

    // check if companies is filtered properly
    const firstCompany = companies[0];    
    expect(firstCompany).to.have.property('id');
    expect(firstCompany).to.have.property('name');
    expect(firstCompany).to.have.property('averageScore');
    expect(firstCompany).to.have.property('type');
  });
});