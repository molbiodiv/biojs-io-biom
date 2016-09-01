/*
 * biojs-io-biom
 * https://github.com/molbiodiv/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

/**
 * Version
 * @type {string} version of this module
 */
export const VERSION = '0.1.4';

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
export const DEFAULT_BIOM = {
    id: null,
    format: 'Biological Observation Matrix 1.0.0',
    format_url: 'http://biom-format.org',
    type: 'OTU table',
    generated_by: `biojs-io-biom v${VERSION}`,
    date: null, // will be set to Date.now() in the constructor
    rows: [],
    columns: [],
    matrix_type: 'sparse',
    matrix_element_type: 'float',
    shape: [0,0],
    data: [],
    comment: null
};

/**
 * Controlled vocabulary for the type field of biom objects
 * @type {string[]}
 */
export const TYPE_CV = [
    'OTU table',
    'Pathway table',
    'Function table',
    'Ortholog table',
    'Gene table',
    'Metabolite table',
    'Taxon table'
];

/**
 * Controlled vocabulary for the matrix_type field of biom objects
 * @type {string[]}
 */
export const MATRIX_TYPE_CV = [
    'sparse', // only non-zero values are specified
    'dense'   // every element must be specified
];

/**
 * Controlled vocabulary for the matrix_element_type field of biom objects
 * @type {string[]}
 */
export const MATRIX_ELEMENT_TYPE_CV = [
    'int',    // integer
    'float',  // floating point
    'unicode' // unicode string
];

let nets = require('nets');
let base64 = require('base64-js');
let textEncoding = require('text-encoding');

/**
 * @class Biom
 */
