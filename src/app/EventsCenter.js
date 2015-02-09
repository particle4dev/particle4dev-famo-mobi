// https://github.com/aurajs/aura/blob/master/lib/ext/mediator.js
// https://github.com/AtumLab/moduleb/blob/master/packages/moduleb/both/mediator.js
// https://github.com/asyncly/EventEmitter2

define('famodev/app/EventsCenter', [
    'require', 
    'exports',
    'module'
    ], function (require, exports, module) {

        var server = new EventEmitter2({
            //
            // use wildcards.
            //
            wildcard: true,

            //
            // the delimiter used to segment namespaces, defaults to `.`.
            //
            delimiter: '#', 

            //
            // if you want to emit the newListener event set to true.
            //
            newListener: false, 

            //
            // max listeners that can be assigned to an event, default 10.
            // By default EventEmitters will print a warning if more than 10 
            // listeners are added to it. This is a useful default which helps finding memory leaks. 
            // Obviously not all Emitters should be limited to 10. This function allows that to be increased.
            // Set to zero for unlimited.
            maxListeners: 50
        });

        server.getType = function () {
            var tmp = this.event.split("#");
            return (tmp[1]);
        }

        server.listen = server.on;
        server.trigger = server.emit;

        return module.exports = {
            'trigger': server.trigger.bind(server),
            'emit': server.emit.bind(server),

            'listen': server.listen.bind(server),
            'on': server.on.bind(server),
            'addListener': server.addListener.bind(server),

            'onAny': server.onAny.bind(server),
            'offAny': server.offAny.bind(server),
            'once': server.once.bind(server),
            'many': server.many.bind(server),
            'removeListener': server.removeListener.bind(server),
            'off': server.off.bind(server),
            'removeAllListeners': server.removeAllListeners.bind(server),
            'setMaxListeners': server.setMaxListeners.bind(server),
            'listeners': server.listeners.bind(server),
            'listenersAny': server.listenersAny.bind(server),
        };
});

/**
Test
Meteor.startup(function () {
    var server = new EventEmitter2({
        //
        // use wildcards.
        //
        wildcard: true,

        //
        // the delimiter used to segment namespaces, defaults to `.`.
        //
        delimiter: '#', 

        //
        // if you want to emit the newListener event set to true.
        //
        newListener: false, 

        //
        // max listeners that can be assigned to an event, default 10.
        // By default EventEmitters will print a warning if more than 10 
        // listeners are added to it. This is a useful default which helps finding memory leaks. 
        // Obviously not all Emitters should be limited to 10. This function allows that to be increased.
        // Set to zero for unlimited.
        maxListeners: 50
    });

    server.getType = function () {
        var tmp = this.event.split("#");
        return (tmp[1]);
    }

    server.on('hidePaper#*', function(value1, value2) {
        console.log(this.getType(), value1, value2);
    });

    server.emit('hidePaper#views/papers/ChatsPaper', {
        interestId: 'self.params.interestId',
        routerName: 'currentRouterName'
    });

    server.listen = server.on;
    server.listen('zoomOutMainApp', function(value1, value2) {
        console.log(this.event, value1, value2);
    });

    server.trigger = server.emit;
    server.trigger('zoomOutMainApp');

});
*/