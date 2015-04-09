// https://github.com/driftyco/ionic/blob/v1.0.0-beta.6/scss/_popup.scss
define('famodev/Modals', [
    'require', 
    'exports',
    'module',

    'famodev/ui/pages/Transitions',
    ], function(require, exports, module){

        var Modifier           = famous.core.Modifier;
        var RenderNode         = famous.core.RenderNode;
        var Surface            = famous.core.Surface;
        var Transform          = famous.core.Transform;

        var StateModifier           = famous.modifiers.StateModifier;
        var ContainerSurface        = famous.surfaces.ContainerSurface;
        var Transitionable          = famous.transitions.Transitionable;
        var TransitionableTransform = famous.transitions.TransitionableTransform;
        
        var Utility                 = famous.utilities.Utility;
        var RenderController        = famous.views.RenderController;

        var Transitions             = require('famodev/ui/pages/Transitions');

        function Modal () {
            RenderNode.apply(this, arguments);
        }
        Modal.prototype = Object.create(RenderNode.prototype);
        Modal.prototype.constructor = Modal;
        Modal.DEFAULT_OPTIONS = {};

        /**
         * Add Views
         */

        /**
         * Methods
         */
        _.extend(Modal.prototype, {
            addRenderable: function (renderable) {
                if(this._renderable)
                    throw new Error('renderable was setted');
                this._containerModifier = new Modifier({
                    size: [undefined, true]
                });
                this._renderable = renderable;
                this
                .add(this._containerModifier)
                .add(this._renderable);
            },
            getActiveModifier: function () {
                return this._containerModifier;
            }
        });

        /**
         * Events
         */

        var _nodes = [],
        _status = {
            // in
            inTransform: Transform.scale(0.001, 0.001, 0.001),
            inOpacity: 0,
            inOrigin: [0.5, 0.5],
            // out
            outTransform: Transform.scale(0.001, 0.001, 0.001),
            outOpacity: 0,
            outOrigin: [0.5, 0.5],
            // show
            showTransform: Transform.identity,
            showOpacity: 1,
            showOrigin: [0.5, 0.5]
        },
        isShow    = false,
        modifiers = {},
        modals    = {},
        animations= {},
        _backdropModifier = null;

        var currentKey,
        modalInstance;

        // add views
        function _createBackdrop () {
            var backdropSurface = new Surface({
                size: [undefined, window.innerHeight],
                properties: {
                    backgroundColor: "rgba(0, 0, 0, 0.4)"
                }
            });

            // add modifier
            _backdropModifier = {
                transform: new TransitionableTransform(_status.inTransform),
                opacity: new Transitionable(_status.inOpacity),
                origin: new Transitionable(_status.inOrigin),
                align: new Transitionable([0.5, 0.5])
            };

            backdropModifier = new Modifier({
                transform: _backdropModifier.transform,
                opacity: _backdropModifier.opacity,
                origin: _backdropModifier.origin,
                align: _backdropModifier.align
            });

            var node = new RenderNode();
            node
            .add(new Modifier({
                transform: Transform.translate(0, 0, -99)
            }))
            .add(backdropModifier)
            .add(backdropSurface);
            _nodes.push(node);

            // attach Event
            backdropSurface.on('click', function (event) {
                if(!isShow)
                    return ;
                hide.call(modalInstance, function () {
                    isShow = false;
                });
            });
        }

        // animation
        function show (callback, key) {
            var _cb = callback ? Utility.after(4, callback) : undefined;
            _nodes.push(modals[key]);

            var animation = animations[key];
            var curve = animation.curve;
            
            // start
            var boxModifier = modals[key].getActiveModifier();
            var size = modals[key]._renderable.getSize(true);
            boxModifier.setSize(size);
            boxModifier.setOrigin(animation.inOrigin);
            boxModifier.setAlign(animation.inAlign);

            // show
            animation.inTransform.call(modals[key], _cb, curve);
            boxModifier.setOrigin(animation.showOrigin, curve, _cb);
            boxModifier.setAlign(animation.showAlign, curve, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0.5, curve, _cb);
        }
        function hide (callback) {
            var _cb = callback ? Utility.after(4, function(){
                callback();
                _backdropModifier.transform.set(_status.outTransform);
                _nodes.pop();
                currentKey = null;
            }) : Utility.after(2, function(){
                _backdropModifier.transform.set(_status.outTransform);
                _nodes.pop();
                currentKey = null;
            });

            var animation = animations[currentKey];
            console.log(currentKey);
            var curve = animation.curve;
            var boxModifier = modals[currentKey].getActiveModifier();
            
            // start
            boxModifier.setOrigin(animation.showOrigin);
            boxModifier.setAlign(animation.showAlign);

            // run
            animation.outTransform.call(modals[currentKey], _cb, curve);
            boxModifier.setOrigin(animation.outOrigin, curve, _cb);
            boxModifier.setAlign(animation.outAlign, curve, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0, curve, _cb);
        }

        // start
        _createBackdrop();

        /**
         * singleton pattern
         */
        modalInstance = {
            register: function(key, renderable, animation) {
                // FIXME: validate

                animations[key] = {};

                if(animation) {
                    if(animation.inTransform)
                        animations[key].inTransform = animation.inTransform;
                    else
                        animations[key].inTransform = Transitions.in.fadeInLeft;

                    if(animation.outTransform)
                        animations[key].outTransform = animation.outTransform;
                    else
                        animations[key].outTransform = Transitions.in.fadeLeft;

                    if(animation.inOrigin)
                        animations[key].inOrigin = animation.inOrigin;
                    else
                        animations[key].inOrigin = [.5, .5];

                    if(animation.outOrigin)
                        animations[key].outOrigin = animation.outOrigin;
                    else
                        animations[key].outOrigin = [.5, .5];

                    if(animation.showOrigin)
                        animations[key].showOrigin = animation.showOrigin;
                    else
                        animations[key].showOrigin = [.5, .5];

                    if(animation.inAlign)
                        animations[key].inAlign = animation.inAlign;
                    else
                        animations[key].inAlign = [.5, .5];

                    if(animation.outAlign)
                        animations[key].outAlign = animation.outAlign;
                    else
                        animations[key].outAlign = [.5, .5];

                    if(animation.showAlign)
                        animations[key].showAlign = animation.showAlign;
                    else
                        animations[key].showAlign = [.5, .5];

                    if(animation.curve)
                        animations[key].curve = animation.curve;
                    else
                        animations[key].curve = { duration: 250, curve: 'easeInOut'};
                }
                else
                    animations[key] = {
                        inTransform: Transitions.in.fadeInLeft,
                        outTransform: Transitions.out.fadeLeft,

                        inOrigin: [.5, .5],
                        outOrigin: [.5, .5],
                        showOrigin: [.5, .5],

                        inAlign: [.5, .5],
                        outAlign: [.5, .5],
                        showAlign: [.5, .5],

                        curve: { duration: 250, curve: 'easeInOut'}
                    };
                var m = new Modal();
                m.addRenderable(renderable);
                modals[key] = m;
            },
            show: function(key, cb) {
                if(isShow)
                    return this.hide.call(this, function () {
                        this.show(key, cb);
                    }.bind(this));
                boxModifier = modals[key].getActiveModifier();

                show.call(this, function () {
                    if(_.isFunction(cb))
                        cb();
                    isShow = true;
                }, key);

                currentKey = key;
            },
            hide: function(cb) {
                if(!isShow)
                    return ;
                hide(function () {
                    if(_.isFunction(cb))
                        cb();
                    isShow = false;
                });
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
                for (var i = 0; i < _nodes.length; i++) {
                    result.push(_nodes[i].render());
                }
                return result;
            },
            getInstance: function () {

            },
            visibleBackdrop: function() {

            },
            invisibleBackdrop: function() {

            }
        };
        module.exports = modalInstance;
        window.sda = modalInstance;
});

/**
 CODE STYLE
Meteor.startup(function () {
    require([
        'famodev/Modals',
        'famodev/reactive/ReactiveTemplate',
        'famodev/ui/pages/Transitions',
    ],
    function(Modals, ReactiveTemplate, Transitions){
        Modals.register('scheduleOpenHouse', new ReactiveTemplate({
            size: [undefined, 276],
            template: Template.scheduleOpenHouseModal
        }), {
            inTransform: Transitions.in.flipX,
            outTransform: Transitions.out.flipX,
            inOrigin: [.5, .5],
            outOrigin: [.0, .0],
            showOrigin: [.5, .5],

            inAlign: [.5, .5],
            outAlign: [.5, .5],
            showAlign: [.5, .5]
        });
    });
});
*/