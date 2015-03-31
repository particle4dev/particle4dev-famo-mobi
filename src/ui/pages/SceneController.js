define('famodev/ui/pages/SceneController', [
    'require', 
    'exports',
    'module'

    ],
    function(require, exports, module) {
    var View            = famous.core.View;
    var RenderNode      = famous.core.RenderNode;
    var Transform       = famous.core.Transform;
    var StateModifier   = famous.modifiers.StateModifier;
    var Engine          = famous.core.Engine;

    function SceneController () {
        View.apply(this, arguments);

        this.nodes   = [];
        this._scenes = {};
        this.defaultOptions = {};

    }

    SceneController.prototype = Object.create(View.prototype);
    SceneController.prototype.constructor = SceneController;

    /*
     *  Set a transform on the active modifier ( the modifier that is above the current scene )
     *  @method setActiveModifier
     *  @param transform {Transform} Transform to set to.
     *  @param transition {Object} Transiition definition
     *  @param callback {Function} callback to execute when animation is finished.
     */
    SceneController.prototype.setActiveModifier = function ( transform, transition, callback ) {
        if (this.activeModifier) {
            this.activeModifier.halt();
            this.activeModifier.setTransform( transform, transition, callback );
        }
    };

    /*
     *  @method getActiveModifier
     *  @returns {Modifier} modifier above the main scene
     */
    SceneController.prototype.getActiveModifier = function () {
        return this.activeModifier;
    };

    /*
     *  @method addScene 
     *  @param key {String} key to trigger viewing of View.
     *  @param view {View|Scene} scene to view on key.
     */
    SceneController.prototype.addScene = function ( key, view ) {
        this._scenes[ key ] = view;
    };

    /*  
     *  @method getScene
     *  @param key {String} key to trigger viewing of View.
     */
    SceneController.prototype.getScene = function ( key ) {
        return this._scenes[ key ];
    };

    /*  
     *  @method isScene
     *  @param key {String} key to trigger viewing of View.
     */
    SceneController.prototype.isScene = function ( key ) {
        return !!this.getScene(key);
    };

    /*
     *  Add many scenes.
     *  @method addScenes
     *  @param obj {Object} object of { 'key' : {{view}} } pairs.
     */
    SceneController.prototype.addScenes = function ( obj ) {
        for ( var key in obj ) {
            this.addScene( key, obj[ key ] );
        }
    };

    /*
     *  Set the scene via a key or an object. The data object will be passed as the
     *  second argument to the scene, enabling default options & passed down data.
     *
     *  @method setScene
     *  @param key {String} key of scene to change to.
     *  @param data {Object} Data to pass.
     */
    SceneController.prototype.setScene = function (key, data) {
        if (key == this.getCurrentRoute()) return false;
        var newView = this._scenes[key];

        if ( typeof newView == 'undefined' ) {
            console.warn( 'No view exists!', key );
            return;
        }

        this.currentRoute = key;
        this.ActiveConstructor = newView;

        this._eventOutput.emit('change', {
            key: key,
            data: data
        });
        if ( this.activeScene && this.activeScene.deactivate ) {
            this.activeScene.deactivate(_resetAndGetOptions.bind(this, data));
        } 
        else {
            return _resetAndGetOptions.call(this, data);
        }
    };

    /*
     *  @method getCurrentRoute
     *  @returns {string} key of current route
     */
    SceneController.prototype.getCurrentRoute = function () {
        return this.currentRoute;
    };

    /*
     *  @method _resetAndGetOptions
     *  @private
     *  @param data {object} data passed from key.data (setScene)
     */
    function _resetAndGetOptions ( data ) {
        this.reset();
        this._eventOutput.emit('deactivate');
        if (data) _createAndAddScene.call(this, data);
        else _getOptions.call(this);
    }

    /*
     *  Get the default options. If it is a function, call it and pass the _createAndAddScene callback, 
     *  allowing ajax calls to a server.
     *
     *  @method _getOptions
     *  @private
     *  @param data {object} data passed from key.data (setScene)
     */
    function _getOptions () {
        var defaultOptions = this.defaultOptions[this.currentRoute];
        if ( defaultOptions instanceof Function ) { 
            defaultOptions(_createAndAddScene.bind(this));
        } 
        else { 
            _createAndAddScene.call(this, defaultOptions);
        }
    }

    /*
     *  @method _createAndAddScene
     *  @private
     *  @param data {Object} 
     *  @param defaultOptions {Object} default options
     */
    function _createAndAddScene(data) {
        this.activeScene    = new this.ActiveConstructor(data);
        this.activeScene.setParent(this);
        this.activeModifier = new StateModifier();


        var node = new RenderNode();
        node.add( this.activeModifier ).add( this.activeScene );
        this.nodes.push( node );

        this._eventOutput.emit('activate', this.currentRoute);
        if ( this.activeScene.activate ) this.activeScene.activate();
    };

    /*
     *  Reset. Nothing will be rendered when this is called.
     *  @method reset
     */
    SceneController.prototype.reset = function  () {
        this.nodes = [];
    };

    /*
     *  Set the default options for each of the scenes that the SceneController will render.
     *  The defaultOptions can either be a preset object or a function. If it is a function,
     *  it is passed a callback as the first argument, which it *MUST* call. 
     *
     *  @method setDefaultOptions
     *  @param obj {Object} 
     */
    SceneController.prototype.setDefaultOptions = function ( obj ) {
        for (var key in obj) this.defaultOptions[key] = obj[key];
    }

    /*
     *  @method removeDefaultOptions
     *  @param arr {Array} array of keys to remove the default options for.
     */
    SceneController.prototype.removeDefaultOptions = function ( arr ) {
        for (var i = 0; i < arr.length; i++) {
            delete this.defaultOptions[arr[i]];
        };
    }

    /*
     *  @method render
     *  @returns {RenderSpec} rendered scenes.
     */
    SceneController.prototype.render = function render() {
        var result = [];
        for (var i = 0; i < this.nodes.length; i++) {
            result.push(this.nodes[i].render());
        }
        return result;
    };

    module.exports = SceneController;
});