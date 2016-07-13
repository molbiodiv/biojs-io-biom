/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

export const VERSION = "0.1.0";

/**
 @class Biom
 */
export class Biom {
    constructor({
        id: _id = null,
        format: _format = "Biological Observation Matrix 1.0.0",
        format_url: _format_url = "http://biom-format.org",
        type: _type = "OTU table",
        generated_by: _generated_by = `biojs-io-biom v${VERSION}`
    } = {}){
        this._id = _id;
        this._generated_by = _generated_by;
    }

    get id(){
        return this._id;
    }

    get generated_by(){
        return this._generated_by;
    }
}
