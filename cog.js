//      Cog.js  1.2.3
//      http://www.github.com/archcomet/cogjs
//      (c) 2013 Michael Good
//      Cog may be freely distributed under the MIT license.

(function() {
    'use strict';

    // ------------------------------------------
    // Setup

    var root = this;

    // Short cuts
    var slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty;

    /**
     * cog
     *  Safe object to hang the API off of
     * @returns {cog}
     */

    var cog = function() {
        return !(this instanceof cog) ? new cog() : this;
    };

    cog.VERSION = '1.2.3';

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

    function extend() {
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

    var requestAnimationFrame = window.requestAnimationFrame,
        cancelAnimationFrame = window.cancelAnimationFrame;

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
     * _read
     *  Safely reads a chain of functions with no parameters.
     *  eg:
     *      // will throw if obj, foo, or bar are not defined
     *      var a = obj.foo().bar();
     *
     *      // will return undefined if obj, foo, or bar are not defined
     *      var a = _read(obj, 'foo', 'bar');
     *
     * @param obj
     * @returns {*}
     * @private
     */

    function _read(obj) {
        var key, i = 1, n = arguments.length;
        for(;i < n; ++i) {
            key = arguments[i];
            if (obj && isFunction(obj[key])) {
                obj = obj[key]();
            } else if (obj) {
                obj = obj[key];
            }
            else {
                return undefined;
            }
        }
        return obj;
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
        var prototype = new this(),
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

        if (instanceProps.properties) {
            Object.defineProperties(Constructor.prototype, instanceProps.properties);
        }

        if (Constructor.properties) {
            Object.defineProperties(Constructor, Constructor.properties);
        }

        if (!Object.getOwnPropertyDescriptor(Constructor, 'fullName')) {
            Object.defineProperty(Constructor, 'fullName', {
                get: function () { return fullName; }
            });
        }

        if (Constructor.setup) {
            Constructor.setup();
        }

        return Constructor;
    };

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

    var ArrayWrapper = Construct.extend('cog.ArrayWrapper', {

        init: function(arg, readOnly) {

            if (this.get) return;

            var data;

            if (arg instanceof ArrayWrapper) {
                data = arg.serialize();
            }
            else if (isArray(arg)) {
                data = arg.slice(0);
            } else {
                data = new Array((isNumber(arg) ? arg : 0));
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

    var SetWrapper = Construct.extend('cog.SetWrapper', {

        init: function(arg, readonly) {

            if (this.get) return;

            var data;

            if (arg instanceof SetWrapper) {
                data = arg.serialize();
            } else if (isObject(arg)) {
                data = extend({}, arg);
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
                    extend.apply(extend, args);
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
                return extend({}, data);
            };

            this.clone = function() {
                return new SetWrapper(this, readonly);
            };

            this.readOnly = function() {
                return new SetWrapper(this, true);
            };
        }
    });


    /**
     * Map
     * @constructor
     */

    var Map = Construct.extend('cog.Map', {

        dirtyOnChange: false,

        defaults: {},

        setup: function() {
            if (this.dirtyOnChange) {
                this.prototype._dirty = true;
                Object.defineProperty(this.prototype, 'dirty', {
                    get: function() { return this._dirty; },
                    set: function(val) { this._dirty = val; }
                })
            }

            var key;
            for (key in this.defaults) {
                if (this.defaults.hasOwnProperty(key)) {
                    this.addProp(key, this.defaults[key]);
                }
            }
        },

        addProp: function(key, value) {
            var privateKey = '_' + key;
            var def = { get: function() { return this[privateKey]; } };

            if (this.dirtyOnChange) {
                def.set = function(val) {
                    if (this[privateKey] !== val) {
                        this[privateKey] = val;
                        this._dirty = true;
                    }
                }
            } else {
                def.set = function(val) {
                    this[privateKey] = val;
                }
            }

            Object.defineProperty(this.prototype, key, def);
            this.prototype[privateKey] = value;
        }

    }, {

        init: function(props) {
            this.set(props);
        },

        set: function(props) {
            extend(this, props);
        },

        serialize: function() {
            var key, copy, clone,
                target = {},
                defaults = this.constructor.defaults;

            for (key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    copy = this[key];

                    if (isArray(copy)) {
                        clone = [];
                        extend(true, clone, copy);
                    } else if (isPlainObject(copy)) {
                        clone = {};
                        extend(true, clone, copy);
                    } else {
                        clone = copy;
                    }

                    target[key] = clone;
                }
            }
            return target;
        }
    });

    // ------------------------------------------
    // Managers

    /**
     * Director
     * @constructor
     */

    var Director = Construct.extend('cog.Director', {
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
            this._aniFmationFrame = null;
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

    /**
     * EntityManager
     *
     * @param director
     * @constructor
     */

    var EntityManager = Construct.extend('cog.EntityManager', {

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
            this._director.events.emit('entityCreated', entity);
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
                this._director.events.emit('entityDestroyed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeAll: function() {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                entity = this._entities.splice(i, 1)[0];
                this._director.events.emit('entityDestroyed', entity);
                entity.destroy(true);
            }
            return this;
        },

        removeWithTag: function(tag) {
            var entity, i = this._entities.length - 1;
            for (; i > -1; --i) {
                if (this._entities[i].tag === tag) {
                    entity = this._entities.splice(i, 1)[0];
                    this._director.events.emit('entityDestroyed', entity);
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
                    this._director.events.emit('entityDestroyed', entity);
                    entity.destroy(true);
                }
            }
            return this;
        }
    });

    /**
     * SystemManager
     *
     * @param director
     * @constructor
     */

    var SystemManager = Construct.extend('cog.SystemManager', {

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
            if (!System || !System.systemId) {
                return undefined;
            }

            var index,
                systemId = System.systemId,
                system = this._systems[systemId];


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
                    index = this._systemOrder.indexOf(system);

                    this._director.events.unregisterContext(system);
                    this._systemOrder.splice(index, 1);
                    this._systems[systemId] = undefined;

                    system.destroy(true);
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

    /**
     * EventManager
     *
     * @param director
     * @constructor
     */

    var _eventRegEx = /.* event$/;

    var EventManager = Construct.extend('cog.SystemManager', {

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
            if (!isObject(context) || !isFunction(callback)) {
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
                if ((prop = context[key]) && isFunction(prop) && _eventRegEx.test(key)) {
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

    // ------------------------------------------
    // Core Objects

    /**
     * Entity
     *
     * @param manager
     * @param id
     * @param [tag]
     * @constructor
     */

    var Entity = Construct.extend('cog.Entity', {

        properties: {
            manager: { get: function() { return this._manager; } },
            id: { get: function() { return this._id } },
            tag: { get: function() { return this._tag } },
            valid: { get: function() { return (this._manager && this._id) ? true : false; } },
            mask: { get: function() { return this._componentMask; } }
        },

        init: function(manager, id, tag) {
            this._manager = manager;
            this._id = id;
            this._tag = tag || null;
            this._components = {};
            this._componentMask = 0;
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
                this._manager.director.events.emit('componentCreated', component, this);
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
                this._manager.director.events.emit('componentDestroyed', component, this);
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
        }
    });

    // ------------------------------------------
    // Extensible Objects

    /**
     * Component
     *
     * @param entity
     * @param options
     * @constructor
     */

    var componentCount = 0;

    var Component = Map.extend('cog.Component', {

        properties: {
            category: { get: function() { return this._category; } },
            count: { get: function() { return componentCount-1; } }
        },

        setup: function() {
            if (componentCount > 64) {
                throw 'Exceeded 64 Component types.';
            }
            this._category= (componentCount === 0) ? 0 : 1 << (componentCount-1);
            componentCount++;
            this._super();
        }

    }, {

        properties: {
            entity: { get: function() { return this._entity; } },
            valid: { get: function() { return (this._entity !== undefined); } }
        },

        init: function(entity, options) {
            this._super(options);
            this._entity = entity;
            this.set(options);
        },

        destroy: function(managed) {
            if (!managed && this._entity && this._entity.remove) {
                this._entity.remove(this);
                return;
            }
            this._entity = undefined;
        }
    });

    /**
     * System
     *
     * @param manager
     * @constructor
     */

    var systemCount = 0;

    var System = Construct.extend('cog.System', {

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

        configure: function(entityManager, eventManager) {},

        update: function(entityManager, eventManager, dt) {},

        render: function(entityManager) {}

    });

    /**
     * Factory
     *
     * @param manager
     * @constructor
     */

    var Factory = System.extend('cog.Factory', {

        entityTag: null,

        components: {},

        init: function(manager) {
            this._entityManager = manager.director.entities;
            this._super(manager);
            this._entities = [];

            if (isString(this.entityTag)) {
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
                    defaults(componentOptions, component.defaults);
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

    // ------------------------------------------
    // Emit API

    root.cog = extend(cog, {

        // Util
        extend: extend,
        defaults: defaults,
        isArray: isArray,
        isBoolean: isBoolean,
        isDate: isDate,
        isFunction: isFunction,
        isNumber: isNumber,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isRegExp: isRegExp,
        isString: isString,

        // Main
        createDirector: Director.create,

        // Base
        Construct: Construct,
        ArrayWrapper: ArrayWrapper,
        SetWrapper: SetWrapper,

        // Managers
        Director: Director,
        EntityManager: EntityManager,
        SystemManager: SystemManager,
        EventManager: EventManager,

        // Core
        Entity: Entity,
        Component: Component,
        System: System,

        // Helpers
        Factory: Factory
    });

    if (typeof define === "function" && define.amd) {
        define(function() { return cog; });
    }

}).call(this);