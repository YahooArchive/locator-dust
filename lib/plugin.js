/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

/*jslint nomen:true, node:true */

'use strict';

var core = require('./core');

module.exports = {

    describe: {
        summary: 'Compile dust templates to yui modules',
        extensions: ['dust'],
        nameParser: core.name
    },

    fileUpdated: function (evt, api) {

        var self = this,
            file = evt.file,
            source_path = file.fullPath,
            bundleName = file.bundleName,
            templateName = this.describe.nameParser(source_path),
            moduleName = bundleName + '-templates-' + templateName,
            destination_path = moduleName + '.js';

        return api.promise(function (fulfill, reject) {

            var compiled,
                dependencies = ['template-base', 'dust'];

            try {
                dependencies = dependencies.concat(core.partials(source_path, bundleName));
                compiled = core.compile(source_path, templateName);
            } catch (e) {
                reject(e);
            }

            // trying to write the destination file which will fulfill or reject the initial promise
            api.writeFileInBundle(bundleName, destination_path,
                self._wrapAsYUI(bundleName, templateName, moduleName, compiled, dependencies))
                .then(function () {
                    // provisioning the module to be used on the server side automatically
                    evt.bundle.useServerModules = evt.bundle.useServerModules || [];
                    evt.bundle.useServerModules.push(moduleName);
                    // we are now ready to roll
                    fulfill();
                }, reject);

        });
    },

    _wrapAsYUI: function (bundleName, templateName, moduleName, compiled, dependencies) {

        return [
            'YUI.add("' + moduleName + '",function(Y, NAME){',
            '   var dust = Y.config.global.dust,',
            '       cache = Y.Template._cache = Y.Template._cache || {};',
            '',
            compiled,
            '',
            '   cache["' + bundleName + '/' + templateName + '"] = function (data) {',
            '       var content;',
            '       dust.render("' + templateName + '", data, function (err, content) {',
            '           result = content;',
            '       });',
            '       return result; // hack to make dust sync',
            '   };',
            '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
        ].join('\n');

    }

};
