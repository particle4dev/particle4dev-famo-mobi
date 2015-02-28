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
    }

    SceneController.prototype = Object.create(View.prototype);
    SceneController.prototype.constructor = SceneController;

    /*
     *  @method addScene 
     *  @param key {String} key to trigger viewing of View.
     *  @param view {View|Scene} scene to view on key.
     */
    SceneController.prototype.addScene = function ( key, view ) {
        this._scenes[ key ] = view;
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
        // if (key == this.getCurrentRoute()) return false;

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
     *  @method _resetAndGetOptions
     *  @private
     *  @param data {object} data passed from key.data (setScene)
     */
    function _resetAndGetOptions ( data ) {
        console.log(data, 'asdasd');
        this.reset();
        this._eventOutput.emit('deactivate');
        if (data) _createAndAddScene.call(this, data);
        // else _getOptions.call(this);
    }

    /*
     *  @method _createAndAddScene
     *  @private
     *  @param data {Object} 
     *  @param defaultOptions {Object} default options
     */
    function _createAndAddScene(data) {
        this.activeScene    = new this.ActiveConstructor(data);
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