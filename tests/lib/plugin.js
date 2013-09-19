/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var libpath = require('path'),
    libfs = require('fs'),
    expect = require('chai').expect,
    plugin = require('../../lib/plugin.js'),
    libpromise  = require('yui/promise');

describe('locator-dust', function () {

    describe('plugin', function () {

        it('summary', function () {
            expect(plugin.describe.summary).to.equal('Compile dust templates to yui modules');
        });

        it('fileUpdated', function (next) {
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixture/layout.dust');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            file.fullPath = libpath.join(__dirname, '../fixtures/layout.dust');
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                expect(bundleName).to.equal("testing");
                expect(relativePath).to.equal("testing-templates-layout.js");
                expect(contents.substring(0, 52)).to.equal("YUI.add(\"testing-templates-layout\",function(Y, NAME)");
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            plugin.fileUpdated(evt, api).then(function () {
                try {
                    expect(1).to.equal(filecall);
                    expect(evt.bundle.useServerModules[0]).to.equal('testing-templates-layout');
                    next();
                } catch (err) {
                    next(err);
                }
            }, next);
        });

        it('fileUpdated if file not exists', function (next) {
            var file = { bundleName: 'testing' },
                bundle = { name: 'testing' },
                evt = { file: file, bundle: bundle },
                api = {},
                filecall = 0;
            file.fullPath = libpath.join(__dirname, '../fixtures/testnofile.dust');
            api.promise = function (fn) {
                return new libpromise.Promise(fn);
            };
            api.writeFileInBundle =  function (bundleName, relativePath, contents, options) {
                filecall += 1;
                return new libpromise.Promise(function (fulfill, reject) {
                    fulfill();
                });
            };
            plugin.fileUpdated(evt, api).then(function () {
                try {
                    expect(filecall).to.equal(0);
                    next();
                } catch (e) {
                    next(e);
                }
            }, function (err) {
                try {
                    expect(err.message.substring(0, 33)).to.equal("ENOENT, no such file or directory");
                    next();
                } catch (e) {
                    next(e);
                }
            }, next);
        });
    });

});
