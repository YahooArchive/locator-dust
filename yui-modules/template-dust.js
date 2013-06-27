YUI.add('template-dust', function (Y) {

    'use strict';

    // var dust = Y.config.global.dust;

    Y.Template.Dust = {
        revive: function (fn) {
            return function (data) {
                // TODO: implement this
                return fn(data);
            };
        }
    };

}, '', {requires: ['template-base'], optional: ['dust']});
