YUI.add('template-dust', function (Y, NAME) {

    /*var dust = Y.config.global.dust;

    Dust.revive = Dust.revive || function (fn) {
        return function (data) {
            var fragment = !node && document.createDocumentFragment(),
                component = React.createClass({
                    render: fn
                }),
                instance = component();

            // mixing in the template data
            Y.mix(instance.props, data, true);
            React.renderComponent(instance, fragment);
            return !node && fragment.innerHTML;
        };
    };*/

}, '', {requires: ['template-base', 'dust']});
