/**
Thinking about code style

https://github.com/Famous/famous/blob/master/src/views/RenderController.js
https://github.com/Famous/famous/blob/master/src/views/Flipper.js

var p = new PagesManager({
    inTransition: ,
    outTransition: ,
    overlap: true
});

p.register('main', renderable);

p.show('main');
p.hide();

p.back();
p.next();

http://jsbin.com/tizuwu/1/edit
*/

// https://github.com/Famous/scene/branches/all

// define('famodev/ui/PagesManager', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/Engine',
//     'famous/core/View',
//     'famous/utilities/Utility',

//     'famodev/ui/Page'
//     ], function (require, exports, module) {

//         var Engine              = require('famous/core/Engine');
//         var View                = require('famous/core/View');
//         var Utility             = require('famous/utilities/Utility');
//         var Page                = require('famodev/ui/Page');

//         function PagesManager() {
//             View.apply(this, arguments);
//             /**
//              * List of available renderable
//              * @type {object}
//              */
//             this._renderableNode = new Register();
//             /**
//              * List of renderable which render on the dom
//              * @type {array}
//              */
//             this._nodes = [];
//             /**
//              * A renderable which display when nothing to render
//              * @type {object}
//              */
//             this._defaultPage = null;
//             /**
//              * The renderable is displayed on the screen
//              * @type {object}
//              */
//             this._currentPage = null;
//             /**
//              * back
//              * @type {array}
//              */
//             this._historyPages = [];
//             /**
//              * next
//              * @type {array}
//              */
//             this._nextPages = [];
//             /**
//              *
//              * Note: we dont fire any event when animation is running
//              */
//             this._isAnimate = false;

//             this._prevPage = null;
//             this._nextPage = null;

//         }

//         PagesManager.prototype = Object.create(View.prototype);
//         PagesManager.DEFAULT_OPTIONS = {
//             overlap: true,
//             autoDisplayDefaultPage: true,
//             hideZIndex: 0,
//             showZIndex: 1
//         };

//         /**
//          * Methods
//          */
//         _.extend(PagesManager.prototype, {
//             constructor: PagesManager,

//             /**
//              * Generate a render spec from the contents of this component (60fps).
//              * 
//              * @private
//              * @method render
//              * @return {number} Render spec for this component
//              */
//             render: function render() {
//                 var result = [];
//                 for (var i = 0; i < this._nodes.length; i++) {
//                     if(this._nodes[i])
//                         result[i] = this._nodes[i].render();
//                 }
//                 return result;
//             },
            
//             /**
//              *
//              *
//              */
//             _removeRenderableFromNodes: function (renderable) {
//                 var index = this._nodes.indexOf(renderable);
//                 if (index > -1) {
//                     /**
//                      * Queue a function to be executed sometime soon, at a time that is
//                      *    unlikely to affect frame rate.
//                      *
//                      */
//                     Engine.defer(function () {
//                         this._nodes.splice(index, 1);
//                     }.bind(this));
//                 }
//             },

//             /**
//              *
//              *
//              */
//             _addRenderableToNodes: function(renderable){
//                 this._nodes.push(renderable);
//             },


//             // draft
//             register: function register (name, renderable) {
//                 var page = new Page(renderable);
//                 this._renderableNode.set(name, page);
//                 // set default page
//                 if(!this._defaultPage) {
//                     this.setDefaultPage(page);
//                 }
//             },

//             /**
//              *
//              */
//             getDefaultPage: function () {
//                 return this._defaultPage;
//             },

//             /**
//              *
//              */
//             setDefaultPage: function (renderable) {
//                 this._defaultPage = renderable;
//                 // show if it doesnt display any things
//                 if(this._nodes.length == 0 && this.options.autoDisplayDefaultPage) {
//                     this._defaultPage.opacity(1, {
//                         duration: 0
//                     });
//                     this._defaultPage.moveX(0, {
//                         duration: 0
//                     });
//                     this._nodes.push(this._defaultPage);
//                     this._defaultPage.rendered();
//                     this._prevPage = this._currentPage;
//                     this._currentPage = this._defaultPage;                    
//                 }
//             },

