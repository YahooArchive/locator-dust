YUI.add('template-dust', function (Y, NAME) {

    var dust = Y.config.global.dust;

    Y.Template.Dust = {
        revive: function (fn) {
            return function (data) {
                // TODO: implement this
            };
        }
    };

}, '', {requires: ['template-base', 'dust']});
