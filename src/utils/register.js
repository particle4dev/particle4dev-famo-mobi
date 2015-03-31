Register = (function () {
    function negate (predicate) {
        return function() {
            return !predicate.apply(this, arguments);
        };
    }
    var omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = negate(iteratee);
        } else {
            var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
            iteratee = function(value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };

    return function () {
        var list = {}, arr = [];
        this.set = function (name, obj) {
            if(list[name])
                throw new Error(name + ' is exists');
            list[name] = obj;
            arr.push(obj);
        };
        this.get = function (name) {
            if(_.isString(name))
                return list[name];
            return arr[name];
        };
        this.isSet = function (name) {
            return !!list[name];
        };
        this.length = function () {
            return arr.length;
        };
        this.forEach = function (func) {
            _.each(list, func);
        };
        this.remove = function (arg) {
            if(_.isString(arg)) {
                arr = _.without(arr, list[arg]);
                list[arg] = null;
                delete list[arg];
            }
            else if(_.isObject(arg)) {
                list = omit(list, function(value, key, object) {
                    return value === arg.value;
                });
                arr = _.without(arr, arg.value);
            }
            else if(_.isNumber(arg)) {
                if(this.length() <= arg)
                    return;
                list = omit(list, function(value, key, object) {
                    return value === arr[arg];
                });
                arr = _.without(arr, arr[arg]);
            }
        }
    };
})();

// tests
// Meteor.startup(function () {
//     var r = new Register();
//     r.set('one', 1);
//     r.set('two', 2);
//     r.set('three', 3);
//     r.set('four', 4);
//     r.set('five', 5);

//     if(r.get('one') != 1)
//         throw new Error('set error');
//     if(r.length() != 5)
//         throw new Error('length error');
//     if(!r.isSet('one'))
//         throw new Error('isSet error');
    
//     r.remove('one');
//     if(r.length() != 4)
//         throw new Error('length error');
//     if(r.get('one') != undefined)
//         throw new Error('get error');
    
//     r.remove(0);
//     if(r.length() != 3)
//         throw new Error('length error');
//     if(r.get(0) != 3)
//         throw new Error('get error');

//     r.remove({
//         value: 4
//     });
//     if(r.length() != 2)
//         throw new Error('length error');
//     if(r.get('four') != undefined)
//         throw new Error('get error');
// });