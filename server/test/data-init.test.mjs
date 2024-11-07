import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as DataInit from '../data-init.mjs';

// Code/concepts fetched from here:
// https://gist.github.com/lkrych/ad537915c69f09ad597767655d2b9211
// https://sinonjs.org/releases/latest/stubs/
// https://stackoverflow.com/questions/42401724/sinon-js-how-can-i-get-arguments-from-a-stub

/**
 * Note: The expected response bodies are from this link:
 * https://thetvdb.github.io/v4-api/
 */

describe('Tests for fetching the token', () => {
  let fetchedStubFunction;

  beforeEach(() => {
    // global is the nodejs global scope
    // it has the fetch function inside it
    fetchedStubFunction = sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    fetchedStubFunction.restore();
  });

  it('Should return a token and status of 200', async () => {
    const expectedResponse = {
      // mock response.ok
      ok: true,
      // mock response.json() method
      json: async () => {
        return {
          data: {
            token: 'my-token'
          },
          status: '200'
        };
      }
    };

    fetchedStubFunction.resolves(expectedResponse);
    const token = await DataInit.fetchToken();
    

    expect(fetchedStubFunction.calledOnce).to.be.true;
    expect(fetchedStubFunction.getCall(0).args[0]).to.be.equal('https://api4.thetvdb.com/v4/login');
    expect(token).to.be.equal('my-token');
  });
}); 