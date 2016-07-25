'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

/**
 * Version
 * @type {string} version of this module
 */
var VERSION = exports.VERSION = '0.1.2';

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
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var _ref$id = _ref.id;

        var _id = _ref$id === undefined ? null : _ref$id;

        var _ref$format = _ref.format;

        var _format = _ref$format === undefined ? DEFAULT_BIOM.format : _ref$format;

        var _ref$format_url = _ref.format_url;

        var _format_url = _ref$format_url === undefined ? DEFAULT_BIOM.format_url : _ref$format_url;

        var _ref$type = _ref.type;

        var _type = _ref$type === undefined ? DEFAULT_BIOM.type : _ref$type;

        var _ref$generated_by = _ref.generated_by;

        var _generated_by = _ref$generated_by === undefined ? DEFAULT_BIOM.generated_by : _ref$generated_by;

        var _ref$date = _ref.date;

        var _date = _ref$date === undefined ? null : _ref$date;

        var _ref$rows = _ref.rows;

        var _rows = _ref$rows === undefined ? DEFAULT_BIOM.rows : _ref$rows;

        var _ref$columns = _ref.columns;

        var _columns = _ref$columns === undefined ? DEFAULT_BIOM.columns : _ref$columns;

        var _ref$matrix_type = _ref.matrix_type;

        var _matrix_type = _ref$matrix_type === undefined ? DEFAULT_BIOM.matrix_type : _ref$matrix_type;

        var _ref$matrix_element_t = _ref.matrix_element_type;

        var _matrix_element_type = _ref$matrix_element_t === undefined ? DEFAULT_BIOM.matrix_element_type : _ref$matrix_element_t;

        var _ref$shape = _ref.shape;

        var _shape = _ref$shape === undefined ? DEFAULT_BIOM.shape : _ref$shape;

        var _ref$data = _ref.data;

        var _data = _ref$data === undefined ? DEFAULT_BIOM.data : _ref$data;

        var _ref$comment = _ref.comment;

        var _comment = _ref$comment === undefined ? DEFAULT_BIOM.comment : _ref$comment;

        _classCallCheck(this, Biom);

        this.id = _id;
        this.format = _format;
        this.format_url = _format_url;
        this.type = _type;
        this.generated_by = _generated_by;
        if (_date === null) {
            _date = new Date().toISOString();
        }
        this.date = _date;
        this.rows = _rows;
        this.columns = _columns;
        this.matrix_type = _matrix_type;
        this.matrix_element_type = _matrix_element_type;
        this.shape = _shape;
        this.data = _data;
        this.comment = _comment;
    }

    /**
     * Getter for id
     * @returns {string|null} - A field that can be used to id a table (or null)
     */


    _createClass(Biom, [{
        key: 'getMetadata',


        /**
         * Get specific metadata of rows or columns as array
         * @param _dimension {string} - either "rows" ("observation") or "columns" ("sample"), default: "rows"
         * @param _attribute {string} - the key in the metadata object to extract for each element in "dimension"
         * @throws Error - if attribute is not set
         * @throws Error - if dimension is something other than "rows", "observation", "columns" or "sample"
         * @returns {Array} - containing the metadata of each element in "dimension" with the key "attribute"
         */
        value: function getMetadata() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref2$dimension = _ref2.dimension;

            var _dimension = _ref2$dimension === undefined ? 'rows' : _ref2$dimension;

            var _ref2$attribute = _ref2.attribute;

            var _attribute = _ref2$attribute === undefined ? null : _ref2$attribute;

            var dim_rows = ['rows', 'observation'];
            var dim_cols = ['columns', 'sample'];
            var extractAttribute = function extractAttribute(element) {
                if (element.metadata === null || !(_attribute in element.metadata)) {
                    return null;
                }
                return element.metadata[_attribute];
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
         * @param _attribute {string} - the key in the metadata object to add/set in each element in "dimension"
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
            var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref3$dimension = _ref3.dimension;

            var _dimension = _ref3$dimension === undefined ? 'rows' : _ref3$dimension;

            var _ref3$attribute = _ref3.attribute;

            var _attribute = _ref3$attribute === undefined ? null : _ref3$attribute;

            var _ref3$defaultValue = _ref3.defaultValue;

            var _defaultValue = _ref3$defaultValue === undefined ? null : _ref3$defaultValue;

            var _ref3$values = _ref3.values;

            var _values = _ref3$values === undefined ? null : _ref3$values;

            var dim_rows = ['rows', 'observation'];
            var dim_cols = ['columns', 'sample'];
            var setMetadatum = function setMetadatum(element, value) {
                if (element.metadata === null) {
                    element.metadata = {};
                }
                element.metadata[_attribute] = value;
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
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = dim[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var element = _step.value;

                            if (element.id in _values) {
                                setMetadatum(element, _values[element.id]);
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
            } else if (_defaultValue !== null) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = dim[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _element = _step2.value;

                        setMetadatum(_element, _defaultValue);
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
        }

        /**
         * This method creates a new biom object from a biom string and calls the callback with this object.
         * Version 2 (hdf5) can be converted to version 1 if the url of a conversionServer is given.
         * @param biomString {string} - the biom string to convert to an object
         * @param _conversionServer {string} - url of a biom-conversion-server instance
         *                                     https://github.com/iimog/biom-conversion-server
         * @throws {Error} - if biomString is not valid JSON and no conversionServer is given
         * @throws {Error} - if biomString is JSON that is not compatible with biom specification
         *                   Error will be thrown by the Biom constructor
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
         * @returns {Array} - the number of rows and number of columns in data
         */

    }, {
        key: 'shape',
        get: function get() {
            return this._shape;
        }

        /**
         * Setter for shape
         * @param shape {Array} - the number of rows and number of columns in data
         * @throws {TypeError} if shape is not an Array
         * @throws {Error} if shape contains something other than
         *                 two non-negative integers
         */
        ,
        set: function set(shape) {
            if (Object.prototype.toString.call(shape) !== '[object Array]') {
                throw new TypeError('shape must be an Array containing' + ' exactly two non-negative integers');
            }
            if (shape.length !== 2) {
                throw new Error('shape does not contain exactly two elements');
            }
            if (!Number.isInteger(shape[0]) || shape[0] < 0 || !Number.isInteger(shape[1]) || shape[1] < 0) {
                throw new Error('shape does not contain non-negative integers');
            }
            this._shape = shape;
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
    }], [{
        key: 'parse',
        value: function parse() {
            var biomString = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref4$conversionServe = _ref4.conversionServer;

            var _conversionServer = _ref4$conversionServe === undefined ? null : _ref4$conversionServe;

            var _ref4$arrayBuffer = _ref4.arrayBuffer;

            var _arrayBuffer = _ref4$arrayBuffer === undefined ? null : _ref4$arrayBuffer;

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
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
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
    }]);

    return Biom;
}();