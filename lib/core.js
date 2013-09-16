/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var dust = require('dustjs-linkedin'),
    libfs = require('fs'),
    libpath = require('path');

// making the dust engine global to re-use it within
// templates when running on the server side.
global.dust = dust;

module.exports = {

    name: function (source_path) {
        return libpath.basename(source_path, libpath.extname(source_path));
    },

    partials: function (source, bundleName) {
        var partialRegex = /\{>"?([0-9a-zA-Z\-\.]*)"?:?([^\{]*)\/?\}/g,
            partialsResult,
            dependencies = [],
            match,
            matchBundle,
            matchFile;

        partialsResult = partialRegex.exec(source);
        while (partialsResult !== null) {
            match = partialsResult[1];
            if (-1 !== match.indexOf(':')) {
                match = match.split(':');
                matchBundle = match[0];
                matchFile = match[1];
            } else {
                matchBundle = bundleName;
                matchFile = match;
            }
            dependencies.push(getNameParts(matchBundle, matchFile, 'dust').join('-'));
            partialsResult = partialRegex.exec(source);
        }

        return dependencies;
    },

    compile: function (sourcePath, templateName) {
        var source = libfs.readFileSync(sourcePath, 'utf8');
        // compiling as string
        return dust.compile(source, templateName);
    }

};