export class Biom {
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
    constructor({
        id: _id = null,
        format: _format = DEFAULT_BIOM.format,
        format_url: _format_url = DEFAULT_BIOM.format_url,
        type: _type = DEFAULT_BIOM.type,
        generated_by: _generated_by = DEFAULT_BIOM.generated_by,
        date: _date = null,
        rows: _rows = DEFAULT_BIOM.rows,
        columns: _columns = DEFAULT_BIOM.columns,
        matrix_type: _matrix_type = DEFAULT_BIOM.matrix_type,
        matrix_element_type:
            _matrix_element_type = DEFAULT_BIOM.matrix_element_type,
        shape: _shape = null,
        data: _data = DEFAULT_BIOM.data,
        comment: _comment = DEFAULT_BIOM.comment
    } = {}){
        this.rows = _rows;
        this.columns = _columns;
        this.matrix_type = _matrix_type;
        this.id = _id;
        this.format = _format;
        this.format_url = _format_url;
        this.type = _type;
        this.generated_by = _generated_by;
        if(_date === null){
            _date = new Date().toISOString();
        }
        this.date = _date;
        this.matrix_element_type = _matrix_element_type;
        if(_shape !== null){
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
    get id(){
        return this._id;
    }

    /**
     * Setter for id
     * @param id {string|null} - A field that can be used to id a table
     * @throws {TypeError} if id is not a string (or null)
     */
    set id(id){
        if(id !== null && typeof id !== 'string'){
            throw new TypeError('id must be string or null');
        }
        this._id = id;
    }

    /**
     * Getter for format
     * @returns {string} - The name and version of the current biom format
     */
    get format(){
        return this._format;
    }

    /**
     * Setter for format
     * @param format {string} - The name and version of the current biom format
     * @throws {TypeError} if format is not a string
     */
    set format(format){
        if(typeof format !== 'string'){
            throw new TypeError('format must be string');
        }
        this._format = format;
    }

    /**
     * Getter for format_url
     * @returns {string} - A string with a static URL providing format details
     */
    get format_url(){
        return this._format_url;
    }

    /**
     * Setter for format_url
     * @param format_url {string} - A string with a static URL
     *                              providing format details
     *                              (not checked whether the string is an url)
     * @throws {TypeError} if format_url is not a string
     */
    set format_url(format_url){
        if(typeof format_url !== 'string'){
            throw new TypeError('format_url must be string' +
                ' (representing a static URL)');
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
    get type(){
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
    set type(type){
        if(typeof type !== 'string'){
            throw new TypeError('type must be string' +
                ' (part of the controlled vocabulary)');
        }
        if(TYPE_CV.indexOf(type) === -1){
            throw new Error('type must be part of the controlled vocabulary');
        }
        this._type = type;
    }

    /**
     * Getter for generated_by
     * @returns {string} - Package and revision that built the table
     */
    get generated_by(){
        return this._generated_by;
    }

    /**
     * Setter for generated_by
     * @param generated_by {string} - Package and revision that built the table
     * @throws {TypeError} if generated_by is not a string
     */
    set generated_by(generated_by){
        if(typeof generated_by !== 'string'){
            throw new TypeError('generated_by must be string');
        }
        this._generated_by = generated_by;
    }

    /**
     * Getter for date
     * @returns {string} - Date the table was built (ISO 8601 format)
     */
    get date(){
        return this._date;
    }

    /**
     * Setter for date
     * @param date {string} - Date the table was built (ISO 8601 format)
     *                       (not checked whether the string is a date)
     * @throws {TypeError} if date is not a string
     */
    set date(date){
        if(typeof date !== 'string'){
            throw new TypeError('date must be string (ISO 8601 format)');
        }
        this._date = date;
    }

    /**
     * Getter for rows
     * @returns {Array} - An ORDERED list of obj describing the rows
     */
    get rows(){
        return this._rows;
    }

    /**
     * Setter for rows
     * @param rows {Array} - An ORDERED list of obj describing the rows
     * @throws {TypeError} if date is not an Array
     */
    set rows(rows){
        if(Object.prototype.toString.call(rows) !== '[object Array]'){
            throw new TypeError('rows must be an Array');
        }
        this._rows = rows;
    }

    /**
     * Getter for columns
     * @returns {Array} - An ORDERED list of obj describing the columns
     */
    get columns() {
        return this._columns;
    }

    /**
     * Setter for columns
     * @param columns {Array} - An ORDERED list of obj describing the columns
     * @throws {TypeError} if date is not an Array
     */
    set columns(columns){
        if(Object.prototype.toString.call(columns) !== '[object Array]'){
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
    get matrix_type(){
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
    set matrix_type(matrix_type){
        if(typeof matrix_type !== 'string'){
            throw new TypeError('matrix_type must be string' +
                ' (part of the controlled vocabulary: "dense" or "sparse")');
        }
        if(MATRIX_TYPE_CV.indexOf(matrix_type) === -1){
            throw new Error('matrix_type must be part of the' +
                ' controlled vocabulary: "dense" or "sparse"');
        }
        // transform data if required
        if(typeof this.matrix_type !== 'undefined' && this.matrix_type !== matrix_type){
            if(matrix_type === 'dense'){
                // create data array of given shape with only 0
                let new_data = Array(this.shape[0]).fill().map(() => Array(this.shape[1]).fill(0));
                // fill in the non-zero values
                for(let d of this.data){
                    new_data[d[0]][d[1]] = d[2];
                }
                this.data = new_data;
            } else if(matrix_type === 'sparse') {
                let new_data = Array();
                for(let i=0; i<this.data.length; i++){
                    for(let j=0; j<this.data[i].length; j++){
                        if(this.data[i][j] !== 0){
                            new_data.push([i, j, this.data[i][j]]);
                        }
                    }
                }
                this.data = new_data;
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
    get matrix_element_type(){
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
    set matrix_element_type(matrix_element_type){
        if(typeof matrix_element_type !== 'string'){
            throw new TypeError('matrix_element_type must be string' +
                ' (part of the controlled vocabulary:' +
                ' "int", "float" or "unicode")');
        }
        if(MATRIX_ELEMENT_TYPE_CV.indexOf(matrix_element_type) === -1){
            throw new Error('matrix_element_type must be part of the' +
                ' controlled vocabulary: "int", "float" or "unicode"');
        }
        this._matrix_element_type = matrix_element_type;
    }

    /**
     * Getter for shape
     * read-only trying to set shape will fail. If shape is set in the constructor it is checked for validity.
     * @returns {Array} - the number of rows and number of columns in data
     */
    get shape(){
        return [this.rows.length, this.columns.length];
    }

    /**
     * Check if shape is concordant with rows and columns
     * @param shape {Array} - the number of rows and number of columns in data
     * @throws {TypeError} if shape is not an Array
     * @throws {Error} if shape contains something other than
     *                 two non-negative integers
     * @throws {Error} if shape is not concordant with rows and columns
     */
    checkShape(shape){
        if(Object.prototype.toString.call(shape) !== '[object Array]'){
            throw new TypeError('shape must be an Array containing' +
                ' exactly two non-negative integers');
        }
        if(shape.length !== 2){
            throw new Error('shape does not contain exactly two elements');
        }
        if(!Number.isInteger(shape[0]) ||
            shape[0] < 0 || !Number.isInteger(shape[1]) || shape[1] < 0){
            throw new Error('shape does not contain non-negative integers');
        }
        if(shape[0] !== this.rows.length){
            throw new Error('First dimension of shape does not match number of rows');
        }
        if(shape[1] !== this.columns.length){
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
    get data(){
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
    set data(data){
        if(Object.prototype.toString.call(data) !== '[object Array]'){
            throw new TypeError('data must be an Array');
        }
        this._data = data;
    }

    /**
     * Getter for comment
     * @returns {string|null} - A free text field containing any information that
     *                     you feel is relevant (or just feel like sharing)
     */
    get comment(){
        return this._comment;
    }

    /**
     * Setter for comment
     * @param comment {string|null} - A free text field containing any information
     *                        that you feel is relevant (or just feel like sharing)
     * @throws {TypeError} if comment is not a string (or null)
     */
    set comment(comment){
        if(comment !== null && typeof comment !== 'string'){
            throw new TypeError('comment must be string or null');
        }
        this._comment = comment;
    }

    /**
     * Getter for nnz
     * This property is read-only, attempts to set it will result in a TypeError
     * @returns {number} - Number of non-zero elements in data
     */
    get nnz(){
        let nnz = 0;
        if(this.matrix_type === 'sparse'){
            return this.data.length;
        } else if(this.matrix_type === 'dense') {
            for(let row of this.data){
                for(let elem of row){
                    if(elem !== 0){
                        nnz++;
                    }
                }
            }
        }
        return nnz;
    }

    /**
     * Get specific metadata of rows or columns as array
     * @param _dimension {string} - either "rows" ("observation") or "columns" ("sample"), default: "rows"
     * @param _attribute {string} - the key in the metadata object to extract for each element in "dimension"
     * @throws Error - if attribute is not set
     * @throws Error - if dimension is something other than "rows", "observation", "columns" or "sample"
     * @returns {Array} - containing the metadata of each element in "dimension" with the key "attribute"
     */
    getMetadata({
        dimension: _dimension = 'rows',
        attribute: _attribute = null
    } = {}){
        let dim_rows = ['rows', 'observation'];
        let dim_cols = ['columns', 'sample'];
        let extractAttribute = function (element) {
            if(element.metadata === null || !(_attribute in element.metadata)){
                return null;
            }
            return element.metadata[_attribute];
        };
        let result;
        if(_attribute === null){
            throw new Error('Missing argument: attribute');
        }
        if(dim_rows.indexOf(_dimension) !== -1){
            result = this.rows.map(extractAttribute);
        } else if (dim_cols.indexOf(_dimension) !== -1){
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
    addMetadata({
        dimension: _dimension = 'rows',
        attribute: _attribute = null,
        defaultValue: _defaultValue = null,
        values: _values = null
    } = {}){
        let dim_rows = ['rows', 'observation'];
        let dim_cols = ['columns', 'sample'];
        let setMetadatum = function(element, value){
            if(element.metadata === null){
                element.metadata = {};
            }
            element.metadata[_attribute] = value;
        };
        if(_attribute === null){
            throw new Error('Missing argument: attribute');
        }
        let dim;
        if(dim_rows.indexOf(_dimension) !== -1){
            dim = this.rows;
        } else if(dim_cols.indexOf(_dimension) !== -1) {
            dim = this.columns;
        } else {
            throw new Error('dimension has to be one of "rows", "observation", "columns" or "sample"');
        }
        if(_defaultValue !== null && _values !== null){
            throw new Error('please set only one of "defaultValue" and "values", not both');
        }
        if(_defaultValue === null && _values === null){
            throw new Error('Missing argument: please set one of "defaultValue" or "values"');
        }
        if(_values !== null){
            if(typeof _values !== 'object'){
                throw new Error('"values" has to be an array or object');
            }
            if(Object.prototype.toString.call(_values) === '[object Array]'){
                if(_values.length !== dim.length){
                    throw new Error('values is an array but has wrong number of elements');
                }
                for(let i=0; i<_values.length; i++){
                    setMetadatum(dim[i], _values[i]);
                }
            } else {
                for(let element of dim){
                    if(element.id in _values){
                        setMetadatum(element, _values[element.id]);
                    }
                }
            }
        } else if(_defaultValue !== null){
            for(let element of dim){
                setMetadatum(element, _defaultValue);
            }
        }
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
    write({conversionServer: _conversionServer = null, asHdf5: _asHdf5 = false} = {}){
        let biomJson = JSON.stringify({
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
        return new Promise((resolve, reject) => {
           if(_asHdf5){
               if(_conversionServer === null){
                   reject(new Error('asHdf5 is set but no conversionServer is given'));
               }
               let b64content = base64.fromByteArray(new Uint8Array(new textEncoding.TextEncoder().encode(biomJson)));
               nets({
                   body: '{"to": "hdf5", "content": "'+b64content+'"}',
                   url: _conversionServer,
                   encoding: undefined,
                   method: "POST",
                   headers:{
                       "Content-Type": "application/json"
                   }
               }, function done (err, resp, body) {
                   if(err !== null){
                       return reject(new Error('There was an error with the conversion:\n'+err));
                   }
                   let response = body.replace(/\r?\n|\r/g, '');
                   response = JSON.parse(response);
                   if(response.error !== null){
                       return reject(new Error('There was an error with the conversion:\n'+response.error));
                   }
                   let arrayBuffer = base64.toByteArray(response.content).buffer;
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
    static parse(biomString = '', {conversionServer: _conversionServer = null, arrayBuffer: _arrayBuffer = null} = {}){
        return new Promise((resolve, reject) => {
            // can only handle json if no conversion server is given
            if(_arrayBuffer !== null){
                biomString = new textEncoding.TextDecoder().decode(_arrayBuffer);
            }
            let json_obj;
            try{
                json_obj = JSON.parse(biomString);
                return resolve(new Biom(json_obj));
            } catch (e){
                if(_conversionServer === null) {
                    return reject(new Error('The given biomString is not in json format and no conversion server is specified.\n' + e.message));
                }
                let b64content = base64.fromByteArray(new Uint8Array(new textEncoding.TextEncoder().encode(biomString)));
                if(_arrayBuffer !== null){
                    b64content = base64.fromByteArray(new Uint8Array(_arrayBuffer));
                }
                nets({
                    body: '{"to": "json", "content": "'+b64content+'"}',
                    url: _conversionServer,
                    encoding:undefined,
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    }
                }, function done (err, resp, body) {
                    if(err !== null){
                        return reject(new Error('There was an error with the conversion:\n'+err));
                    }
                    let response = body.replace(/\r?\n|\r/g, '');
                    response = JSON.parse(response);
                    if(response.error !== null){
                        return reject(new Error('There was an error with the conversion:\n'+response.error));
                    }
                    json_obj = JSON.parse(new textEncoding.TextDecoder().decode(base64.toByteArray(response.content)));
                    return resolve(new Biom(json_obj));
                });
            }
        });
    }
}
