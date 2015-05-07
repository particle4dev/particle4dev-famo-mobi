define('famodev/ui/pages/Scene', [
    'require', 
    'exports',
    'module',

    'famodev/ui/SizeAwareView',
    'famodev/ui/pages/Transitions'
    ],
    function(require, exports, module) {
    var View                = famous.core.View;
    var Entity              = famous.core.Entity;
    var Engine              = famous.core.Engine;
    var Transform           = famous.core.Transform;
    
    var SizeAwareView       = require('famodev/ui/SizeAwareView');
    var Transitions         = require('famodev/ui/pages/Transitions');
    /**
     *  A scene is a view with a standardized activate and deactivate method.
     *  **WARNING**
     *  If a scene fails to call the callback on deactivate, the current scene will never exit
     *  from the screen.
     *
     *  After the deactivate callback is called, the scene will be removed from the render tree, and the new scene will
     *  be activated. This gives you absolute control over the animations on creation
     *  and deletion.
     *
     *  @class Scene
     *  @name Scene
     *  @extends View
     */
    function Scene() {
        SizeAwareView.apply(this, arguments);
        this.__activeEvents = [];

        // support rendered
        var optionsScene = this.getOptions();
        if(!optionsScene.inTransform)
            this.setOptions({
                inTransform: Transitions.in.fadeIn
            });
        if(!optionsScene.outTransform)
            this.setOptions({
                outTransform: Transitions.out.fadeOut
            });
    }

    Scene.prototype = Object.create( SizeAwareView.prototype );
    Scene.prototype.constructor = Scene;

    /**
     * Activate method to be overwritten.
     * @method activate
     */
    Scene.prototype.activate = function activate(callback) {
        var optionsScene = this.getOptions();
        optionsScene.inTransform.apply(this, [function () {
            if (callback) callback();
            if(_.isFunction(this.rendered))
                this.rendered();
        }.bind(this)]);
    };

    /**
     * 
     * @method getActiveModifier
     */
    Scene.prototype.getActiveModifier = function getActiveModifier() {
        var parent = this.getParent();
        return parent.getActiveModifier();
    };

    /**
     * 
     * @method getParent
     */
    Scene.prototype.getParent = function getParent() {
        return this.__parent;
    };

    /**
     * 
     * @method setParent
     */
    Scene.prototype.setParent = function setParent(parent) {
        this.__parent = parent;
        return this;
    };


    /**
     * Deactivate method. Meant to be overwritten by the children.
     * If the callback is not called, then the current scene will never be able to be destroyed.
     * @example
     *  MyScene.prototype.deactivate = function (callback) {
     *
     *    this.mod1.setOpacity(0, {
     *      curve: 'outBack',
     *      duration: 200
     *    }) 
     *    this.mod2.setTranslate(Transform.translate(0, 1000), { 
     *      curve: 'outBack',
     *      duration: 800
     *    }, callback); // destroyed on the callback of the setTranslate.
     *  };
     *
     * @method activate
     */
    Scene.prototype.deactivate = function deactivate( callback ) {
        var optionsScene = this.getOptions();
        optionsScene.outTransform.apply(this, [function () {
            if (callback) callback();
            this.destroy();
        }.bind(this)]);
    };

    /*
     *  Add a function to be called during the removeAllEvents destroy.
     *  This is mainly meant for child views, who can group their own unbind functions
     *  in one function to call them.
     *  @param *eventFns {Functio} events to call
     */
    Scene.prototype.addEventFn = function addEventFn(/* eventFns, * */) {
        this.__activeEvents.push.apply( this.__activeEvents, arguments );
        return this;
    }

    /*
     *  If it's an eventFn, call it, otherwise, unbind it from the activeEvent object,
     *  and delete it.
     *  @method removeAllEvents
     */
    Scene.prototype.removeAllEvents = function removeAllEvents() {
        for (var i = 0; i < this.__activeEvents.length; i++) {
            var activeEvent = this.__activeEvents[i];
            if ( activeEvent instanceof Function ) activeEvent();
            else activeEvent.unbindFn( activeEvent.key, activeEvent.boundFn );
            this.__activeEvents[i] = null;
        };
    }

    /*
     *  Unregister the entity, destroying the scene. WARNING, rendering will stop after you call this method.
     *  As this is called in deactivate, wait until the next frame to allow the last commit to occur before
     *  unregestering.
     *  @method destroy
     */
    Scene.prototype.destroy = function destroy() {
        var self = this;
        Engine.nextTick(function(){
            Entity.unregister.bind({}, self.__id )
            // support destroyed
            if(_.isFunction(self.destroyed))
                self.destroyed();
        });
    }

    module.exports = Scene;
});