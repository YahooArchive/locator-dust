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

function getNameParts(bundleName, path, ext) {
    var parts = [bundleName];
    parts = parts.concat(libpath.dirname(path).split(libpath.sep));
    parts.push(libpath.basename(path, '.' + ext));
    return parts;
}

module.exports = {

    describe: {
        summary: 'Modown Dust Locator Plugin',
        extensions: ['dust']
    },

    fileUpdated: function (evt, api) {

        var self = this,
            file = evt.file,
            ext = file.ext,
            source_path = file.fullPath,
            relative_path = file.relativePath,
            bundleName = file.bundleName,
            name = getNameParts(bundleName, relative_path, ext).join('-'),
            id = getNameParts(bundleName, relative_path, ext).join('/'),
            destination_path = name + '.js';

        return api.promise(function (fulfill, reject) {

            var compiled,
                source;

            // TODO: make this async
            source = libfs.readFileSync(source_path, 'utf8');

            console.log('[modown-dust] compiling ' + source_path);
            compiled = dust.compile(source, name);

            // trying to write the destination file which will fulfill or reject the initial promise
            api.writeFileInBundle(bundleName, destination_path,
                self._wrapAsYUI(name, id, compiled), 'utf8')
                .then(fulfill, reject);

        });

    },

    _wrapAsYUI: function (name, id, compiled) {
        // TODO: make sure that dust is in the picture by registering dust
        return [
            'YUI.add("' + name + '",function(Y, NAME){',
            '   dust.cache = dust.cache || {};',
            '   dust.cache[NAME] = (function () { return ' + compiled + ' }());',
            '   Y.Template._cache = Y.Template._cache || {};',
            '   Y.Template._cache["' + id + '"] = function (data, cb) {',
            '       data = data || {};',
            '       dust.render(NAME, data, cb);',
            '   };',
            '}, "", {requires: ["template-base", "dust"]});'
        ].join('\n');

    }

};