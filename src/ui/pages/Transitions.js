define('famodev/ui/pages/Transitions', [
    'require', 
    'exports',
    'module'

    ], function(require, exports, module) {
    var Easing          = famous.transitions.Easing;
    var Transform       = famous.core.Transform;
    var Utility         = famous.utilities.Utility;

    module.exports = {

        fallBack: function ( callback, curve ) {
            var modifier = this.getActiveModifier();
            curve = curve ? curve : {
                method : 'spring',
                period : 1000,
                dampingRatio: 0.5
            };
            modifier.halt();
            modifier.setOrigin([0,1]);
            modifier.setTransform( Transform.rotateX( Math.PI * .35), curve, callback);

        },

        in: {
            fadeIn: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.outExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setOpacity( 0 );
                modifier.setOpacity( 1, curve, callback);
            },
            fadeInForward: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( 0, 0, -200));
                modifier.setTransform( Transform.identity, curve, callback);

                modifier.setOpacity( 0 );
                modifier.setOpacity( 1, curve);
            },
            fadeInSmallRight : function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( -200, 0, 0));
                modifier.setTransform( Transform.identity, curve, callback);

                modifier.setOpacity( 0 );
                modifier.setOpacity( 1, curve);
            },
            fadeInRight : function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( -window.innerWidth, 0, 0));
                modifier.setTransform( Transform.identity, curve, callback);

                modifier.setOpacity( 0 );
                modifier.setOpacity( 1, curve);
            },
            fadeInLeft: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( window.innerWidth, 0, 0));
                modifier.setTransform( Transform.identity, curve, callback);

                modifier.setOpacity( 0 );
                modifier.setOpacity( 1, curve);
            },
            popIn : function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform(
                    Transform.thenMove(
                        Transform.scale( 0.000001, 0.000001),
                        [window.innerWidth * 0.5, window.innerHeight * 0.5]));
                modifier.setTransform( Transform.identity, curve, callback);
            },
            slideUp: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 500
                };

                modifier.halt();
                modifier.setTransform( Transform.translate(0, window.innerHeight, 0) );
                modifier.setTransform( Transform.identity, curve, callback);
            },
            flipX: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setTransform( Transform.rotateX(Math.PI/2) );
                modifier.setTransform( Transform.rotateX(0), curve, callback);
            },
            flipY: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setOpacity(1);

                modifier.setTransform( Transform.rotateY(Math.PI/2) );
                modifier.setTransform( Transform.rotateY(0), curve, callback);
            },
            zoomIn: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };
                var _cb = callback ? Utility.after(2, function(){
                    callback();
                }) : Utility.after(2, function(){});

                // start
                modifier.halt();
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setOpacity(0);
                modifier.setTransform(Transform.multiply(
                    Transform.scale(2, 2, 1),
                    Transform.translate(0, 0, 0)
                ));

                // run
                modifier.setOpacity(1, curve, _cb);
                modifier.setTransform(Transform.scale(1, 1, 1), curve, _cb);
            }
        },

        out: {
            fadeOut: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setOpacity( 1 );
                modifier.setOpacity( 0, curve, callback);
                modifier.setTransform( Transform.identity );
            },
            popOut: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                        curve       : Easing.inOutExpoNorm,
                        duration    : 350
                    };

                modifier.halt();
                modifier.setTransform(
                    Transform.thenMove(
                        Transform.scale( 0.000001, 0.000001),
                        [window.innerWidth * 0.5, window.innerHeight * 0.5]),
                    curve,
                    callback
                );
            },
            fadeSmallRight: function ( callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( 200, 0, 0), curve, callback);
                modifier.setOpacity( 0, curve);
            },
            fadeRight: function ( callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( window.innerWidth, 0, 0), curve, callback);
                modifier.setOpacity( 0, curve);
            },
            fadeLeft: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setTransform( Transform.translate( -window.innerWidth, 0, 0), curve, callback);
                modifier.setOpacity( 0, curve);
            },
            slideDown: function ( callback, curve ) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setTransform( Transform.identity );
                modifier.setTransform( Transform.translate(0, window.innerHeight, 0), curve, callback);
            },
            flipX: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setTransform( Transform.rotateX(0) );
                modifier.setTransform( Transform.rotateX(Math.PI/2), curve, callback);
            },
            flipY: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };

                modifier.halt();
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setOpacity(1);

                modifier.setTransform( Transform.rotateY(0) );
                modifier.setTransform( Transform.rotateY(Math.PI/2), curve, callback);
            },

            zoomOut: function (callback, curve) {
                var modifier = this.getActiveModifier();
                curve = curve ? curve : {
                    curve       : Easing.inOutExpoNorm,
                    duration    : 350
                };
                modifier.halt();

                var _cb = callback ? Utility.after(2, function(){
                    callback();

                }) : Utility.after(2, function(){

                });

                // start
                modifier.setOrigin([.5, .5]);
                modifier.setAlign([.5, .5]);
                modifier.setOpacity(1);
                modifier.setTransform(Transform.multiply(
                    Transform.scale(1, 1, 1),
                    Transform.translate(0, 0, 0)
                ));

                // run
                modifier.setOpacity(0, curve, _cb);
                modifier.setTransform(Transform.scale(2, 2, 1), curve, _cb);
            }
        }
    };
});