//             /**
//              *
//              */
//             show: function(name){
//                 if(this._isAnimate)
//                     return;
//                 var renderable;
//                 if(_.isString(name))
//                     renderable = this._renderableNode.get(name);
//                 // not found
//                 if(!renderable)
//                     return;
//                 if(renderable === this._currentPage)
//                     return;
//                 this._prevPage = this._currentPage;
//                 this._currentPage = renderable;
//                 this._historyPages.push(this._prevPage);
//                 this._nextPages = []; // reset
//                 this._nextPage = null;
//                 this._runShowAnimation(renderable, this._prevPage, function(){
//                     console.log('show done');
//                     this._removeRenderableFromNodes(this._prevPage);
//                 }.bind(this));
//             },
//             _runShowAnimation: function(display, hide, callback){
//                 var _cb = Utility.after(2, function(){
//                     this._isAnimate = false;
//                     if(_.isFunction(callback))
//                         callback();
//                 }.bind(this));
//                 // start x
//                 display.moveX(window.innerWidth, {
//                     duration: 0
//                 });
//                 display.opacity(1, {
//                     duration: 0
//                 });

//                 display._zTran.set(this.options.showZIndex);
//                 hide._zTran.set(this.options.hideZIndex);

//                 this._addRenderableToNodes(display);
//                 this._isAnimate = true;

//                 // start animation
//                 this._isAnimate = true;
//                 hide.multiply([
//                     {zoomIn: 0.85},
//                     {opacity: 0.7}
//                 ], function(){
//                     hide.destroyed();
//                     _cb();
//                 });

//                 display.multiply([
//                     {opacity: 1},
//                     {moveX: 0}
//                 ], function(){
//                     display.rendered();
//                     _cb();
//                 });
//             },

//             /**
//              *
//              */
//             hide: function(name){
//                 throw new Error('not implement yet');
//             },
//             /**
//              *
//              */
//             back: function(){
//                 if(this._isAnimate)
//                     return;
//                 if(this._historyPages.length === 0 || this._prevPage == null)
//                     return;
                
//                 this._nextPage = this._currentPage;
//                 this._nextPages.push(this._nextPage);
//                 this._currentPage = this._historyPages.pop();
//                 this._prevPage = this._historyPages[this._historyPages.length - 1];
//                 if(this._prevPage === undefined)
//                     this._prevPage = null;
//                 this._runBackAnimation(this._currentPage, this._nextPage, function(){
//                     console.log('back done');
//                     this._nextPage.opacity(0, {
//                         duration: 0
//                     });
//                     this._removeRenderableFromNodes(this._nextPage);
//                 }.bind(this));
//             },
//             _runBackAnimation: function(display, hide, callback){
//                 var _cb = Utility.after(2, function(){
//                     this._isAnimate = false;
//                     if(_.isFunction(callback))
//                         callback();
//                 }.bind(this));
//                 this._addRenderableToNodes(this._currentPage);

//                 display._zTran.set(this.options.hideZIndex);
//                 hide._zTran.set(this.options.showZIndex);

//                 //start animation
//                 this._isAnimate = true;
//                 display.multiply([
//                     {zoomIn: 1},
//                     {opacity: 1}
//                 ], function(){
//                     display.rendered();
//                     _cb();
//                 });

//                 hide.multiply([
//                     {moveX: window.innerWidth}
//                 ], function(){
//                     display.destroyed();
//                     _cb();
//                 });
//             },

//             /**
//              *
//              */
//             next: function(){
//                 throw new Error('not implement yet');
//                 if(this._nextPages.length === 0)
//                     return;
//                 this._removeRenderableFromNodes(this._currentPage);
//                 this._prevPage = this._currentPage;
//                 this._historyPages.push(this._prevPage);
//                 this._currentPage = this._nextPages.pop();
//                 this._nextPage = this._nextPages[this._nextPages.length - 1];
//                 if(this._nextPage === undefined)
//                     this._nextPage = null;
//                 this._addRenderableToNodes(this._currentPage);
//             }
//         });

//         module.exports = PagesManager;
//     });



// define('famodev/ui/Page', [
//     'require', 
//     'exports',
//     'module',
//     'famous/core/View',
//     'famous/core/Modifier',
//     'famous/core/Transform',
//     'famous/transitions/Transitionable',
//     'famous/utilities/Utility'
//     ], function (require, exports, module) {

