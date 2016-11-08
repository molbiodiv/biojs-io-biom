'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * biojs-io-biom
 * https://github.com/molbiodiv/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

var _ = require('lodash');

/**
 * Version
 * @type {string} version of this module
 */
var VERSION = exports.VERSION = '1.0.4';

/**
 * Default Biom Object for empty initialization
 * @type {{
 * id: null,
 * format: string,
 * format_url: string,
 * type: string,
 * generated_by: string,
 * date: Date,
 * rows: Array,
 * columns: Array,
 * matrix_type: string,
 * matrix_element_type: string,
 * shape: number[],
 * data: Array
 * }}
 */
var DEFAULT_BIOM = exports.DEFAULT_BIOM = {
    id: null,
    format: 'Biological Observation Matrix 1.0.0',
    format_url: 'http://biom-format.org',
    type: 'OTU table',
    generated_by: 'biojs-io-biom v' + VERSION,
    date: null, // will be set to Date.now() in the constructor
    rows: [],
    columns: [],
    matrix_type: 'sparse',
    matrix_element_type: 'float',
    shape: [0, 0],
    data: [],
    comment: null
};

/**
 * Controlled vocabulary for the type field of biom objects
 * @type {string[]}
 */
var TYPE_CV = exports.TYPE_CV = ['OTU table', 'Pathway table', 'Function table', 'Ortholog table', 'Gene table', 'Metabolite table', 'Taxon table'];

/**
 * Controlled vocabulary for the matrix_type field of biom objects
 * @type {string[]}
 */
var MATRIX_TYPE_CV = exports.MATRIX_TYPE_CV = ['sparse', // only non-zero values are specified
'dense' // every element must be specified
];

/**
 * Controlled vocabulary for the matrix_element_type field of biom objects
 * @type {string[]}
 */
var MATRIX_ELEMENT_TYPE_CV = exports.MATRIX_ELEMENT_TYPE_CV = ['int', // integer
'float', // floating point
'unicode' // unicode string
];

var nets = require('nets');
var base64 = require('base64-js');
var textEncoding = require('text-encoding');

/**
 * @class Biom
 */

