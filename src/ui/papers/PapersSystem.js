define('famodev/ui/papers/PapersSystem', [
    'require', 
    'exports',
    'module',

    'famous/views/SequentialLayout',
    'famodev/ui/papers/Paper',

    'famous/core/View',
    'famous/core/RenderNode',
    
    'famous/core/Transform',
    'famous/core/Modifier',
    'famous/core/Engine'
    ],
    function (require, exports, module) {

    var Paper                   = require('famodev/ui/papers/Paper');

    var View                        = require('famous/core/View');
    var RenderNode                  = require('famous/core/RenderNode');
    
    var Transform                   = require('famous/core/Transform');
    var Modifier                    = require('famous/core/Modifier');
    var Engine                      = require('famous/core/Engine');
    function PapersSystem(renderable) {
        this._renderablesStore = new Register();
        this._renderables = [];
    }
    
    /**
     * Add Views
     */

    /**
     * Methods
     */
    _.extend(PapersSystem.prototype, {
        register: function (name, renderable) {
            this._renderablesStore.set(name, new Paper(name, renderable));
        },
        show: function (name, callback) {
            // NOTE: right now we not allow to call show twice
            // or show paper twice
            if(this._isRunning) {
                console.warn('paper show is running');
                return;
            }
            this._isRunning = true;
            Engine.nextTick(function() {
                var lastPaper = this._renderables[this._renderables.length -1];
                if(lastPaper && lastPaper.getName() == name) {
                    console.warn(name + " has really opened");
                    return;
                }
                var paper = this._renderablesStore.get(name);
                var index = this._renderables.length * 10;
                paper.setZIndex(index);
                if(lastPaper && lastPaper.setScale)
                    lastPaper.setScale(0.95);
                this._renderables.push(paper);
                if(this.onShow)
                    this.onShow();

                var self = this;
                paper.show(function () {
                    self._isRunning = false;
                    if(_.isFunction(callback))
                        callback();
                });
            }.bind(this));
        },
        hide: function (name, callback) {
            // NOTE: right now we not allow to call show when is running
            if(this._isRunning) {
                console.warn('paper hide is running');
                return;
            }
            this._isRunning = true;
            var paper;
            if(_.isUndefined(name)) 
                paper = this._renderables[this._renderables.length - 1];
            else
                paper = this._renderablesStore.get(name);
            var lastPaper = this._renderables[this._renderables.length -2];
            if(lastPaper && lastPaper.setScale)
                lastPaper.setScale(1);
            if(this.onHide)
                this.onHide();
            paper.hide(function(){
                // remove
                // this._renderablesStore.remove(name); // no remove on register, paper can be show again
                
                // DOESNT WORK; the dom doesn't removed from document (body) why ???
                // this._renderables = _.without(this._renderables, paper);
                this._isRunning = false;
                Engine.nextTick(function() {
                    var index = this._renderables.indexOf(paper);
                    if (index > -1) {
                        this._renderables.splice(index, 1);
                    }
                    paper.setZIndex(0);
                }.bind(this));
                if(_.isFunction(callback))
                    callback();
            }.bind(this));
        },
        setSize: function (size) {
            for (var i = 0; i < this._renderables.length; i++) {
                this._renderables[i].setSize(size);
            };
        },
        getRenderLength: function () {
            return this._renderables.length;
        },
        /**
         * Generate a render spec from the contents of this component.
         *
         * @private
         * @method render
         * @return {number} Render spec for this component
         */
        render: function () {
            var result = [];
            for (var i = 0; i < this._renderables.length; i++) {
                result.push(this._renderables[i].render());
            };
            return result;
        },
        // FIXME: check this function
        reset: function(){
            while(this._renderables.length > 0) {
                this._renderables.pop();
            }
        }
    });

    /**
     * Events
     */

    module.exports = PapersSystem;

});

// test
// define('header', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/View',
//     'famous/core/Surface',
//     'famous/core/Transform',
//     'famous/modifiers/StateModifier'
//     ],
//     function (require, exports, module) {

//     var View            = require('famous/core/View');
//     var Surface         = require('famous/core/Surface');
//     var Transform       = require('famous/core/Transform');
//     var StateModifier   = require('famous/modifiers/StateModifier');

//     function header() {
//         View.apply(this, arguments);

//         _createbackground.call(this);

//         _setListeners.call(this);
//     }
//     header.prototype = Object.create(View.prototype);
//     header.prototype.constructor = header;
//     header.DEFAULT_OPTIONS = {};

//     /**
//      * Add Views
//      */
//     function _createbackground() {
//         this
//         ._add(new StateModifier({
//             transform: Transform.translate(0, 0, -1)
//         }))
//         .add(new Surface({
//             properties: {
//                 backgroundColor: 'green'
//             }
//         }));
//     }

//     /**
//      * Methods
//      */

//     /**
//      * Events
//      */

//     function _setListeners() {
        
//     }

//     module.exports = header;

// });

// define('footer', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/View',
//     'famous/core/Surface',
//     'famous/core/Transform',
//     'famous/modifiers/StateModifier'
//     ],
//     function (require, exports, module) {

//     var View            = require('famous/core/View');
//     var Surface         = require('famous/core/Surface');
//     var Transform       = require('famous/core/Transform');
//     var StateModifier   = require('famous/modifiers/StateModifier');

//     function footer() {
//         View.apply(this, arguments);

