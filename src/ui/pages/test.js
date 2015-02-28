/**
 * TESTS
 */
define('famodev/ui/pages/tests/Page', [
    'require',
    'exports',
    'module',

    'famodev/ui/pages/Scene',
    'famodev/ui/pages/Transitions'
    ], function (require, exports, module) {

        var Surface             = famous.core.Surface;
        var Modifier            = famous.core.Modifier;
        var Transform           = famous.core.Transform;
        var StateModifier       = famous.modifiers.StateModifier;
        var Scene               = require('famodev/ui/pages/Scene');
        var Transitions         = require('famodev/ui/pages/Transitions');

        function Page() {
            Scene.apply(this, arguments);

            this.colors = [
            'red',
            'yellow',
            'blue',
            'green'
            ];
            _createBackground.call(this);
            _createLayout.call(this);
        }
        Page.prototype = Object.create(Scene.prototype);
        Page.prototype.constructor = Page;
        Page.DEFAULT_OPTIONS = {
            inTransform: Transitions.fadeIn,
            outTransform: Transitions.fadeOut
        };

        /**
         * Add views
         */
        function _createBackground(){
            var self = this;
            this._bg = new Surface({
                size: [undefined, undefined],
                properties: {
                    'background': self.getColor()
                }
            });
            this
            .add(new StateModifier({
                transform: Transform.translate(0, 0, -1)
            }))
            .add(this._bg);
        }

        function _createLayout() {
            var self = this;
            var HeaderFooterLayout = ijzerenhein.layout.HeaderFooterLayout;

            var layout = new ijzerenhein.LayoutController({
                layout: HeaderFooterLayout,
                layoutOptions: {
                    headerSize: 60,    // header has height of 60 pixels
                    footerSize: 20     // footer has height of 20 pixels
                },
                dataSource: {
                    header: new Surface({
                        content: 'This is the header surface',
                        properties: {
                            'background': self.getColor(),
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    content: new Surface({
                        content: 'This is ' + self.getOptions().content,
                        properties: {
                            'background': self.getColor(),
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    footer: new Surface({
                        content: 'This is the footer surface',
                        properties: {
                            'background': self.getColor(),
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    })
                }
            });
            this
            .add(new StateModifier({
                transform: Transform.translate(0, 0, 0)
            }))
            .add(layout);
        }

        /**
         * Methods
         */
        _.extend(Page.prototype, {
            destroyed: function () {
                console.log('Page destroyed' + this.getOptions().content);
            },
            rendered: function () {
                console.log('Page rendered' + this.getOptions().content);
            },
            getColor: function () {
                var i = _.random(0, this.colors.length -1);
                return this.colors[i];
            }
        });

        /**
         * Events
         */


        module.exports = Page;
});

Meteor.startup(function () {
    require([
        'require',
        'exports',
        'module',

        'famodev/ui/pages/SceneController',
        'famodev/ui/pages/tests/Page'

        ], function (require, exports, module) {
        var Engine              = famous.core.Engine;
        var Transform           = famous.core.Transform;
        var Surface             = famous.core.Surface;
        var StateModifier       = famous.modifiers.StateModifier;

        var SceneController     = require('famodev/ui/pages/SceneController');
        var Page               = require('famodev/ui/pages/tests/Page');

        var mainContext = Engine.createContext();

        var modifier = new StateModifier({
            size: [undefined, undefined],
            transform: Transform.translate(0, 0, 0)
        });

        var sc = new SceneController();
        var numberOfPage = 100;
        for (var i = 1; i < numberOfPage; i++) {
            sc.addScene('p' + i, Page);
        };
        sc.setScene('p1', {
            content: 'hi'
        });
        var ip = 1;
        window.switchPage = function () {
            var p = ip % numberOfPage;
            sc.setScene('p' + p, {
                content: 'page ' + p
            });
            ip++;
        };
        mainContext.add(modifier).add(sc);        
    });
});