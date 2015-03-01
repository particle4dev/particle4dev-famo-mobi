
var isRenderable = function (obj) {
    if(obj && obj.render)
        return true;
    return false;
};

/**
 * PagesManager
 *      
 *
 * @constructor
 * @extends {}
 * @status v0.3.0
 */
define('famodev/app/PagesManager', [
    'require', 
    'exports',
    'module'
    ], function (require, exports, module) {

        var Transform           = famous.core.Transform;
        var Lightbox            = famous.views.Lightbox;
        var Transitionable      = famous.transitions.Transitionable;
        var SpringTransition    = famous.transitions.SpringTransition;
        var Easing              = famous.transitions.Easing;

        Transitionable.registerMethod('spring', SpringTransition);
        /**
         * Add Views
         */
        var PagesManager = function(opt){
            var PagesLine       = new Pipeline();
            var pages = {},
            defaultPage = null,
            currentpage = null,
            autoShow = true,
            isShow = false,
            currentPageObject = null;
            if(!opt)
                opt = PagesManager.SlideHideLeft;
            var lightbox = new Lightbox(opt);

            /**
             * Methods
             */
            var _requireShow = function () {
                if(!autoShow || isShow)
                    return;
                this.show();
                isShow = true;
            }.bind(this);

            this['getInstance'] = function(){
                return lightbox;
            };
            // PagesManager.register('views/LeadsListingsInterestedView');
            // or
            // PagesManager.register('page1', renderable);
            this['register'] = function (path, options) {
                if(_.isString(path) && isRenderable(options)) {
                    pages[path] = options;
                    if(!defaultPage)
                        this['defaultPage'](path);
                    _requireShow();
                    return ;
                }
                var pageModule = require(path);
                pages[path] = pageModule;
                if(!defaultPage)
                    this['defaultPage'](path);
                _requireShow();
                return ;
            };
            this['getPage'] = function (path) {
                return pages[path];
            };
            this['defaultPage'] = function (page) {
                if(page)
                    return defaultPage = page;
                return defaultPage;
            };
            this['show'] = function (path) {
                PagesLine.push(function(path){
                    if(!path)
                        path = defaultPage;
                    if(currentpage == path)
                        return;
                    // call destroyed
                    var p1 = currentPageObject;
                    if(p1 && p1.destroyed)
                        p1.destroyed();

                    var p2 = new pages[path]();
                    currentPageObject = p2;
                    // call rendered
                    if(p2 && p2.rendered)
                        p2.rendered();
                    if(p1)
                        lightbox.hide(function () {
                            if(p1 && p1.destroyDom)
                                p1.destroyDom();
                            lightbox.show(p2);
                        });
                    else
                        lightbox.show(p2);
                    currentpage = path;
                }, path);
                PagesLine.sequenceFlush({
                    duration: 500 //ms
                });
            };
        };

        // Methods
        _.extend(PagesManager.prototype, {

        });
        
        // static value
        _.extend(PagesManager, {
            HideOutgoingSpringIn: {
                inOpacity: 0,
                outOpacity: 0,
                inTransform: Transform.scale(0, -0.1, 0), //Transform.translate(window.innerWidth,0,0),
                outTransform: Transform.translate(0, 0, 1),
                inTransition: {
                    method: 'spring',
                    period: 500,
                    dampingRatio: 0.6
                },
                outTransition: {
                    duration: 300,
                    curve: Easing.easeOut
                }
            },


            // done (fadeIn)
            OpacityIn: {
                inOpacity: 0,
                outOpacity: 0,
                inTransform: Transform.identity,
                outTransform: Transform.identity,
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeOut
                }
            },



            Identity: {
                inOpacity: 1,
                outOpacity: 1,
                inTransform: Transform.identity,
                outTransform: Transform.identity,
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 300,
                    curve: Easing.easeIn
                },
            },
            SlideDown: {
                inOpacity: 0,
                outOpacity: 1,
                showOpacity: 1,
                showTransform: Transform.identity,
                inTransform: Transform.inFront,
                outTransform: Transform.translate(0, window.innerHeight, 0),
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeIn
                },
                overlap: true
            },

            // done (slideUp)
            SlideUp: {
                inOpacity: 0,
                outOpacity: 0,
                showOpacity: 1,
                showTransform: Transform.identity,
                inTransform: Transform.translate(0, window.innerHeight, 0),
                outTransform: Transform.behind,
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeIn
                },
                overlap: true
            },

            SlideLeft: {
                inOpacity: 1,
                outOpacity: 1,
                inTransform: Transform.translate(window.innerWidth, 0, 0),
                outTransform: Transform.translate(window.innerWidth * -1, 0, 0),
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeIn
                },
                overlap: true
            },
            SlideRight: {
                inOpacity: 1,
                outOpacity: 1,
                inTransform: Transform.translate(window.innerWidth * -1, 0, 0),
                outTransform: Transform.translate(window.innerWidth, 0, 0),
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeIn
                },
                overlap: true
            },
            SlideHideLeft: {
                inOpacity: 0,
                outOpacity: 1,
                showOpacity: 1,
                showTransform: Transform.identity,
                inTransform: Transform.identity,
                outTransform: Transform.translate(window.innerWidth * -1, 0, 0),
                inTransition: {
                    duration: 500,
                    curve: Easing.easeIn
                },
                outTransition: {
                    duration: 350,
                    curve: Easing.easeIn
                },
                // overlap: true
            },
            TurnOff: {
                inOpacity: 0,
                outOpacity: 1,
                showOpacity: 1,
                showTransform: Transform.identity,
                inTransform: Transform.identity,
                outTransform: Transform.translate(window.innerWidth * -1, 0, 0),
                inTransition: null,
                outTransition: null,
                overlap: true
            }
        });

        /**
         * Methods
         */
        _.extend(PagesManager.prototype, {

        });

        /**
         * Events
         */

        return module.exports = PagesManager;
});

/**
 * Tests
 */
// require([
//     'famodev/app/PagesManager'
//     ], function (PagesManager) {
//         var Engine      = famous.core.Engine;
        
//         var context     = Engine.createContext();
//         var p = new PagesManager();
//         p.register('page1', new famous.core.Surface({
//             size: [undefined, undefined],
//             properties: {
//                 backgroundColor: 'blue'
//             }
//         }));
//         p.register('page2', new famous.core.Surface({
//             size: [undefined, undefined],
//             properties: {
//                 backgroundColor: 'green'
//             }
//         }));
//         context.add(p.getInstance());
// });