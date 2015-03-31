/**
 * ReactiveSurface
 *     Display content with reactive data.
 * NOTE: check memory leak
 * @constructor
 * @extends {famous/core/Surface}
 * @status v0.3.0
 */
define('famodev/reactive/ReactiveSurface',[
    'require', 
    'exports',
    'module',
    'famodev/reactive/ReactiveSession'
    ],
    function(require, exports, module){

        var Surface             = famous.core.Surface;
        var ReactiveSession     = require('famodev/reactive/ReactiveSession');
        
        function ReactiveSurface (options){
            Surface.apply(this, arguments);
            this._reactiveSession = new ReactiveSession({
                data: options.content,
                surface: this
            });
            _setListeners.call(this);
        }
        ReactiveSurface.prototype = Object.create(Surface.prototype);

        /**
         * Functions
         */
        function _setListeners () {
            this._reactiveSession.on('changed', function(value){
                this.emit('changed', value);
            }.bind(this));
        }

        /**
         * Methods
         */
        var cleanup = ReactiveSurface.prototype.cleanup;
        var deploy  = ReactiveSurface.prototype.deploy;
        _.extend(ReactiveSurface.prototype, {
            constructor: ReactiveSurface,
            deploy: function (target) {
                deploy.call(this, target);
                this.emit('rendered');
            },
            //wrap up cleanup method
            cleanup: function (allocator) {
                // this._reactiveSession.stop();
                this.emit('destroyed');
                // http://stackoverflow.com/a/3955238/2104729
                // FIXME : some how famous surface doest remove all child elements on it
                // it should be, but i dont know why ?
                // so we have to remove by my self.
                // need check this again
                while (this._currentTarget.firstChild) {
                    this._currentTarget.removeChild(this._currentTarget.firstChild);
                }
                cleanup.call(this, allocator);
            },
            //this function will save content in document.createDocumentFragment();
            //we will not save content if we want it reactive
            recall: function (target) {
            }
        });

        module.exports = ReactiveSurface;
    });

// with session
// Meteor.startup(function(){
//     Session.set('session', 'value');
//     require([
//         'famodev/reactive/ReactiveSurface',
//         'famous/core/Engine',
//         'famous/core/Transform',
//         'famous/core/Modifier',
//         'famous/core/RenderNode'
//     ], function(){
//         var ReactiveSurface = require('famodev/reactive/ReactiveSurface');
//         var Engine          = require('famous/core/Engine');
//         var Transform       = require('famous/core/Transform');
//         var Modifier        = require('famous/core/Modifier');
//         var RenderNode      = require('famous/core/RenderNode');

//         var mainContext = Engine.createContext();
//         var sur = new ReactiveSurface({
//             size: [200, 200],
//             properties: {
//                 textAlign: 'center',
//                 color: 'white',
//                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//                 fontWeight: '200',
//                 fontSize: '16px',
//                 lineHeight: "200px",
//                 background: 'red'
//             },
//             content: function(){
//                 return '<h1>' + Session.get('session') + '</h1>';
//             }
//         });

//         var mod = new Modifier({
//             origin: [.5, .5],
//             align: [.5, .5]
//         });

//         sur.on('destroyed', function(){
//             console.log('destroyed');
//         });

//         sur.on('changed', function(data){
//             console.log(data);
//             mod.setTransform(Transform.translate(10, 0, 0), {duration: 500, curve: "easeIn"});
//         });

//         sur.on('rendered', function(){
//             console.log('rendered');
//         });

//         var node = new RenderNode(sur);

//         mainContext.add(mod).add(node);
//         Meteor.setTimeout(function(){
//             Session.set('session', 'value2');

//             // test delete
//             Meteor.setTimeout(function(){
//                 node.set(new RenderNode());
//                 Session.set('session', 'value3');

//                 // re add
//                 Meteor.setTimeout(function(){
//                     node.set(sur);
//                 }, 10000);

//             }, 10000);
//         }, 10000);
//     });
// });


//with database
// Meteor.startup(function(){
//     Items = new Meteor.Collection('items',{
//         connection: null
//     });
//     Items.insert({
//         _id: 'test',
//         text: 'cookie'
//     });
//     require([
//         'famodev/reactive/ReactiveSurface',
//         'famous/core/Engine',
//         'famous/core/Modifier',
//         'famous/core/Transform'
//     ], function(){
//         var ReactiveSurface = require('famodev/reactive/ReactiveSurface');
//         var Engine          = require('famous/core/Engine');
//         var Modifier        = require('famous/core/Modifier');
//         var Transform       = require('famous/core/Transform');

//         var mainContext = Engine.createContext();
//         var sur = new ReactiveSurface({
//             size: [200, 200],
//             properties: {
//                 textAlign: 'center',
//                 color: 'white',
//                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//                 fontWeight: '200',
//                 fontSize: '16px',
//                 lineHeight: "200px",
//                 background: 'red'
//             },
//             content: function(){
//                 return Items.findOne('test').text;
//             }
//         });

//         var mod = new Modifier({
//             origin: [.5, .5]
//         });

//         sur.on('changed', function(data){
//             console.log(data);
//             mod.setTransform(Transform.translate(10, 0, 0), {duration: 500, curve: "easeIn"});
//         });

//         mainContext.add(mod).add(sur);
//         Meteor.setTimeout(function(){
//             Items.update('test', {$set: {text: 'cookie 2'}});
//         }, 1000);
//     });
// });