# biojs-io-biom

[![NPM version](http://img.shields.io/npm/v/biojs-io-biom.svg)](https://www.npmjs.org/package/biojs-io-biom)
[![Build Status](https://secure.travis-ci.org/iimog/biojs-io-biom.png?branch=master)](http://travis-ci.org/iimog/biojs-io-biom)
[![Coverage Status](https://coveralls.io/repos/github/iimog/biojs-io-biom/badge.svg?branch=master)](https://coveralls.io/github/iimog/biojs-io-biom?branch=master)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)
[![Software DOI](https://zenodo.org/badge/latestdoi/12731/iimog/biojs-io-biom)](https://zenodo.org/badge/12731/iimog/biojs-io-biom.svg)

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

## Changes

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
