define([
    './var/hasOwn',
    './var/slice',
    './var/toString'
], function(hasOwn, slice, toString) {

    /**
     *  @module cog
     *  @namespace
     */

    var cog = function() {
        return !(this instanceof cog) ? new cog() : this;
    };

    /**
     * @name VERSION
     * @summary The current version of cog.
     *
     * @const
     * @memberof cog
     *
     * @type {string}
     */

    cog.VERSION = '@VERSION';

    /**
     * @name extend
     * @summary Merges objects, overwriting existing properties.
     * @desc Merge contents of two or more objects into the first one.
     * Source properties will replace target properties.
     *  based on jQuery extend().
     *
     * @see http://api.jquery.com/jQuery.extend/
     * @see https://github.com/jquery/jquery/blob/master/src/core.js
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {object} [target] - Target object
     * @param {...object} [source] - Source object(s).
     * @returns {object}
     */

    cog.extend = function extend() {
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

        if (typeof target !== 'object' && !isFunction(target)) {
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

                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        //noinspection JSUnfilteredForInLoop
                        target[key] = extend(deep, clone, copy);

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
     * @name defaults
     * @summary Merges objects, keeping existing properties.
     * @desc Merge contents of two or more objects into the first one.
     * Source properties will not replace target properties.
     *  based on underscore defaults().
     *
     * @see http://underscorejs.org/#defaults
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {object} [target] - Target object
     * @param {...object} [source] - Source object(s).
     * @returns {object}
     */

    function defaults(target, source) {
        slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var key in source) {
                    //noinspection JSUnfilteredForInLoop
                    if (target[key] === undefined) {
                        //noinspection JSUnfilteredForInLoop
                        target[key] = source[key];
                    }
                }
            }
        });
        return target;
    }

    /**
     * @name type
     * @summary Safely check object type.
     * @desc based on jquery type().
     *
     * @see http://api.jquery.com/jquery.type/
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {string}
     */

    function type(obj) {
        // undefined or null
        if (obj == null) {
            return obj + '';
        }
        return typeof obj === 'object' || typeof obj === 'function' ? 'object' : typeof obj;
    }

    /**
     * @name isArray
     * @summary Returns true if object is an Array.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * @name isDate
     * @summary Returns true if object is a Date.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isDate(obj) {
        return toString.call(obj) === '[object Date]';
    }

    /**
     * @name isBoolean
     * @summary Returns true if object is a boolean.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isBoolean(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    }

    /**
     * @name isFunction
     * @summary Returns true if object is a function.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    /**
     * @name isNumber
     * @summary Returns true if object is a number.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    }

    /**
     * @name isObject
     * @summary Returns true if object is an object.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * @name isPlainObject
     * @summary Returns true if object is a plain object.
     * @desc based on jquery isPlainObject().
     *
     *  false if:
     *   - not an object
     *   - an element object
     *   - a window object
     *   - an instance of a constructor
     *
     * @see http://api.jquery.com/jQuery.isPlainObject/
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isPlainObject(obj) {
        if (type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
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
    }

    /**
     * @name isRegExp
     * @summary Returns true if object is an RegExp.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isRegExp(obj) {
        return toString.call(obj) === '[object RegExp]';
    }

    /**
     * @name isString
     * @summary Returns true if object is a String.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * @name isWindow
     * @summary Returns true if object is a window.
     *
     * @static
     * @method
     * @memberof cog
     *
     * @param {*} obj - Test object.
     * @returns {boolean}
     */

    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    // ------------------------------------------
    // Internal Utilities

    /**
     * _inherit
     *
     *  Based on Simple Javascript Inheritance by John Resig
     *      http://ejohn.org/blog/simple-javascript-inheritance/
     *  MIT Licensed.
     *
     * @param target
     * @param base
     * @param source
     * @private
     */

    var initializing = false;

    //if function de-compilation is supported match '_super', otherwise match anything
    //noinspection JSValidateTypes
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    function _inherit(target, base, source) {
        for (var key in source) {
            //noinspection JSUnfilteredForInLoop
            target[key] = (isFunction(source[key]) && isFunction(base[key]) && fnTest.test(source[key])) ?
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

    /**
     * _defineDirtyableProp
     * @param obj
     * @param key
     * @param value
     * @private
     */

    function _defineDirtyableProp(obj, key, value) {

        var privateKey = '_' + key;
        obj[privateKey] = value;

        Object.defineProperty(obj, key, {
            get: function() {
                return this[privateKey];
            },
            set: function(value) {
                var oldValue = this[privateKey];
                this[privateKey] = value;
                this.dirty = true;
                if (isFunction(this.trigger)) {
                    this.trigger(key, value, oldValue);
                }
            },
            enumerable: true,
            configurable: true
        })
    }

    /**
     * _defaultProperties
     * @param obj
     * @param defaults
     * @param dirtyable
     * @private
     */

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
     * @class Construct
     * @classdesc Construct is a base class for javascript inheritance. All cog classes derive from this object.
     *
     * When a Construct instance is created, the init method will be called with any arguments passed to the Constructor.
     *
     * Derived classes can be created using the extend method.
     * Instances can be created using the new keyword or the create method.
     * Access to overridden methods has been provided by this._super()
     *
     * Based on Simple Javascript inheritance by John Resig.
     *
     * @see http://ejohn.org/blog/simple-javascript-inheritance/
     *
     * @abstract
     * @memberof cog
     *
     * @returns {instance}
     */

    var Construct = function() {
        if (arguments.length) {
            return Construct.extend.apply(Construct, arguments);
        }
        return this;
    };

    /**
     * @name create
     * @summary Creates a new instance of the constructor.
     * @desc The create method creates a new instance of the class.
     * Arguments passed to create will passed to the constructor function.
     *
     * @static
     * @method
     * @memberof cog.Construct
     *
     * @returns {instance}
     */

    Construct.create = function() {
        var args = slice.call(arguments);
        args.splice(0, 0, this);
        return new (Function.prototype.bind.apply(this, args));
    };

    /**
     * @name init
     * @summary Initialize the class
     * @desc Called by the Constructor on create.
     *
     * @instance
     * @abstract
     * @method
     * @memberof cog.Construct
     */

    Construct.prototype.init = function() {};

    /**
     * @name destroy
     * @summary Destroys the instance of the constructor.
     * @desc Destroy is a virtual function. The base implementation does nothing.
     * Override this function if clean up is needed when the object is destroyed.
     *
     * @abstract
     * @instance
     * @method
     * @memberof cog.Construct
     */

    Construct.prototype.destroy = function() {};


    /**
     * @name Props Definition
     * @summary A props definition object used by cog.Construct.extend
     *
     * @desc The props definition is a descriptor object that defines new properties/functions for the target object,
     * which is either a Constructor or the Constructor's prototype.
     *
     * @example
     *  {
     *      defaults: {
     *          foo: 42
     *      },
     *      properties: {
     *          bar: {
     *              value: 84,
     *              writable: true
     *          }
     *      },
     *      doSomething: function() { ... }
     *  }
     * @see {@link cog.Construct.extend}
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     *
     * @typedef {Object} props
     * @property {boolean} [dirtyOnChange=false] - If set to true, default auto-properties will set dirty=true on change.
     * @property {Object} defaults - A object whose enumerable properties constitute values for properties.
     * @property {Object} properties - An object whose enumerable properties constitute property descriptors.
     * @property {...function} ...function - All enumerable functions will be merged into the target object.
     */


    /**
     * @name extend
     * @summary Extends the constructor and returns a new Constructor.
     * @desc The extend is used to derive objects from a class.
     *
     * @static
     * @method
     * @memberof cog.Construct
     *
     * @example <caption>.extend(instanceProps)</caption>
     *  var Derived = cog.Construct.extend({
     *      instanceMethod: function() {...} // 'this' is the instance
     *  });
     * @example <caption>.extend(fullName, instanceProps)</caption>
     *  var Derived = cog.Construct.extend('DerivedClass', {
     *      instanceMethod: function() {...} // 'this' is the instance
     *  });
     * @example <caption>.extend(staticProps, instanceProps)</caption>
     *  var Derived = cog.Construct.extend({
     *      staticMethod: function() {...} // 'this' is the Constructor
     *  }, {
     *      instanceMethod: function() {...} // 'this' is the instance
     *  });
     * @example <caption>.extend(fullName, staticProps, instanceProps)</caption>
     *  var Derived = cog.Construct.extend('DervedClass', {
     *      staticMethod: function() {...} // 'this' is the Constructor
     *  }, {
     *      instanceMethod: function() {...} // 'this' is the instance
     *  });
     * @param {string} [fullName] - Tags the Constructor to make identification easier.
     * @param {props} [staticProps] - Static props are merged into returned the Constructor object.
     * @param {props} [instanceProps] - Instances props are merged into the returned Constructor.prototype object.
     * @returns {Function}
     */

    Construct.extend = function(fullName, staticProps, instanceProps) {

        var prototype, superPrototype;

        if (!isString(fullName)) {
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
                this.init.apply(this, arguments);
            }
        }

        Constructor.prototype = prototype;
        Constructor.prototype.constructor = Constructor;

        _inherit(Constructor, {}, superPrototype.constructor);
        _inherit(Constructor, superPrototype.constructor, staticProps);

        /**
         * @name fullName
         * @summary Gets fullName of Constructor.
         *
         * @static
         * @memberof cog.Construct
         * @type {String}
         */

        Object.defineProperty(Constructor, 'fullName', {
            value: fullName,
            writable: false,
            configurable: true,
            enumerable: false
        });

        /**
         * @name dirty
         * @summary True if an auto-property has been changed.
         *
         * @instance
         * @memberof cog.Construct
         * @type {boolean}
         */

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

        return Constructor;
    };

    cog.extend({
        defaults: defaults,
        type: type,
        isArray: isArray,
        isBoolean: isBoolean,
        isDate: isDate,
        isFunction: isFunction,
        isNumber: isNumber,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isRegExp: isRegExp,
        isString: isString,
        Construct: Construct
    });

    return cog;
});
