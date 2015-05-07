// https://github.com/meteor/meteor/blob/devel/packages/mongo/collection.js#L211
// https://github.com/meteor/meteor/blob/devel/packages/mongo/package.js#L43
// https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_client.js#L341
var ir = Package['iron:router'];
if(typeof ir !== 'undefined' && ir.RouteController) {
    var runAfter = null;
    FamousController = ir.RouteController.extend({
        page: 'views/pages/NewPage',
        onBeforeAction: function () {
            if(_.isFunction(runAfter)) {
                runAfter();
                runAfter = null;
            }
            if(this.loadingPage())
                this.next();
            setTimeout(function(){
                if(_.isFunction(this.beforeAction))
                    this.beforeAction();
            }.bind(this));
        },
        onAfterAction: function () {
            console.log('onAfterAction');
        },
        onStop: function () {
            console.log('onStop');
        },
        data: function () {
            console.log('data');
        },
        action: function () {
            var self = this;
            if (self.ready()) {
                self.showPage();
                if(self.onReady)
                    self.onReady();
            }
        },
        loadingPage: function () {
            var self = this;
            var status = Meteor.status();
            if (!self.ready() && status.connected) {
                require([
                    'famodev/app/EventsCenter'
                ],
                function(EventsCenter) {
                    if(self.page)
                        EventsCenter.trigger('switchPage#views/pages/LoadingPage');
                });
            }
            return self.ready();
        },
        showPage: function () {
            var self = this;
            require([
                'famodev/app/EventsCenter'
            ],
            function(EventsCenter) {
                if(self.page)
                    EventsCenter.trigger('switchPage#' + self.page);
            });
        },
        _runAfterRouterSwitch: function (callback) {
            if(_.isFunction(callback)) {
                runAfter = callback;
            }
        }
    });
    window.FamousController = FamousController;
}