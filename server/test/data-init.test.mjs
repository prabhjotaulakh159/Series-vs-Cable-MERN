import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

// https://gist.github.com/lkrych/ad537915c69f09ad597767655d2b9211

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
}); 