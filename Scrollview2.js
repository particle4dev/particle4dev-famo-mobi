define('widgets/Scrollview2', [
    'famous/views/Scrollview',
    'famous/core/Surface',
    'famous/core/RenderNode'
    ], function (require, exports, module) {
        
        var Scrollview              = require("famous/views/Scrollview");
        var Surface                 = require("famous/core/Surface");
        var RenderNode              = require("famous/core/RenderNode");
    
        function Scrollview2 () {
            Scrollview.apply(this, arguments);

            this._scroller.group.elementClass = ["famous-group", "list"];

            _attachEvents.call(this);
        };
        Scrollview2.prototype = Object.create(Scrollview.prototype);
        Scrollview2.prototype.constructor = Scrollview2;
        Scrollview2.DEFAULT_OPTIONS = Scrollview.DEFAULT_OPTIONS;

        // direction move
        Scrollview2.UP      = 1;
        Scrollview2.FREEZE  = 0;
        Scrollview2.DOWN    = -1;
        // add view

        // events
        function _attachEvents() {
            // on edge event
            this._isTop = false;
            this._isBottom = false;
            this._scroller.on('edgeHit', function(data) {
                this._eventOutput.emit('edgeHit', data);
                if(data.position == 0){
                    if(!this._isTop)
                        this._eventOutput.emit('onTop', data);
                    this._isTop = true;
                    this._isBottom = false;
                }
                if(data.position < 0){
                    if(!this._isBottom)
                        this._eventOutput.emit('onBottom', data);
                    this._isTop = false;
                    this._isBottom = true;
                }
            }.bind(this));

            // direction scroll
            this._eventInput.on('start', function(event){
                this._eventOutput.emit('startScroll', event);

            });
            this._eventInput.on('update', function(event){
                if(this._scroller._onEdge == -1){
                    this._isTop = true;
                    this._isBottom = false;
                }
                else if(this._scroller._onEdge == 1){
                    this._isTop = false;
                    this._isBottom = true;
                }
                else if(this._scroller._onEdge == 0){
                    this._isTop = false;
                    this._isBottom = false;
                }

                if(event.velocity > 0)
                    this._directionMove = Scrollview2.UP;
                if(event.velocity < 0)
                    this._directionMove = Scrollview2.DOWN;

                this._eventOutput.emit('moveScroll', event);
            });
            this._eventInput.on('end', function(event){
                this._directionMove = Scrollview2.FREEZE;
                this._eventOutput.emit('endScroll', event);
            });
            this._directionMove = Scrollview2.FREEZE;
            this.getDirection = function (){
                return this._directionMove;
            }
            this.isOnTop = function(){
                return this._isTop;
            }
            this.isOnBottom = function(){
                return this._isBottom;
            }
        };

        module.exports = Scrollview2;
    });

// Meteor.startup(function(){

//     define(function(require, exports, module) {
//         var Engine     = require("famous/core/Engine");
//         var Surface    = require("famous/core/Surface");
//         var Scrollview = require('widgets/Scrollview2');

//         var mainContext = Engine.createContext();

//         var scrollview = new Scrollview();
//         var surfaces = [];

//         scrollview.sequenceFrom(surfaces);

//         for (var i = 0, temp; i < 40; i++) {
//             temp = new Surface({
//                  content: "Surface: " + (i + 1),
//                  size: [undefined, 200],
//                  properties: {
//                      backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
//                      lineHeight: "200px",
//                      textAlign: "center"
//                  }
//             });

//             temp.pipe(scrollview);
//             surfaces.push(temp);
//         }

//         scrollview.on('onBottom', function(data){
//             console.log(data);
//         });
//         scrollview.on('onTop', function(data){
//             console.log(data);
//         });

//         scrollview.on('moveScroll', function(event){
//             if(this.getDirection() == Scrollview.UP)
//                 console.log('UP');
//             if(this.getDirection() == Scrollview.DOWN)
//                 console.log('DOWN');
//         });
        
//         mainContext.add(scrollview);
//     });

// });