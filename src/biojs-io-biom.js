/*
 * biojs-io-biom
 * https://github.com/iimog/biojs-io-biom
 *
 * Copyright (c) 2016 Markus J. Ankenbrand
 * Licensed under the MIT license.
 */

export const VERSION = '0.1.0';
export const DEFAULT_BIOM = {
    id: null,
    format: 'Biological Observation Matrix 1.0.0',
    format_url: 'http://biom-format.org',
    type: 'OTU table',
    generated_by: `biojs-io-biom v${VERSION}`
};

/**
 @class Biom
 */
export class Biom {
    constructor({
        id: _id = null,
        format: _format = DEFAULT_BIOM.format,
        format_url: _format_url = DEFAULT_BIOM.format_url,
        type: _type = DEFAULT_BIOM.type,
        generated_by: _generated_by = DEFAULT_BIOM.generated_by
    } = {}){
        this._id = _id;
        this._format = _format;
        this._format_url = _format_url;
        this._type = _type;
        this._generated_by = _generated_by;
    }

    get id(){
        return this._id;
    }

    get generated_by(){
        return this._generated_by;
    }
}
