
/**
 * TESTS
 * 
 */
define('famodev/ui/pages/tests/Page1', [
    'require',
    'exports',
    'module',

    'famodev/ui/pages/Scene',
    ], function (require, exports, module) {

        var Surface             = famous.core.Surface;
        var Modifier            = famous.core.Modifier;
        var Transform           = famous.core.Transform;
        var StateModifier       = famous.modifiers.StateModifier;
        var Scene               = require('famodev/ui/pages/Scene');

        function Page1() {
            Scene.apply(this, arguments);

            _createBackground.call(this);
            _createLayout.call(this);
        }
        Page1.prototype = Object.create(Scene.prototype);
        Page1.prototype.constructor = Page1;

        /**
         * Add views
         */
        function _createBackground(){
            this._bg = new Surface({
                size: [undefined, undefined],
                properties: {
                    'background': 'red'
                }
            });
            this
            .add(new StateModifier({
                transform: Transform.translate(0, 0, -1)
            }))
            .add(this._bg);
        }

        function _createLayout() {
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
                            'background': 'blue',
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    content: new Surface({
                        content: 'This is the content surface',
                        properties: {
                            'background': 'green',
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    footer: new Surface({
                        content: 'This is the footer surface',
                        properties: {
                            'background': 'yellow',
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
        _.extend(Page1.prototype, {
            destroyed: function () {
                console.log('Page1 destroyed');
            },
            rendered: function () {
                console.log('Page1 rendered');
            }
        });

        /**
         * Events
         */


        module.exports = Page1;
});

define('famodev/ui/pages/tests/Page2', [
    'require',
    'exports',
    'module',

    'famodev/ui/pages/Scene',
    ], function (require, exports, module) {

        var Surface             = famous.core.Surface;
        var Modifier            = famous.core.Modifier;
        var Transform           = famous.core.Transform;
        var StateModifier       = famous.modifiers.StateModifier;
        var Scene               = require('famodev/ui/pages/Scene');

        function Page2() {
            Scene.apply(this, arguments);

            _createBackground.call(this);
            _createLayout.call(this);
        }
        Page2.prototype = Object.create(Scene.prototype);
        Page2.prototype.constructor = Page2;

        /**
         * Add views
         */
        function _createBackground(){
            this._bg = new Surface({
                size: [undefined, undefined],
                properties: {
                    'background': 'blue'
                }
            });
            this
            .add(new StateModifier({
                transform: Transform.translate(0, 0, -1)
            }))
            .add(this._bg);
        }

        function _createLayout() {
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
                            'background': 'red',
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    content: new Surface({
                        content: 'This is the content surface',
                        properties: {
                            'background': 'yellow',
                            'color': '#fff',
                            'text-align': 'center'
                        }
                    }),
                    footer: new Surface({
                        content: 'This is the footer surface',
                        properties: {
                            'background': 'green',
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
        _.extend(Page2.prototype, {
            destroyed: function () {
                console.log('Page2 destroyed');
            },
            rendered: function () {
                console.log('Page2 rendered');
            }
        });

        /**
         * Events
         */


        module.exports = Page2;
});


Meteor.startup(function () {
    require([
        'require',
        'exports',
        'module',

        'famodev/ui/pages/SceneController',
        'famodev/ui/pages/tests/Page1',
        'famodev/ui/pages/tests/Page2'

        ], function (require, exports, module) {
        var Engine              = famous.core.Engine;
        var Transform           = famous.core.Transform;
        var Surface             = famous.core.Surface;
        var StateModifier       = famous.modifiers.StateModifier;

        var SceneController     = require('famodev/ui/pages/SceneController');
        var Page1               = require('famodev/ui/pages/tests/Page1');
        var Page2               = require('famodev/ui/pages/tests/Page2');

        var mainContext = Engine.createContext();

        var modifier = new StateModifier({
            size: [undefined, undefined],
            transform: Transform.translate(0, 0, 0)
        });

        var sc = new SceneController();
        sc.addScene('p1', Page1);
        sc.addScene('p2', Page2);
        sc.setScene('p1', {
            content: 'hi'
        });
        Meteor.setTimeout(function () {
            sc.setScene('p2', {
                content: 'hi'
            });
        }, 5000);
        mainContext.add(modifier).add(sc);        
    });
});