/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2015 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;

// register alternative styles
// @see http://chaijs.com/api/bdd/
chai.expect();
chai.should();

// requires your main app (specified in index.js)
//var biom = require('../');
import {Biom} from '../src/biojs-io-biom';

describe('biojs-io-biom module', function(){
//  describe('#hello()', function(){
//    it('should return a hello', function(){
//
//      assert.equal(biom.hello('biojs'), ("hello biojs"));
//      
//      // alternative styles
//      biom.hello('biojs').should.equal("hello biojs");
//    });
//  });
  describe('Biom object', function(){
    it('should create an object', function(){
      assert.equal(typeof new Biom(), "object");
    });
  });
});
