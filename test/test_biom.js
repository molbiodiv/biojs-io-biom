/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2015 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

// chai is an assertion library
let chai = require('chai');

// @see http://chaijs.com/api/assert/
let assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// requires your main app (specified in index.js)
import {Biom} from '../src/biojs-io-biom';

describe('biojs-io-biom module', () => {
  describe('Biom constructor should create an object', () => {
    it('should create an object', () => {
      assert.equal(typeof new Biom(), "object");
    });
  });
});
