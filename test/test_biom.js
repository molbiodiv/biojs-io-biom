/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
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
import {Biom, VERSION, DEFAULT_BIOM} from '../src/biojs-io-biom';

describe('biojs-io-biom module', () => {
  describe('Biom constructor should create a biom object with default values', () => {
    it('should create an object', () => {
      assert.equal(typeof new Biom(), 'object');
    });
    it('id should be null after empty initialization', () => {
      assert.equal(new Biom().id, DEFAULT_BIOM.id);
    });
    it('new biom object should be initialized with default values', () => {
      let biom = new Biom();
      assert.equal(biom.columns, DEFAULT_BIOM.columns);
      assert.equal(biom.data, DEFAULT_BIOM.data);
      // The date is set to now by default and can not be checked in this manner
      // assert.equal(biom.date, DEFAULT_BIOM.date);
      assert.equal(biom.format, DEFAULT_BIOM.format);
      assert.equal(biom.format_url, DEFAULT_BIOM.format_url);
      assert.equal(biom.generated_by, DEFAULT_BIOM.generated_by);
      assert.equal(biom.matrix_element_type, DEFAULT_BIOM.matrix_element_type);
      assert.equal(biom.matrix_type, DEFAULT_BIOM.matrix_type);
      assert.equal(biom.rows, DEFAULT_BIOM.rows);
      assert.equal(biom.shape, DEFAULT_BIOM.shape);
      assert.equal(biom.type, DEFAULT_BIOM.type);
    });
  });

  describe('getter and setter for id should work', () => {
    it('should set and get the id to string', () => {
      let biom = new Biom();
      biom.id = 'NewID';
      assert.equal(biom.id, 'NewID');
    });
    it('should set and get the id to null', () => {
      let biom = new Biom();
      biom.id = null;
      assert.equal(biom.id, null);
    });
    it('should throw a type error when trying to set id to something other than string or null', () => {
      let biom = new Biom();
      assert.throws(() => {biom.id = []}, TypeError);
      assert.throws(() => {biom.id = 2}, TypeError);
      assert.throws(() => {biom.id = {}}, TypeError);
    });
  });

  describe('getter and setter for format should work', () => {
    it('should set and get the format to string', () => {
      let biom = new Biom();
      biom.format = 'NewFormat';
      assert.equal(biom.format, 'NewFormat');
    });
    it('should throw a type error when trying to set format to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.format = []}, TypeError);
      assert.throws(() => {biom.format = 52}, TypeError);
      assert.throws(() => {biom.format = {}}, TypeError);
      assert.throws(() => {biom.format = null}, TypeError);
    });
  });

  describe('getter and setter for format_url should work', () => {
    it('should set and get the format_url to string', () => {
      let biom = new Biom();
      biom.format_url = 'http://newformat.url';
      assert.equal(biom.format_url, 'http://newformat.url');
    });
    it('should throw a type error when trying to set format_url to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.format_url = []}, TypeError);
      assert.throws(() => {biom.format_url = 27}, TypeError);
      assert.throws(() => {biom.format_url = {}}, TypeError);
      assert.throws(() => {biom.format_url = null}, TypeError);
    });
  });

  describe('getter and setter for type should work', () => {
    it('should set and get the type to string', () => {
      let biom = new Biom();
      biom.type = 'Function table';
      assert.equal(biom.type, 'Function table');
    });
    it('should throw a type error when trying to set type to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.type = []}, TypeError);
      assert.throws(() => {biom.type = 99}, TypeError);
      assert.throws(() => {biom.type = {}}, TypeError);
      assert.throws(() => {biom.type = null}, TypeError);
    });
    it('should throw an error when trying to set type to a string that is not in the controlled vocabulary', () => {
      let biom = new Biom();
      assert.throws(() => {biom.type = 'Some value that is not in the CV'}, Error, /controlled vocabulary/);
    });
  });

  describe('getter and setter for generated_by should work', () => {
    it('should set and get the generated_by to string', () => {
      let biom = new Biom();
      biom.generated_by = 'New Generator version 1.0';
      assert.equal(biom.generated_by, 'New Generator version 1.0');
    });
    it('should throw a type error when trying to set generated_by to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.generated_by = []}, TypeError);
      assert.throws(() => {biom.generated_by = 123}, TypeError);
      assert.throws(() => {biom.generated_by = {}}, TypeError);
      assert.throws(() => {biom.generated_by = null}, TypeError);
    });
  });
});
