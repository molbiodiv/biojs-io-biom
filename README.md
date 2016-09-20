# biojs-io-biom

[![NPM version](http://img.shields.io/npm/v/biojs-io-biom.svg)](https://www.npmjs.org/package/biojs-io-biom)
[![Build Status](https://secure.travis-ci.org/molbiodiv/biojs-io-biom.png?branch=master)](http://travis-ci.org/molbiodiv/biojs-io-biom)
[![Coverage Status](https://coveralls.io/repos/github/molbiodiv/biojs-io-biom/badge.svg?branch=master)](https://coveralls.io/github/molbiodiv/biojs-io-biom?branch=master)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/12731/molbiodiv/biojs-io-biom.svg)](https://zenodo.org/badge/latestdoi/12731/molbiodiv/biojs-io-biom)

> Parses biom files

## Getting Started

### node
Install the module with:
```bash
npm install biojs-io-biom
```
Then you can use it in node like this:
```javascript
var Biom = require('biojs-io-biom');
biom = new Biom(); // "creates new biom object"
```

### browser
To use the biojs-io-biom module in the browser you need the `build/biom.js` file:
```html
<!-- ... -->
<script src="biom.js"></script>
<script type="text/javascript">
var Biom = require('biojs-io-biom').Biom;
biom = new Biom();
</script>
<!-- ... -->
```

### bower
You can also use bower to install the biojs-io-biom component for use in the browser:
```bash
bower install biojs-io-biom
```
The file you need will be under `bower_components/biojs-io-biom/build/biom.js` in this case.

## Documentation

See the [biom format specification (version 1.0)](http://biom-format.org/documentation/format_versions/biom-1.0.html) for more details on the file format.
Please cite the biom-format project (in addition to this module) as:
```
The Biological Observation Matrix (BIOM) format or: how I learned to stop worrying and love the ome-ome.
Daniel McDonald, Jose C. Clemente, Justin Kuczynski, Jai Ram Rideout, Jesse Stombaugh, Doug Wendel, Andreas Wilke, Susan Huse, John Hufnagle, Folker Meyer, Rob Knight, and J. Gregory Caporaso.
GigaScience 2012, 1:7. doi:10.1186/2047-217X-1-7
```

#### constructor(object)

**Parameter**: `object`
**Type**: `Object`
**Example**: `{}`

The 'constructor' method is responsible for creating an object call via `new Biom()`.

How to use this method

```javascript
biom = new Biom();
// or with a (partial) biom json object
biom = new Biom({
    id: "Table ID",
    shape: [2,2],
    rows: [
        {id: "row1", metadata: null},
        {id: "row2", metadata: null}
    ],
    columns: [
        {id: "col1", metadata: null},
        {id: "col2", metadata: null}
    ]
    // ...
});
// type validation is performed so assigning illegal types will result in a TypeError:
// would throw a TypeError:
//new Biom({id: 7});
```

#### getter/setter

The getter methods are called implicitly when reading properties with the dot notation.

```javascript
biom = new Biom();
id = biom.id;
data = biom.data;
```

The setter methods are called implicitly when assigning to properties with the dot notation (some basic type checks are performed).

```javascript
biom = new Biom();
biom.id = "New ID";
// would throw a TypeError:
//biom.id = 17;
```

The `matrix_type` setter also updates internal representation of `data`:

```javascript
biom = new Biom({matrix_type: 'sparse', shape: [2,4], data: [[0,1,12],[1,2,7],[1,3,17]]});
biom.matrix_type = 'dense';
biom.data;
// [[0,12,0,0],
//  [0,0,7,17]]
```

The `rows` and `columns` setter update the internal data by id.
Consider the following example:

```javascript
biom = new Biom({
    matrix_type: 'dense',
    rows: [{id: 'row1'},{id: 'row2'},{id: 'row3'}],
    columns: [{id: 'col1'},{id: 'col2'}],
    data: [[0,1],[2,7],[5,0]]
});
```
This will result in the following `data` matrix:

|          | col1  | col2  |
| -------- |:-----:|:-----:|
| **row1** | 0     | 1     |
| **row2** | 2     | 7     |
| **row3** | 5     | 0     |

Now setting the `rows` will also update the `data` accordingly:

```javascript
biom.rows = [{id: 'row2'},{id: 'row1'},{id: 'row4'},{id: 'row5'}];
console.log(biom.data);
```

This results in the following table (row1 and row2 are swapped, row3 is removed and two new rows, row4 and row5 are added):

|          | col1  | col2  |
| -------- |:-----:|:-----:|
| **row2** | 2     | 7     |
| **row1** | 0     | 1     |
| **row4** | 0     | 0     |
| **row5** | 0     | 0     |

This all happens in the background by simply assigning to `rows`. The same applies to `columns`.
This way data integrity is preserved.

#### getMetadata(object)

**Parameter**: `object`
**Type**: `Object`
**Example**: `{dimension: 'rows', attribute: 'taxonomy'}`
**Throws** `Error` if attribute is not set or dimension is none of "rows", "observation", "columns" or "sample"

This method extracts metadata with a given attribute from rows or columns (dimension).
Default value for `object.dimension` is "rows"

```javascript
biom = new Biom({
    id: "Table ID",
    shape: [2,2],
    rows: [
        {id: "row1", metadata: null},
        {id: "row2", metadata: null}
    ],
    columns: [
        {id: "col1", metadata: {pH: 7.2}},
        {id: "col2", metadata: {pH: 8.1}},
        {id: "col3", metadata: {pH: null}},
        {id: "col4", metadata: {pH: 6.9}},
        {id: "col5", metadata: {}}
    ]
    // ...
});
meta = biom.getMetadata({dimension: 'columns', attribute: 'pH'});
// [7.2, 8.1, null, 6.9, null]
```

#### addMetadata(object)

**Parameter**: `object`
**Type**: `Object`
**Example**: `{dimension: 'columns', attribute: 'pH', defaultValue: 7}`
**Example**: `{dimension: 'columns', attribute: 'pH', values: [6,7,5,5,9]}`
**Example**: `{dimension: 'rows', attribute: 'importance', values: {row3id: 5, row7id: 0}}`
**Throws** `Error` if attribute is not set
**Throws** `Error` if dimension is none of "rows", "observation", "columns" or "sample"
**Throws** `Error` if not exactly one of `defaultValue` or `values` is set (setting to null is considered unset)
**Throws** `Error` if values is an array with a length that does not match that of the dimension (rows or columns)

This method adds metadata with a given attribute to rows or columns (dimension).
Default value for `object.dimension` is "rows"

```javascript
biom = new Biom({
    id: "Table ID",
    shape: [2,2],
    rows: [
        {id: "row1", metadata: null},
        {id: "row2", metadata: null}
    ],
    columns: [
        {id: "col1", metadata: {}},
        {id: "col2", metadata: {}},
        {id: "col3", metadata: {}},
        {id: "col4", metadata: {}},
        {id: "col5", metadata: {}}
    ]
    // ...
});
biom.addMetadata({dimension: 'columns', attribute: 'pH', defaultValue: 7})
biom.getMetadata({dimension: 'columns', attribute: 'pH'});
// [7, 7, 7, 7, 7]
biom.addMetadata({dimension: 'columns', attribute: 'pH', values: [1,2,null,4,5]})
biom.getMetadata({dimension: 'columns', attribute: 'pH'});
// [1, 2, null, 4, 5]
biom.addMetadata({dimension: 'columns', attribute: 'pH', values: {col2: 7, col3: 9, col4: null}})
biom.getMetadata({dimension: 'columns', attribute: 'pH'});
// [1, 3, 9, null, 5]
```

#### getter/setter for `data` independent of `matrix_type`

Accessing `data` directly returns different results depending on `matrix_type` (`sparse` or `dense`).
Therefore a couple of helper functions have been implemented that work independent of `matrix_type`:

 - `getDataAt(rowID, colID)` returns a single data point
 - `setDataAt(rowID, colID, value)` sets a single data point
 - `getDataRow(rowID)` returns data for a single row
 - `setDataRow(rowID, values)` sets data for a single row
 - `getDataColumn(colID)` returns data for a single column
 - `setDataColumn(colID, values)` sets data for a single column
 - `getDataMatrix()` returns the full data matrix in dense format (independent of internal representation)
 - `setDataMatrix(values)` sets the full data matrix in dense format (independent of internal representation)

```javascript
biom = new Biom({
    rows: [{id: 'r1'},{id: 'r2'},{id: 'r3'},{id: 'r4'},{id: 'r5'}],
    columns: [{id: 'c1'},{id: 'c2'},{id: 'c3'},{id: 'c4'},{id: 'c5'}],
    matrix_type: 'sparse',
    data: [[0,1,11],[1,2,13],[4,4,9]]
});
biom.getDataAt('r1','c2');
// 11
biom.getDataRow('r2');
// [0,0,13,0,0]
biom.getDataColumn('c5');
// [0,0,0,0,9]
biom.getDataMatrix();
// [[0,11, 0, 0, 0],
//  [0, 0,13, 0, 0],
//  [0, 0, 0, 0, 0],
//  [0, 0, 0, 0, 0],
//  [0, 0, 0, 0, 9]]
biom.setDataAt('r3','c4',99);
biom.setDataRow('r4',[1,2,3,4,5]);
biom.setDataColumn('c1',[10,9,8,7,6]);
biom.getDataMatrix();
// [[10,11, 0, 0, 0],
//  [ 9, 0,13, 0, 0],
//  [ 8, 0, 0,99, 0],
//  [ 7, 2, 3, 4, 5],
//  [ 6, 0, 0, 0, 9]]

// internal data remains to be sparse
biom.data
// [[0,0,10],[0,1,11],[1,0,9],[1,2,13],[2,0,8],[2,3,99],[3,0,7],[3,1,2],[3,2,3],[3,3,4],[3,4,5],[4,1,6],[4,4,9]]
```

#### static parse(biomString, options)

**Parameter**: `biomString`
**Type**: `String`
**Example**: `'{"id": "test", "shape": [0,0]}'`
**Parameter**: `options`
**Type**: `Object`
**Example**: `{conversionServer: 'https://biomcs.iimog.org/convert.php', arrayBuffer: ab}`
**Returns** `Promise` this function returns a promise. In case of success the new Biom object is passed otherwise the Error object is passed.

The [conversion server](https://github.com/molbiodiv/biom-conversion-server) is a simple php application that provides a webservice interface to the [official python biom-format utility](http://biom-format.org/).
You can host your own server using a pre-configured [Docker container](https://hub.docker.com/r/iimog/biom-conversion-server/).
A publicly available instance is reachable under [https://biomcs.iimog.org/]().
For this version of the module biom-conversion-server v0.2.0 or later is required.

The promise is rejected:
 - if biomString is not valid JSON and no conversionServer is given
 - if biomString is JSON that is not compatible with biom specification. Error will be thrown by the Biom constructor
 - if there is a conversion error (conversionServer not reachable, conversionServer returns error)

This method parses the content of a biom file either as string or as ArrayBuffer.

```javascript
// Example: json String
Biom.parse('{"id": "Table ID", "shape": [2,2]}', {}).then(
    function(biom){
        console.log(biom.shape);
    }
);

// Example: raw arrayBuffer from hdf5 file (file is a reference on the hdf5 file)
// Using the public conversionServer on biomcs.iimog.org
var reader = new FileReader();
reader.onload = function(c) {
    Biom.parse('', {conversionServer: 'https://biomcs.iimog.org/convert.php', arrayBuffer: c.target.result}).then(
        // in case of success
        function(biom){
            console.log(biom);
        },
        // in case of failure
        function(fail){
            console.log(fail);
        }
    );
};
reader.readAsArrayBuffer(file);
```

#### write(options)

**Parameter**: `options`
**Type**: `Object`
**Example**: `{conversionServer: 'https://biomcs.iimog.org/convert.php', asHdf5: false}`
**Returns** `Promise` this function returns a promise. In case of success the String or ArrayBuffer representation of the biom object is passed otherwise the Error object is passed.

The [conversion server](https://github.com/molbiodiv/biom-conversion-server) is a simple php application that provides a webservice interface to the [official python biom-format utility](http://biom-format.org/).
You can host your own server using a pre-configured [Docker container](https://hub.docker.com/r/iimog/biom-conversion-server/).
A publicly available instance is reachable under [https://biomcs.iimog.org/]().
For this version of the module biom-conversion-server v0.2.0 or later is required.

The promise is rejected:
 - if there is a conversion error (conversionServer not reachable, conversionServer returns error)

This method generates a String (json) or ArrayBuffer (hdf5) representation of the biom object.

```javascript
biom = new Biom({
    id: "Table ID",
    shape: [2,2]
    // ...
});

// Example: to json String
biom.write().then(
    function(biomString){
        console.log(biomString);
    }
);

// Example: to raw arrayBuffer (hdf5)
// Using the public conversionServer on biomcs.iimog.org
biom.write({conversionServer: 'https://biomcs.iimog.org/convert.php', asHdf5: true}).then(
    // in case of success
    function(biomArrayBuffer){
        console.log(biomArrayBuffer);
        // a Blob can be created
        // blob = new Blob([biomArrayBuffer], {type: "application/octet-stream"});
        // and saved as file e.g. with https://github.com/eligrey/FileSaver.js/
        // saveAs(blob, 'export.hdf5.biom', true);
    },
    // in case of failure
    function(fail){
        console.log(fail);
    }
);
```

#### static sparse2dense(sparseData, shape)

**Parameter**: `sparseData`
**Type**: `Array`
**Example**: `[[0,1,1],[1,0,2]]`
**Parameter**: `shape`
**Type**: `Array`
**Example**: `[2,2]`
**Returns** `Array` the given sparseData converted to dense, e.g. `[[0,1],[2,0]]`

```javascript
var denseData = Biom.sparse2dense([[0,1,1],[1,0,2]], [2,2]);
// denseData = [[0,1],[2,0]]
```

#### static dense2sparse(denseData)

**Parameter**: `denseData`
**Type**: `Array`
**Example**: `[[0,1],[2,0]]`
**Returns** `Array` the given denseData converted to sparse, e.g. `[[0,1,1],[1,0,2]]`

```javascript
var sparseData = Biom.dense2sparse([[0,1],[2,0]]);
// sparseData = [[0,1,1],[1,0,2]]
```

## Changes

### v1.0.2 <small>(2016-09-15)</small>
 - Fix installation via npm
 - Fix minfied version of js

### v1.0.1 <small>(2016-09-07)</small>
 - Init metadata in `rows` and `columns`

### v1.0.0 <small>(2016-09-06)</small>
 - Add `matrix_type` agnostic getter/setter for `data`
 - Add static methods `sparse2dense` and `dense2sparse`
 - Update `data` on set `columns`
 - Update `data` on set `rows`
 - Check `data` for correct dimensions
 - Check `rows` and `columns` for missing or duplicate ids
 - Make `shape` property read only
 - Check `shape` on construction
 - Add getter for `nnz` (#10)
 - Add `data` transformation to `matrix_type` setter (#3)

### v0.1.4 <small>(2016-07-29)</small>
 - Add write function
 - Add browserified build

### v0.1.3 <small>(2016-07-25)</small>
 - Add parse function
 - Add hdf5 conversion capability to parse (via external server)

### v0.1.2 <small>(2016-07-21)</small>
 - Add getMetadata function
 - Add addMetadata function

### v0.1.1 <small>(2016-07-20)</small>
 - Bower init

### v0.1.0 <small>(2016-07-18)</small>
 - Initial release
 - Constructor
 - Getter/Setter for specified fields
 - Basic type checking in setters

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/molbiodiv/biojs-io-biom/issues).

## License 

The MIT License

Copyright (c) 2016, Markus J. Ankenbrand

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
