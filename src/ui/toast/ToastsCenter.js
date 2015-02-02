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
        idsetTimeout = null,
        isShow = false;
        var requireDisplay = function () {
            if(!currentToast) {
                currentToast = Toast.createText({
                    duration: Toast.UNIDENTIFIED
                });
                currentToast.show();
                isShow = true;
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
                    isShow = false;
                }
            }, time);
        };
        EventsCenter.listen('show#message', function (message, time) {
            var duration = Toast.UNIDENTIFIED;
            if(time)
                duration = time;
            requireDisplay();
            currentToast.setText(message);
            hideToast(duration);
        });
        EventsCenter.listen('hide#message', function (message, time) {
            requireDisplay();
            if(_.isNumber(message))
                time = message;
            if(_.isString(message)) {
                currentToast.setText(message);
                if(!_.isNumber(message))
                    time = 3000;
            }
            if(!time)
                time = 0;
            hideToast(time);
        });
        module.exports = {
            display: function (container) {
                Toast.init(container, zIndex6_toast); 
            }
        };
    });