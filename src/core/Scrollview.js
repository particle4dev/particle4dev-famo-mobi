/**
 * Scrollview
 *
 * @constructor
 * @extends {famous/views/Scrollview}
 * @status stable
 */
define('famodev/core/Scrollview',[
    'require', 
    'exports',
    'module'
    ],
    function (require, exports, module) {

        var ScrollviewOrigin        = famous.views.Scrollview;
        var Surface                 = famous.core.Surface;
        var RenderNode              = famous.core.RenderNode;

        function Scrollview () {
            ScrollviewOrigin.apply(this, arguments);

            this._scroller.group.elementClass = ["famous-group", "list"];

            _attachEvents.call(this);
        }
        Scrollview.prototype = Object.create(ScrollviewOrigin.prototype);
        Scrollview.prototype.constructor = Scrollview;
        Scrollview.DEFAULT_OPTIONS = ScrollviewOrigin.DEFAULT_OPTIONS;

        // direction move
        Scrollview.UP      = 1;
        Scrollview.FREEZE  = 0;
        Scrollview.DOWN    = -1;
        // add view

        // events
        function _attachEvents() {
            // on edge event
            this._isTop = false;
            this._isBottom = false;
            this._scroller.on('onEdge', function(data) {
                this._eventOutput.emit('onEdge', data);
                if(data.position === 0){
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
                else if(this._scroller._onEdge === 0){
                    this._isTop = false;
                    this._isBottom = false;
                }

                if(event.velocity > 0)
                    this._directionMove = Scrollview.UP;
                if(event.velocity < 0)
                    this._directionMove = Scrollview.DOWN;

                this._eventOutput.emit('moveScroll', event);
            });
            this._eventInput.on('end', function(event){
                this._directionMove = Scrollview.FREEZE;
                this._eventOutput.emit('endScroll', event);
            });
            this._directionMove = Scrollview.FREEZE;
            this.getDirection = function (){
                return this._directionMove;
            };
            this.isOnTop = function(){
                return this._isTop;
            };
            this.isOnBottom = function(){
                return this._isBottom;
            };
        }

        module.exports = Scrollview;
    });

define('famodev/Scrollview',[
    'require', 
    'exports',
    'module',
    'famodev/core/Scrollview'
    ],
    function (require, exports, module) {
        var Scrollview  = require('famodev/core/Scrollview');
        module.exports = Scrollview;
    });