---
title: "Introduction"
order: 2
---
In the last years there has been an enormous increase in biological data available from omics studies.
This includes among others transcriptomic and marker-gene community data.
For many of these studies the general layout of the data is the same.
Consisting of a matrix of counts for each observations (e.g. gene or OTU) in each sample and metadata for both observations and samples.
The Biological Observation Matrix format [<sup>1</sup>](https://doi.org/10.1186/2047-217X-1-7 "The Biological Observation Matrix (BIOM) format or: how I learned to stop worrying and love the ome-ome") was developed to store this kind of data.
One main purpose of the biom format is to enhance interoperability between different software suits.
Many current tools support the biom format, e.g. QIIME, MG-RAST, PICRUSt, Mothur, phyloseq, MEGAN, VAMPS, metagenomeSeq, Phinch, RDP Classifier (add citations).
Official libraries exist in python and R.

Interactive visualization of biological data in a web browser are becoming more and more popular. (cite biojs and some modules)
BIOM format version 1 can be easily handled by web applications as it's underlying JSON format is natively supported by javascript.
The more recent BIOM format version 2 however uses HDF5 as undelying format and con therefore not be handled natively by javascript.
Also there are challenges when accessing the internal data as this can be stored either in dense or sparse format.
So web applications have to handle the different versions and internal representations.
Here we present biojs-io-biom a javascript module that provides a unified interface to read, modify, and write biom data.
To demonstrate the utility of this generic module it has been used to implement a simple user interface for a biom conversion server.
Further the well known biom visualization tool Phinch has been extended to support biom version 2.
This module is available at [github](https://github.com/iimog/biojs-io-biom) and [npm](https://www.npmjs.com/package/biojs-io-biom).
