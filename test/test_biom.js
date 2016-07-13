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

describe('biojs-io-biom module', function(){
  describe('Biom object', function(){
    it('should create an object', function(){
      assert.equal(typeof new Biom(), "object");
    });
  });
});
