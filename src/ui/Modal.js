// https://github.com/driftyco/ionic/blob/v1.0.0-beta.6/scss/_popup.scss
define('famodev/Modals', [
    'require', 
    'exports',
    'module',

    'famodev/ui/pages/Transitions',
    ], function(require, exports, module){

        var View               = famous.core.View;
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
            View.apply(this, arguments);

            this._containerView = new ContainerSurface({
                size: [undefined, true],
                properties: {
                    overflow: 'hidden',
                    zIndex: "1050" // from bootstrap
                }
            });
            this._containerModifier = new Modifier({
            });
            this._add(this._containerModifier).add(this._containerView);

            createBackground.call(this);
            createContainerModal.call(this);
        }
        Modal.prototype = Object.create(View.prototype);
        Modal.prototype.constructor = Modal;
        Modal.DEFAULT_OPTIONS = {};

        var _containerModal = null;

        /**
         * Add Views
         */
        function createBackground () {
            this._bg = new Surface({
                properties: {
                    borderRadius: "0px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
                    minHeight: "50px"
                }
            });
            this._containerView.add(this._bg);
        }

        function createContainerModal () {
            _containerModal = new RenderController();
            _containerModalModifier = new StateModifier({
                opacity: 1
            });
            this._containerView.add(_containerModalModifier).add(_containerModal);
        }

        /**
         * Methods
         */
        Modal.prototype.show = function (renderable) {
            _containerModal.show(renderable);
            var size = renderable.size;
            if(size) {
                size = [size[0], size[1]];
                this._bg.setSize(size);
                this._containerView.setSize(size);
            }
        };

        Modal.prototype.getContainerModifier = function () {
            return this._containerModifier;
        };

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
        _backdropModifier = null,
        _containerModalModifier = null,
        _boxSurface = null;

        var boxModifier,
        currentKey,
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
                transform: Transform.translate(0, 0, -1)
            }))
            .add(backdropModifier)
            .add(backdropSurface);
            _nodes.push(node);

            // attach Event
            backdropSurface.on('click', function (event) {
                if(!isShow)
                    return ;
                hide.call(modalInstance);
                isShow = false;
            });
        }

        function _createBox(){
            _boxSurface = new Modal();
            boxModifier = _boxSurface.getContainerModifier();
            _nodes.push(_boxSurface);
        }

        // animation
        function show (callback, key) {
            var _cb = callback ? Utility.after(4, callback) : undefined;

            var animation = animations[key];
            var curve = animation.curve;
            boxModifier.setOrigin(animation.inOrigin);
            boxModifier.setAlign(animation.inAlign);

            animation.inTransform.call(this, _cb, curve);
            boxModifier.setOrigin(animation.showOrigin, curve, _cb);
            boxModifier.setAlign(animation.showAlign, curve, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0.5, curve, _cb);
        }
        function hide (callback) {
            var _cb = callback ? Utility.after(4, function(){
                callback();
                _backdropModifier.transform.set(_status.outTransform);
                currentKey = null;
            }) : Utility.after(2, function(){
                _backdropModifier.transform.set(_status.outTransform);
                currentKey = null;
            });

            var animation = animations[currentKey];
            var curve = animation.curve;
            boxModifier.setOrigin(animation.showOrigin);
            boxModifier.setAlign(animation.showAlign);

            animation.outTransform.call(this, _cb, curve);
            boxModifier.setOrigin(animation.outOrigin, curve, _cb);
            boxModifier.setAlign(animation.outAlign, curve, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0, curve, _cb);
        }

        // start
        _createBackdrop();
        _createBox();
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
                        animations[key].inTransform = Transitions.in.zoomIn;

                    if(animation.outTransform)
                        animations[key].outTransform = animation.outTransform;
                    else
                        animations[key].outTransform = Transitions.in.zoomOut;

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
                        inTransform: Transitions.in.zoomIn,
                        outTransform: Transitions.out.zoomOut,

                        inOrigin: [.5, .5],
                        outOrigin: [.5, .5],
                        showOrigin: [.5, .5],

                        inAlign: [.5, .5],
                        outAlign: [.5, .5],
                        showAlign: [.5, .5],

                        curve: { duration: 250, curve: 'easeInOut'}
                    };
                modals[key] = renderable;
            },
            show: function(key, cb) {
                if(isShow)
                    return this.hide.call(this, function () {
                        this.show(key, cb);
                    }.bind(this));
                _boxSurface.show(modals[key]);
                show.call(this, cb, key);
                isShow = true;

                currentKey = key;
            },
            hide: function(cb) {
                if(!isShow)
                    return ;
                hide.call(this, cb);
                isShow = false;
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
            getActiveModifier: function () {
                return boxModifier;
            },
            getInstance: function () {

            },
            visibleBackdrop: function() {

            },
            invisibleBackdrop: function() {

            }
        };
        module.exports = modalInstance;
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