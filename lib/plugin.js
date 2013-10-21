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
                partials;

            try {
                partials = core.partials(source_path);
                compiled = core.compile(source_path, templateName);
            } catch (e) {
                reject(e);
            }

            // trying to write the destination file which will fulfill or reject the initial promise
            api.writeFileInBundle(bundleName, destination_path,
                self._wrapAsYUI(bundleName, templateName, moduleName, compiled, partials))
                .then(function () {
                    // provisioning the module to be used on the server side automatically
                    evt.bundle.useServerModules = evt.bundle.useServerModules || [];
                    evt.bundle.useServerModules.push(moduleName);
                    // we are now ready to roll
                    fulfill();
                }, reject);

        });
    },

    _wrapAsYUI: function (bundleName, templateName, moduleName, compiled, partials) {

        // base dependency
        var dependencies = ["template-base", "template-dust"];

        // each partial should be provisioned thru another yui module
        // and the name of the partial should translate into a yui module
        // to become a dependency
        partials = partials || [];
        partials.forEach(function (name) {
            // adding prefix to each partial
            dependencies.push(bundleName + '-templates-' + name);
        });

        return [
            'YUI.add("' + moduleName + '",function(Y, NAME){',
            '   var dust = Y.config.global.dust;',
            '',
            compiled,
            '',
            '   Y.Template.register("' + bundleName + '/' + templateName + '", function (data) {',
            '       var content;',
            '       dust.render("' + templateName + '", data, function (err, content) {',
            '           result = content;',
            '       });',
            '       return result; // hack to make dust sync',
            '   });',
            '}, "", {requires: ' + JSON.stringify(dependencies) + '});'
        ].join('\n');

    }

};
