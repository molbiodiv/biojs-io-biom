# biojs-io-biom

[![NPM version](http://img.shields.io/npm/v/biojs-io-biom.svg)](https://www.npmjs.org/package/biojs-io-biom)
[![Build Status](https://secure.travis-ci.org/iimog/biojs-io-biom.png?branch=master)](http://travis-ci.org/iimog/biojs-io-biom)
[![Coverage Status](https://coveralls.io/repos/github/iimog/biojs-io-biom/badge.svg?branch=master)](https://coveralls.io/github/iimog/biojs-io-biom?branch=master)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/12731/iimog/biojs-io-biom.svg)](https://zenodo.org/badge/latestdoi/12731/iimog/biojs-io-biom)

> Parses biom files

## Getting Started
Install the module with: `npm install biojs-io-biom`

```javascript
var Biom = require('biojs-io-biom');
biom = new Biom(); // "creates new biom object"
```

## Documentation

See the [biom format specification (version 1.0)](http://biom-format.org/documentation/format_versions/biom-1.0.html) for more details.
Please cite the biom file format (as opposed to this module) as:
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

## Changes

### v0.1.2
 - Add getMetadata function
 - Add addMetadata function

### v0.1.1
 - Bower init

### v0.1.0
 - Initial release
 - Constructor
 - Getter/Setter for specified fields
 - Basic type checking in setters

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/iimog/biojs-io-biom/issues).

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
