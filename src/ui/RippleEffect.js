// http://codepen.io/iraycd/pen/dHrxv
define('famodev/ui/Wave', [
    'require', 
    'exports',
    'module',
    'famous/core/Surface',
    'famous/core/Transform',
    'famous/transitions/Transitionable'
    ], function (require, exports, module) {
    'use strict';

    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var Transitionable      = require('famous/transitions/Transitionable');

    function Wave() {
        Surface.apply(this, arguments);

        this.gradientOpacity = new Transitionable(0);
        this.gradientSize = new Transitionable(0);
        this.offsetX = 0;
        this.offsetY = 0;

        var _runAnimation = function(){        
            this.gradientSize.set(Math.sqrt(this._realSize[0] * this._realSize[0] + this._realSize[1] * this._realSize[1]), {
                duration: 1000,
                curve: 'easeOut'
            });
        }.bind(this);

        var _stopAnimation = function(){
            this.gradientSize
            .halt()
            .set(Math.sqrt(this._realSize[0] * this._realSize[0] + this._realSize[1] * this._realSize[1]), {
                duration: 250,
                curve: 'easeOut'
            }, function(){

            }.bind(this));

            this.gradientOpacity
            .halt()
            .set(0, {
                duration: 250,
                curve: 'easeOut'
            });
        }.bind(this);

        this.runAnimation = function(data){
            if (!data.detail) {
                return;
            }

            this.offsetX = (data.offsetX || data.layerX) + 'px';
            this.offsetY = (data.offsetY || data.layerY) + 'px';

            this.gradientOpacity.set(0.25, {
                duration: 150,
                curve: 'easeOut'
            });
            this.gradientSize.set(0);

            _runAnimation();
        };
        this.stopAnimation = _stopAnimation;
    }

    Wave.prototype = Object.create(Surface.prototype);
    Wave.prototype.constructor = Wave;

    Wave.prototype.render = function () {
        var gradientOpacity = this.gradientOpacity.get();
        var gradientSize = this.gradientSize.get();
        var fadeSize = gradientSize * 0.75;

        this.setProperties({
            backgroundImage: 'radial-gradient(circle at '
                + this.offsetX + ' '
                + this.offsetY + ', rgba(0,0,0,'
                + gradientOpacity + '), rgba(0,0,0,'
                + gradientOpacity + ') '
                + gradientSize + 'px, rgba(255,255,255,'
                + gradientOpacity + ') '
                + gradientSize + 'px)'
        });

        return this.id;
    };

    var originDeploy = Wave.prototype.deploy;
    Wave.prototype.deploy = function deploy(target) {
        originDeploy.call(this, target);

        var width = target.offsetWidth;
        var height = target.offsetHeight;
        this._realSize = [width, height];
    };

    module.exports = Wave;
});


define('famodev/ui/RippleEffect', [
    'require', 
    'exports',
    'module',
    'famodev/ui/Wave',
    'famodev/ui/SizeAwareView',
    'famous/core/Transform',
    'famous/modifiers/StateModifier',
    'famous/utilities/Utility'
    ], function (require, exports, module) {
    'use strict';

        var SizeAwareView       = require('famodev/ui/SizeAwareView');
        var Wave                = require('famodev/ui/Wave');
        var Transform           = require('famous/core/Transform');

        var StateModifier       = require('famous/modifiers/StateModifier');
        var Utility             = require('famous/utilities/Utility');

        function RippleEffect(options) {

            this.options = Utility.clone(options || RippleEffect.DEFAULT_OPTIONS);
            this._dom   = new SizeAwareView();
            this._waves = [];
            this._mod   = [];
            this._currentIndex = 0;
            this._currentWave = null;

            this.drawRipple();
            this._addEvents();
        }

        RippleEffect.DEFAULT_OPTIONS = {
            numberWaves: 3,
            event: 'mousedown-mouseup' // OR click
        };

        RippleEffect.prototype.drawRipple = function () {
            var pointerEvents = 'none';
            if(this.options.pointerEvents)
                pointerEvents = 'auto';
            for (var i = 0; i < this.options.numberWaves; i++) {
                this._waves[i] = new Wave({
                    size: [undefined, undefined],
                    properties: {
                        pointerEvents: pointerEvents
                    },
                    classes: ['none-user-select']
                });
                this._mod[i] = new StateModifier({
                    transform: Transform.translate(0, 0, i)
                });

                this._dom
                .add(this._mod[i])
                .add(this._waves[i]);

                if(this.options.pointerEvents) // ??? TEST
                    this._dom._eventOutput.subscribe(this._waves[i]._eventOutput);
            };
        };

        RippleEffect.prototype._getNext = function () {
            this._currentWave = this._waves[this._currentIndex];
            this._currentIndex++;
            if(this._currentIndex >= this._waves.length)
                this._currentIndex = 0;
            return this._currentWave;
        };

        RippleEffect.prototype._addEvents = function(){
            this._dom.on('mousedown', function (data) {
                if(this.options.event != 'mousedown-mouseup')
                    return;
                var wave = this._getNext();
                wave.runAnimation(data);
            }.bind(this));

            this._dom.on('mouseup', function () {
                if(this.options.event != 'mousedown-mouseup')
                    return;
                if(this._currentWave)
                    this._currentWave.stopAnimation();
            }.bind(this));

            this._dom.on('mouseleave', function () {
                if(this._currentWave)
                    this._currentWave.stopAnimation();
            }.bind(this));

            this._dom.on('click', function (data) {
                if(this.options.event != 'click')
                    return;
                var wave = this._getNext();
                wave.runAnimation(data);
                setTimeout(function () {
                    this.stopAnimation();
                }.bind(wave), 300);
            }.bind(this));
        };

        RippleEffect.prototype.subscribe = function(renderable){
            if(!renderable || !renderable._eventOutput)
                return console.warn('param must be a renderable');    
            this._dom._eventOutput.subscribe(renderable._eventOutput);
        };

        /**
         * Generate a render spec from the contents of this component (60fps).
         * 
         * @private
         * @method render
         * @return {number} Render spec for this component
         */
        RippleEffect.prototype.render = function () {
            return this._dom.render();
        };

        module.exports = RippleEffect;
});

