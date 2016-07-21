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

let exampleTaxonomy = [
  ['k__1', 'p__1', 'c__1', 'o__1', 'f__1', 'g__1', 's__1'],
  ['k__1', 'p__1', 'c__1', 'o__1', 'f__1', 'g__1', 's__2'],
  ['k__1', 'p__1', 'c__1', 'o__1', 'f__1', 'g__2', 's__1'],
  ['k__1', 'p__1', 'c__1', 'o__1', 'f__1', 'g__2', 's__2'],
  ['k__1', 'p__1', 'c__1', 'o__1', 'f__2', 'g__1', 's__1'],
  ['k__1', 'p__1', 'c__1', 'o__2', 'f__1', 'g__1', 's__1'],
  ['k__1', 'p__1', 'c__2', 'o__1', 'f__1', 'g__1', 's__1'],
  ['k__1', 'p__2', 'c__1', 'o__1', 'f__1', 'g__1', 's__1'],
  ['k__2', 'p__1', 'c__1', 'o__1', 'f__1', 'g__1', 's__1'],
  ['k__3', 'p__1', 'c__1', 'o__1', 'f__1', 'g__1', 's__1']
];
let exampleBiom = {
  'id': 'My Table ID',
  'format': 'Biological Observation Matrix 2.1.0',
  'format_url': 'http://biom-format.org',
  'matrix_type': 'sparse',
  'generated_by': 'BIOM-Format 2.1',
  'date': '2016-05-03T08:13:41.848780',
  'type': 'OTU table',
  'matrix_element_type': 'float',
  'shape': [10, 5],
  'data': [[0,0,120.0],[3,1,12.0],[5,2,20.0],[7,3,12.7],[8,4,16.0]],
  'rows': [
    {'id': 'OTU_1', 'metadata': {'taxonomy': exampleTaxonomy[0]}},
    {'id': 'OTU_2', 'metadata': {'taxonomy': exampleTaxonomy[1]}},
    {'id': 'OTU_3', 'metadata': {'taxonomy': exampleTaxonomy[2]}},
    {'id': 'OTU_4', 'metadata': {'taxonomy': exampleTaxonomy[3]}},
    {'id': 'OTU_5', 'metadata': {'taxonomy': exampleTaxonomy[4]}},
    {'id': 'OTU_6', 'metadata': {'taxonomy': exampleTaxonomy[5]}},
    {'id': 'OTU_7', 'metadata': {'taxonomy': exampleTaxonomy[6]}},
    {'id': 'OTU_8', 'metadata': {'taxonomy': exampleTaxonomy[7]}},
    {'id': 'OTU_9', 'metadata': {'taxonomy': exampleTaxonomy[8]}},
    {'id': 'OTU_10', 'metadata': {'taxonomy': exampleTaxonomy[9]}}
  ],
  'columns': [
    {'id': 'Sample_1', 'metadata': {'pH': 7}},
    {'id': 'Sample_2', 'metadata': {'pH': 3.1}},
    {'id': 'Sample_3', 'metadata': {'pH': null}},
    {'id': 'Sample_4', 'metadata': null},
    {'id': 'Sample_5', 'metadata': {'pH': 'NA'}}
  ]
};

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
      assert.equal(typeof biom.date, 'string');
      assert.equal(biom.format, DEFAULT_BIOM.format);
      assert.equal(biom.format_url, DEFAULT_BIOM.format_url);
      assert.equal(biom.generated_by, DEFAULT_BIOM.generated_by);
      assert.equal(biom.matrix_element_type, DEFAULT_BIOM.matrix_element_type);
      assert.equal(biom.matrix_type, DEFAULT_BIOM.matrix_type);
      assert.equal(biom.rows, DEFAULT_BIOM.rows);
      assert.equal(biom.shape, DEFAULT_BIOM.shape);
      assert.equal(biom.type, DEFAULT_BIOM.type);
      assert.equal(biom.comment, DEFAULT_BIOM.comment);
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

  describe('getter and setter for date should work', () => {
    it('should set and get the date to string', () => {
      let biom = new Biom();
      biom.date = new Date(12345).toISOString();
      assert.equal(biom.date, '1970-01-01T00:00:12.345Z');
    });
    it('should throw a type error when trying to set date to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.date = []}, TypeError);
      assert.throws(() => {biom.date = 153}, TypeError);
      assert.throws(() => {biom.date = {}}, TypeError);
      assert.throws(() => {biom.date = null}, TypeError);
    });
  });

  describe('getter and setter for rows should work', () => {
    it('should set and get the rows to array', () => {
      let biom = new Biom();
      biom.rows = [{id: 'row1', metadata: null}];
      assert.equal(biom.rows[0].id, 'row1');
    });
    it('should throw a type error when trying to set rows to something other than array', () => {
      let biom = new Biom();
      assert.throws(() => {biom.rows = 'rows'}, TypeError);
      assert.throws(() => {biom.rows = 8349}, TypeError);
      assert.throws(() => {biom.rows = {}}, TypeError);
      assert.throws(() => {biom.rows = null}, TypeError);
    });
  });

  describe('getter and setter for columns should work', () => {
    it('should set and get the columns to array', () => {
      let biom = new Biom();
      biom.columns = [{id: 'col1', metadata: null}];
      assert.equal(biom.columns[0].id, 'col1');
    });
    it('should throw a type error when trying to set columns to something other than array', () => {
      let biom = new Biom();
      assert.throws(() => {biom.columns = 'columns'}, TypeError);
      assert.throws(() => {biom.columns = 47257}, TypeError);
      assert.throws(() => {biom.columns = {}}, TypeError);
      assert.throws(() => {biom.columns = null}, TypeError);
    });
  });

  describe('getter and setter for matrix_type should work', () => {
    it('should set and get the matrix_type to dense and sparse', () => {
      let biom = new Biom();
      biom.matrix_type = 'dense';
      assert.equal(biom.matrix_type, 'dense');
      biom.matrix_type = 'sparse';
      assert.equal(biom.matrix_type, 'sparse');
    });
    it('should throw a type error when trying to set matrix_type to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.matrix_type = []}, TypeError);
      assert.throws(() => {biom.matrix_type = 99}, TypeError);
      assert.throws(() => {biom.matrix_type = {}}, TypeError);
      assert.throws(() => {biom.matrix_type = null}, TypeError);
    });
    it('should throw an error when trying to set matrix_type to a string that is not in the controlled vocabulary', () => {
      let biom = new Biom();
      assert.throws(() => {biom.matrix_type = 'Some value that is not in the CV'}, Error, /controlled vocabulary/);
    });
  });

  describe('getter and setter for matrix_element_type should work', () => {
    it('should set and get the matrix_element_type to int, float and unicode', () => {
      let biom = new Biom();
      biom.matrix_element_type = 'int';
      assert.equal(biom.matrix_element_type, 'int');
      biom.matrix_element_type = 'float';
      assert.equal(biom.matrix_element_type, 'float');
      biom.matrix_element_type = 'unicode';
      assert.equal(biom.matrix_element_type, 'unicode');
    });
    it('should throw a type error when trying to set matrix_element_type to something other than string', () => {
      let biom = new Biom();
      assert.throws(() => {biom.matrix_element_type = []}, TypeError);
      assert.throws(() => {biom.matrix_element_type = 9659}, TypeError);
      assert.throws(() => {biom.matrix_element_type = {}}, TypeError);
      assert.throws(() => {biom.matrix_element_type = null}, TypeError);
    });
    it('should throw an error when trying to set matrix_element_type to a string that is not in the controlled vocabulary', () => {
      let biom = new Biom();
      assert.throws(() => {biom.matrix_element_type = 'Some value that is not in the CV'}, Error, /controlled vocabulary/);
    });
  });

  describe('getter and setter for shape should work', () => {
    it('should set and get the columns to array (containing two numbers)', () => {
      let biom = new Biom();
      biom.shape = [7,13];
      assert.equal(biom.shape[0], 7);
      assert.equal(biom.shape[1], 13);
    });
    it('should throw a type error when trying to set columns to something other than array', () => {
      let biom = new Biom();
      assert.throws(() => {biom.shape = 'columns'}, TypeError);
      assert.throws(() => {biom.shape = 47257}, TypeError);
      assert.throws(() => {biom.shape = {}}, TypeError);
      assert.throws(() => {biom.shape = null}, TypeError);
    });
    it('should throw an error when trying to set shape to an array that contains something other than two non-negative integers', () => {
      let biom = new Biom();
      assert.throws(() => {biom.shape = ['string','string']}, Error, /contain/);
      assert.throws(() => {biom.shape = [1, 2, 3]}, Error, /contain/);
      assert.throws(() => {biom.shape = [0]}, Error, /contain/);
      assert.throws(() => {biom.shape = [-1, 1]}, Error, /contain/);
      assert.throws(() => {biom.shape = [0.1, 2]}, Error, /contain/);
    });
  });

  describe('getter and setter for data should work', () => {
    it('should set and get the data to array', () => {
      let biom = new Biom();
      biom.data = [[1,1,12]];
      assert.equal(biom.data[0][2], 12);
    });
    it('should throw a type error when trying to set data to something other than array', () => {
      let biom = new Biom();
      assert.throws(() => {biom.data = 'data'}, TypeError);
      assert.throws(() => {biom.data = 7257}, TypeError);
      assert.throws(() => {biom.data = {}}, TypeError);
      assert.throws(() => {biom.data = null}, TypeError);
    });
  });

  describe('getter and setter for comment should work', () => {
    it('should set and get the comment to string', () => {
      let biom = new Biom();
      biom.comment = 'New comment';
      assert.equal(biom.comment, 'New comment');
    });
    it('should set and get the comment to null', () => {
      let biom = new Biom();
      biom.comment = null;
      assert.equal(biom.comment, null);
    });
    it('should throw a type error when trying to set comment to something other than string or null', () => {
      let biom = new Biom();
      assert.throws(() => {biom.comment = []}, TypeError);
      assert.throws(() => {biom.comment = 2}, TypeError);
      assert.throws(() => {biom.comment = {}}, TypeError);
    });
  });

  describe('getMetadata should extract metadata from rows or columns', () => {
    it('should throw an Error if no attribute is given', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.getMetadata()}, Error, /attribute/);
    });
    it('should throw an Error if dimension is none of the defined terms', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.getMetadata({dimension: 'not something defined', attribute: 'test'})}, Error, /dimension/);
    });
    it('should get column metadata', () => {
      let biom = new Biom(exampleBiom);
      assert.deepEqual(biom.getMetadata({dimension: 'columns', attribute: 'pH'}), [7, 3.1, null, null, 'NA']);
    });
    it('should get row metadata', () => {
      let biom = new Biom(exampleBiom);
      assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: 'taxonomy'}), exampleTaxonomy);
    });
  });

  describe('addMetadata should add metadata to rows or columns', () => {
    it('should throw an Error if no attribute is given', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'rows', defaultValue: 7})}, Error, /attribute/);
    });
    it('should throw an Error if neither "values" nor "defaultValue" is given', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'rows', attribute: 'test'})}, Error, /argument/);
    });
    it('should throw an Error if dimension is none of the defined terms', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'not something defined', attribute: 'test', defaultValue: 7})}, Error, /dimension/);
    });
    it('should throw an Error if both "values" and "defaultValue" are set', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'rows', attribute: 'test', defaultValue: 7, values: [6,6,6,6,6,6,6,6,6,6]})}, Error, /both/);
    });
    it('should throw an Error if "values" is an array with wrong dimension', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'rows', attribute: 'test', values: [7,7,7,7]})}, Error, /number of elements/);
    });
    it('should throw an Error if "values" is neither an array nor an object', () => {
      let biom = new Biom(exampleBiom);
      assert.throws(() => {biom.addMetadata({dimension: 'rows', attribute: 'test', values: 7})}, Error, /values/);
    });
    it('should add column metadata (via array)', () => {
      let biom = new Biom(exampleBiom);
      biom.addMetadata({dimension: 'columns', attribute: 'pH', values: [1, 2, 3, 4, null]});
      assert.deepEqual(biom.getMetadata({dimension: 'columns', attribute: 'pH'}), [1, 2, 3, 4, null]);
    });
    it('should add column metadata (via defaultValue)', () => {
      let biom = new Biom(exampleBiom);
      biom.addMetadata({dimension: 'columns', attribute: 'pH', defaultValue: 7});
      assert.deepEqual(biom.getMetadata({dimension: 'columns', attribute: 'pH'}), [7, 7, 7, 7, 7]);
    });
    it('should add row metadata (via object)', () => {
      let biom = new Biom(exampleBiom);
      biom.addMetadata({dimension: 'rows', attribute: 'organism_id', values: {'OTU_3': 5, 'OTU_5': 7, 'OTU_9': 11}});
      assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: 'organism_id'}), [null, null, 5, null, 7, null, null, null, 11, null]);
      // overwriting works as well
      biom.addMetadata({dimension: 'rows', attribute: 'organism_id', values: {'OTU_1': 1, 'OTU_7': 'NA', 'OTU_9': 9}});
      assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: 'organism_id'}), [1, null, 5, null, 7, null, 'NA', null, 9, null]);
    });
  });
});
