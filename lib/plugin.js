/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

"use strict";

var dust = require('dustjs-linkedin'),
    fs = require('fs'),
    path = require('path');

function getName(file, ext) {
    file = path.basename(file);
    return file.substring(0, file.length - ext.length - 1);
}

module.exports = {

    describe: {
        summary: 'Modown Dust Locator Plugin',
        extensions: ['dust']
    },

    fileUpdated: function (meta, api) {

        var self = this,
            ext = meta.ext,
            source_path = meta.fullPath,
            name = getName(source_path, ext),
            bundleName = meta.bundleName,
            moduleName = bundleName + '-template-' + name,
            destination_path = path.join('yui-modules', moduleName, moduleName + '-debug.js');

        return api.promise(function (fulfill, reject) {

            var compiled;

            try {

                // TODO: making this an async call
                compiled = dust.compile(fs.readFileSync(source_path, 'utf8'), name);

                // trying to write the destination file which will fulfill or reject the initial promise
                api.writeFileInBundle(bundleName, destination_path,
                    self._wrapAsYUI(bundleName, name, compiled))
                    .then(fulfill, reject);

            } catch (e) {

                reject(new Error(source_path + ": Dust compiler error: " + e.message));

            }

        });

    },

    _wrapAsYUI: function (bundleName, templateName, compiled) {

        return [
            'YUI.add("' + bundleName + '-template-' + templateName + '",function(Y){',
            '   // compiled template created by locator plugin modown-dust',
            '   var bundle=Y.namespace("' + bundleName + '");',
            '   bundle.templates=bundle.templates||{};',
            '   bundle.templates["' + templateName + '"]=Y.Template.revive((function(){return ' + compiled + '}()));',
            '}, "", {requires: ["template-base"]});'
        ].join('\n');

    }

};