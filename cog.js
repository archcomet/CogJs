//      Cog.js  1.2.2
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

    cog.VERSION = '1.2.2';

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
     * isType
     * @param obj
     * @param type
     * @returns {boolean}
     */

    function isType(obj, type) {
        return (obj !== undefined && obj.type !== undefined && obj.type() === type);
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
            if ((arg = arguments[i]) && isFunction(arg.category)) {
                ret |= arg.category();
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

    var Construct = function() {};

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

        Constructor.fullName = function () { return fullName; };

        if (instanceProps.properties) {
            Object.defineProperties(Constructor.prototype, instanceProps.properties);
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
            this._eventManager = EventManager.create(this);
            this._entityManager = EntityManager.create(this);
            this._systemManager = SystemManager.create(this);
            this._preUpateCallback = null;
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
            this._preUpateCallback = undefined;
            this._postUpdateCallback = undefined;
        },

        update: function(dt) {
            if (this._preUpateCallback) {
                this._preUpateCallback();
            }
            this._systemManager.update(dt);
            if (this._postUpdateCallback) {
                this._postUpdateCallback();
            }
        },

        preUpdate: function(callback) {
            this._preUpateCallback = callback;
        },

        postUpdate: function(callback) {
            this._postUpdateCallback = callback;
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
            this.update(dt);
            if (this._animationFrame) {
                this._lastFrame = timestamp;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        }
    });

    /**
     * EntityManager
     *
     * @param director
     * @constructor
     */

    var EntityManager = Construct.extend('cog.EntityManager', {
        create: function(director) {
            return new EntityManager(director);
        }
    }, {

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
                    if (entity.tag() === tag) {
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
                if ((inputMask & entity.mask()) === inputMask) {
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
                if (this._entities[i].tag() === tag) {
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
                if ((inputMask & entity.mask()) === inputMask) {
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
        create: function(director) {
            return new SystemManager(director);
        }
    },{

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._systems = {};
            this._director = director;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(System) {
            if (!isType(System, cog.System)) {
                return undefined;
            }

            var typeId = System.typeId(),
                system = this._systems[typeId];

            if (!system) {
                system = this._systems[typeId] = new System(this);
                this._director.events.registerContext(system);
                system.configure(this._director.entities, this._director.events, this._director.config)
            }
            return system;
        },

        get: function(System) {
            if (!isType(System, cog.System)) {
                return undefined;
            }
            var typeId = System.typeId();
            return this._systems[typeId];
        },

        remove: function(System) {
            if (!isType(System, cog.System)) {
                return undefined;
            }
            var typeId = System.typeId();
            this._director.events.unregisterContext(this._systems[typeId]);
            this._systems[typeId].destroy(true);
            this._systems[typeId] = undefined;
            return this;
        },

        removeAll: function() {
            for (var key in this._systems) {
                if (this._systems.hasOwnProperty(key)) {
                    this._director.events.unregisterContext(this._systems[key]);
                    this._systems[key].destroy(true);
                    this._systems[key] = undefined;
                }
            }
            return this;
        },

        update: function(dt) {
            for (var key in this._systems) {
                if (this._systems.hasOwnProperty(key)) {
                    this._systems[key].update(this._director.entities, this._director.events, dt);
                }
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
        create: function(director) {
            return new EventManager(director);
        }
    },{

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

        init: function(manager, id, tag) {

            var components = {},
                componentMask = 0,
                events = _read(manager, 'director', 'events');

            if (!tag) {
                tag = null;
            }

            this.id = function() {
                return id;
            };

            this.tag = function() {
                return tag;
            };

            this.manager = function() {
                return manager;
            };

            this.valid = function() {
                return (manager && id) ? true : false;
            };

            this.add = function(Component, options) {
                if (!Component || !Component.type || !Component.type() === cog.Component) {
                    return undefined;
                }
                var component, category = Component.category();
                if ((category & componentMask) === category) {
                    component = components[category];
                    component.set(options);
                } else {
                    component = components[category] = new Component(this, options);
                    componentMask |= category;
                    if (events) {
                        events.emit('componentCreated', component, this);
                    }
                }
                return component;
            };

            this.has = function(Component) {
                var inputMask = _mask.apply(_mask, arguments);
                return inputMask !== 0 && (inputMask & componentMask) === inputMask;
            };

            this.get = function(Component) {
                if (!Component || !Component.type || !Component.type() === cog.Component) {
                    return undefined;
                }
                var category = Component.category();
                return components[category];
            };

            this.remove = function(Component) {
                if (Component instanceof cog.Component) {
                    Component = Component.constructor;
                }
                var component, category = Component.category();
                if ((category & componentMask) === category) {
                    component = components[category];
                    componentMask &= ~(category);
                    components[category] = undefined;
                    if (events) {
                        events.emit('componentDestroyed', component, this);
                    }
                    component.destroy(true);
                }
                return this;
            };

            this.removeAll = function() {
                var key;
                for (key in components) {
                    if (components.hasOwnProperty(key)) {
                        this.remove(components[key]);
                    }
                }
                return this;
            };

            this.mask = function() {
                return componentMask;
            };

            this.clone = function() {
                var key, component, clone = manager.add(tag);
                for (key in components) {
                    if (components.hasOwnProperty(key)) {
                        component = components[key];
                        clone.add(component.constructor, component.serialize());
                    }
                }
                return clone;
            };

            this.destroy = function(managed) {
                if (manager && !managed) {
                    manager.remove(this);
                    return;
                }

                this.removeAll();
                manager = undefined;
                id = undefined;
                tag = undefined;
            }
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

    var Component = Construct.extend('cog.Component', {

        setup: function() {
            if (componentCount > 64) {
                throw 'Exceeded 64 Component types.';
            }
            var categoryId = (componentCount === 0) ? 0 : 1 << (componentCount-1);
            componentCount++;
            this.category = function() {
                return categoryId;
            };

            this.type = function() {
                return Component;
            }
        },

        count: function() {
            return componentCount-1;
        }

    }, {

        defaults: {},

        init: function(entity, options) {

            this.set(options);

            this.entity = function() {
                return entity;
            };

            this.valid = function() {
                return (entity !== undefined);
            };

            this.destroy = function(managed) {
                if (!managed && entity && entity.remove) {
                    entity.remove(this);
                    return;
                }
                entity = undefined;
            };
        },

        set: function(options) {
            extend(true, this, this.constructor.prototype.defaults, options);
        },

        serialize: function() {
            var key, copy, clone, target = {};
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    copy = this[key];

                    if (isFunction(copy)) {
                        continue;
                    }

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

    /**
     * System
     *
     * @param manager
     * @constructor
     */

    var systemCount = 0;

    var System = Construct.extend('cog.System', {

        setup: function() {

            var typeId = (systemCount-1);
            systemCount++;
            this.typeId = function() {
                return typeId;
            }
        },

        count: function() {
            return systemCount-1;
        },

        type: function() {
            return System;
        }

    }, {

        init: function(manager) {

            this.manager = function() {
                return manager;
            };

            this.destroy = function(managed) {
                if (manager && !managed) {
                    manager.remove(this);
                    return;
                }
                manager = undefined;
            };
        },

        configure: function(entityManager, eventManager) {},

        update: function(entityManager, eventManager, dt) {}

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

            var entityManager = manager.director.entities;

            this._super(manager);

            /**
             * spawn
             * @param [options]
             * @returns {*}
             */

            this.spawn = function(options) {

                var key,
                    entity = entityManager.add(this.entityTag),
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
                return entity;
            };

            if (isString(this.entityTag)) {
                this['spawn ' + this.entityTag + ' event'] = this.spawn;
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