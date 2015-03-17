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
                size: [window.innerWidth - 40, true],
                properties: {
                    overflow: 'hidden',
                    zIndex: "1050" // from bootstrap
                }
            });
            this._containerModifier = new StateModifier({
                origin: [0.5, 0.5],
                align: [0.5, 0.5]
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
                origin: [0.5, 0.5],
                align: [0.5, 0.5],
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
                size = [window.innerWidth - 40, size[1]];
                this._bg.setSize(size);
                this._containerView.setSize(size);
            }
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
            node.add(backdropModifier).add(backdropSurface);
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

            boxModifier = new Modifier({
                size: [undefined, undefined],
                align: [.5, .5],
                origin: [.5, .5],
            });

            var node = new RenderNode();
            node.add(boxModifier).add(_boxSurface);
            _nodes.push(node);
        }

        // animation
        function show (callback, key) {
            var _cb = callback ? Utility.after(2, callback) : undefined;

            var animation = animations[key];
            animation.inTransform.call(this, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0.5, { duration: 200, curve: 'easeInOut'}, _cb);
        }
        function hide (callback) {
            var _cb = callback ? Utility.after(2, function(){
                callback();
                _backdropModifier.transform.set(_status.outTransform);
                currentKey = null;
            }) : Utility.after(2, function(){
                _backdropModifier.transform.set(_status.outTransform);
                currentKey = null;
            });

            var animation = animations[currentKey];
            animation.outTransform.call(this, _cb);

            _backdropModifier.transform.set(Transform.scale(1, 1, 1));
            _backdropModifier.opacity.set(0, { duration: 350, curve: 'easeInOut'}, _cb);
        }

        // start
        _createBackdrop();
        _createBox();
        //_createContainerModal();

        /**
         * singleton pattern
         */
        modalInstance = {
            register: function(key, renderable, animation) {
                if(animation)
                    animations[key] = animation;
                else 
                    animations[key] = {
                        inTransform: Transitions.in.zoomIn,
                        outTransform: Transitions.out.zoomOut
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
            inTransform: Transitions.in.zoomIn,
            outTransform: Transitions.out.zoomOut
        });
    });
});
*/