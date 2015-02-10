define('famodev/ui/SizeAwareView', [
    'require', 
    'exports',
    'module'
    ],
    function(require, exports, module) {
    var View      = famous.core.View;
    var Entity    = famous.core.Entity;
    var Transform = famous.core.Transform;

    // https://github.com/Famous/scene/blob/master/SizeAwareView.js
    /*
     *  A view that keeps track of the parent's resize, passed down from the
     *  commit function. This can be anything higher in the render tree, 
     *  either the engine, or a modifier with a size, or a custom render function
     *  that changes the size. 
     *
     *  If you have a View that inherits from this, you get a .getParentSize()
     *  method that you can query at any point, and a `parentResize` event on 
     *  the `_eventInput` that you can listen to for immediate notificaitons of
     *  changes.
     *  
     *  @class SizeAwareView
     */
    function SizeAwareView() {
        View.apply(this, arguments);
        this.__id = Entity.register(this);
        this.__parentSize = []; //Store reference to parent size.
    }

    SizeAwareView.prototype = Object.create( View.prototype );
    SizeAwareView.prototype.constructor = SizeAwareView;

    /*
     * Commit the content change from this node to the document.
     * Keeps track of parent's size and fires 'parentResize' event on
     * eventInput when it changes.
     *
     * @private
     * @method commit
     * @param {Object} context
     */
    SizeAwareView.prototype.commit = function commit( context ) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;

        // Update the reference to view's parent size if it's out of sync with 
        // the commit's context. Notify the element of the resize.
        if (!this.__parentSize || this.__parentSize[0] !== context.size[0] || 
            this.__parentSize[1] !== context.size[1]) {
            this.__parentSize[0] = context.size[0];
            this.__parentSize[1] = context.size[1];
            this._eventInput.emit('parentResize', this.__parentSize);
            if (this.onResize) this.onResize(this.__parentSize);
        }

        if (this.__parentSize) { 
          transform = Transform.moveThen([
              -this.__parentSize[0]*origin[0], 
              -this.__parentSize[1]*origin[1], 
              0], transform);
        }

        return {
            transform: transform,
            opacity: opacity,
            size: this.__parentSize,
            target: this._node.render()
        };
    }

    /*
     * Get view's parent size.
     * @method getSize
     */
    SizeAwareView.prototype.getParentSize = function getParentSize() {
        return this.__parentSize;
    }

    /*
     * Actual rendering happens in commit.
     * @method render
     */
    SizeAwareView.prototype.render = function render() {
        return this.__id;
    };

    module.exports = SizeAwareView;
});

// Meteor.startup(function () {
//     require([
//         'require',
//         'exports',
//         'module',
//         'famous/core/Engine',
//         'famous/core/Transform',
//         'famous/modifiers/StateModifier',

//         'famodev/ui/SizeAwareView',
//         'famous/core/Surface'
//         ], function (require, exports, module) {
//         var Engine              = require('famous/core/Engine');
//         var Transform           = require('famous/core/Transform');
//         var StateModifier       = require('famous/modifiers/StateModifier');

//         var SizeAwareView       = require('famodev/ui/SizeAwareView');
//         var Surface             = require('famous/core/Surface');

//         var mainContext = Engine.createContext();

//         var surface4 = new Surface({
//             content: 'Big Button',
//             size: [undefined, undefined],
//             properties: {
//                 fontFamily: 'Helvetica Neue',
//                 fontSize: '18px',
//                 fontWeight: '300',
//                 textAlign: 'center',
//                 lineHeight: '150px',
//                 backgroundColor: '#1abc9c'
//             },
//             classes: ['none-user-select']
//         });

//         var modifier4 = new StateModifier({
//             size: [150, 150],
//             transform: Transform.translate(450, 50, 0)
//         });

//         var s = new SizeAwareView();
//         s.add(surface4);
//         mainContext.add(modifier4).add(s);
//     });
// });