//         var View                = require('famous/core/View');
//         var Modifier            = require('famous/core/Modifier');
//         var Transform           = require('famous/core/Transform');
//         var Transitionable      = require('famous/transitions/Transitionable');
//         var Utility             = require('famous/utilities/Utility');

//         function Page(renderable) {
//             View.apply(this, arguments);

//             this._xTran = new Transitionable(0);
//             this._yTran = new Transitionable(0);
//             this._zTran = new Transitionable(0);

//             this._xScale = new Transitionable(1);
//             this._yScale = new Transitionable(1);
//             this._zScale = new Transitionable(1);

//             this._modifier = new Modifier({
//                 align: [.5, .5],
//                 origin: [.5, .5],
//                 transform: function() {
//                     return Transform.multiply4x4(
//                         Transform.translate(this._xTran.get(), this._yTran.get(), this._zTran.get()),
//                         Transform.scale(this._xScale.get(), this._yScale.get(), this._zScale.get())
//                     );
//                 }.bind(this)
//             });


//             this._isAnimate = 0;

//             // reset
//             this._modifier.setOpacity(0);

//             this._renderable = renderable;
//             this._renderable.pipe(this);
//             this
//             .add(this._modifier)
//             .add(this._renderable);
//         }

//         Page.prototype = Object.create(View.prototype);

//         Page.DEFAULT_OPTIONS = {
//             transition: {
//                 duration: 200,
//                 curve: 'easeOut'
//             }
//         };

//         /**
//          * Methods
//          */
//         _.extend(Page.prototype, {
//             constructor: Page,

//             rendered: function () {
//                 if(this._renderable && this._renderable.rendered)
//                     this._renderable.rendered();
//             },

//             destroyed: function () {
//                 if(this._renderable && this._renderable.destroyed)
//                     this._renderable.destroyed();
//             },

//             _getOptions: function (options, callback) {
//                 if(typeof options == 'function') {
//                     callback = options;
//                     options = null;  
//                 }
//                 if(!options)
//                     options = this.options.transition;
//                 var _cb = function () {
//                     this._isAnimate--;
//                     if(typeof callback == 'function')
//                         callback();
//                 }.bind(this);
//                 return [options, _cb];
//             },

//             _requireHalt: function(){
//                 if(this._isAnimate) {
//                     this._xTran.halt();
//                     this._yTran.halt();
//                     this._zTran.halt();

//                     this._xScale.halt();
//                     this._yScale.halt();
//                     this._zScale.halt();
//                 }
//             },

//             halt: function () {
//                 this._modifier.halt();
//             },

//             // animations
//             zoomIn: function (number) {
//                 var args = Array.prototype.slice.call(arguments, 1);
//                 options = this._getOptions.apply(this, args);

//                 var _cb = Utility.after(2, options[1]);

//                 this._isAnimate ++;
//                 if(this._xScale) {
//                     this._xScale.set(number, options[0], _cb);
//                 }
//                 if(this._yScale) {
//                     this._yScale.set(number, options[0], _cb);
//                 }
//                 return this;
//             },

//             zoomOut: function (number, options) {
//                 var args = Array.prototype.slice.call(arguments, 1);
//                 options = this._getOptions.apply(this, args);

//                 var _cb = Utility.after(2, options[1]);

//                 this._isAnimate ++;
//                 if(this._xScale) {
//                     this._xScale.set(number, options[0], _cb);
//                 }
//                 if(this._yScale) {
//                     this._yScale.set(number, options[0], _cb);
//                 }
//                 return this;
//             },

//             moveX: function (value) {
//                 var args = Array.prototype.slice.call(arguments, 1);
//                 options = this._getOptions.apply(this, args);
                
//                 this._isAnimate ++;
//                 this._xTran.set(value, options[0], options[1]);
//                 return this;
//             },
            
//             moveY: function (value) {
//                 var args = Array.prototype.slice.call(arguments, 1);
//                 options = this._getOptions.apply(this, args);

//                 this._isAnimate ++;
//                 this._yTran.set(value, options[0], options[1]);
//                 return this;
//             },

