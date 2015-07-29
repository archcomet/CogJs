define([
    './var/hasOwn',
    './var/slice',
    './var/toString',
    './polyfill/bind'
], function(hasOwn, slice, toString) {

    /**
     * CogJs exposes itself as a global namespace and as a named AMD module called 'cog'.
     * This namespace contains all classes and core utility functions.
     * @namespace cog
     */

    var cog = function() {
        return !(this instanceof cog) ? new cog() : this;
    };

    /**
     * A string containing the CogJs version number.
     * @memberof cog
     * @const
     */

    cog.VERSION = '@VERSION';

    // ------------------------------------------
    // Public Utilities

    /**
     * Merge the contents of two or more objects into the first object. Target properties will be overwritten.
     *
     * Based on [jQuery.extend()](http://api.jquery.com/jQuery.extend/)
     *
     * Essentially the same as jQuery.extend, except extends the cog namespaces instead of the jquery namespace if
     * only one argument is passed in.
     *
     * @see http://api.jquery.com/jQuery.extend/
     *
     * @memberof cog
     *
     * @param {boolean} [deep] - If true, the merge becomes recursive (a.k.a. deep copy).
     * @param {object} target - An object that will receive the properties if additional objects are passed in.
     * Alternatively, target will extend the cog namespace if it is the sole argument.
     * @param {object} [object1] - An object containing properties to be merged into the target.
     * @param {...object} [objectN] - Additional objects containing properties to be merged into the target.
     * Will overwrite properties provided by previous objects.
     * @returns {object} - The target object.
     *
     * @example <caption>Merge two objects</caption>
     *  var target = {
     *      foo: {
     *          bar: 42
     *      }
     *  }
     *
     *  var object {
     *      foo: {
     *          msg: 'hello world'
     *      }
     *  }
     *
     *  // Replaces object.foo with a references to target.foo.
     *  cog.extend(target, object);
     *
     *  // The following statements are now true:
     *  target.foo.msg === 'hello world'
     *  target.foo.bar === undefined;
     *  target.foo === object.foo;
     * @example <caption>Merge two objects with a deep copy</caption>
     *  var target = {
     *      foo: {
     *          bar: 42
     *      }
     *  }
     *
     *  var object {
     *      foo: {
     *          msg: 'hello world'
     *      }
     *  }
     *
     *  // Merges object.foo with to target.foo, and copies properties.
     *  cog.extend(true, target, object);
     *
     *  // The following statements are now true:
     *  target.foo.msg === 'hello world'
     *  target.foo.bar === 42;
     *  target.foo !== object.foo;
     */

    cog.extend = function() {
        var options, key, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            n = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && !cog.isFunction(target)) {
            target = {};
        }

        if (i === n) {
            target = this;
            i--;
        }

        for(; i < n; ++i) {
            if ((options = arguments[i]) != null) {
                for (key in options) {
                    //noinspection JSUnfilteredForInLoop
                    src = target[key];

                    //noinspection JSUnfilteredForInLoop
                    copy = options[key];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (cog.isPlainObject(copy) || (copyIsArray = cog.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && cog.isArray(src) ? src : [];
                        } else {
                            clone = src && cog.isPlainObject(src) ? src : {};
                        }

                        //noinspection JSUnfilteredForInLoop
                        target[key] = cog.extend(deep, clone, copy);

                    } else if (copy !== undefined) {

                        //noinspection JSUnfilteredForInLoop
                        target[key] = copy;
                    }
                }
            }
        }

        return target;
    };

    /**
     * Merges the contents of two or more objects into the first object. Target properties will not be overwritten.
     *
     * Based on jquery extend, but modified to keep existing props instead.
     *
     * Note: Source arraies will only be copied if the target's property is undefined.
     *
     * @memberof cog
     *
     * @param {boolean} [deep] - Optional, when true, properties will be deep copied.
     * @param {object} target - An object that will receive properties if additional objects are passed in.
     * @param {object} [object1] - An object containing properties to be merged into the target.
     * @param {object} [objectN] - Additional objects containing properties to be merged into the target.
     * @returns {object} - The target object.
     */

    cog.defaults = function defaults(target, object1, objectN) {

        var options, key, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            n = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && !cog.isFunction(target)) {
            target = {};
        }

        for(; i < n; ++i) {
            if ((options = arguments[i]) != null) {
                for (key in options) {
                    //noinspection JSUnfilteredForInLoop
                    src = target[key];

                    //noinspection JSUnfilteredForInLoop
                    copy = options[key];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (cog.isPlainObject(copy) || (copyIsArray = cog.isArray(copy)) )) {

                        if (src === undefined) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = [];
                            } else {
                                clone = {};
                            }

                            //noinspection JSUnfilteredForInLoop
                            target[key] = cog.defaults(deep, clone, copy);

                        } else if (!cog.isArray(src)) {
                            cog.defaults(deep, src, copy);
                        }

                    } else if (src == undefined && copy !== undefined) {

                        //noinspection JSUnfilteredForInLoop
                        target[key] = copy;
                    }
                }
            }
        }

        return target;
    };

    cog.type = function type(obj) {
        // undefined or null
        if (obj == null) {
            return obj + '';
        }
        return typeof obj === 'object' || typeof obj === 'function' ? 'object' : typeof obj;
    };

    /**
     * Checks if the object is an array.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isArray = function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    };

    /**
     * Checks if the object is a date.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isDate = function isDate(obj) {
        return toString.call(obj) === '[object Date]';
    };

    /**
     * Checks if the object is a boolean.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isBoolean = function isBoolean(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    /**
     * Checks if the object is a function.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isFunction = function isFunction(obj) {
        return typeof obj === 'function';
    };

    /**
     * Checks if the object is a number.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isNumber = function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    };

    /**
     * Checks if the object is an object.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isObject = function isObject(obj) {
        return obj === Object(obj);
    };

    /**
     * Checks if the object is a plain object.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isPlainObject = function isPlainObject(obj) {
        if (cog.type(obj) !== 'object' || obj.nodeType || cog.isWindow(obj)) {
            return false;
        }
        try {
            if (obj.constructor && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }
        return true;
    };

    /**
     * Checks if the object is a regular expression.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isRegExp = function isRegExp(obj) {
        return toString.call(obj) === '[object RegExp]';
    };

    /**
     * Checks if the object is a string.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isString = function isString(obj) {
        return toString.call(obj) === '[object String]';
    };

    /**
     * Checks if the object is a window element.
     * @memberof cog
     * @param obj
     * @returns {boolean}
     */

    cog.isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // ------------------------------------------
    // Internal Utilities

    var initializing = false;

    //if function de-compilation is supported match '_super', otherwise match anything
    //noinspection JSValidateTypes
    var fnTest = /xyz/.test(function(){xyz=true;}) ? /\b_super\b/ : /.*/;

    var base = { _super: function(){} };

    function _inherit(target, base, source) {
        for (var key in source) {
            //noinspection JSUnfilteredForInLoop
            target[key] = (cog.isFunction(source[key]) && cog.isFunction(base[key]) && fnTest.test(source[key])) ?
                (function(key, fn) {
                    return function() {
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        var tmp = this._super;

                        //noinspection JSUnfilteredForInLoop,JSPotentiallyInvalidUsageOfThis
                        this._super = base[key];
                        var ret = fn.apply(this, arguments);
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        this._super = tmp;

                        return ret;
                    }
                } (key, source[key])) : source[key];
        }
    }

    function _defineDirtyableProp(obj, key, value) {

        var privateKey = '_' + key;
        obj[privateKey] = value;

        Object.defineProperty(obj, key, {
            get: function() {
                return this[privateKey];
            },
            set: function(value) {
                var oldValue = this[privateKey];
                if (oldValue !== value) {

                    /**ExcludeStart**/
                    cog.debug.log('Dirty property changed', key, oldValue, value);
                    /**ExcludeEnd**/

                    this[privateKey] = value;
                    this.dirty = true;
                    if (cog.isFunction(this.trigger)) {
                        this.trigger(key, value, oldValue);
                    }
                }
            },
            enumerable: true,
            configurable: true
        })
    }

    function _defaultProperties(obj, defaults, dirtyable) {
        var key;
        for (key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                if (dirtyable) {
                    _defineDirtyableProp(obj, key, defaults[key]);
                } else {
                    Object.defineProperty(obj, key, {
                        value: defaults[key],
                        configurable: true,
                        writable: true,
                        enumerable: true
                    });
                }
            }
        }
    }

    /**
     * A base constructor for inheritance.
     *
     * Based on [Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)
     * by John Resig
     *
     * @constructor
     * @abstract
     * @memberof cog
     */

    cog.Construct = function Construct() {
        if (arguments.length) {
            return cog.Construct.extend.apply(Construct, arguments);
        }
        return this;
    };


    /**
     * Create an instance
     * @memberof cog
     * @returns {instance} - A new instance of the Constructor.
     */

    cog.Construct.create = function() {
        var args = slice.call(arguments);
        args.splice(0, 0, this);
        return new (Function.prototype.bind.apply(this, args));
    };

    /**
     * Initialize an instance
     * @abstract
     * @instance
     * @memberof cog.Construct
     * @method init
     */

    cog.Construct.prototype.init = function() {};

    /**
     * Destroys an instance
     * @abstract
     * @instance
     * @memberof cog.Construct
     * @method destroy
     */

    cog.Construct.prototype.destroy = function() {};

    var constructs = {};


    /**
     * Extends the Constructor
     * @memberof cog.Construct
     * @param fullName
     * @param staticProps
     * @param instanceProps
     * @returns {Constructor}
     */

    cog.Construct.extend = function(fullName, staticProps, instanceProps) {

        var prototype, superPrototype;

        if (!cog.isString(fullName)) {
            instanceProps = staticProps;
            staticProps = fullName;
            fullName = null;
        }

        if (!instanceProps) {
            instanceProps = staticProps;
            staticProps = null;
        }

        instanceProps = instanceProps || {};
        staticProps = staticProps || {};

        initializing = true;
        prototype = new this();
        superPrototype = this.prototype;
        initializing = false;

        _inherit(prototype, superPrototype, instanceProps);

        function Constructor() {
            if (!(this instanceof Constructor)) {
                throw 'Constructor called without new keyword';
            }
            if (!initializing) {
                var key, prop;
                for (key in Constructor.prototype) {
                    if (key !== 'defaults' && key !== 'properties') {
                        //noinspection JSUnfilteredForInLoop
                        prop = Constructor.prototype[key];
                        if (cog.isPlainObject(prop)) {
                            //noinspection JSUnfilteredForInLoop
                            this[key] = cog.extend(true, {}, prop);
                        }
                        else if (cog.isArray(prop)) {
                            //noinspection JSUnfilteredForInLoop
                            this[key] = cog.extend(true, [], prop);
                        }
                    }
                }
                this.init.apply(this, arguments);
            }
        }

        Constructor.prototype = prototype;
        Constructor.prototype.constructor = Constructor;
        Constructor.super = this;

        _inherit(Constructor, {}, superPrototype.constructor);
        _inherit(Constructor, superPrototype.constructor, staticProps);

        Object.defineProperty(Constructor, 'fullName', {
            value: fullName,
            writable: false,
            configurable: true,
            enumerable: false
        });


        if (Constructor.dirtyOnChange) {
            Object.defineProperty(Constructor.prototype, 'dirty', {
                value: true,
                writable: true,
                configurable: true,
                enumerable: false
            });
        }

        if (instanceProps.defaults) {
            _defaultProperties(Constructor.prototype, instanceProps.defaults, Constructor.dirtyOnChange);
        }

        if (instanceProps.properties) {
            Object.defineProperties(Constructor.prototype, instanceProps.properties);
        }

        if (Constructor.defaults) {
            _defaultProperties(Constructor, Constructor.defaults, false);
        }

        if (Constructor.properties) {
            Object.defineProperties(Constructor, Constructor.properties);
        }

        if (Constructor.setup) {
            Constructor.setup();
        }

        if (cog.isString(fullName)) {
            if (constructs[fullName]) {
                console.warn('Construct ' + fullName + ' re-declared.');
            }
            constructs[fullName] = Constructor;
        }

        return Constructor;
    };

    return cog;
});
