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

    partials: function () {
        // TODO: implement this
        return [];
    },

    compile: function (sourcePath, templateName) {
        var source = libfs.readFileSync(sourcePath, 'utf8');
        // compiling as string
        return dust.compile(source, templateName);
    }

};