//             opacity: function (value) {
//                 var args = Array.prototype.slice.call(arguments, 1);
//                 options = this._getOptions.apply(this, args);
                
//                 this._isAnimate ++;
//                 this._modifier.setOpacity(value, options[0], options[1]);
//                 return this;
//             },

//             multiply: function (animates, callback) {
//                 var self = this;
//                 var _cb = Utility.after(animates.length, function(){
//                     if(_.isFunction(callback))
//                         callback();
//                 }.bind(this));

//                 _.each(animates, function (value) {
//                     _.each(value, function (v, k) {
//                         self[k].call(self, v, _cb);
//                     });
//                 });
//                 return this;
//             }
//         });

//         module.exports = Page;
//     });



// Meteor.startup(function () {
// require([
//     'require',
//     'exports',
//     'module',
//     "famous/core/Engine",
//     "famous/core/Surface",
//     "famous/core/Modifier",

//     'famodev/ui/PagesManager'

//     ], function (require, exports, module) {

//     var Engine          = require('famous/core/Engine');
//     var Surface         = require('famous/core/Surface');
//     var Modifier        = require('famous/core/Modifier');

//     var PagesManager    = require('famodev/ui/PagesManager');

//     var p = new PagesManager();

//     var mainContext = Engine.createContext();
//     mainContext.setPerspective(500);
//     var currentI = 0, rec = 1;
//     for (var i = 0; i < 10; i++) {
//         var sur = new Surface({
//             content: "<h1>Surface: " + (i + 1) + '</h1>',
//             size: [undefined, undefined],
//             properties: {
//                 backgroundColor: "hsl(" + (i * 360 / 10) + ", 100%, 50%)",
//                 lineHeight: "200px",
//                 textAlign: 'center'
//             }
//         });
//         sur.on('click', function (evt) {
//             evt.preventDefault();
//             if(currentI == 10)
//                 rec = -1;
//             if(currentI == 0)
//                 rec = 1;
//             if(rec === 1) {
//                 currentI += rec;
//                 console.log('sur'+ currentI);
//                 p.show('sur'+ currentI);
//             }
//             if(rec === -1) {
//                 currentI += rec;
//                 p.back();
//             }
//         });
//         p.register('sur' + i, sur);
//     };
//     var centerModifier = new Modifier({
//         align : [.5, .5],
//         origin : [.5, .5]
//     });

//     mainContext
//     .add(centerModifier)
//     .add(p);

// });


// require([
//     'require',
//     'exports',
//     'module',
//     "famous/core/Engine",
//     "famous/core/Surface",
//     "famous/core/Modifier",
    
//     'famodev/ui/Page'

//     ], function (require, exports, module) {

//     var Engine          = require('famous/core/Engine');
//     var Surface         = require('famous/core/Surface');
//     var Modifier        = require('famous/core/Modifier');

//     var Page            = require('famodev/ui/Page');

//     var mainContext = Engine.createContext();
//     mainContext.setPerspective(500);

//     var i = 0;
//     var sur1 = new Surface({
//         content: "Surface: " + (i + 1),
//         size: [200, 200],
//         properties: {
//             backgroundColor: "hsl(" + (i * 360 / 10) + ", 100%, 50%)",
//             lineHeight: "200px",
//             textAlign: 'center'
//         }
//     });
//     i = 9;
//     var sur2 = new Surface({
//         content: "Surface: " + (i + 1),
//         size: [200, 200],
//         properties: {
//             backgroundColor: "hsl(" + (i * 360 / 10) + ", 100%, 50%)",
//             lineHeight: "200px",
//             textAlign: 'center'
//         }
//     });

//     var p = new Page(sur1);

//     var centerModifier = new Modifier({
//         align : [.5,.5],
//         origin : [.5,.5]
//     });

//     mainContext
//     .add(centerModifier)
//     .add(p);

//     window.p = p;
//     p._eventInput.on('click', function(evt){
//         evt.preventDefault();
//         p._requireHalt();
//     });

//     setTimeout(function () {
//         p.zoomIn(0.8);
//         p.moveX(100);
//         setTimeout(function(){
//             p.moveY(100);
//             p.opacity(0.7);
//         }, 1000);
//     }, 1000);
// });


// });