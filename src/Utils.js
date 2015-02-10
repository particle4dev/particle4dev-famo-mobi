define('famodev/Utils',[
    'require', 
    'exports',
    'module'
    ], function(require, exports, module) {

        var Transform               = famous.core.Transform;
        var Utilities               = famous.math.Utilities;
        var Engine                  = famous.core.Engine;
        var Transitionable          = famous.transitions.Transitionable;

        var innerHeight = new Transitionable(0), innerWidth = new Transitionable(0);
        var resize = function () {
            innerHeight.set(window.innerHeight);
            innerWidth.set(window.innerWidth);
        };
        Engine.on('resize', resize);
        resize();

        module.exports = {
            windowHeight: function () {
                return innerHeight.get();
            },
            windowWidth: function () {
                return innerWidth.get();
            },
            frontOfZ: function(m, value) {
                if (value === undefined) value = 1;
                if(_.isArray(m))
                    return Transform.translate(m[12], m[13], m[14] + value);
                if(_.isObject(m) && m.getFinalTransform)
                    // recursive function
                    return frontOfZ(m.getFinalTransform());
            },
            behindZ: function(m, value) {
                if (value === undefined) value = 1;
                if(_.isArray(m))
                    return Transform.translate(m[12], m[13], m[14] - 1);
                if(_.isObject(m) && m.getFinalTransform)
                    // recursive function
                    return behindZ(m.getFinalTransform());
            },
            getModifierX: function (t) {
                return Math.round(t.getTransform.call(t)[12]);
            },
            getModifierY: function (t) {
                return Math.round(t.getTransform()[13]);
            },
            getModifierZ: function (t) {
                return Math.round(t.getTransform()[14]);
            }
        };
});