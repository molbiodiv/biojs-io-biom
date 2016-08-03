---
title: "Application"
order: 4
---
To demonstrate the usefulness of this module it has been used to implement a user interface for the biom-conversion-server (cite).
Besides providing an API it is now also possible to upload files using a file dialog.
The uploaded file is checked using this module and converted to version 1 on the fly if necessary.
In case of success it can be downloaded in version 1 or 2.
As most of the functionality is provided by the Biom module the whole interface is implemented in a few lines of code.

As a second example the Phinch framework (cite) has been enhanced to allow biom version 2.
Phinch visualizes the content of biom files using a variety of interactive plots.
However due to the difficulties of handling hdf5 data only biom version 1 is supported.
This is unfortunate as most tools nowadays return biom version 2 (e.g. QIIME from version X, Qiita, ... TODO).
It is possible to convert from version 2 to version 1 without loss of information but that requires an extra step using the command line.
By including this Biom module and the biom-conversion-server into Phinch it was possible to add support for biom version 2 without major changes.
(add link to public server and docker image)

One of the next steps is the development of another biojs module to present biom data as a set of data tables.
In order to do that for large data sets sophisticated accession functions capitalizing on the sparse data representation
have to be implemented.
