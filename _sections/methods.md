---
title: "The Biom component"
order: 3
---

The Biom library can be used to create new Biom objects like that:
```
var biom = new Biom({
    id: 'My Biom',
    matrix_type: 'dense',
    shape: [2,2],
    rows: [
        {id: 'row1', metadata: {}},
        {id: 'row2', metadata: {}}
    ],
    columns: [
        {id: 'col1', metadata: {}},
        {id: 'col2', metadata: {}}
    ],
    data: [
        [0,1],
        [2,3]
    ]
});
```
The data is checked for integrity and compliance with the BIOM specification version 1.
Missing fields are created with default content.
All operations that set attributes of the biom object with the dot notation are also checked and throw an Error if they are not allowed.
```
var biom = new Biom({});
biom.id = 7
# Will throw a TypeError as id has to be a string or null
```
Beside checking and maintaining integrity the Biom library implements convenience functions (e.g. for getting and setting metadata).
But one of the main features of this library is the capability of handling biom data in both versions 1 and 2 by interfacing with a biom-conversion-server (cite and link to public server).
Handling of biom version 2 in javascript directly is not possible as data is in hdf5 format which is a binary format (cite).
The only reference implementation of the format is in C and trying to transpile the library to javascript using emscripten failed due to strong reliance on file operations.
Using a conversion server allows developers to use biom of both versions transparently.
Biom objects also expose the function `write` which exports it as version 1 or version 2 (needs a conversion server).
