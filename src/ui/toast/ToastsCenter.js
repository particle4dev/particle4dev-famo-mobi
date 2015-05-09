// FIXME: rewrite with new EventsCenter
define('famodev/ui/ToastsCenter', [
    'require',
    'exports',
    'module',
    'famodev/app/EventsCenter',
    'famodev/ui/Toast'
    ], function (require, exports, module) {

        var EventsCenter        = require('famodev/app/EventsCenter');
        var Toast               = require('famodev/ui/Toast');
        /**
         * Add Views
         */

        /**
         * Methods
         */

        /**
         * Events
         */
        var currentToast = null,
        idsetTimeout = null;
        var requireDisplay = function () {
            if(!currentToast) {
                currentToast = Toast.createText({
                    duration: Toast.UNIDENTIFIED
                });
                currentToast.show();
            }
        };
        var hideToast = function (time) {
            if(!_.isNumber(time) || time === Toast.UNIDENTIFIED)
                return;
            if(idsetTimeout) {
                Meteor.clearTimeout(idsetTimeout);
                idsetTimeout = null;
            }
            idsetTimeout = Meteor.setTimeout(function(){
                if(currentToast) {
                    currentToast.hide();
                    currentToast = null;
                }
            }, time);
        };
        EventsCenter.listen('message#*', function (message, time) {
            if(this.getType() == 'show') {
                var duration = Toast.UNIDENTIFIED;
                if(time)
                    duration = time;
                requireDisplay();

                currentToast.setText(message);
                hideToast(duration);
            }
            else if(this.getType() == 'hide') {
                requireDisplay();

                if(_.isNumber(message))
                    time = message;
                if(_.isString(message)) {
                    currentToast.setText(message);
                    if(!_.isNumber(time))
                        time = 3000;
                }
                if(!time)
                    time = 0;
                hideToast(time);
            }
        });

        module.exports = {
            display: function (container) {
                Toast.init(container, zIndex6_toast);
                var message = Toast.getMessageSurface();
                message.on('click', function(evt){
                    evt.preventDefault();
                    if(idsetTimeout) {
                        Meteor.clearTimeout(idsetTimeout);
                        idsetTimeout = null;
                    }
                    if(currentToast) {
                        currentToast.hide();
                        currentToast = null;
                    }
                });
            }
        };
    });