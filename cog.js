//      Cog.js 1.3.1pre 2014-01-04T22:13:59.475Z
//      http://www.github.com/archcomet/cogjs
//      (c) 2013-2014 Michael Good
//      Cog.js may be freely distributed under the MIT license.

(function() {

    var hasOwn = Object.prototype.hasOwnProperty;

    var slice = Array.prototype.slice;

    var toString = Object.prototype.toString;


    /**
     * cog
     *  Safe object to hang the API off of
     * @returns {cog}
     */

    var cog = function() {
        return !(this instanceof cog) ? new cog() : this;
    };

    cog.VERSION = '1.3.1pre';


    // ------------------------------------------
    // Utility functions

    /**
     * extend function
     * based on jQuery extend:
     *  http://api.jquery.com/jQuery.extend/
     *  https://github.com/jquery/jquery/blob/master/src/core.js
     *
     * @returns {*|{}}
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
    }

    /**
     * defaults
     *  fill given objects with properties
     * @param obj
     * @returns {*}
     */

    function defaults(obj) {
        slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var key in source) {
                    //noinspection JSUnfilteredForInLoop
                    if (obj[key] === undefined) {
                        //noinspection JSUnfilteredForInLoop
                        obj[key] = source[key];
                    }
                }
            }
        });
        return obj;
    }

    /**
     * type
     *  Safely check typeof object.
     * @param obj
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
     * isArray
     * @param obj
     * @returns {boolean}
     */

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * isDate
     * @param obj
     * @returns {boolean}
     */

    function isDate(obj) {
        return toString.call(obj) === '[object Date]';
    }

    /**
     * isBoolean
     * @param obj
     * @returns {boolean}
     */

    function isBoolean(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    }

    /**
     * isFunction
     * @param obj
     * @returns {boolean}
     */

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    /**
     * isNumber
     * @param obj
     * @returns {boolean}
     */

    function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    }

    /**
     * isObject
     * @param obj
     * @returns {boolean}
     */

    function isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * isPlainObject
     *  false if:
     *   - not an object
     *   - an element object
     *   - a window object
     *   - an instance of a constructor
     *
     * @param obj
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
     * isRegExp
     * @param obj
     * @returns {boolean}
     */

    function isRegExp(obj) {
        return toString.call(obj) === '[object RegExp]';
    }

    /**
     * isString
     * @param obj
     * @returns {boolean}
     */

    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * isWindow
     * @param obj
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

    // ------------------------------------------
    // Core Objects

    /**
     * Construct
     *  Base object used by cog for inheritance
     *  No implementation for instances, but provides interface for destroy function.
     * @constructor
     */

    var Construct = function() {
        if (arguments.length) {
            return Construct.extend.apply(Construct, arguments);
        }
        return this;
    };

    Construct.create = function() {
        var args = slice.call(arguments);
        args.splice(0, 0, this);
        return new (Function.prototype.bind.apply(this, args));
    };

    Construct.prototype.destroy = function() {};

    /**
     * Construct Extend
     *  Extends the constructor and returns a new Constructor.
     *
     * @param [fullName] - Optional param, if provided will tag Constructor to may identification easier.
     * @param [staticProps] - Optional param, if provided will extend the Constructor.
     * @param [instanceProps] - Optional param, if provided will extend the Constructor.prototype.
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
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        Constructor.prototype = prototype;
        Constructor.prototype.constructor = Constructor;

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

    /**
     * ArrayWrapper
     *
     * Wraps a native javascript array for protected data access.
     * Can spawn clones or readonly copies.
     *
     * If the first parameter is an Array type or instance of an ArrayWrapper,
     * then initialize the data as a clone of the input array.
     *
     * If the first parameter is a Number type,
     * then initialize the data with the given capacity.
     *
     * If the second parameter is true,
     * then initialize as a read-only object.
     *
     * @param [array || capacity]
     * @param [readOnly]
     * @constructor
     */

    var ArrayWrapper = cog.Construct.extend('cog.ArrayWrapper', {

        init: function(arg, readOnly) {

            if (this.get) return;

            var data;

            if (arg instanceof ArrayWrapper) {
                data = arg.serialize();
            }
            else if (cog.isArray(arg)) {
                data = arg.slice(0);
            } else {
                data = new Array((cog.isNumber(arg) ? arg : 0));
            }

            if (!readOnly) {
                this.add = function(obj) {
                    data.push(obj);
                    return this;
                };

                this.insert = function(obj, index) {
                    data.splice(index, 0, obj);
                    return this;
                };

                this.remove = function(obj) {
                    var index = data.indexOf(obj);
                    if (index > -1) {
                        data.splice(index, 1);
                    }
                    return this;
                };

                this.removeAtIndex = function(index) {
                    data.splice(index, 1);
                    return this;
                };

                this.removeAll = function() {
                    data.length = 0;
                    return this;
                };

                this.removeLast = function() {
                    data.pop();
                    return this;
                };
            }

            this.get = function(index) {
                return data[index];
            };

            this.each = function(callback) {
                var i = 0, n = data.length;
                for (; i < n; ++i) {
                    callback(data[i], i);
                }
                return this;
            };

            this.length = function() {
                return data.length;
            };

            this.serialize = function() {
                return data.slice(0);
            };

            this.clone = function() {
                return new ArrayWrapper(this, readOnly);
            };

            this.readyOnly = function() {
                return new ArrayWrapper(this, true);
            };
        }
    });

    /**
     * SetWrapper
     *
     * Wraps a native javascript object for protected data access.
     * Can spawn clones or readonly copies.
     *
     * If the first parameter is an Object type or instance of an SetWrapper,
     * then initialize the data as a clone of the input object.
     *
     * If the second parameter is true,
     * then initialize as a read-only object.
     *
     * @param [object]
     * @param [readOnly]
     * @constructor
     */

    var SetWrapper = cog.Construct.extend('cog.SetWrapper', {

        init: function(arg, readonly) {

            if (this.get) return;

            var data;

            if (arg instanceof SetWrapper) {
                data = arg.serialize();
            } else if (cog.isObject(arg)) {
                data = cog.extend({}, arg);
            } else {
                data = {};
            }

            if (!readonly) {
                this.set = function(key, obj) {
                    data[key] = obj;
                    return this;
                };

                this.remove = function(obj) {
                    for (var key in data) {
                        if (data.hasOwnProperty(key) && data[key] === obj) {
                            return this.removeKey(key);
                        }
                    }
                    return this;
                };

                this.removeKey = function(key) {
                    delete data[key];
                    return this;
                };

                this.removeAll = function() {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            delete data[key];
                        }
                    }
                    return this;
                };

                this.extend = function() {
                    var args = slice.call(arguments);
                    args.splice(0, 0, data);
                    cog.extend.apply(cog.extend, args);
                    return this;
                };
            }

            this.get = function(key) {
                return data[key];
            };

            this.each = function(callback) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        callback(data[key], key);
                    }
                }
                return this;
            };

            this.count = function() {
                var count = 0;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        ++count;
                    }
                }
                return count;
            };

            this.serialize = function() {
                return cog.extend({}, data);
            };

            this.clone = function() {
                return new SetWrapper(this, readonly);
            };

            this.readOnly = function() {
                return new SetWrapper(this, true);
            };
        }
    });

    cog.extend({
        ArrayWrapper: ArrayWrapper,
        SetWrapper: SetWrapper
    });


    /**
     * Seed-able random number generator based on ARC4
     */

    var rand = (function() {

        var lastSeed,
            width = 256, // Size of RC4 output
            chunks = 6, // Number of RC4 outputs for each double
            digits = 52, // Significant digits in a double
            S = new Array(width), // Entropy pool
            key = [], // Key array
            denominator = Math.pow(width, chunks),
            significance = Math.pow(2, digits),
            overflow = significance * 2,
            mask = width - 1;

        /**
         * Key mixing
         * Converts seed to an array of integers with a max length 256
         * @param seed
         */

        function _mixKey(seed) {
            var smear, i = 0, seedString = seed + '';
            key.length = 0;
            for (; i < seedString.length; ++i) {
                key[mask & i] =  mask & ((smear ^= key[mask & i] * 19) + seedString.charCodeAt(i))
            }
        }

        /**
         * Key scheduling
         * Initializes permutations in the entropy pool
         */

        function _scheduleKey() {
            var swap, i, j = 0, keyLength = key.length;
            for (i = 0; i < width; ++i) {
                S[i] = i;
            }

            for (i = 0; i < width; ++i) {
                j = (j + S[i] + key[i % keyLength]) % width;
                swap = S[i];
                S[i] = S[j];
                S[j] = swap;
            }
        }

        /**
         * generator
         * @type {{i: number, j: number, out: out}}
         * @private
         */

        var _gen = {
            i: 0, j: 0,
            out: function(count) {
                var i = this.i,
                    j = this.j,
                    swap, K = 0;
                while(count--) {
                    swap = S[i = (i + 1) % mask];
                    K = K * width + S[mask & ((S[i] = S[j = mask & (j + swap)]) + (S[j] = swap))];
                }
                this.i = i;
                this.j = j;
                return K;
            }
        };

        /**
         * Generate a random double between 0 and 1;
         * @returns {number}
         * @private
         */

        function _randDouble() {
            var n = _gen.out(chunks),
                d = denominator,
                x = 0;

            while (n < significance) {
                n = (n + x) * width;
                d *= width;
                x = _gen.out(1);
            }

            while (n >= overflow) {
                n /= 2;
                d /= 2;
                x >>>= 1;
            }

            return (n + x) / d;
        }

        /**
         * Gets/Sets seed
         *
         * seed(*) sets a seed
         * seed() gets the last seed
         *
         * Input can be any type, including strings, numbers, objects, or properties
         * For best results use strings or numbers
         *
         * @param [seed]
         * @return {*}
         */

        function seed(seed) {
            if (arguments.length > 0) {
                _mixKey(seed);
                _scheduleKey();
                _gen.i = 0;
                _gen.j = 0;
                lastSeed = seed;
                return undefined;
            }
            return lastSeed;
        }

        /**
         * Seeds generator with output from Math.random()
         */

        function seedRand() {
            seed(Math.random());
        }

        /**
         * Seeds generator with output from Date.now()
         * Default seed is initialized with this.
         */

        function seedTime() {
            seed(Date.now());
        }

        /**
         * Generates a random integer between 0 and 255
         *
         * Gets the next byte of the output stream.
         * Not as 'random', but is about 5 times faster
         *
         * arc4rand255()    output is 0<= x < 256
         *
         * @returns {number}
         */

        function arc4rand255() {
            return _gen.out(1);
        }

        /**
         * Generates a random double
         *
         * arc4rand()       output is 0 <= x < 1
         * arc4rand(N)      output is 0 <= x < N
         * arc4rand(N, M)   output is N <= x < M
         *
         * @param [N]
         * @param [M]
         * @return {number}
         */

        function arc4rand(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return r;
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return r * (M - N) + N;
        }

        /**
         * Generates a random integer
         *
         * arc4randInt()        output is 0 <= x <= 1
         * arc4randInt(N)       output is 0 <= x <= N
         * arc4randInt(N, M)    output is N <= x <= M
         *
         * @param [N]
         * @param [M]
         * @return {number}
         */

        function arc4randInt(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return Math.floor(r * 2);
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return Math.floor(r * (M - N + 1)) + N;
        }

        // Initialize seed with time
        seedTime();

        return {
            seed: seed,
            seedRand: seedRand,
            seedTime: seedTime,
            arc4rand: arc4rand,
            arc4randInt: arc4randInt,
            arc4rand255: arc4rand255
        };
    }());

    cog.extend({
        rand: rand
    });

    /**
     * _mask
     *  Creates a bit mask from the arguments array.
     * @returns {number}
     * @private
     */

    function _mask() {
        var arg, ret = 0, i = 0, n = arguments.length;
        for(; i < n; ++i) {
            if ((arg = arguments[i]) && arg.category) {
                ret |= arg.category;
            }
        }
        return ret;
    }

    /**
     * Entity
     *
     * @param manager
     * @param id
     * @param [tag]
     * @constructor
     */

    var Entity = cog.Construct.extend('cog.Entity', {

        properties: {
            manager: { get: function() { return this._manager; } },
            id: { get: function() { return this._id } },
            tag: { get: function() { return this._tag } },
            valid: { get: function() { return (this._manager && this._id) ? true : false; } },
            mask: { get: function() { return this._componentMask; } },
            parent: { get: function() { return this._parent; } },
            children: { get: function() { return this._children.slice(0); } }
        },

        init: function(manager, id, tag) {
            this._manager = manager;
            this._id = id;
            this._tag = tag || null;
            this._components = {};
            this._componentMask = 0;
            this._parent = null;
            this._children = [];
        },

        destroy: function(managed) {
            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this.removeAll();
            this._manager = undefined;
            this._id = undefined;
            this._tag = undefined;
            this._children = undefined;
        },

        clone: function() {
            var key, component, clone = this._manager.add(this._tag);
            for (key in this._components) {
                if (this._components.hasOwnProperty(key)) {
                    component = this._components[key];
                    clone.add(component.constructor, component.serialize());
                }
            }
            return clone;
        },

        add: function(Component, options) {
            if (!Component || !Component.category) {
                return undefined;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                component.set(options);
            } else {
                component = this._components[category] = new Component(this, options);
                this._componentMask |= category;
                var event = Component.fullName ? Component.fullName + ' added' : 'component added';
                this._manager.director.events.emit(event, component, this);
            }
            return component;
        },

        has: function(Component) {
            var inputMask = _mask.apply(_mask, arguments);
            return inputMask !== 0 && (inputMask & this._componentMask) === inputMask;
        },

        get: function(Component) {
            if (!Component || !Component.category) {
                return undefined;
            }
            var category = Component.category;
            return this._components[category];
        },

        remove: function(Component) {
            if (Component instanceof cog.Component) {
                Component = Component.constructor;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                this._componentMask &= ~(category);
                this._components[category] = undefined;
                var event = Component.fullName ? Component.fullName + ' removed' : 'component removed';
                this._manager.director.events.emit(event, component, this);
                component.destroy(true);
            }
            return this;
        },

        removeAll: function() {
            var key;
            for (key in this._components) {
                if (this._components.hasOwnProperty(key)) {
                    this.remove(this._components[key]);
                }
            }
            return this;
        },

        addChild: function(entity) {
            if (entity.parent) {
                entity.parent.removeChild(entity);
            }

            entity._parent = this;
            this._children.push(entity);
            this._manager.director.events.emit('entity addChild', this, entity);
            return this;
        },

        removeChild: function(entity) {
            var index;
            if (entity.parent === this) {
                entity._parent = null;
                index = this._children.indexOf(entity);
                if (index > -1) {
                    this._children.splice(index, 1);
                    this._manager.director.events.emit('entity removeChild', this, entity);
                }
            }
            return this;
        },

        removeAllChildren: function() {
            var children = this._children,
                n = children.length - 1;
            for (; n >= 0; --n) {
                this.removeChild(children[n]);
            }
            return this;
        }
    });

    cog.extend({
        Entity: Entity
    });

    function assertLimit(num, limit, msg) {
        if (num > limit) {
            throw msg;
        }
    }

    /**
     * Component
     *
     * @param entity
     * @param options
     * @constructor
     */

    var componentCount = 0;

    var Component = cog.Construct.extend('cog.Component', {

        properties: {
            category: { get: function() { return this._category; } },
            count: { get: function() { return componentCount - 1; } }
        },

        setup: function() {
            assertLimit(componentCount, 64, 'Exceeded 64 Component types.');
            this._category= (componentCount === 0) ? 0 : 1 << (componentCount-1);
            componentCount++;
        }

    }, {

        properties: {
            entity: { get: function() { return this._entity; } },
            valid: { get: function() { return (this._entity !== undefined); } }
        },

        init: function(entity, props) {
            this._entity = entity;
            this._listeners = {};
            this.set(props);
        },

        set: function(props) {
            for(var key in props) {
                if (props.hasOwnProperty(key)) {
                    this.prop(key, props[key]);
                }
            }
        },

        prop: function(propName, value) {
            if (arguments.length === 2) {
                var oldValue = this[propName];
                this[propName] = value;
                this.trigger(propName, value, oldValue);
                return undefined;
            }
            return this[propName];
        },

        on: function(key, handler) {
            var handlers = this._listeners[key];
            if (!handlers) {
                handlers = this._listeners[key] = [];
            }
            handlers.push(handler);
        },

        off: function(key) {
            if (key) {
                if (this._listeners[key]) {
                    this._listeners[key].length = 0;
                }
            } else {
                for (key in this._listeners) {
                    if (this._listeners.hasOwnProperty(key)) {
                        this._listeners[key].length = 0;
                    }
                }
            }
        },

        trigger: function(key, value, oldValue) {
            var i, n, handlers = this._listeners[key];
            if (handlers) {
                for (i = 0, n = handlers.length; i < n; ++i) {
                    handlers[i](value, oldValue);
                }
            }
        },

        keys: function() {
            var key, keys = [];

            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            for (key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    if (key === 'entity' || key === 'valid') {
                        continue;
                    }
                    if (keys.indexOf(key) > -1) {
                        continue;
                    }
                    keys.push(key);
                }
            }

            return keys;
        },

        serialize: function() {
            var key,
                target = {};

            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    target[key] = this[key];
                }
            }

            for (key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    if ( key === 'entity' || key === 'valid') {
                        continue;
                    }
                    target[key] = this[key];
                }
            }

            return target;
        },

        destroy: function(managed) {
            if (!managed && this._entity && this._entity.remove) {
                this._entity.remove(this);
                return;
            }
            this.off();
            this._entity = undefined;
        }
    });

    cog.extend({
        Component: Component
    });

    /**
     * System
     *
     * @param manager
     * @constructor
     */

    var systemCount = 0;

    var System = cog.Construct.extend('cog.System', {

        properties: {
            systemId: { get: function() { return this._systemId; } },
            count: { get: function() { return systemCount -1; } }
        },

        setup: function() {
            this._systemId = (systemCount-1);
            systemCount++;
        }

    }, {

        properties: {
            manager: { get: function() { return this._manager; } }
        },

        init: function(manager) {
            this._manager = manager;
        },

        destroy: function(managed) {
            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this._manager = undefined;
        },

        configure: function(entityManager, eventManager, config) {},

        update: function(entityManager, eventManager, dt) {},

        render: function(entityManager) {}

    });

    cog.extend({
        System: System
    });

    /**
     * Factory
     *
     * @param manager
     * @constructor
     */

    var Factory = cog.System.extend('cog.Factory', {

        entityTag: null,

        components: {},

        init: function(manager) {
            this._entityManager = manager.director.entities;
            this._super(manager);
            this._entities = [];

            if (cog.isString(this.entityTag)) {
                var self = this;
                this['spawn ' + this.entityTag + ' event'] = function() {
                    self.spawn.apply(self, arguments);
                }
            }
        },

        spawn: function(options) {
            var key,
                entity = this._entityManager.add(this.entityTag),
                components = this.components,
                component,
                componentOptions;

            for (key in components) {
                if (components.hasOwnProperty(key)) {
                    component = components[key];
                    componentOptions = (options && options[key]) ? options[key] : {};
                    cog.defaults(componentOptions, component.defaults);
                    entity.add(component.constructor, componentOptions);
                }
            }

            this._entities.push(entity);
            return entity;
        },

        despawn: function(entity) {
            var index = this._entities.indexOf(entity);
            if (index > -1) {
                this._entities.splice(index, 1);
                entity.destroy();
            }
        }
    });

    cog.extend({
        Factory: Factory
    });

    /**
     * EntityManager
     *
     * @param director
     * @constructor
     */

    var EntityManager = cog.Construct.extend('cog.EntityManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._director = director;
            this._entities = [];
            this._entityId = 1;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(tag) {
            var entity = new Entity(this, this._entityId++, tag);
            this._entities.push(entity);
            this._director.events.emit('entity added', entity);
            return entity;
        },

        all: function() {
            var i = 0, n = this._entities.length, ret = [];
            for (; i < n; ++i) {
                ret.push(this._entities[i]);
            }
            return ret;
        },

        withTag: function(tag) {
            var entity, i = 0, n = this._entities.length, ret = [];
            if (tag) {
                for (; i < n; ++i) {
                    entity = this._entities[i];
                    if (entity.tag === tag) {
                        ret.push(entity);
                    }
                }
            }
            return ret;
        },

        withComponents: function() {
            var entity,
                inputMask = _mask.apply(_mask, arguments),
                i = 0, n = this._entities.length, ret = [];
            for (; i < n; ++i) {
                entity = this._entities[i];
                if ((inputMask & entity.mask) === inputMask) {
                    ret.push(entity);
                }
            }
            return ret;
        },

        remove: function(entity) {
            var index = this._entities.indexOf(entity);
            if (index > -1) {
                this._entities.splice(index, 1);
                this._director.events.emit('entity removed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeAll: function() {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                entity = this._entities.splice(i, 1)[0];
                this._director.events.emit('entity removed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeWithTag: function(tag) {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                if (this._entities[i].tag === tag) {
                    entity = this._entities.splice(i, 1)[0];
                    this._director.events.emit('entity removed', entity);
                    entity.destroy(true);
                }
            }
            return this;
        },

        removeWithComponents: function() {
            var entity, i = this._entities.length - 1,
                inputMask = _mask.apply(_mask, arguments);
            for (; i > -1; --i) {
                entity = this._entities[i];
                if ((inputMask & entity.mask) === inputMask) {
                    entity = this._entities.splice(i, 1)[0];
                    this._director.events.emit('entity removed', entity);
                    entity.destroy(true);
                }
            }
            return this;
        }
    });

    cog.extend({
        EntityManager: EntityManager
    });

    /**
     * EventManager
     *
     * @param director
     * @constructor
     */

    var _eventRegEx = /.* event$/;

    var EventManager = cog.Construct.extend('cog.SystemManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._director = director;
            this._eventContexts = {};
            this._eventCallbacks = {};
        },

        destroy:  function() {
            this.unregisterAll();
            this._director = undefined;
        },

        emit: function(eventName) {
            var i, n, args,
                contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                args = slice.call(arguments, 1);
                for (i = 0, n = callbacks.length; i < n; ++i) {
                    callbacks[i].apply(contexts[i], args);
                }
            }
            return this;
        },

        register: function(eventName, context, callback) {
            if (!cog.isObject(context) || !cog.isFunction(callback)) {
                return this;
            }
            var contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];

            if (contexts === undefined || callbacks === undefined) {
                contexts = this._eventContexts[eventName] = [];
                callbacks = this._eventCallbacks[eventName] = [];
            }
            contexts.push(context);
            callbacks.push(callback);
            return this;
        },

        registerContext: function(context) {
            var key, prop;
            for (key in context) {
                //noinspection JSUnfilteredForInLoop
                if ((prop = context[key]) && cog.isFunction(prop) && _eventRegEx.test(key)) {
                    //noinspection JSUnfilteredForInLoop
                    this.register(key.substring(0, key.length-6), context, prop);
                }
            }
            return this;
        },

        unregister: function(eventName, context) {
            var i, contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                for (i = contexts.length - 1; i >= 0; --i) {
                    if (contexts[i] === context) {
                        contexts.splice(i, 1);
                        callbacks.splice(i, 1);
                    }
                }
            }
            return this;
        },

        unregisterContext: function(context) {
            for (var event in this._eventContexts) {
                if (this._eventContexts.hasOwnProperty(event)) {
                    this.unregister(event, context);
                }
            }
            return this;
        },

        unregisterEvent: function(eventName) {
            var contexts = this._eventContexts[eventName],
                callbacks = this._eventCallbacks[eventName];
            if (contexts && callbacks) {
                this._eventContexts[eventName].length = 0;
                this._eventCallbacks[eventName].length = 0;
            }
            return this;
        },

        unregisterAll: function() {
            for (var event in this._eventContexts) {
                if (this._eventContexts.hasOwnProperty(event)) {
                    this.unregisterEvent(event);
                }
            }
            return this;
        }
    });

    cog.extend({
        EventManager: EventManager
    });

    /**
     * SystemManager
     *
     * @param director
     * @constructor
     */

    var SystemManager = cog.Construct.extend('cog.SystemManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._systems = {};
            this._systemOrder = [];
            this._director = director;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(System) {
            if (!System || !System.systemId) {
                return undefined;
            }

            var systemId = System.systemId,
                system = this._systems[systemId];

            if (!system) {
                system = new System(this);
                this._systems[systemId] = system;
                this._systemOrder.push(system);
                this._director.events.registerContext(system);
                system.configure(this._director.entities, this._director.events, this._director.config)
            }
            return system;
        },

        get: function(System) {
            var systemId = System.systemId;
            return this._systems[systemId];
        },

        remove: function(System) {
            var index, systemId, system;

            if (System instanceof cog.System) {
                system = System;
                System = system.constructor;
            }

            if (!System || !System.systemId) {
                return this;
            }

            systemId = System.systemId;

            if (!system) {
                system = this._systems[systemId];
            }

            if (system) {
                index = this._systemOrder.indexOf(system);

                this._director.events.unregisterContext(system);
                this._systemOrder.splice(index, 1);
                this._systems[systemId] = undefined;

                system.destroy(true);
            }

            return this;
        },

        removeAll: function() {
            var index, systemId, system;
            for (systemId in this._systems) {
                if (this._systems.hasOwnProperty(systemId)) {
                    system = this._systems[systemId];
                    if (system) {
                        index = this._systemOrder.indexOf(system);

                        this._director.events.unregisterContext(system);
                        this._systemOrder.splice(index, 1);
                        this._systems[systemId] = undefined;

                        system.destroy(true);
                    }
                }
            }
            return this;
        },

        update: function(dt) {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities,
                events = this._director.events;
            for (; i < n; ++i) {
                systems[i].update(entities, events, dt);
            }
            return this;
        },

        render: function() {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities;
            for (; i < n; ++i) {
                systems[i].render(entities);
            }
            return this;
        }
    });

    cog.extend({
        SystemManager: SystemManager
    });


    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

    // MIT license

    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
        };
    }());


    /**
     * Director
     * @constructor
     */

    var Director = cog.Construct.extend('cog.Director', {
        create: function(config) {
            return new Director(config);
        }
    }, {

        properties: {
            config: { get: function() { return this._config; } },
            events: { get: function() { return this._eventManager; } },
            entities: { get: function() { return this._entityManager; } },
            systems: { get: function() { return this._systemManager; } },
            valid: { get: function() {
                return (this._entityManager !== undefined &&
                    this._systemManager !== undefined &&
                    this._eventManager !== undefined);
            }}
        },

        init: function(config) {
            this._config = config;
            this._eventManager = new EventManager(this);
            this._entityManager = new EntityManager(this);
            this._systemManager = new SystemManager(this);
            this._beginUpdateCallback = null;
            this._animationFrame = null;
            this._lastFrame = 0;
        },

        destroy: function() {
            this.stop();
            this._entityManager.destroy();
            this._eventManager.destroy();
            this._systemManager.destroy();
            this._entityManager = undefined;
            this._systemManager = undefined;
            this._eventManager = undefined;
            this._beginUpdateCallback = undefined;
            this._endUpdateCallback = undefined;
        },

        start:function() {
            if (!this._animationFrame) {
                this._lastFrame = 0;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        stop: function() {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = null;
            }
        },

        step: function(timestamp) {
            var lastFrame = this._lastFrame,
                dt = (lastFrame !== 0) ? timestamp - lastFrame : 16;

            if (this._beginStepCallback) {
                this._beginStepCallback();
            }

            this.update(dt);
            this.render();

            if (this._endStepCallback) {
                this._endStepCallback();
            }

            if (this._animationFrame) {
                this._lastFrame = timestamp;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        update: function(dt) {
            if (this._beginUpdateCallback) {
                this._beginUpdateCallback();
            }
            this._systemManager.update(dt);
            if (this._endUpdateCallback) {
                this._endUpdateCallback();
            }
        },

        render: function() {
            this._systemManager.render();
        },

        onBeginUpdate: function(callback) {
            this._beginUpdateCallback = callback;
            return this;
        },

        onEndUpdate: function(callback) {
            this._endUpdateCallback = callback;
            return this;
        },

        onBeginStep: function(callback) {
            this._beginStepCallback = callback;
            return this;
        },

        onEndStep: function(callback) {
            this._endStepCallback = callback;
            return this;
        }
    });

    cog.extend({
        Director: Director,
        createDirector: Director.create
    });

    if (typeof define === "function" && define.amd) {
        define('cog', [],function() { return cog; });
    }


    this.cog = cog;

}).call(this);