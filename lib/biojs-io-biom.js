'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
var VERSION = exports.VERSION = '0.1.0';

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
    data: []
};

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

        var _date = _ref$date === undefined ? Date.now() : _ref$date;

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

        _classCallCheck(this, Biom);

        this.id = _id;
        this._format = _format;
        this._format_url = _format_url;
        this._type = _type;
        this._generated_by = _generated_by;
        this._date = _date;
        this._rows = _rows;
        this._columns = _columns;
        this._matrix_type = _matrix_type;
        this._matrix_element_type = _matrix_element_type;
        this._shape = _shape;
        this._data = _data;
    }

    /**
     * Getter for id
     * @returns {string} - A field that can be used to id a table (or null)
     */


    _createClass(Biom, [{
        key: 'id',
        get: function get() {
            return this._id;
        }

        /**
         * Setter for id
         * @param id {string} - Update id to string or null
         */
        ,
        set: function set(id) {
            if (id !== null && typeof id !== "string") {
                throw new TypeError("id must be string or null");
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
         * Getter for format_url
         * @returns {string} - A string with a static URL providing format details
         */

    }, {
        key: 'format_url',
        get: function get() {
            return this._format_url;
        }

        /**
         * Getter for type
         * @returns {string} - Table type (a controlled vocabulary)
         *                     Acceptable values:
         *                       "OTU table"
         *                       "Pathway table"
         *                       "Function table"
         *                       "Ortholog table"
         *                       "Gene table"
         *                       "Metabolite table"
         *                       "Taxon table"
         */

    }, {
        key: 'type',
        get: function get() {
            return this._type;
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
         * Getter for date
         * @returns {Date} - Date the table was built (ISO 8601 format)
         */

    }, {
        key: 'date',
        get: function get() {
            return this._date;
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
         * Getter for columns
         * @returns {Array} - An ORDERED list of obj describing the columns
         */

    }, {
        key: 'columns',
        get: function get() {
            return this._columns;
        }

        /**
         * Getter for matrix_type
         * @returns {string} - Type of matrix data representation
         *                     (a controlled vocabulary) Acceptable values:
         *                       "sparse" : only non-zero values are specified
         *                       "dense" : every element must be specified
         */

    }, {
        key: 'matrix_type',
        get: function get() {
            return this._matrix_type;
        }

        /**
         * Getter for matrix_element_type
         * @returns {string} - Value type in matrix (a controlled vocabulary)
         *                     Acceptable values:
         *                       "int" : integer
         *                       "float" : floating point
         *                       "unicode" : unicode string
         */

    }, {
        key: 'matrix_element_type',
        get: function get() {
            return this._matrix_element_type;
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
         * Getter for data
         * @returns {Array} - counts of observations by sample
         *                   if matrix_type is "sparse", [[row, column, value],
         *                                                 [row, column, value],
         *                                                                  ...]
         *                   if matrix_type is "dense", [[value, value, value, ...],
         *                                               [value, value, value, ...],
         *                                                                      ...]
         */

    }, {
        key: 'data',
        get: function get() {
            return this._data;
        }
    }]);

    return Biom;
}();