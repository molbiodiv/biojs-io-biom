/*
 * biojs-io-biom
 * https://github.com/molbiodiv/biojs-io-biom
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

// fs for reading test files
let fs = require('fs');

// nock for mocking server requests
let nock = require('nock');

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
    'data': [[0, 0, 120.0], [3, 1, 12.0], [5, 2, 20.0], [7, 3, 12.7], [8, 4, 16.0]],
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

// helper function for comparing sparse data arrays
let sortByCoord = function (a, b) {
    if (a[0] === b[0]) {
        return a[1] - b[1];
    }
    return a[0] - b[0];
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
            assert.deepEqual(biom.shape, DEFAULT_BIOM.shape);
            assert.equal(biom.type, DEFAULT_BIOM.type);
            assert.equal(biom.comment, DEFAULT_BIOM.comment);
        });
        it('should throw an error if shape is not concordant with columns and rows', () => {
            assert.throws(() => {
                new Biom({shape: 'columns'})
            }, TypeError);
            assert.throws(() => {
                new Biom({shape: 47257})
            }, TypeError);
            assert.throws(() => {
                new Biom({shape: {}})
            }, TypeError);
            assert.throws(() => {
                new Biom({shape: {}})
            }, TypeError);
            assert.throws(() => {
                new Biom({shape: ['string', 'string']})
            }, Error, /contain/);
            assert.throws(() => {
                new Biom({shape: [1, 2, 3]})
            }, Error, /contain/);
            assert.throws(() => {
                new Biom({shape: [0]})
            }, Error, /contain/);
            assert.throws(() => {
                new Biom({shape: [-1, 1]})
            }, Error, /contain/);
            assert.throws(() => {
                new Biom({shape: [0.1, 2]})
            }, Error, /contain/);
            // shape is ok but not concordant with empty rows/columns
            assert.throws(() => {
                new Biom({shape: [5, 0]})
            }, Error, /dimension/);
            assert.throws(() => {
                new Biom({shape: [0, 5]})
            }, Error, /dimension/);
            // if shape is correct it should work
            let biom = new Biom({
                shape: [1, 1],
                rows: [{id: 'row1', metadata: {}}],
                columns: [{id: 'col1', metadata: {}}]
            });
            assert.deepEqual(biom.shape, [1, 1]);
        });
        it('JSON strings in metadata should be unpacked by default', () => {
            let biom = new Biom({
                rows: [
                    {id: 'row1', metadata: {rowJson: '{"nextLevel": {"lastLevel": [1,2,3]}}'}},
                    {id: 'row2', metadata: {rowJson: '{"nextLevel": {"lastLevel": [2,3,1]}}'}},
                    {id: 'row3', metadata: {rowJson: '{"nextLevel": {"lastLevel": [3,1,2]}}'}}
                ],
                columns: [
                    {id: 'column1', metadata: {colJson: '{"firstLevel": {"secondLevel": "test1"}}'}},
                    {id: 'column2', metadata: {colJson: '{"firstLevel": {"secondLevel": "test2"}}'}},
                    {id: 'column3', metadata: {colJson: '{"firstLevel": {"secondLevel": "test3"}}'}}
                ],
            });
            assert.equal(biom.columns[0].metadata.colJson.firstLevel.secondLevel, "test1");
            assert.equal(biom.columns[1].metadata.colJson.firstLevel.secondLevel, "test2");
            assert.equal(biom.columns[2].metadata.colJson.firstLevel.secondLevel, "test3");
            assert.deepEqual(biom.rows[0].metadata.rowJson.nextLevel.lastLevel, [1,2,3]);
            assert.deepEqual(biom.rows[1].metadata.rowJson.nextLevel.lastLevel, [2,3,1]);
            assert.deepEqual(biom.rows[2].metadata.rowJson.nextLevel.lastLevel, [3,1,2]);
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
            assert.throws(() => {
                biom.id = []
            }, TypeError);
            assert.throws(() => {
                biom.id = 2
            }, TypeError);
            assert.throws(() => {
                biom.id = {}
            }, TypeError);
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
            assert.throws(() => {
                biom.format = []
            }, TypeError);
            assert.throws(() => {
                biom.format = 52
            }, TypeError);
            assert.throws(() => {
                biom.format = {}
            }, TypeError);
            assert.throws(() => {
                biom.format = null
            }, TypeError);
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
            assert.throws(() => {
                biom.format_url = []
            }, TypeError);
            assert.throws(() => {
                biom.format_url = 27
            }, TypeError);
            assert.throws(() => {
                biom.format_url = {}
            }, TypeError);
            assert.throws(() => {
                biom.format_url = null
            }, TypeError);
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
            assert.throws(() => {
                biom.type = []
            }, TypeError);
            assert.throws(() => {
                biom.type = 99
            }, TypeError);
            assert.throws(() => {
                biom.type = {}
            }, TypeError);
            assert.throws(() => {
                biom.type = null
            }, TypeError);
        });
        it('should throw an error when trying to set type to a string that is not in the controlled vocabulary', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.type = 'Some value that is not in the CV'
            }, Error, /controlled vocabulary/);
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
            assert.throws(() => {
                biom.generated_by = []
            }, TypeError);
            assert.throws(() => {
                biom.generated_by = 123
            }, TypeError);
            assert.throws(() => {
                biom.generated_by = {}
            }, TypeError);
            assert.throws(() => {
                biom.generated_by = null
            }, TypeError);
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
            assert.throws(() => {
                biom.date = []
            }, TypeError);
            assert.throws(() => {
                biom.date = 153
            }, TypeError);
            assert.throws(() => {
                biom.date = {}
            }, TypeError);
            assert.throws(() => {
                biom.date = null
            }, TypeError);
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
            assert.throws(() => {
                biom.rows = 'rows'
            }, TypeError);
            assert.throws(() => {
                biom.rows = 8349
            }, TypeError);
            assert.throws(() => {
                biom.rows = {}
            }, TypeError);
            assert.throws(() => {
                biom.rows = null
            }, TypeError);
        });
        it('should throw an error if id is missing', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.rows = [{id: 'row1', metadata: null}, {metadata: null}, {id: 'row2', metadata: null}]
            }, Error);
        });
        it('should throw an error if id is duplicate', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.rows = [{id: 'row1', metadata: null}, {id: 'row2', metadata: null}, {id: 'row2', metadata: null}]
            }, Error);
        });
        it('should update data according to new rows (dense)', () => {
            let new_data1 = [[0, 1], [5, 0], [0, 0], [0, 0]];
            let new_data2 = [[0, 0], [0, 1]];
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}],
                data: [[0, 1], [2, 7], [5, 0]],
                matrix_type: 'dense'
            });
            biom.rows = [{id: 'r1'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
            assert.deepEqual(biom.data, new_data1);
            biom.rows = [{id: 'r6'}, {id: 'r1'}];
            assert.deepEqual(biom.data, new_data2);
        });
        it('should update data according to new rows (sparse)', () => {
            let new_data1 = [[0, 1, 1], [1, 0, 5]];
            let new_data2 = [[1, 1, 1]];
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}],
                data: [[0, 1, 1], [1, 0, 2], [1, 1, 7], [2, 0, 5]],
                matrix_type: 'sparse'
            });
            biom.rows = [{id: 'r1'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
            assert.deepEqual(biom.data, new_data1);
            biom.rows = [{id: 'r6'}, {id: 'r1'}];
            assert.deepEqual(biom.data, new_data2);
        });
        it('should add empty metadata object if missing', () => {
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}],
                matrix_type: 'sparse'
            });
            assert.deepEqual(biom.rows[0], {id: 'r1', metadata: {}});
            biom.rows = [{id: 'r4'}, {id: 'r5'}, {id: 'r6', metadata: null}];
            assert.deepEqual(biom.rows[1], {id: 'r5', metadata: {}});
            assert.deepEqual(biom.rows[2], {id: 'r6', metadata: {}});
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
            assert.throws(() => {
                biom.columns = 'columns'
            }, TypeError);
            assert.throws(() => {
                biom.columns = 47257
            }, TypeError);
            assert.throws(() => {
                biom.columns = {}
            }, TypeError);
            assert.throws(() => {
                biom.columns = null
            }, TypeError);
        });
        it('should throw an error if id is missing', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.columns = [{id: 'col1', metadata: null}, {metadata: null}, {id: 'col2', metadata: null}]
            }, Error);
        });
        it('should throw an error if id is duplicate', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.columns = [{id: 'col1', metadata: null}, {id: 'col2', metadata: null}, {
                    id: 'col1',
                    metadata: null
                }]
            }, Error);
        });
        it('should update data according to new columns (dense)', () => {
            let new_data1 = [[1, 3, 0, 6], [4, 2, 0, 21], [0, 0, 0, 1]];
            let new_data2 = [[3, 6], [2, 21], [0, 1]];
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}],
                data: [[3, 1, 6], [2, 4, 21], [0, 0, 1]],
                matrix_type: 'dense'
            });
            biom.columns = [{id: 'c2'}, {id: 'c1'}, {id: 'c4'}, {id: 'c3'}];
            assert.deepEqual(biom.data, new_data1);
            biom.columns = [{id: 'c1'}, {id: 'c3'}];
            assert.deepEqual(biom.data, new_data2);
        });
        it('should update data according to new columns (sparse)', () => {
            let new_data1 = [[0, 0, 1], [0, 1, 3], [0, 3, 6], [1, 0, 4], [1, 1, 2], [1, 3, 21], [2, 3, 1]];
            let new_data2 = [[0, 0, 3], [0, 1, 6], [1, 0, 2], [1, 1, 21], [2, 1, 1]];
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}],
                data: [[0, 0, 3], [0, 1, 1], [0, 2, 6], [1, 0, 2], [1, 1, 4], [1, 2, 21], [2, 2, 1]],
                matrix_type: 'sparse'
            });
            biom.columns = [{id: 'c2'}, {id: 'c1'}, {id: 'c4'}, {id: 'c3'}];
            assert.deepEqual(biom.data.sort(sortByCoord), new_data1);
            biom.columns = [{id: 'c1'}, {id: 'c3'}];
            assert.deepEqual(biom.data.sort(sortByCoord), new_data2);
        });
        it('should add empty metadata object if missing', () => {
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}],
                matrix_type: 'sparse'
            });
            assert.deepEqual(biom.columns[0], {id: 'c1', metadata: {}});
            biom.columns = [{id: 'c4'}, {id: 'c5'}, {id: 'c6', metadata: null}];
            assert.deepEqual(biom.columns[1], {id: 'c5', metadata: {}});
            assert.deepEqual(biom.columns[2], {id: 'c6', metadata: {}});
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
            assert.throws(() => {
                biom.matrix_type = []
            }, TypeError);
            assert.throws(() => {
                biom.matrix_type = 99
            }, TypeError);
            assert.throws(() => {
                biom.matrix_type = {}
            }, TypeError);
            assert.throws(() => {
                biom.matrix_type = null
            }, TypeError);
        });
        it('should throw an error when trying to set matrix_type to a string that is not in the controlled vocabulary', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.matrix_type = 'Some value that is not in the CV'
            }, Error, /controlled vocabulary/);
        });
        it('should update internal data representation from sparse to dense', () => {
            let original_data = [[0, 1, 12], [1, 2, 7], [3, 4, 109], [2, 1, 17]];
            let transformed_data = [
                [0, 12, 0, 0, 0],
                [0, 0, 7, 0, 0],
                [0, 17, 0, 0, 0],
                [0, 0, 0, 0, 109]
            ];
            let rows = [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}, {id: 'r3', metadata: {}}, {
                id: 'r4',
                metadata: {}
            }];
            let cols = [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}, {id: 'c3', metadata: {}}, {
                id: 'c4',
                metadata: {}
            }, {id: 'c5', metadata: {}}];
            let biom = new Biom({matrix_type: 'sparse', shape: [4, 5], data: original_data, rows: rows, columns: cols});
            assert.deepEqual(biom.data, original_data);
            biom.matrix_type = 'dense';
            assert.deepEqual(biom.data, transformed_data);
        });
        it('should update internal data representation from dense to sparse', () => {
            let original_data = [
                [0, 2, 0, 1, 0],
                [0, 0, 7, 0, 3],
                [0, 5, 0, 0, 0],
                [0, 0, 34, 0, 0],
                [0, 0, 0, 0, 2]
            ];
            let rows = [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}, {id: 'r3', metadata: {}}, {
                id: 'r4',
                metadata: {}
            }, {id: 'r5', metadata: {}}];
            let cols = [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}, {id: 'c3', metadata: {}}, {
                id: 'c4',
                metadata: {}
            }, {id: 'c5', metadata: {}}];
            let transformed_data = [[0, 1, 2], [0, 3, 1], [1, 2, 7], [1, 4, 3], [2, 1, 5], [3, 2, 34], [4, 4, 2]];
            let biom = new Biom({matrix_type: 'dense', shape: [5, 5], data: original_data, rows: rows, columns: cols});
            assert.deepEqual(biom.data, original_data);
            // no transformation when confirming the type that is already set
            biom.matrix_type = 'dense';
            assert.deepEqual(biom.data, original_data);
            biom.matrix_type = 'sparse';
            assert.deepEqual(biom.data, transformed_data);
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
            assert.throws(() => {
                biom.matrix_element_type = []
            }, TypeError);
            assert.throws(() => {
                biom.matrix_element_type = 9659
            }, TypeError);
            assert.throws(() => {
                biom.matrix_element_type = {}
            }, TypeError);
            assert.throws(() => {
                biom.matrix_element_type = null
            }, TypeError);
        });
        it('should throw an error when trying to set matrix_element_type to a string that is not in the controlled vocabulary', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.matrix_element_type = 'Some value that is not in the CV'
            }, Error, /controlled vocabulary/);
        });
    });

    describe('getter for shape should work, setter should throw an error', () => {
        it('should set and get the columns to array (containing two numbers)', () => {
            let rows = [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}, {id: 'r3', metadata: {}}, {
                id: 'r4',
                metadata: {}
            }, {id: 'r5', metadata: {}}, {id: 'r6', metadata: {}}, {id: 'r7', metadata: {}}];
            let cols = [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}, {id: 'c3', metadata: {}}, {
                id: 'c4',
                metadata: {}
            }, {id: 'c5', metadata: {}}];
            let biom = new Biom({rows: rows, columns: cols});
            assert.equal(biom.shape[0], 7);
            assert.equal(biom.shape[1], 5);
        });
        it('should throw a type error when trying to set columns to something other than array', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.shape = [0, 0]
            }, TypeError);
        });
    });

    describe('getter and setter for data should work', () => {
        it('should set and get the data to array', () => {
            let biom = new Biom({
                rows: [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}],
                columns: [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}]
            });
            biom.data = [[1, 1, 12]];
            assert.equal(biom.data[0][2], 12);
        });
        it('should throw a type error when trying to set data to something other than array', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.data = 'data'
            }, TypeError);
            assert.throws(() => {
                biom.data = 7257
            }, TypeError);
            assert.throws(() => {
                biom.data = {}
            }, TypeError);
            assert.throws(() => {
                biom.data = null
            }, TypeError);
        });
        it('should throw an error when trying to set data not concordant with dimensions (dense)', () => {
            let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}];
            let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}];
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
            });
            // Correct usage works
            biom.data = [[0, 0, 1, 2], [5, 0, 1, 0], [0, 3, 3, 1]];
            assert.equal(biom.data[1][2], 1);
            // Wrong number of rows
            assert.throws(() => {
                biom.data = [[0, 0, 1, 2], [5, 0, 1, 0], [0, 3, 3, 1], [0, 0, 0, 0]]
            }, Error);
            // Wrong number of columns
            assert.throws(() => {
                biom.data = [[0, 0, 1], [5, 0, 1], [0, 3, 3]]
            }, Error);
            // Wrong data in constructor
            assert.throws(() => {
                new Biom({data: [[0, 0, 1], [5, 0, 1], [0, 3, 3]], rows: rows, columns: cols, matrix_type: 'dense'})
            }, Error);
        });
        it('should throw an error when trying to set data not concordant with dimensions (sparse)', () => {
            let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}];
            let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}];
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            // Correct usage works
            biom.data = [[0, 0, 12], [1, 1, 3], [3, 2, 31]];
            assert.equal(biom.data[1][2], 3);
            // row out of bounds
            assert.throws(() => {
                biom.data = [[0, 0, 12], [5, 1, 3], [3, 2, 31]]
            }, Error);
            // column out of bounds
            assert.throws(() => {
                biom.data = [[0, 0, 12], [1, 5, 3], [3, 2, 31]]
            }, Error);
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
            assert.throws(() => {
                biom.comment = []
            }, TypeError);
            assert.throws(() => {
                biom.comment = 2
            }, TypeError);
            assert.throws(() => {
                biom.comment = {}
            }, TypeError);
        });
    });

    describe('getter and setter for nnz should work', () => {
        it('should get the nnz', () => {
            let biom = new Biom({
                data: [[1, 1, 12]], matrix_type: 'sparse', shape: [2, 2],
                rows: [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}],
                columns: [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}]
            });
            assert.equal(biom.nnz, 1);
            biom = new Biom({
                data: [[1, 1, 12], [2, 1, 1], [2, 2, 9]], matrix_type: 'sparse', shape: [3, 3],
                rows: [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}, {id: 'r3', metadata: {}}],
                columns: [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}, {id: 'c3', metadata: {}}]
            });
            assert.equal(biom.nnz, 3);
            biom = new Biom({
                data: [[1, 1, 0], [0, 1, 1], [0, 2, 0]], matrix_type: 'dense', shape: [3, 3],
                rows: [{id: 'r1', metadata: {}}, {id: 'r2', metadata: {}}, {id: 'r3', metadata: {}}],
                columns: [{id: 'c1', metadata: {}}, {id: 'c2', metadata: {}}, {id: 'c3', metadata: {}}]
            });
            assert.equal(biom.nnz, 5);
        });
        it('should throw a type error when trying to set nnz (read-only)', () => {
            let biom = new Biom();
            assert.throws(() => {
                biom.nnz = 'data'
            }, TypeError);
            assert.throws(() => {
                biom.nnz = 7257
            }, TypeError);
            assert.throws(() => {
                biom.nnz = {}
            }, TypeError);
            assert.throws(() => {
                biom.nnz = null
            }, TypeError);
            assert.throws(() => {
                biom.nnz = []
            }, TypeError);
        });
    });

    describe('getMetadata should extract metadata from rows or columns', () => {
        it('should throw an Error if no attribute is given', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.getMetadata()
            }, Error, /attribute/);
        });
        it('should throw an Error if dimension is none of the defined terms', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.getMetadata({dimension: 'not something defined', attribute: 'test'})
            }, Error, /dimension/);
        });
        it('should get column metadata', () => {
            let biom = new Biom(exampleBiom);
            assert.deepEqual(biom.getMetadata({dimension: 'columns', attribute: 'pH'}), [7, 3.1, null, null, 'NA']);
        });
        it('should get row metadata', () => {
            let biom = new Biom(exampleBiom);
            assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: 'taxonomy'}), exampleTaxonomy);
        });
        it('should get nested column metadata (object)', () => {
            let biom = new Biom(exampleBiom);
            let columns = [
                {'id': 'Sample_1', 'metadata': {'firstLevel': {'secondLevel': {'thirdLevel': 'a'}}}},
                {'id': 'Sample_2', 'metadata': {'firstLevel': {'secondLevel': {'thirdLevel': 'b'}}}},
                {'id': 'Sample_3', 'metadata': {'firstLevel': {'thirdLevel': {'secondLevel': 'will not be found'}}}},
                {'id': 'Sample_4', 'metadata': {'firstLevel': {'secondLevel': {'thirdLevel': 'c'}}}},
                {'id': 'Sample_5', 'metadata': {'firstLevel': {'secondLevel': {'hasNoThird': 'will not be found'}}}}
            ];
            biom.columns = columns;
            assert.deepEqual(biom.getMetadata({
                dimension: 'columns',
                attribute: ['firstLevel', 'secondLevel', 'thirdLevel']
            }), ['a', 'b', null, 'c', null]);
        });
        it('should get nested row metadata (array)', () => {
            let biom = new Biom(exampleBiom);
            let rows = [
                {'id': 'OTU_1', 'metadata': {'numbers': [1, 2, 3, 4]}},
                {'id': 'OTU_2', 'metadata': {'numbers': []}},
                {'id': 'OTU_3', 'metadata': {'numbers': [1, 2, 3]}},
                {'id': 'OTU_4', 'metadata': {'numbers': [1, 2, 3, 4, 5]}},
                {'id': 'OTU_5', 'metadata': {'numbers': [6, 7, 8, 9]}},
                {'id': 'OTU_6', 'metadata': {'numbers': [1, 2, 3, 44]}},
                {'id': 'OTU_7', 'metadata': {'numbers': [1, 2, 3, 12]}},
                {'id': 'OTU_8', 'metadata': {'number_array': [1, 2, 3, 4]}},
                {'id': 'OTU_9', 'metadata': {}},
                {'id': 'OTU_10', 'metadata': {'numbers': {a: 1, b: 2, c: 3, d: 4}}}
            ];
            biom.rows = rows;
            let expectedNumbers = [4, null, null, 4, 9, 44, 12, null, null, null];
            assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: ['numbers', 3]}), expectedNumbers);
        });
    });

    describe('addMetadata should add metadata to rows or columns', () => {
        it('should throw an Error if no attribute is given', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({dimension: 'rows', defaultValue: 7})
            }, Error, /attribute/);
        });
        it('should throw an Error if neither "values" nor "defaultValue" is given', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({dimension: 'rows', attribute: 'test'})
            }, Error, /argument/);
        });
        it('should throw an Error if dimension is none of the defined terms', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({dimension: 'not something defined', attribute: 'test', defaultValue: 7})
            }, Error, /dimension/);
        });
        it('should throw an Error if both "values" and "defaultValue" are set', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({
                    dimension: 'rows',
                    attribute: 'test',
                    defaultValue: 7,
                    values: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
                })
            }, Error, /both/);
        });
        it('should throw an Error if "values" is an array with wrong dimension', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({dimension: 'rows', attribute: 'test', values: [7, 7, 7, 7]})
            }, Error, /number of elements/);
        });
        it('should throw an Error if "values" is neither an array nor an object', () => {
            let biom = new Biom(exampleBiom);
            assert.throws(() => {
                biom.addMetadata({dimension: 'rows', attribute: 'test', values: 7})
            }, Error, /values/);
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
            biom.addMetadata({
                dimension: 'rows',
                attribute: 'organism_id',
                values: {'OTU_3': 5, 'OTU_5': 7, 'OTU_9': 11}
            });
            assert.deepEqual(biom.getMetadata({
                dimension: 'rows',
                attribute: 'organism_id'
            }), [null, null, 5, null, 7, null, null, null, 11, null]);
            // overwriting works as well
            biom.addMetadata({
                dimension: 'rows',
                attribute: 'organism_id',
                values: {'OTU_1': 1, 'OTU_7': 'NA', 'OTU_9': 9}
            });
            assert.deepEqual(biom.getMetadata({
                dimension: 'rows',
                attribute: 'organism_id'
            }), [1, null, 5, null, 7, null, 'NA', null, 9, null]);
        });
        it('should add nested column metadata (via object)', () => {
            let biom = new Biom(exampleBiom);
            let columns = [
                {'id': 'Sample_1', 'metadata': {}},
                {'id': 'Sample_2', 'metadata': {}},
                {'id': 'Sample_3', 'metadata': {}},
                {'id': 'Sample_4', 'metadata': {}},
                {'id': 'Sample_5', 'metadata': {}}
            ];
            biom.columns = columns;
            biom.addMetadata({
                dimension: 'columns',
                attribute: ['firstLevel', 'secondLevel', 'thirdLevel'],
                values: {'Sample_1': 'a', 'Sample_2': 'b', 'Sample_4': 'c'}
            });
            let expected = ['a', 'b', null, 'c', null];
            assert.deepEqual(biom.getMetadata({
                dimension: 'columns',
                attribute: ['firstLevel', 'secondLevel', 'thirdLevel']
            }), expected);
        });
        it('should set nested row metadata (via array)', () => {
            let biom = new Biom(exampleBiom);
            let rows = [
                {'id': 'OTU_1', 'metadata': {'numbers': []}},
                {'id': 'OTU_2', 'metadata': {'numbers': [1, 2, 3, 4]}},
                {'id': 'OTU_3', 'metadata': {'numbers': [1, 2, 3, null]}},
                {'id': 'OTU_4', 'metadata': {}},
                {'id': 'OTU_5', 'metadata': {}},
                {'id': 'OTU_6', 'metadata': {}},
                {'id': 'OTU_7', 'metadata': {}},
                {'id': 'OTU_8', 'metadata': {}},
                {'id': 'OTU_9', 'metadata': {}},
                {'id': 'OTU_10', 'metadata': {}}
            ];
            biom.rows = rows;
            let expectedNumbers = [4, null, 42, 4, 9, 44, 12, null, null, null];
            biom.addMetadata({dimension: 'rows', attribute: ['numbers', 3], values: expectedNumbers});
            assert.deepEqual(biom.getMetadata({dimension: 'rows', attribute: ['numbers', 3]}), expectedNumbers);
        });
    });

    describe('parse should create a new object from a string (in json or raw hdf5 format)', () => {
        it('should reject the promise if the string is not json and no conversion server is given', (done) => {
            Biom.parse('just some random text').then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.match(fail.message, /json/, 'Correct error created');
                    done();
                }
            );
        });
        it('should throw an error if the string is valid json which is incompatible with the biom specification', () => {
            // id is neither string nor null
            Biom.parse('{"id": []}').then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.equal(typeof fail, 'TypeError', 'A TypeError was thrown');
                    done();
                }
            );
            // data is not an array
            Biom.parse('{"id": "test", "data": "someData"}').then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.equal(typeof fail, 'TypeError', 'A TypeError was thrown');
                    done();
                }
            );
        });
        it('should return a new biom object if the string is valid json', (done) => {
            // load test json file
            fs.readFile('./test/files/simpleBiom.json', 'utf8', function (err, data) {
                Biom.parse(data, {}).then(
                    (biom) => {
                        assert.equal(biom.id, 'No Table ID');
                        assert.equal(biom.format, 'Biological Observation Matrix 2.1.0');
                        done();
                    },
                    (fail) => {
                        throw new Error('The promise should not be rejected');
                        done();
                    }
                );
            });
        });
        it('should throw an error if the biomString is no JSON and the conversionServer is not reachable', (done) => {
            Biom.parse('', {conversionServer: 'http://non-existent.example.com/non-existent.php'}).then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.match(fail.message, /conversion/, 'Correct error created');
                    done();
                }
            );
        });
        it('should send a proper request to the given conversion server and interpret the results', (done) => {
            nock('http://example.com')
                .persist()
                .post('/convert.php', {
                    to: 'json',
                    content: /AAAAAAAAAA/
                })
                .replyWithFile(200, './test/files/simpleBiom.hdf5.conversionServerAnswer');
            fs.readFile('./test/files/simpleBiom.hdf5', function (err, data) {
                Biom.parse('', {conversionServer: 'http://example.com/convert.php', arrayBuffer: data}).then(
                    (biom) => {
                        assert.equal(biom.date, '2016-07-22T09:36:48.816900');
                        assert.equal(biom.matrix_element_type, 'float');
                        done();
                    },
                    (fail) => {
                        throw new Error('The promise should not be rejected');
                        done();
                    }
                );
            });
        });
        it('should send a proper request to the given conversion server but get an error if not convertible', (done) => {
            nock('http://example.com')
                .persist()
                .post('/convert.php', {
                    to: 'json',
                    content: /VGhpcyBpcyBh/
                })
                .replyWithFile(200, './test/files/noJson.conversionServerAnswer');
            fs.readFile('./test/files/noJson', function (err, data) {
                Biom.parse('', {conversionServer: 'http://example.com/convert.php', arrayBuffer: data}).then(
                    (biom) => {
                        throw new Error('The promise should not be fulfilled');
                        done();
                    },
                    (fail) => {
                        assert.match(fail.message, /conversion/, 'Correct error created');
                        done();
                    }
                );
            });
        });
    });

    describe('write should create a JSON string or ArrayBuffer representation of the biom object', () => {
        it('should throw an error if hdf5 is requested but no conversionServer is given', (done) => {
            let biom = new Biom();
            biom.write({asHdf5: true}).then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.match(fail.message, /conversion/, 'Correct error created');
                    done();
                }
            );
        });
        it('should return a valid json string', (done) => {
            let biom = new Biom();
            biom.write().then(
                (biomString) => {
                    assert.match(biomString, /"id": ?null/);
                    done();
                },
                (fail) => {
                    throw new Error('The promise should not be rejected');
                    done();
                }
            )
        });
        it('should throw an error if asHdf5 is set and the conversionServer is not reachable', (done) => {
            let biom = new Biom();
            biom.write({conversionServer: 'http://non-existent.example.com/non-existent.php', asHdf5: true}).then(
                (suc) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.match(fail.message, /conversion/, 'Correct error created');
                    done();
                }
            );
        });
        // this mocked server answer is not expected for the generated request however other errors may occur and look like that
        it('should send a proper request to the given conversion server but handle an error if one occurs', (done) => {
            nock('http://example.com')
                .persist()
                .post('/convert.php', {
                    to: 'hdf5',
                    content: /eyJpZCI6bnVsbCwi/
                })
                .replyWithFile(200, './test/files/noJson.conversionServerAnswer');
            let biom = new Biom();
            biom.write({conversionServer: 'http://example.com/convert.php', asHdf5: true}).then(
                (biom) => {
                    throw new Error('The promise should not be fulfilled');
                    done();
                },
                (fail) => {
                    assert.match(fail.message, /conversion/, 'Correct error created');
                    done();
                }
            );
        });
        it('should send a proper request to the given conversion server and interpret the results', (done) => {
            nock('http://2.example.com')
                .persist()
                .post('/convert.php', {
                    to: 'hdf5',
                    content: /eyJpZCI6bnVsbCwi/
                })
                .replyWithFile(200, './test/files/emptyObject.to-hdf5.conversionServerAnswer');
            let biom = new Biom();
            biom.write({conversionServer: 'http://2.example.com/convert.php', asHdf5: true}).then(
                (biomAB) => {
                    assert.equal(Object.prototype.toString.call(biomAB), '[object ArrayBuffer]');
                    let u8 = new Uint8Array(biomAB);
                    assert.equal(u8[0], 137);
                    assert.equal(u8[1], 72);
                    assert.equal(u8[2], 68);
                    assert.equal(u8[3], 70);
                    assert.equal(u8[4], 13);
                    done();
                },
                (fail) => {
                    throw new Error('The promise should not be rejected');
                    done();
                }
            );
        });
    });

    describe('toString should return the json representation', () => {
        it('should work if toString is invoked explicitly', () => {
            let biom = new Biom();
            assert.match(biom.toString(), /"id": ?null/);
        });
        it('should work if toString is invoked implicitly', () => {
            let biom = new Biom();
            assert.match(biom + "", /"id": ?null/);
        });
        it('should convert metadata objects to json string', () => {
            let biom = new Biom({
                rows: [
                    {id: 'row1', metadata: {'level1': {'level2': 'value1'}}},
                    {id: 'row2', metadata: {'level1': {'level2': 'value2'}}},
                    {id: 'row3', metadata: {'level1': {'level2': 'value3'}}},
                ]
            });
            assert.match(biom.toString(), /"level1":"\{\\"level2/);
        });
        it('should leave metadata arrays as arrays', () => {
            let biom = new Biom({
                rows: [
                    {id: 'row1', metadata: {'level1': ['level2', 'value1']}},
                    {id: 'row2', metadata: {'level1': ['level2', 'value2']}},
                    {id: 'row3', metadata: {'level1': ['level2', 'value3']}}
                ]
            });
            assert.match(biom.toString(), /"level1":\["level2/);
        });
        it('should convert numbers to strings for compatibility with BIOM version 2.1', () => {
            let biom = new Biom({
                columns: [
                    {id: 'col1', metadata: {'number': 1}},
                    {id: 'col2', metadata: {'number': 2}},
                    {id: 'col3', metadata: {'number': 3}}
                ]
            });
            assert.match(biom.toString(), /"number":"2"/);
        });
    });

    describe('getDataAt should return data for a given row and column', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if rowID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.getDataAt('r7', 'c1')
            }, Error, /unknown/);
        });
        it('should throw an Error if colID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.getDataAt('r1', 'c9')
            }, Error, /unknown/);
        });
        it('should return correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.equal(biom.getDataAt('r1', 'c1'), 0);
            assert.equal(biom.getDataAt('r1', 'c2'), 11);
            assert.equal(biom.getDataAt('r2', 'c3'), 13);
            assert.equal(biom.getDataAt('r3', 'c4'), 0);
            assert.equal(biom.getDataAt('r5', 'c5'), 9);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.equal(biom.getDataAt('r1', 'c1'), 0);
            assert.equal(biom.getDataAt('r1', 'c2'), 1);
            assert.equal(biom.getDataAt('r2', 'c3'), 2);
            assert.equal(biom.getDataAt('r3', 'c4'), 1);
            assert.equal(biom.getDataAt('r5', 'c5'), 9);
        });
    });

    describe('setDataAt should set data for a given row and column', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if rowID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataAt('r7', 'c1', 0)
            }, Error, /unknown/);
        });
        it('should throw an Error if colID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataAt('r1', 'c9', 0)
            }, Error, /unknown/);
        });
        it('should set correct value for sparse data', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse', data: [[1, 2, 13], [4, 4, 9]]});
            biom.setDataAt('r1', 'c1', 0);
            assert.equal(biom.getDataAt('r1', 'c1'), 0);
            biom.setDataAt('r1', 'c2', 11);
            assert.equal(biom.getDataAt('r1', 'c2'), 11);
            assert.equal(biom.getDataAt('r2', 'c3'), 13);
            biom.setDataAt('r2', 'c3', 15);
            assert.equal(biom.getDataAt('r2', 'c3'), 15);
            biom.setDataAt('r3', 'c4', 0);
            assert.equal(biom.getDataAt('r3', 'c4'), 0);
            assert.equal(biom.getDataAt('r5', 'c5'), 9);
            biom.setDataAt('r5', 'c5', 0);
            assert.equal(biom.getDataAt('r5', 'c5'), 0);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            biom.setDataAt('r1', 'c1', 3);
            assert.equal(biom.getDataAt('r1', 'c1'), 3);
            biom.setDataAt('r1', 'c2', 5);
            assert.equal(biom.getDataAt('r1', 'c2'), 5);
            biom.setDataAt('r2', 'c3', 2);
            assert.equal(biom.getDataAt('r2', 'c3'), 2);
            biom.setDataAt('r3', 'c4', 11);
            assert.equal(biom.getDataAt('r3', 'c4'), 11);
            biom.setDataAt('r5', 'c5', 91);
            assert.equal(biom.getDataAt('r5', 'c5'), 91);
        });
    });

    describe('getDataRow should return data for a given row', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if rowID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.getDataRow('r7')
            }, Error, /unknown/);
        });
        it('should return correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataRow('r1'), [0, 11, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r2'), [0, 0, 13, 0, 0]);
            assert.deepEqual(biom.getDataRow('r3'), [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r4'), [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r5'), [0, 0, 0, 0, 9]);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataRow('r1'), [0, 1, 11, 1, 0]);
            assert.deepEqual(biom.getDataRow('r2'), [0, 1, 2, 0, 13]);
            assert.deepEqual(biom.getDataRow('r3'), [0, 1, 0, 1, 1]);
            assert.deepEqual(biom.getDataRow('r4'), [1, 20, 0, 0, 13]);
            assert.deepEqual(biom.getDataRow('r5'), [3, 0, 4, 4, 9]);
        });
    });

    describe('setDataRow should set data for a given row', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if rowID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataRow('r7', [0, 0, 0, 0, 0])
            }, Error, /unknown/);
        });
        it('should throw an Error if the new row has wrong length', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataRow('r1', [0, 0, 0, 0, 0, 0])
            }, Error, /length/);
        });
        it('should set correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataRow('r1'), [0, 11, 0, 0, 0]);
            biom.setDataRow('r1', [1, 2, 3, 4, 5]);
            assert.deepEqual(biom.getDataRow('r1'), [1, 2, 3, 4, 5]);
            biom.setDataRow('r2', [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r2'), [0, 0, 0, 0, 0]);
            biom.setDataRow('r3', [0, 11, 0, 5, 0]);
            assert.deepEqual(biom.getDataRow('r3'), [0, 11, 0, 5, 0]);
            biom.setDataRow('r3', [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r3'), [0, 0, 0, 0, 0]);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataRow('r1'), [0, 1, 11, 1, 0]);
            biom.setDataRow('r1', [1, 2, 3, 4, 5]);
            assert.deepEqual(biom.getDataRow('r1'), [1, 2, 3, 4, 5]);
            biom.setDataRow('r2', [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataRow('r2'), [0, 0, 0, 0, 0]);
            biom.setDataRow('r3', [0, 11, 0, 5, 0]);
            assert.deepEqual(biom.getDataRow('r3'), [0, 11, 0, 5, 0]);
        });
    });

    describe('getDataColumn should return data for a given column', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if colID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.getDataColumn('c7')
            }, Error, /unknown/);
        });
        it('should return correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataColumn('c1'), [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c2'), [11, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c3'), [0, 13, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c4'), [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c5'), [0, 0, 0, 0, 9]);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataColumn('c1'), [0, 0, 0, 1, 3]);
            assert.deepEqual(biom.getDataColumn('c2'), [1, 1, 1, 20, 0]);
            assert.deepEqual(biom.getDataColumn('c3'), [11, 2, 0, 0, 4]);
            assert.deepEqual(biom.getDataColumn('c4'), [1, 0, 1, 0, 4]);
            assert.deepEqual(biom.getDataColumn('c5'), [0, 13, 1, 13, 9]);
        });
    });

    describe('setDataColumn should set data for a given column', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should throw an Error if columnID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataColumn('c7', [0, 0, 0, 0, 0])
            }, Error, /unknown/);
        });
        it('should throw an Error if the new column has wrong length', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.throws(() => {
                biom.setDataColumn('c1', [0, 0, 0, 0, 0, 0])
            }, Error, /length/);
        });
        it('should set correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataColumn('c2'), [11, 0, 0, 0, 0]);
            biom.setDataColumn('c2', [1, 2, 3, 4, 5]);
            assert.deepEqual(biom.getDataColumn('c2'), [1, 2, 3, 4, 5]);
            biom.setDataColumn('c3', [0, 11, 0, 5, 0]);
            assert.deepEqual(biom.getDataColumn('c3'), [0, 11, 0, 5, 0]);
            biom.setDataColumn('c3', [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c3'), [0, 0, 0, 0, 0]);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataColumn('c1'), [0, 0, 0, 1, 3]);
            biom.setDataColumn('c1', [1, 2, 3, 4, 5]);
            assert.deepEqual(biom.getDataColumn('c1'), [1, 2, 3, 4, 5]);
            biom.setDataColumn('c2', [0, 0, 0, 0, 0]);
            assert.deepEqual(biom.getDataColumn('c2'), [0, 0, 0, 0, 0]);
            biom.setDataColumn('c3', [0, 11, 0, 5, 0]);
            assert.deepEqual(biom.getDataColumn('c3'), [0, 11, 0, 5, 0]);
        });
    });

    describe('getDataMatrix should return data in dense format', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should return correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
        });
        it('should return correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]);
        });
    });

    describe('setDataMatrix should set data in dense format', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should set correct value for sparse data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
            biom.setDataMatrix([[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]);
            assert.deepEqual(biom.getDataMatrix(), [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]);
        });
        it('should set correct value for dense data', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'dense',
                data: [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 1, 11, 1, 0], [0, 1, 2, 0, 13], [0, 1, 0, 1, 1], [1, 20, 0, 0, 13], [3, 0, 4, 4, 9]]);
            biom.setDataMatrix([[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
        });
    });

    describe('pa should convert the data to presence/absence', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should return correct matrix (but not modify original data)', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
            let matrix = biom.pa(false);
            assert.deepEqual(matrix, [[0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]]);
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
        });
        it('should return correct matrix (and replace original data in-place)', () => {
            let biom = new Biom({
                rows: rows,
                columns: cols,
                matrix_type: 'sparse',
                data: [[0, 1, 11], [1, 2, 13], [4, 4, 9]]
            });
            assert.deepEqual(biom.getDataMatrix(), [[0, 11, 0, 0, 0], [0, 0, 13, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 9]]);
            biom.pa(true);
            assert.deepEqual(matrix, [[0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]]);
            assert.deepEqual(biom.getDataMatrix(), [[0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]]);
        });
    });

    describe('_indexByID should return the index by given id in rows or columns', () => {
        let rows = [{id: 'r1'}, {id: 'r2'}, {id: 'r3'}, {id: 'r4'}, {id: 'r5'}];
        let cols = [{id: 'c1'}, {id: 'c2'}, {id: 'c3'}, {id: 'c4'}, {id: 'c5'}];
        it('should return null if ID is unknown', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.equal(biom._indexByID('c2', true), null);
            assert.equal(biom._indexByID('r1', false), null);
            assert.equal(biom._indexByID('bla', false), null);
            assert.equal(biom._indexByID('', false), null);
        });
        it('should give the correct index in rows', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.equal(biom._indexByID('r2', true), 1);
            assert.equal(biom._indexByID('r1', true), 0);
            assert.equal(biom._indexByID('r4', true), 3);
        });
        it('should give the correct index in columns', () => {
            let biom = new Biom({rows: rows, columns: cols, matrix_type: 'sparse'});
            assert.equal(biom._indexByID('c2', false), 1);
            assert.equal(biom._indexByID('c1', false), 0);
            assert.equal(biom._indexByID('c4', false), 3);
        });
    });

    describe('static sparse2dense should convert a sparse data matrix into a dense data matrix', () => {
        let sparseData = [[1, 1, 5], [2, 1, 13], [4, 3, 1], [0, 0, 9]];
        let shape = [5, 5];
        let denseData = [[9, 0, 0, 0, 0], [0, 5, 0, 0, 0], [0, 13, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0]];
        it('should return data in dense format', () => {
            assert.deepEqual(Biom.sparse2dense(sparseData, shape), denseData);
        });
    });

    describe('static dense2sparse should convert a dense data matrix into a sparse data matrix', () => {
        let denseData = [[9, 0, 0, 0, 0], [0, 5, 0, 0, 0], [0, 13, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0]];
        let sparseData = [[1, 1, 5], [2, 1, 13], [4, 3, 1], [0, 0, 9]];
        it('should return data in sparse format', () => {
            assert.deepEqual(Biom.dense2sparse(denseData).sort(sortByCoord), sparseData.sort(sortByCoord));
        });
    });
});
