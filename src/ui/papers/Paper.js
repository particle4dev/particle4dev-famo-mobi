define('famodev/ui/papers/Paper', [
    'require', 
    'exports',
    'module',

    'famous/surfaces/ContainerSurface',
    'famous/core/View',
    'famous/core/RenderNode',

    'famous/core/Transform',
    'famous/core/Modifier',
    'famous/transitions/Transitionable',
    'famous/transitions/TransitionableTransform',
    'famous/transitions/Easing',
    'famous/utilities/Utility',

    'famodev/Utils'
    ],
    function (require, exports, module) {

    var ContainerSurface            = require('famous/surfaces/ContainerSurface');
    var View                        = require('famous/core/View');
    var RenderNode                  = require('famous/core/RenderNode');

    var Transform                   = require('famous/core/Transform');
    var Modifier                    = require('famous/core/Modifier');
    var Transitionable              = require('famous/transitions/Transitionable');
    var TransitionableTransform     = require('famous/transitions/TransitionableTransform');
    var Easing                      = require('famous/transitions/Easing');
    var Utility                     = require('famous/utilities/Utility');

    var Utils                       = require('famodev/Utils');

    var _status = {
        // in
        inTransform: Transform.translate(Utils.windowWidth(), 0, 0),
        inOpacity: 0,
        inOrigin: [0.5, 0.5],
        inAlign: [0.5, 0.5],

        // out
        outTransform: Transform.translate(Utils.windowWidth(), 0, 0),
        outOpacity: 1,
        outOrigin: [0.5, 0.5],
        outAlign: [0.5, 0.5],

        // show
        showTransform: Transform.translate(0, 0, 0),
        showOpacity: 1,
        showOrigin: [0.5, 0.5],
        showAlign: [0.5, 0.5],

        inTransition: {
            duration: 250,
            curve: Easing.easeInOutBack
        },
        outTransition: {
            duration: 250,
            curve: Easing.easeInOutBack
        }
    };

    function Paper(name, renderable) {
        this._name          = name;
        // this._node          = new RenderNode();
        // this._node          = new ContainerSurface();
        this._node          = new View();

        this._renderable    = renderable;

        this._boxModifier = {
            transform: new TransitionableTransform(_status.inTransform),
            opacity: new Transitionable(_status.inOpacity),
            align: new Transitionable(_status.inAlign),
            origin: new Transitionable(_status.inOrigin)
        };

        this.boxModifier = new Modifier({
            transform: this._boxModifier.transform,
            opacity: this._boxModifier.opacity,
            align: this._boxModifier.align,
            origin: this._boxModifier.origin,
            // size: [undefined, undefined] // FIXME: not work on famous 0.3.1
        });

        this._zindex = new Transitionable(0);
        this._scale = new Transitionable(1);
        this._modSizeZindex = new Modifier({ 
            transform: function() {
                return Transform.multiply4x4(
                    Transform.translate(0, 0, this._zindex.get()),
                    Transform.scale(this._scale.get(), this._scale.get(), 1)
                );
            }.bind(this),
            size: [Utils.windowWidth(), Utils.windowHeight()]
        });

        this._node
        .add(this.boxModifier)
        .add(this._modSizeZindex)
        .add(this._renderable);
    }
    
    /**
     * Add Views
     */

    /**
     * Methods
     */
    _.extend(Paper.prototype, {
        show: function (callback) {
            var self = this;
            var _cb = callback ? Utility.after(3, function(){
                callback();
                // call rendered
                if(self._renderable && self._renderable.rendered)
                    self._renderable.rendered();
            }) : Utility.after(3, function(){
                // call rendered
                if(self._renderable && self._renderable.rendered)
                    self._renderable.rendered();
            });

            var transition = _status.inTransition;

            this._boxModifier.transform.set(_status.showTransform, transition, _cb);
            this._boxModifier.opacity.set(_status.showOpacity, transition, _cb);
            this._boxModifier.align.set(_status.showAlign, transition, _cb);
            this._boxModifier.origin.set(_status.showOrigin, transition, _cb);
        },
        hide: function (callback) {
            var self = this;
            var _cb = callback ? Utility.after(3, function(){
                callback();
                // call destroyed
                if(self._renderable && self._renderable.destroyed)
                    self._renderable.destroyed();
            }) : Utility.after(3, function(){
                // call destroyed
                if(self._renderable && self._renderable.destroyed)
                    self._renderable.destroyed();
            });
            var transition = _status.outTransition;

            this._boxModifier.transform.set(_status.outTransform, transition, _cb);
            this._boxModifier.opacity.set(_status.outOpacity, transition, _cb);
            this._boxModifier.align.set(_status.outAlign, transition, _cb);
            this._boxModifier.origin.set(_status.outOrigin, transition, _cb);
        },

        setZIndex: function (value) {
            this._zindex.set(value);
        },
        setScale: function (value) {
            this._scale.set(value, {
                duration: 250,
                curve: Easing.easeInOutBack
            });
        },
        setSize: function (size) {
            console.log(this._modSizeZindex.setSize);
            console.log(size);
            this._modSizeZindex.setSize(size);
        },
        getName: function () {
            return this._name;
        },
        /**
         * Generate a render spec from the contents of this component.
         *
         * @private
         * @method render
         * @return {number} Render spec for this component
         */
        render: function () {
            return this._node.render();
        }
    });


    /**
     * Events
     */

    module.exports = Paper;

});