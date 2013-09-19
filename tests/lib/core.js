/*
 * Copyright (c) 2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */


/*jslint nomen:true, node:true */
/*globals describe,it */
"use strict";


var libpath = require('path'),
    expect = require('chai').expect,
    core = require('../../lib/core.js'),
    fixturesPath = libpath.join(__dirname, '../fixtures');

describe('locator-dust', function () {

    describe('core', function () {

        it('partials', function () {
            var result = core.partials(fixturesPath + '/layout.dust');
            expect(result[0]).to.equal('abc');
            expect(result[1]).to.equal('def');
            expect(result.length).to.equal(2);
        });

        it('compile', function () {
            var result = core.compile(fixturesPath + '/layout.dust');
            expect(JSON.stringify(result).substring(2, 10)).to.equal('function');
        });
    });

});