var Biom = exports.Biom = function () {
    /**
     * constructor
     * @param _id
     * @param _format
     * @param _format_url
     * @param _type
     * @param _generated_by
     * @param _date
     * @param _rows
     * @param _columns
     * @param _matrix_type
     * @param _matrix_element_type
     * @param _shape
     * @param _data
     * @param _comment
     */
    function Biom() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$id = _ref.id,
            _id = _ref$id === undefined ? null : _ref$id,
            _ref$format = _ref.format,
            _format = _ref$format === undefined ? DEFAULT_BIOM.format : _ref$format,
            _ref$format_url = _ref.format_url,
            _format_url = _ref$format_url === undefined ? DEFAULT_BIOM.format_url : _ref$format_url,
            _ref$type = _ref.type,
            _type = _ref$type === undefined ? DEFAULT_BIOM.type : _ref$type,
            _ref$generated_by = _ref.generated_by,
            _generated_by = _ref$generated_by === undefined ? DEFAULT_BIOM.generated_by : _ref$generated_by,
            _ref$date = _ref.date,
            _date = _ref$date === undefined ? null : _ref$date,
            _ref$rows = _ref.rows,
            _rows = _ref$rows === undefined ? DEFAULT_BIOM.rows : _ref$rows,
            _ref$columns = _ref.columns,
            _columns = _ref$columns === undefined ? DEFAULT_BIOM.columns : _ref$columns,
            _ref$matrix_type = _ref.matrix_type,
            _matrix_type = _ref$matrix_type === undefined ? DEFAULT_BIOM.matrix_type : _ref$matrix_type,
            _ref$matrix_element_t = _ref.matrix_element_type,
            _matrix_element_type = _ref$matrix_element_t === undefined ? DEFAULT_BIOM.matrix_element_type : _ref$matrix_element_t,
            _ref$shape = _ref.shape,
            _shape = _ref$shape === undefined ? null : _ref$shape,
            _ref$data = _ref.data,
            _data = _ref$data === undefined ? DEFAULT_BIOM.data : _ref$data,
            _ref$comment = _ref.comment,
            _comment = _ref$comment === undefined ? DEFAULT_BIOM.comment : _ref$comment;

        _classCallCheck(this, Biom);

        this.rows = _rows;
        this._unpackMetadataJSON('rows');
        this.columns = _columns;
        this._unpackMetadataJSON('columns');
        this.matrix_type = _matrix_type;
        this.id = _id;
        this.format = _format;
        this.format_url = _format_url;
        this.type = _type;
        this.generated_by = _generated_by;
        if (_date === null) {
            _date = new Date().toISOString();
        }
        this.date = _date;
        this.matrix_element_type = _matrix_element_type;
        if (_shape !== null) {
            // @throws Error if _shape is not concordant with rows and columns
            this.checkShape(_shape);
        }
        this.data = _data;
        this.comment = _comment;
    }

    /**
     * Getter for id
     * @returns {string|null} - A field that can be used to id a table (or null)
     */


    _createClass(Biom, [{
        key: 'checkShape',


        /**
         * Check if shape is concordant with rows and columns
         * @param shape {Array} - the number of rows and number of columns in data
         * @throws {TypeError} if shape is not an Array
         * @throws {Error} if shape contains something other than
         *                 two non-negative integers
         * @throws {Error} if shape is not concordant with rows and columns
         */
        value: function checkShape(shape) {
            if (Object.prototype.toString.call(shape) !== '[object Array]') {
                throw new TypeError('shape must be an Array containing' + ' exactly two non-negative integers');
            }
            if (shape.length !== 2) {
                throw new Error('shape does not contain exactly two elements');
            }
            if (!Number.isInteger(shape[0]) || shape[0] < 0 || !Number.isInteger(shape[1]) || shape[1] < 0) {
                throw new Error('shape does not contain non-negative integers');
            }
            if (shape[0] !== this.rows.length) {
                throw new Error('First dimension of shape does not match number of rows');
            }
            if (shape[1] !== this.columns.length) {
                throw new Error('Second dimension of shape does not match number of columns');
            }
        }

        /**
         * Getter for data
         * @returns {Array} - counts of observations by sample
         *                   if matrix_type is 'sparse', [[row, column, value],
         *                                                 [row, column, value],
         *                                                                  ...]
         *                   if matrix_type is 'dense', [[value, value, value, ...],
         *                                               [value, value, value, ...],
         *                                                                      ...]
         */

    }, {
        key: '_unpackMetadataJSON',


        /**
         * Replace JSON strings in metadata with object representations
         * @param {string} dimension columns|rows
         * @private
         */
        value: function _unpackMetadataJSON(dimension) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this[dimension][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var element = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(element.metadata)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var metaKey = _step2.value;

                            if (typeof element.metadata[metaKey] === 'string') {
                                try {
                                    element.metadata[metaKey] = JSON.parse(element.metadata[metaKey]);
                                } catch (e) {}
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Returns the JSON string representation of the biom-format version 1 fields.
         * This can be used as a synchronous alternative to write if JSON is desired.
         * @return {string} biomJson
         */

    }, {
        key: 'toString',
        value: function toString() {
            var biomCopy = _.cloneDeep({
                id: this.id,
                format: this.format,
                format_url: this.format_url,
                type: this.type,
                generated_by: this.generated_by,
                date: this.date,
                rows: this.rows,
                columns: this.columns,
                matrix_type: this.matrix_type,
                matrix_element_type: this.matrix_element_type,
                shape: this.shape,
                data: this.data,
                comment: this.comment
            });
            var convertMetadataObjectsToString = function convertMetadataObjectsToString(biom, dimension) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = biomCopy[dimension][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var element = _step3.value;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = Object.keys(element.metadata)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var metaKey = _step4.value;

                                if (_typeof(element.metadata[metaKey]) === 'object' && Object.prototype.toString.call(element.metadata[metaKey]) !== '[object Array]') {
                                    element.metadata[metaKey] = JSON.stringify(element.metadata[metaKey]);
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            };
            convertMetadataObjectsToString(biomCopy, 'rows');
            convertMetadataObjectsToString(biomCopy, 'columns');
            var biomJson = JSON.stringify(biomCopy);
            return biomJson;
        }

        /**
         * Get specific metadata of rows or columns as array
         * @param _dimension {string} - either "rows" ("observation") or "columns" ("sample"), default: "rows"
         * @param _attribute {string|string[]} - the path in the metadata object to extract for each element in "dimension"
         *                                       this is used as path for the lodash get function (https://lodash.com/docs/4.16.6#get)
         *                                       so a string with dots is interpreted as a path ('a.b.c' is equivalent to ['a','b','c']
         * @throws Error - if attribute is not set
         * @throws Error - if dimension is something other than "rows", "observation", "columns" or "sample"
         * @returns {Array} - containing the metadata of each element in "dimension" with the key "attribute"
         */

    }, {
        key: 'getMetadata',
        value: function getMetadata() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref2$dimension = _ref2.dimension,
                _dimension = _ref2$dimension === undefined ? 'rows' : _ref2$dimension,
                _ref2$attribute = _ref2.attribute,
                _attribute = _ref2$attribute === undefined ? null : _ref2$attribute;

            var dim_rows = ['rows', 'observation'];
            var dim_cols = ['columns', 'sample'];
            var extractAttribute = function extractAttribute(element) {
                return _.get(element.metadata, _attribute, null);
            };
            var result = void 0;
            if (_attribute === null) {
                throw new Error('Missing argument: attribute');
            }
            if (dim_rows.indexOf(_dimension) !== -1) {
                result = this.rows.map(extractAttribute);
            } else if (dim_cols.indexOf(_dimension) !== -1) {
                result = this.columns.map(extractAttribute);
            } else {
                throw new Error('dimension has to be one of "rows", "observation", "columns" or "sample"');
            }
            return result;
        }

        /**
         * Add specific metadata to rows or columns
         * @param _dimension {string} - either "rows" ("observation") or "columns" ("sample"), default: "rows"
         * @param _attribute {string|string[]} - the path in the metadata object to add/set in each element in "dimension"
         *                                       this is used as path for the lodash set function (https://lodash.com/docs/4.16.6#set)
         *                                       so a string with dots is interpreted as a path ('a.b.c' is equivalent to ['a','b','c']
         * @param _defaultValue {*} - the metadata "attribute" is set to this value on each element in "dimension"
         * @param _values {Object|Array} - if Array has to have same length as "dimension" and contain the values to set
         *                                 if Object keys have to be ids in the "dimension"
         * @throws Error - if attribute is not set
         * @throws Error - if dimension is something other than "rows", "observation", "columns" or "sample"
         * @throws Error - if values is set and has the wrong length
         * @throws Error - if both defaultValue and values are set
         */

    }, {
        key: 'addMetadata',
        value: function addMetadata() {
            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref3$dimension = _ref3.dimension,
                _dimension = _ref3$dimension === undefined ? 'rows' : _ref3$dimension,
                _ref3$attribute = _ref3.attribute,
                _attribute = _ref3$attribute === undefined ? null : _ref3$attribute,
                _ref3$defaultValue = _ref3.defaultValue,
                _defaultValue = _ref3$defaultValue === undefined ? null : _ref3$defaultValue,
                _ref3$values = _ref3.values,
                _values = _ref3$values === undefined ? null : _ref3$values;

            var dim_rows = ['rows', 'observation'];
            var dim_cols = ['columns', 'sample'];
            var setMetadatum = function setMetadatum(element, value) {
                _.set(element.metadata, _attribute, value);
            };
            if (_attribute === null) {
                throw new Error('Missing argument: attribute');
            }
            var dim = void 0;
            if (dim_rows.indexOf(_dimension) !== -1) {
                dim = this.rows;
            } else if (dim_cols.indexOf(_dimension) !== -1) {
                dim = this.columns;
            } else {
                throw new Error('dimension has to be one of "rows", "observation", "columns" or "sample"');
            }
            if (_defaultValue !== null && _values !== null) {
                throw new Error('please set only one of "defaultValue" and "values", not both');
            }
            if (_defaultValue === null && _values === null) {
                throw new Error('Missing argument: please set one of "defaultValue" or "values"');
            }
            if (_values !== null) {
                if ((typeof _values === 'undefined' ? 'undefined' : _typeof(_values)) !== 'object') {
                    throw new Error('"values" has to be an array or object');
                }
                if (Object.prototype.toString.call(_values) === '[object Array]') {
                    if (_values.length !== dim.length) {
                        throw new Error('values is an array but has wrong number of elements');
                    }
                    for (var i = 0; i < _values.length; i++) {
                        setMetadatum(dim[i], _values[i]);
                    }
                } else {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = dim[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var element = _step5.value;

                            if (element.id in _values) {
                                setMetadatum(element, _values[element.id]);
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            } else if (_defaultValue !== null) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = dim[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _element = _step6.value;

                        setMetadatum(_element, _defaultValue);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }
        }

        /**
         * Get data for a specific row and column (independent of matrix_type)
         * @param rowID {string} - the id of the desired row
         * @param colID {string} - the id of the desired column
         * @throws Error - if rowID is unknown
         * @throws Error - if colID is unknown
         * @return number - entry in the data matrix at the given position
         */

    }, {
        key: 'getDataAt',
        value: function getDataAt(rowID, colID) {
            var rowIndex = this._indexByID(rowID, true);
            if (rowIndex === null) {
                throw new Error('unknown rowID: ' + rowID);
            }
            var colIndex = this._indexByID(colID, false);
            if (colIndex === null) {
                throw new Error('unknown colID: ' + colID);
            }
            if (this.matrix_type === 'dense') {
                return this.data[rowIndex][colIndex];
            } else if (this.matrix_type === 'sparse') {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var entry = _step7.value;

                        if (entry[0] === rowIndex && entry[1] === colIndex) {
                            return entry[2];
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            }
            return 0;
        }

        /**
         * Set data for a specific row and column (independent of matrix_type)
         * @param rowID {string} - the id of the desired row
         * @param colID {string} - the id of the desired column
         * @param value {number} - the value to set at the specified position
         * @throws Error - if rowID is unknown
         * @throws Error - if colID is unknown
         */

    }, {
        key: 'setDataAt',
        value: function setDataAt(rowID, colID, value) {
            var rowIndex = this._indexByID(rowID, true);
            if (rowIndex === null) {
                throw new Error('unknown rowID: ' + rowID);
            }
            var colIndex = this._indexByID(colID, false);
            if (colIndex === null) {
                throw new Error('unknown colID: ' + colID);
            }
            if (this.matrix_type === 'dense') {
                this.data[rowIndex][colIndex] = value;
            } else if (this.matrix_type === 'sparse') {
                var update = false;
                var toRemove = -1;
                for (var i = 0; i < this.data.length; i++) {
                    var entry = this.data[i];
                    if (entry[0] === rowIndex && entry[1] === colIndex) {
                        if (value === 0) {
                            toRemove = i;
                        } else {
                            entry[2] = value;
                        }
                        update = true;
                    }
                }
                if (!update) {
                    this.data.push([rowIndex, colIndex, value]);
                }
                if (toRemove !== -1) {
                    this.data.splice(toRemove, 1);
                }
            }
        }

        /**
         * Get data for a specific row (independent of matrix_type)
         * @param rowID {string} - the id of the desired row
         * @throws Error - if rowID is unknown
         * @return Array - array of entries in the given row of the data matrix
         */

    }, {
        key: 'getDataRow',
        value: function getDataRow(rowID) {
            var rowIndex = this._indexByID(rowID, true);
            if (rowIndex === null) {
                throw new Error('unknown rowID: ' + rowID);
            }
            if (this.matrix_type === 'dense') {
                return this.data[rowIndex];
            } else if (this.matrix_type === 'sparse') {
                var row = Array(this.shape[1]).fill(0);
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var entry = _step8.value;

                        if (entry[0] === rowIndex) {
                            row[entry[1]] = entry[2];
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                return row;
            }
        }

        /**
         * Set data for a specific row (independent of matrix_type)
         * @param rowID {string} - the id of the desired row
         * @param values {Array} - the array of new values to set for the specified row
         * @throws Error - if rowID is unknown
         * @throws Error - if values length does not equal the number of columns
         */

    }, {
        key: 'setDataRow',
        value: function setDataRow(rowID, values) {
            var rowIndex = this._indexByID(rowID, true);
            if (rowIndex === null) {
                throw new Error('unknown rowID: ' + rowID);
            }
            if (values.length !== this.shape[1]) {
                throw new Error('length of values does not equal the number of columns');
            }
            if (this.matrix_type === 'dense') {
                this.data[rowIndex] = values;
            } else if (this.matrix_type === 'sparse') {
                var update = Array(this.shape[1]).fill(false);
                var toRemove = Array();
                for (var i = 0; i < this.data.length; i++) {
                    var entry = this.data[i];
                    if (entry[0] === rowIndex) {
                        if (values[entry[1]] === 0) {
                            toRemove.push(i);
                        } else {
                            entry[2] = values[entry[1]];
                        }
                        update[entry[1]] = true;
                    }
                }
                // remove positions with big index first - otherwise indices change
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = toRemove.sort(function (a, b) {
                        return b - a;
                    })[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _i2 = _step9.value;

                        this.data.splice(_i2, 1);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                for (var _i = 0; _i < values.length; _i++) {
                    if (!update[_i]) {
                        this.data.push(Array(rowIndex, _i, values[_i]));
                    }
                }
            }
        }

        /**
         * Get data for a specific column (independent of matrix_type)
         * @param colID {string} - the id of the desired column
         * @throws Error - if colID is unknown
         * @return Array - array of entries in the given column of the data matrix
         */

    }, {
        key: 'getDataColumn',
        value: function getDataColumn(colID) {
            var colIndex = this._indexByID(colID, false);
            if (colIndex === null) {
                throw new Error('unknown colID: ' + colID);
            }
            if (this.matrix_type === 'dense') {
                var col = Array();
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = this.data[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var row = _step10.value;

                        col.push(row[colIndex]);
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                return col;
            } else if (this.matrix_type === 'sparse') {
                var _col = Array(this.shape[0]).fill(0);
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = this.data[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var entry = _step11.value;

                        if (entry[1] === colIndex) {
                            _col[entry[0]] = entry[2];
                        }
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }

                return _col;
            }
        }

        /**
         * Set data for a specific column (independent of matrix_type)
         * @param colID {string} - the id of the desired column
         * @param values {Array} - the array of new values to set for the specified column
         * @throws Error - if colID is unknown
         * @throws Error - if values length does not equal the number of rows
         */

    }, {
        key: 'setDataColumn',
        value: function setDataColumn(colID, values) {
            var colIndex = this._indexByID(colID, false);
            if (colIndex === null) {
                throw new Error('unknown colID: ' + colID);
            }
            if (values.length !== this.shape[0]) {
                throw new Error('length of values does not equal the number of rows');
            }
            if (this.matrix_type === 'dense') {
                for (var i = 0; i < this.data.length; i++) {
                    var row = this.data[i];
                    row[colIndex] = values[i];
                }
            } else if (this.matrix_type === 'sparse') {
                var update = Array(this.shape[0]).fill(false);
                var toRemove = Array();
                for (var _i3 = 0; _i3 < this.data.length; _i3++) {
                    var entry = this.data[_i3];
                    if (entry[1] === colIndex) {
                        if (values[entry[0]] === 0) {
                            toRemove.push(_i3);
                        } else {
                            entry[2] = values[entry[0]];
                        }
                        update[entry[0]] = true;
                    }
                }
                // remove positions with big index first - otherwise indices change
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = toRemove.sort(function (a, b) {
                        return b - a;
                    })[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var _i5 = _step12.value;

                        this.data.splice(_i5, 1);
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }
                    } finally {
                        if (_didIteratorError12) {
                            throw _iteratorError12;
                        }
                    }
                }

                for (var _i4 = 0; _i4 < values.length; _i4++) {
                    if (!update[_i4]) {
                        this.data.push(Array(_i4, colIndex, values[_i4]));
                    }
                }
            }
        }

        /**
         * Get full data in dense format (independent of matrix_type)
         * @return Array - array of arrays containing the full data matrix in dense format
         */

    }, {
        key: 'getDataMatrix',
        value: function getDataMatrix() {
            if (this.matrix_type === 'dense') {
                return this.data;
            } else if (this.matrix_type === 'sparse') {
                return this.constructor.sparse2dense(this.data, this.shape);
            }
        }

        /**
         * Set full data in dense format (independent of matrix_type)
         * @param data {Array} - array of arrays containing the full data matrix in dense format
         */

    }, {
        key: 'setDataMatrix',
        value: function setDataMatrix(data) {
            if (this.matrix_type === 'dense') {
                this.data = data;
            } else if (this.matrix_type === 'sparse') {
                this.data = this.constructor.dense2sparse(data);
            }
        }

        /**
         * Get row/column index of a given id, returns null for unknown id
         * This function is meant for internal use
         * @param id {string} - the id of the desired row/column
         * @param inRow {boolean} - search in rows (true) or columns (false)
         * @return {int|null} - the index of the row/column with given id or null if unknown
         */

    }, {
        key: '_indexByID',
        value: function _indexByID(id) {
            var inRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var a = this.columns;
            if (inRow) {
                a = this.rows;
            }
            for (var i = 0; i < a.length; i++) {
                if (a[i].id === id) {
                    return i;
                }
            }
            return null;
        }

        /**
         * This method creates a string or ArrayBuffer representation of the biom object.
         * Version 2 (hdf5) can be generated by providing the url of a conversionServer and passing asHdf5.
         * @param _conversionServer {string} - url of a biom-conversion-server instance
         *                                     https://github.com/molbiodiv/biom-conversion-server
         *                                     In order to use it you have to set asHdf5 to true
         * @param _asHdf5 {boolean} - instead of a biomString a raw ArrayBuffer is returned
         *                            in order to work a valid conversionServer url has to be set
         * @throws {Error} - if hdf5 is requested but no conversionServer is given
         * @throws {Error} - if there is a conversion error (conversionServer not reachable, conversionServer returns error)
         * @returns Promise - a promise that is fulfilled when the string or ArrayBuffer has been created
         *                              or rejected if an error occurs on the way.
         */

    }, {
        key: 'write',
        value: function write() {
            var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref4$conversionServe = _ref4.conversionServer,
                _conversionServer = _ref4$conversionServe === undefined ? null : _ref4$conversionServe,
                _ref4$asHdf = _ref4.asHdf5,
                _asHdf5 = _ref4$asHdf === undefined ? false : _ref4$asHdf;

            var biomJson = this.toString();
            return new Promise(function (resolve, reject) {
                if (_asHdf5) {
                    if (_conversionServer === null) {
                        reject(new Error('asHdf5 is set but no conversionServer is given'));
                    }
                    var b64content = base64.fromByteArray(new Uint8Array(new textEncoding.TextEncoder().encode(biomJson)));
                    nets({
                        body: '{"to": "hdf5", "content": "' + b64content + '"}',
                        url: _conversionServer,
                        encoding: undefined,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, function done(err, resp, body) {
                        if (err !== null) {
                            return reject(new Error('There was an error with the conversion:\n' + err));
                        }
                        var response = body.replace(/\r?\n|\r/g, '');
                        response = JSON.parse(response);
                        if (response.error !== null) {
                            return reject(new Error('There was an error with the conversion:\n' + response.error));
                        }
                        var arrayBuffer = base64.toByteArray(response.content).buffer;
                        return resolve(arrayBuffer);
                    });
                } else {
                    resolve(biomJson);
                }
            });
        }

        /**
         * This method creates a new biom object from a biom string and calls the callback with this object.
         * Version 2 (hdf5) can be converted to version 1 if the url of a conversionServer is given.
         * @param biomString {string} - the biom string to convert to an object
         * @param _conversionServer {string} - url of a biom-conversion-server instance
         *                                     https://github.com/molbiodiv/biom-conversion-server
         * @param _arrayBuffer {ArrayBuffer} - instead of a biomString a raw ArrayBuffer as returned by
         *                                     FileReader.readAsArrayBuffer() can be given
         *                                     (only used if biomString is not valid json)
         *                                     For hdf5 files it is recommended to use this method rather than readAsText
         * @throws {Error} - if biomString is not valid JSON and no conversionServer is given
         * @throws {Error} - if biomString is JSON that is not compatible with biom specification
         *                   Error will be thrown by the Biom constructor
         * @throws {Error} - if there is a conversion error (conversionServer not reachable, conversionServer returns error)
         * @returns promise {Promise} - a promise that is fulfilled when the new Biom object has been created
         *                              or rejected if an error occurs on the way.
         */

    }, {
        key: 'id',
        get: function get() {
            return this._id;
        }

        /**
         * Setter for id
         * @param id {string|null} - A field that can be used to id a table
         * @throws {TypeError} if id is not a string (or null)
         */
        ,
        set: function set(id) {
            if (id !== null && typeof id !== 'string') {
                throw new TypeError('id must be string or null');
            }
            this._id = id;
        }

        /**
         * Getter for format
         * @returns {string} - The name and version of the current biom format
         */

    }, {
        key: 'format',
        get: function get() {
            return this._format;
        }

        /**
         * Setter for format
         * @param format {string} - The name and version of the current biom format
         * @throws {TypeError} if format is not a string
         */
        ,
        set: function set(format) {
            if (typeof format !== 'string') {
                throw new TypeError('format must be string');
            }
            this._format = format;
        }

        /**
         * Getter for format_url
         * @returns {string} - A string with a static URL providing format details
         */

    }, {
        key: 'format_url',
        get: function get() {
            return this._format_url;
        }

        /**
         * Setter for format_url
         * @param format_url {string} - A string with a static URL
         *                              providing format details
         *                              (not checked whether the string is an url)
         * @throws {TypeError} if format_url is not a string
         */
        ,
        set: function set(format_url) {
            if (typeof format_url !== 'string') {
                throw new TypeError('format_url must be string' + ' (representing a static URL)');
            }
            this._format_url = format_url;
        }

        /**
         * Getter for type
         * @returns {string} - Table type (a controlled vocabulary)
         *                     Acceptable values:
         *                       'OTU table'
         *                       'Pathway table'
         *                       'Function table'
         *                       'Ortholog table'
         *                       'Gene table'
         *                       'Metabolite table'
         *                       'Taxon table'
         */

    }, {
        key: 'type',
        get: function get() {
            return this._type;
        }

        /**
         * Setter for type
         * @param type {string} - Table type (a controlled vocabulary)
         *                        Acceptable values:
         *                          'OTU table'
         *                          'Pathway table'
         *                          'Function table'
         *                          'Ortholog table'
         *                          'Gene table'
         *                          'Metabolite table'
         *                          'Taxon table'
         * @throws {TypeError} if type is not a string
         * @throws {Error} if type is not in the controlled vocabulary
         */
        ,
        set: function set(type) {
            if (typeof type !== 'string') {
                throw new TypeError('type must be string' + ' (part of the controlled vocabulary)');
            }
            if (TYPE_CV.indexOf(type) === -1) {
                throw new Error('type must be part of the controlled vocabulary');
            }
            this._type = type;
        }

        /**
         * Getter for generated_by
         * @returns {string} - Package and revision that built the table
         */

    }, {
        key: 'generated_by',
        get: function get() {
            return this._generated_by;
        }

        /**
         * Setter for generated_by
         * @param generated_by {string} - Package and revision that built the table
         * @throws {TypeError} if generated_by is not a string
         */
        ,
        set: function set(generated_by) {
            if (typeof generated_by !== 'string') {
                throw new TypeError('generated_by must be string');
            }
            this._generated_by = generated_by;
        }

        /**
         * Getter for date
         * @returns {string} - Date the table was built (ISO 8601 format)
         */

    }, {
        key: 'date',
        get: function get() {
            return this._date;
        }

        /**
         * Setter for date
         * @param date {string} - Date the table was built (ISO 8601 format)
         *                       (not checked whether the string is a date)
         * @throws {TypeError} if date is not a string
         */
        ,
        set: function set(date) {
            if (typeof date !== 'string') {
                throw new TypeError('date must be string (ISO 8601 format)');
            }
            this._date = date;
        }

        /**
         * Getter for rows
         * @returns {Array} - An ORDERED list of obj describing the rows
         */

    }, {
        key: 'rows',
        get: function get() {
            return this._rows;
        }

        /**
         * Setter for rows
         * @param rows {Array} - An ORDERED list of obj describing the rows
         * @throws {TypeError} if date is not an Array
         */
        ,
        set: function set(rows) {
            if (Object.prototype.toString.call(rows) !== '[object Array]') {
                throw new TypeError('rows must be an Array');
            }
            var new_id_dict = {};
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (typeof row.id === 'undefined') {
                    throw new TypeError('every row has to have an id');
                }
                if (typeof row.metadata === 'undefined' || row.metadata === null) {
                    row.metadata = {};
                }
                if (typeof new_id_dict[row.id] !== 'undefined') {
                    throw new Error('duplicate row id: ' + row.id);
                }
                new_id_dict[row.id] = i;
            }
            // update old data according to new rows (unless in constructor)
            if (typeof this.data !== 'undefined') {
                var new_data = Array();
                var old_rows = this.rows;
                var old_id_dict = {};
                for (var _i6 = 0; _i6 < old_rows.length; _i6++) {
                    old_id_dict[old_rows[_i6].id] = _i6;
                }
                if (this.matrix_type === 'dense') {
                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        for (var _iterator13 = rows[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var _row = _step13.value;

                            var new_row = Array(this.shape[1]).fill(0);
                            if (typeof old_id_dict[_row.id] !== 'undefined') {
                                new_row = this.data[old_id_dict[_row.id]];
                            }
                            new_data.push(new_row);
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                _iterator13.return();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }

                    this._rows = rows;
                    this.data = new_data;
                } else if (this.matrix_type === 'sparse') {
                    var _iteratorNormalCompletion14 = true;
                    var _didIteratorError14 = false;
                    var _iteratorError14 = undefined;

                    try {
                        for (var _iterator14 = this.data[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                            var entry = _step14.value;

                            var newPos = new_id_dict[old_rows[entry[0]].id];
                            if (typeof newPos !== 'undefined') {
                                new_data.push(new Array(newPos, entry[1], entry[2]));
                            }
                        }
                    } catch (err) {
                        _didIteratorError14 = true;
                        _iteratorError14 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                _iterator14.return();
                            }
                        } finally {
                            if (_didIteratorError14) {
                                throw _iteratorError14;
                            }
                        }
                    }

                    this._rows = rows;
                    this.data = new_data;
                }
            }
            this._rows = rows;
        }

        /**
         * Getter for columns
         * @returns {Array} - An ORDERED list of obj describing the columns
         */

    }, {
        key: 'columns',
        get: function get() {
            return this._columns;
        }

        /**
         * Setter for columns
         * @param columns {Array} - An ORDERED list of obj describing the columns
         * @throws {TypeError} if date is not an Array
         */
        ,
        set: function set(columns) {
            if (Object.prototype.toString.call(columns) !== '[object Array]') {
                throw new TypeError('columns must be an Array');
            }
            var new_id_dict = {};
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                if (typeof col.id === 'undefined') {
                    throw new TypeError('every column has to have an id');
                }
                if (typeof col.metadata === 'undefined' || col.metadata === null) {
                    col.metadata = {};
                }
                if (typeof new_id_dict[col.id] !== 'undefined') {
                    throw new Error('duplicate column id: ' + col.id);
                }
                new_id_dict[col.id] = i;
            }
            // update old data according to new columns (unless in constructor)
            if (typeof this.data !== 'undefined') {
                var new_data = Array();
                var old_cols = this.columns;
                var old_id_dict = {};
                for (var _i7 = 0; _i7 < old_cols.length; _i7++) {
                    old_id_dict[old_cols[_i7].id] = _i7;
                }
                if (this.matrix_type === 'dense') {
                    var _iteratorNormalCompletion15 = true;
                    var _didIteratorError15 = false;
                    var _iteratorError15 = undefined;

                    try {
                        for (var _iterator15 = this.data[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                            var row = _step15.value;

                            var new_row = Array();
                            for (var _i8 = 0; _i8 < columns.length; _i8++) {
                                var oldPos = old_id_dict[columns[_i8].id];
                                if (typeof oldPos === 'undefined') {
                                    new_row.push(0);
                                } else {
                                    new_row.push(row[oldPos]);
                                }
                            }
                            new_data.push(new_row);
                        }
                    } catch (err) {
                        _didIteratorError15 = true;
                        _iteratorError15 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion15 && _iterator15.return) {
                                _iterator15.return();
                            }
                        } finally {
                            if (_didIteratorError15) {
                                throw _iteratorError15;
                            }
                        }
                    }

                    this._columns = columns;
                    this.data = new_data;
                } else if (this.matrix_type === 'sparse') {
                    var _iteratorNormalCompletion16 = true;
                    var _didIteratorError16 = false;
                    var _iteratorError16 = undefined;

                    try {
                        for (var _iterator16 = this.data[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                            var entry = _step16.value;

                            var newPos = new_id_dict[old_cols[entry[1]].id];
                            if (typeof newPos !== 'undefined') {
                                new_data.push(new Array(entry[0], newPos, entry[2]));
                            }
                        }
                    } catch (err) {
                        _didIteratorError16 = true;
                        _iteratorError16 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion16 && _iterator16.return) {
                                _iterator16.return();
                            }
                        } finally {
                            if (_didIteratorError16) {
                                throw _iteratorError16;
                            }
                        }
                    }

                    this._columns = columns;
                    this.data = new_data;
                }
            }
            this._columns = columns;
        }

        /**
         * Getter for matrix_type
         * @returns {string} - Type of matrix data representation
         *                     (a controlled vocabulary) Acceptable values:
         *                       'sparse' : only non-zero values are specified
         *                       'dense' : every element must be specified
         */

    }, {
        key: 'matrix_type',
        get: function get() {
            return this._matrix_type;
        }

        /**
         * Setter for matrix_type
         * Will update internal representation of 'data' to new type
         * @param matrix_type {string} - Type of matrix data representation
         *                               (a controlled vocabulary)
         *                               Acceptable values:
         *                             'sparse' : only non-zero values are specified
         *                             'dense' : every element must be specified
         * @throws {TypeError} if matrix_type is not a string
         * @throws {Error} if matrix_type is not in the controlled vocabulary
         */
        ,
        set: function set(matrix_type) {
            if (typeof matrix_type !== 'string') {
                throw new TypeError('matrix_type must be string' + ' (part of the controlled vocabulary: "dense" or "sparse")');
            }
            if (MATRIX_TYPE_CV.indexOf(matrix_type) === -1) {
                throw new Error('matrix_type must be part of the' + ' controlled vocabulary: "dense" or "sparse"');
            }
            // transform data if required
            if (typeof this.matrix_type !== 'undefined' && this.matrix_type !== matrix_type) {
                if (matrix_type === 'dense') {
                    this._matrix_type = matrix_type;
                    this.data = this.constructor.sparse2dense(this.data, this.shape);
                } else if (matrix_type === 'sparse') {
                    this._matrix_type = matrix_type;
                    this.data = this.constructor.dense2sparse(this.data);
                }
            }
            this._matrix_type = matrix_type;
        }

        /**
         * Getter for matrix_element_type
         * @returns {string} - Value type in matrix (a controlled vocabulary)
         *                     Acceptable values:
         *                       'int' : integer
         *                       'float' : floating point
         *                       'unicode' : unicode string
         */

    }, {
        key: 'matrix_element_type',
        get: function get() {
            return this._matrix_element_type;
        }

        /**
         * Setter for matrix_element_type
         * @param matrix_element_type {string} - Value type in matrix
         *                               (a controlled vocabulary)
         *                               Acceptable values:
         *                                 'int' : integer
         *                                 'float' : floating point
         *                                 'unicode' : unicode string
         * @throws {TypeError} if matrix_element_type is not a string
         * @throws {Error} if matrix_element_type is not in controlled vocabulary
         */
        ,
        set: function set(matrix_element_type) {
            if (typeof matrix_element_type !== 'string') {
                throw new TypeError('matrix_element_type must be string' + ' (part of the controlled vocabulary:' + ' "int", "float" or "unicode")');
            }
            if (MATRIX_ELEMENT_TYPE_CV.indexOf(matrix_element_type) === -1) {
                throw new Error('matrix_element_type must be part of the' + ' controlled vocabulary: "int", "float" or "unicode"');
            }
            this._matrix_element_type = matrix_element_type;
        }

        /**
         * Getter for shape
         * read-only trying to set shape will fail. If shape is set in the constructor it is checked for validity.
         * @returns {Array} - the number of rows and number of columns in data
         */

    }, {
        key: 'shape',
        get: function get() {
            return [this.rows.length, this.columns.length];
        }
    }, {
        key: 'data',
        get: function get() {
            return this._data;
        }

        /**
         * Setter for data
         * @param data {Array} - counts of observations by sample
         *                   if matrix_type is 'sparse', [[row, column, value],
         *                                                 [row, column, value],
         *                                                                  ...]
         *                   if matrix_type is 'dense', [[value, value, value, ...],
         *                                               [value, value, value, ...],
         *                                                                      ...]
         * @throws {TypeError} if date is not an Array
         */
        ,
        set: function set(data) {
            if (Object.prototype.toString.call(data) !== '[object Array]') {
                throw new TypeError('data must be an Array');
            }
            if (this.matrix_type === 'dense') {
                if (data.length !== this.shape[0]) {
                    throw new Error('This data matrix has wrong number of rows (dense).');
                }
                var _iteratorNormalCompletion17 = true;
                var _didIteratorError17 = false;
                var _iteratorError17 = undefined;

                try {
                    for (var _iterator17 = data[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                        var row = _step17.value;

                        var cols = this.shape[1];
                        if (row.length !== cols) {
                            throw new Error('This data matrix has wrong number of cols in at least one row (dense).');
                        }
                    }
                } catch (err) {
                    _didIteratorError17 = true;
                    _iteratorError17 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion17 && _iterator17.return) {
                            _iterator17.return();
                        }
                    } finally {
                        if (_didIteratorError17) {
                            throw _iteratorError17;
                        }
                    }
                }
            } else if (this.matrix_type === 'sparse') {
                var shape = this.shape;
                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                    for (var _iterator18 = data[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                        var entry = _step18.value;

                        if (entry[0] >= shape[0] || entry[1] >= shape[1]) {
                            throw new Error('This data matrix has out of bounds value (sparse): ' + entry[0] + ',' + entry[0]);
                        }
                    }
                } catch (err) {
                    _didIteratorError18 = true;
                    _iteratorError18 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
                            _iterator18.return();
                        }
                    } finally {
                        if (_didIteratorError18) {
                            throw _iteratorError18;
                        }
                    }
                }
            }
            this._data = data;
        }

        /**
         * Getter for comment
         * @returns {string|null} - A free text field containing any information that
         *                     you feel is relevant (or just feel like sharing)
         */

    }, {
        key: 'comment',
        get: function get() {
            return this._comment;
        }

        /**
         * Setter for comment
         * @param comment {string|null} - A free text field containing any information
         *                        that you feel is relevant (or just feel like sharing)
         * @throws {TypeError} if comment is not a string (or null)
         */
        ,
        set: function set(comment) {
            if (comment !== null && typeof comment !== 'string') {
                throw new TypeError('comment must be string or null');
            }
            this._comment = comment;
        }

        /**
         * Getter for nnz
         * This property is read-only, attempts to set it will result in a TypeError
         * @returns {number} - Number of non-zero elements in data
         */

    }, {
        key: 'nnz',
        get: function get() {
            var nnz = 0;
            if (this.matrix_type === 'sparse') {
                return this.data.length;
            } else if (this.matrix_type === 'dense') {
                var _iteratorNormalCompletion19 = true;
                var _didIteratorError19 = false;
                var _iteratorError19 = undefined;

                try {
                    for (var _iterator19 = this.data[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                        var row = _step19.value;
                        var _iteratorNormalCompletion20 = true;
                        var _didIteratorError20 = false;
                        var _iteratorError20 = undefined;

                        try {
                            for (var _iterator20 = row[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                                var elem = _step20.value;

                                if (elem !== 0) {
                                    nnz++;
                                }
                            }
                        } catch (err) {
                            _didIteratorError20 = true;
                            _iteratorError20 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion20 && _iterator20.return) {
                                    _iterator20.return();
                                }
                            } finally {
                                if (_didIteratorError20) {
                                    throw _iteratorError20;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError19 = true;
                    _iteratorError19 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
                            _iterator19.return();
                        }
                    } finally {
                        if (_didIteratorError19) {
                            throw _iteratorError19;
                        }
                    }
                }
            }
            return nnz;
        }
    }], [{
        key: 'parse',
        value: function parse() {
            var biomString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref5$conversionServe = _ref5.conversionServer,
                _conversionServer = _ref5$conversionServe === undefined ? null : _ref5$conversionServe,
                _ref5$arrayBuffer = _ref5.arrayBuffer,
                _arrayBuffer = _ref5$arrayBuffer === undefined ? null : _ref5$arrayBuffer;

            return new Promise(function (resolve, reject) {
                // can only handle json if no conversion server is given
                if (_arrayBuffer !== null) {
                    biomString = new textEncoding.TextDecoder().decode(_arrayBuffer);
                }
                var json_obj = void 0;
                try {
                    json_obj = JSON.parse(biomString);
                    return resolve(new Biom(json_obj));
                } catch (e) {
                    if (_conversionServer === null) {
                        return reject(new Error('The given biomString is not in json format and no conversion server is specified.\n' + e.message));
                    }
                    var b64content = base64.fromByteArray(new Uint8Array(new textEncoding.TextEncoder().encode(biomString)));
                    if (_arrayBuffer !== null) {
                        b64content = base64.fromByteArray(new Uint8Array(_arrayBuffer));
                    }
                    nets({
                        body: '{"to": "json", "content": "' + b64content + '"}',
                        url: _conversionServer,
                        encoding: undefined,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, function done(err, resp, body) {
                        if (err !== null) {
                            return reject(new Error('There was an error with the conversion:\n' + err));
                        }
                        var response = body.replace(/\r?\n|\r/g, '');
                        response = JSON.parse(response);
                        if (response.error !== null) {
                            return reject(new Error('There was an error with the conversion:\n' + response.error));
                        }
                        json_obj = JSON.parse(new textEncoding.TextDecoder().decode(base64.toByteArray(response.content)));
                        return resolve(new Biom(json_obj));
                    });
                }
            });
        }

        /**
         * Convert a sparse data matrix into a dense one
         * @param data - the sparse data matrix
         * @param shape - the desired shape of the dense matrix
         * @return {Array} - array of arrays containing data in dense format
         */

    }, {
        key: 'sparse2dense',
        value: function sparse2dense(data, shape) {
            // create data array of given shape with only 0
            var denseData = Array(shape[0]).fill().map(function () {
                return Array(shape[1]).fill(0);
            });
            // fill in the non-zero values
            var _iteratorNormalCompletion21 = true;
            var _didIteratorError21 = false;
            var _iteratorError21 = undefined;

            try {
                for (var _iterator21 = data[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                    var d = _step21.value;

                    denseData[d[0]][d[1]] = d[2];
                }
            } catch (err) {
                _didIteratorError21 = true;
                _iteratorError21 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion21 && _iterator21.return) {
                        _iterator21.return();
                    }
                } finally {
                    if (_didIteratorError21) {
                        throw _iteratorError21;
                    }
                }
            }

            return denseData;
        }

        /**
         * Convert a dense data matrix into a sparse one
         * @param data - the dense data matrix
         * @return {Array} - array of arrays containing data in sparse format
         */

    }, {
        key: 'dense2sparse',
        value: function dense2sparse(data) {
            var sparseData = Array();
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    if (data[i][j] !== 0) {
                        sparseData.push([i, j, data[i][j]]);
                    }
                }
            }
            return sparseData;
        }
    }]);

    return Biom;
}();