//         _createbackground.call(this);

//         _setListeners.call(this);
//     }
//     footer.prototype = Object.create(View.prototype);
//     footer.prototype.constructor = footer;
//     footer.DEFAULT_OPTIONS = {};

//     /**
//      * Add Views
//      */
//     function _createbackground() {
//         this
//         ._add(new StateModifier({
//             transform: Transform.translate(0, 0, -1)
//         }))
//         .add(new Surface({
//             properties: {
//                 backgroundColor: 'blue'
//             }
//         }));
//     }

//     /**
//      * Methods
//      */

//     /**
//      * Events
//      */

//     function _setListeners() {
        
//     }

//     module.exports = footer;

// });

// define('body', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/View',
//     'famous/core/Surface',
//     'famous/core/Transform',
//     'famous/modifiers/StateModifier'
//     ],
//     function (require, exports, module) {

//     var View            = require('famous/core/View');
//     var Surface         = require('famous/core/Surface');
//     var Transform       = require('famous/core/Transform');
//     var StateModifier   = require('famous/modifiers/StateModifier');

//     function body() {
//         View.apply(this, arguments);

//         _createbackground.call(this);

//         _setListeners.call(this);
//     }
//     body.prototype = Object.create(View.prototype);
//     body.prototype.constructor = body;
//     body.DEFAULT_OPTIONS = {};

//     /**
//      * Add Views
//      */
//     function _createbackground() {
//         this
//         ._add(new StateModifier({
//             transform: Transform.translate(0, 0, -1)
//         }))
//         .add(new Surface({
//             properties: {
//                 backgroundColor: 'yellow'
//             }
//         }));
//     }

//     /**
//      * Methods
//      */

//     /**
//      * Events
//      */

//     function _setListeners() {
        
//     }

//     module.exports = body;

// });

// define('paper', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/View',
//     'famous/core/Surface',
//     'famous/core/Transform',
//     'famous/modifiers/StateModifier',
//     'famous/views/HeaderFooterLayout',

//     'header',
//     'footer',
//     'body'
//     ],
//     function (require, exports, module) {

//     var View            = require('famous/core/View');
//     var Surface         = require('famous/core/Surface');
//     var Transform       = require('famous/core/Transform');
//     var StateModifier   = require('famous/modifiers/StateModifier');
//     var HeaderFooter    = require('famous/views/HeaderFooterLayout');

//     var header          = require('header');
//     var footer          = require('footer');
//     var body            = require('body');

//     function paper() {
//         View.apply(this, arguments);

//         _createLayout.call(this);
//         _createHeader.call(this);
//         _createFooter.call(this);
//         _createBody.call(this);

//         _setListeners.call(this);
//     }
//     paper.prototype = Object.create(View.prototype);
//     paper.prototype.constructor = paper;
//     paper.DEFAULT_OPTIONS = {};

//     /**
//      * Add Views
//      */
    
//     function _createLayout() {
//         this.layout = new HeaderFooter({
//             headerSize: this.options.headerSize
//         });
//         this
//         ._add(new StateModifier({
//             transform: Transform.translate(0, 0, 0.1)
//         }))
//         .add(this.layout);
//     }

//     function _createHeader() {
//         this._headerModifier = new StateModifier({
//             transform: Transform.translate(0, 0, zIndex4_header),
//             align: [0, 0],
//             origin: [0, 0],
//             size: [undefined, 44]
//         });
//         this.layout.header
//         .add(this._headerModifier)
//         .add(new header());
//     }

//     function _createFooter() {
//         this._footerModifier = new StateModifier({
//             transform: Transform.translate(0, 0, 1),
//             align: [0, 0],
//             origin: [0, 0],
//             size: [undefined, 44]
//         });
//         this.layout.footer
//         .add(this._footerModifier)
//         .add(new footer());
//     }

//     function _createBody() {
//         this.layout.content
//         .add(new StateModifier({
//             transform: Transform.translate(0, 0, 2),
//             size: [undefined, undefined]
//         }))
//         .add(new body());
//     }

//     /**
//      * Methods
//      */

//     /**
//      * Events
//      */

//     function _setListeners() {
        
//     }

//     module.exports = paper;

// });

// Meteor.startup(function(){
//     require([
//         'famous/core/Engine',
//         'famous/core/Surface',
//         'famous/modifiers/StateModifier',
//         'famous/core/Transform',

//         'PapersSystem',
//         'paper'
//     ],
//     function(Engine, Surface, StateModifier, Transform, PapersSystem, paper) {

//         var mainContext     = Engine.createContext();
//         var p               = new paper();

//         //https://developer.mozilla.org/en-US/docs/Web/CSS/perspective
//         //mainContext.setPerspective(1000);

//         var papersSystem = new PapersSystem();
//         papersSystem.register('paper', p);
//         papersSystem.register('paper2', new paper());

//         mainContext.add(new Surface({
//             size: [undefined, undefined],
//             properties: {
//                 backgroundColor: 'red'
//             }
//         }));

//         mainContext
//         .add(new StateModifier({
//             transform: Transform.translate(0, 0, 0.1)
//         }))
//         .add(papersSystem);

//         Meteor.setTimeout(function () {
//             papersSystem.show('paper');
//             Meteor.setTimeout(function () {
//                 papersSystem.show('paper2');
//                 papersSystem.hide('paper');
//             }, 3000);
//         }, 2000)
//     });

// });