// Meteor.startup(function () {
//     // http://stackoverflow.com/questions/24946191/how-to-implement-google-paper-button-effects
//     // https://github.com/Famous/famous/blob/master/src/surfaces/SubmitInputSurface.js
//     // https://github.com/Famous/famous/blob/master/src/surfaces/InputSurface.js
//     // https://github.com/Skelware/Famous-Material
//     // https://github.com/Polymer/paper-ripple/blob/master/paper-ripple.html
//     require([
//         'require',
//         'exports',
//         'module',
//         'famous/core/Engine',
//         'famous/core/Transform',
//         'famous/modifiers/StateModifier',

//         'famodev/ui/RippleEffect',

//         'famous/core/Surface',
//         'famous/core/View'
//         ], function (require, exports, module) {
//         var Engine              = require('famous/core/Engine');
//         var Transform           = require('famous/core/Transform');
//         var StateModifier       = require('famous/modifiers/StateModifier');

//         var RippleEffect        = require('famodev/ui/RippleEffect');

//         var Surface             = require('famous/core/Surface');
//         var View                = require('famous/core/View');

//         var mainContext = Engine.createContext();

//         var view = new View();
       
//         var surface = new Surface({
//             content: 'Big Button',
//             size: [undefined, undefined],
//             properties: {
//                 fontFamily: 'Helvetica Neue',
//                 fontSize: '18px',
//                 fontWeight: '300',
//                 textAlign: 'center',
//                 lineHeight: '44px',
//                 backgroundColor: '#1abc9c'
//             },
//             classes: ['none-user-select']
//         });

//         var background = new RippleEffect({
//             numberWaves: 3
//         });
//         background.subscribe(surface);

//         view
//         .add(new StateModifier({
//             transform: Transform.translate(0, 0, -1)
//         }))
//         .add(surface);

//         view
//         .add(new StateModifier({
//             transform: Transform.translate(0, 0, 1)
//         }))
//         .add(background);

//         var modifier3 = new StateModifier({
//             size: [150, 44],
//             transform: Transform.translate(450, 50, 0)
//         });
//         mainContext.add(modifier3).add(view);

//     });
// });

