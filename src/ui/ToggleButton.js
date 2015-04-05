/**
 * @module
 */
define('famodev/ui/ToggleButton', [
    'require',
    'exports',
    'module'
    ],
    function(require, exports, module) {
    'use strict';

    var Surface = famous.core.Surface;

    /**
     * A view for transitioning between two surfaces based
     *  on a 'on' and 'off' state
     *
     * @class ToggleButton
     * @extends Surface
     * @constructor
     *
     * @param {object} options overrides of default options
     */

    function ToggleButton(options) {
        Surface.apply(this, arguments);

        this.options.onClasses = options.onClasses;
        this.options.offClasses = options.offClasses;
        this.options.duration = options.duration;
        this.on('click', function () {
            var self = this;
            _.each(this.options.onClasses, function (cls) {
                self.addClass(cls);
            });
            _.each(this.options.offClasses, function (cls) {
                self.removeClass(cls);
            });
            setTimeout(function () {
                _.each(self.options.offClasses, function (cls) {
                    self.addClass(cls);
                });
                _.each(self.options.onClasses, function (cls) {
                    self.removeClass(cls);
                }); 
            }, this.options.duration);
        }.bind(this));
    }

    ToggleButton.prototype = Object.create(Surface.prototype);
    ToggleButton.prototype.constructor = ToggleButton;
    ToggleButton.DEFAULT_OPTIONS = {
        duration: 300
    };

    module.exports = ToggleButton;
});