define('famodev/ui/RippleEffect2', [
    'require', 
    'exports',
    'module',
    'famous/core/Surface',
    'famous/core/Transform',
    'famous/transitions/Transitionable'
    ], function (require, exports, module) {
    'use strict';

    var Surface             = require('famous/core/Surface');
    var Transform           = require('famous/core/Transform');
    var Transitionable      = require('famous/transitions/Transitionable');

    function RippleEffect2(options) {
        Surface.apply(this, arguments);

        this.gradientOpacity = new Transitionable(0.1);
        this.gradientSize = new Transitionable(0);
        this.offsetX = 0;
        this.offsetY = 0;

        var _runAnimation = function(){
            this.gradientSize.set(Math.sqrt(this._realSize[0] * this._realSize[0] + this._realSize[1] * this._realSize[1]), {
                duration: 1000,
                curve: 'easeOut'
            });
        }.bind(this);

        var _stopAnimation = function(){
            this.gradientSize
            .halt()
            .set(Math.sqrt(this._realSize[0] * this._realSize[0] + this._realSize[1] * this._realSize[1]), {
                duration: 250,
                curve: 'easeOut'
            }, function(){

            }.bind(this));

            this.gradientOpacity
            .halt()
            .set(0, {
                duration: 250,
                curve: 'easeOut'
            });
        }.bind(this);

        this.runAnimation = function(data){
            if (!data.detail) {
                return;
            }
            console.log(this.options.event != 'mousedown-mouseup', data, this._realSize);
            this.offsetX = (data.offsetX || data.layerX) + 'px';
            this.offsetY = (data.offsetY || data.layerY) + 'px';

            this.gradientOpacity.set(0.25, {
                duration: 150,
                curve: 'easeOut'
            });
            this.gradientSize.set(0);

            _runAnimation();
        };
        this.stopAnimation = _stopAnimation;

        if(this.options)
            this.options = {};
        if(options && options.event)
            this.options.event = options.event;
        this._addEvents();
    }

    RippleEffect2.prototype = Object.create(Surface.prototype);
    RippleEffect2.prototype.constructor = RippleEffect2;

    RippleEffect2.prototype._addEvents = function(){
        this.on('mousedown', function (data) {
            if(this.options.event != 'mousedown-mouseup')
                return;
            this.runAnimation(data);
        }.bind(this));

        this.on('mouseup', function () {
            if(this.options.event != 'mousedown-mouseup')
                return;
            this.stopAnimation();
        }.bind(this));

        this.on('mouseleave', function () {
            this.stopAnimation();
        }.bind(this));

        this.on('click', function (data) {
            if(this.options.event != 'click')
                return;
            this.runAnimation(data);
            setTimeout(function () {
                this.stopAnimation();
            }.bind(this), 300);
        }.bind(this));
    };

    RippleEffect2.prototype.render = function () {
        var gradientOpacity = this.gradientOpacity.get();
        var gradientSize = this.gradientSize.get();

        this.setProperties({
            backgroundImage: 'radial-gradient(circle at '
                + this.offsetX + ' '
                + this.offsetY + ', rgba(0,0,0,'
                + gradientOpacity + '), rgba(0,0,0,'
                + gradientOpacity + ') '
                + gradientSize + 'px, rgba(255,255,255,'
                + gradientOpacity + ') '
                + gradientSize + 'px)'
        });
        // return what Surface expects
        return this.id;
    };

    /**
     * wrap a deploy function so we can get real size of surface.
     *
     */
    var originDeploy = RippleEffect2.prototype.deploy;
    RippleEffect2.prototype.deploy = function deploy(target) {
        originDeploy.call(this, target);

        var width = target.offsetWidth;
        var height = target.offsetHeight;
        this._realSize = [width, height];
    };

    module.exports = RippleEffect2;
});

// Meteor.startup(function () {
//     require([
//         'require',
//         'exports',
//         'module',
//         'famous/core/Engine',
//         'famous/core/Transform',
//         'famous/modifiers/StateModifier',
//         'famous/core/Surface',
//         'famous/core/View',
//         'famodev/ui/RippleEffect2'
//         ], function (require, exports, module) {
//         var Engine              = require('famous/core/Engine');
//         var Transform           = require('famous/core/Transform');
//         var StateModifier       = require('famous/modifiers/StateModifier');
//         var Surface             = require('famous/core/Surface');
//         var View                = require('famous/core/View');

//         var RippleEffect        = require('famodev/ui/RippleEffect2');

//         var mainContext = Engine.createContext();

//         var surface = new RippleEffect({
//             event: 'mousedown-mouseup',
//             content: 'Big Button',
//             size: [undefined, undefined],
//             properties: {
//                 fontFamily: 'Helvetica Neue',
//                 fontSize: '18px',
//                 fontWeight: '300',
//                 textAlign: 'center',
//                 lineHeight: '44px',
//                 backgroundColor: '#1abc9c'
//             },
//             classes: ['none-user-select']
//         });

//         mainContext
//         .add(new StateModifier({
//             size: [200, 200],
//             transform: Transform.translate(50, 50, 0)
//         }))
//         .add(surface);

//     });
// });