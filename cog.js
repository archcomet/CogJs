//      Cog.js  1.2.0
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

    cog.VERSION = '1.2.0';

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
            } else {
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
        init: function(config) {

            var eventManager = new EventManager(this),
                preUpdateCallback,
                postUpdateCallback;

            this.events = function() {
                return eventManager;
            };

            var entityManager = new EntityManager(this);
            this.entities = function() {
                return entityManager;
            };

            var systemManager = new SystemManager(this);
            this.systems = function() {
                return systemManager;
            };

            this.config = function() {
                return config;
            };

            var animationFrame = null,
                lastFrame = 0;

            this.start = function() {
                if (!animationFrame) {
                    lastFrame = 0;
                    animationFrame = requestAnimationFrame(this.step.bind(this));
                }
            };

            this.stop = function() {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }
            };

            this.step = function(timestamp) {
                var dt = (lastFrame !== 0) ? timestamp - lastFrame : 16;
                this.update(dt);
                if (animationFrame) {
                    lastFrame = timestamp;
                    animationFrame = requestAnimationFrame(this.step.bind(this));
                }
            };

            this.update = function(dt) {
                if (preUpdateCallback) {
                    preUpdateCallback();
                }
                systemManager.update(dt);
                if (postUpdateCallback) {
                    postUpdateCallback();
                }
            };

            this.preUpdate = function(callback) {
                preUpdateCallback = callback;
            };

            this.postUpdate = function(callback) {
                postUpdateCallback = callback;
            };

            this.valid = function() {
                return (entityManager !== undefined &&
                        systemManager !== undefined &&
                        eventManager !== undefined);
            };

            this.destroy = function() {
                this.stop();
                entityManager.destroy();
                eventManager.destroy();
                systemManager.destroy();
                entityManager = undefined;
                systemManager = undefined;
                eventManager = undefined;
                preUpdateCallback = undefined;
                postUpdateCallback = undefined;
            };
        }
    });

    function createDirector(config) {
        return new Director(config);
    }

    /**
     * EntityManager
     *
     * @param director
     * @constructor
     */

    var EntityManager = Construct.extend('cog.EntityManager', {

        init: function(director) {

            var entities = [],
                entityId = 1,
                events = director.events();

            this.director = function() {
                return director;
            };

            this.add = function(tag) {
                var entity = new Entity(this, entityId++, tag);
                entities.push(entity);
                events.emit('entityCreated', entity);
                return entity;
            };

            this.remove = function(entity) {
                var index = entities.indexOf(entity);
                if (index > -1) {
                    entities.splice(index, 1);
                    events.emit('entityDestroyed', entity);
                    entity.destroy(true);
                }
                return this;
            };

            this.removeAll = function() {
                var entity, i = entities.length - 1;
                for (; i > -1; --i) {
                    entity = entities.splice(i, 1)[0];
                    events.emit('entityDestroyed', entity);
                    entity.destroy(true);
                }
                return this;
            };

            this.removeWithTag = function(tag) {
                var entity, i = entities.length - 1;
                for (; i > -1; --i) {
                    if (entities[i].tag() === tag) {
                        entity = entities.splice(i, 1)[0];
                        events.emit('entityDestroyed', entity);
                        entity.destroy(true);
                    }
                }
                return this;
            };

            this.all = function() {
                var i = 0, n = entities.length, ret = [];
                for (; i < n; ++i) {
                    ret.push(entities[i]);
                }
                return ret;
            };

            this.withTag = function(tag) {
                var entity, i = 0, n = entities.length, ret = [];
                if (tag) {
                    for (; i < n; ++i) {
                        entity = entities[i];
                        if (entity.tag() === tag) {
                            ret.push(entity);
                        }
                    }
                }
                return ret;
            };

            this.withComponents = function() {
                var entity,
                    inputMask = _mask.apply(_mask, arguments),
                    i = 0, n = entities.length, ret = [];
                for (; i < n; ++i) {
                    entity = entities[i];
                    if ((inputMask & entity.mask()) === inputMask) {
                        ret.push(entity);
                    }
                }
                return ret;
            };

            this.valid = function() {
                return (director !== undefined);
            };

            this.destroy = function() {
                this.removeAll();
                director = undefined;
                events = undefined;
            };
        }
    });

    /**
     * SystemManager
     *
     * @param director
     * @constructor
     */

    var eventRegEx = /.* event$/;

    var SystemManager = Construct.extend('cog.SystemManager', {

        init: function(director) {

            var systems = {},
                entities = director.entities(),
                events = director.events();

            this.director = function() {
                return director;
            };

            this.add = function(System) {
                if (!System || !System.type || !System.type() === cog.System) {
                    return undefined;
                }
                var key, prop,
                    category = System.category(),
                    system = systems[category];
                if (!system) {
                    system = systems[category] = new System(this);

                    for (key in system) {
                        //noinspection JSUnfilteredForInLoop
                        if ((prop = system[key]) && isFunction(prop) && eventRegEx.test(key)) {
                            //noinspection JSUnfilteredForInLoop
                            events.register(key.substring(0, key.length-6), system, prop);
                        }
                    }

                    system.configure(entities, events)
                }
                return system;
            };

            this.get = function(System) {
                if (!System || !System.type || !System.type() === cog.System) {
                    return undefined;
                }
                var category = System.category();
                return systems[category];
            };

            this.remove = function(System) {
                if (!System || !System.type || !System.type() === cog.System) {
                    return this;
                }
                var category = System.category();
                events.unregisterContext(systems[category]);
                systems[category].destroy(true);
                systems[category] = undefined;
                return this;
            };

            this.removeAll = function() {
                for (var key in systems) {
                    if (systems.hasOwnProperty(key)) {
                        events.unregisterContext(systems[key]);
                        systems[key].destroy(true);
                        systems[key] = undefined;
                    }
                }
                return this;
            };

            this.update = function(dt) {
                for (var key in systems) {
                    if (systems.hasOwnProperty(key)) {
                        systems[key].update(entities, events, dt);
                    }
                }
                return this;
            };

            this.valid = function() {
                return (director !== undefined);
            };

            this.destroy = function() {
                this.removeAll();
                director = undefined;
            };
        }
    });

    /**
     * EventManager
     *
     * @param director
     * @constructor
     */

    var EventManager = Construct.extend('cog.SystemManager', {

        init: function(director) {

            var eventContexts = {},
                eventCallbacks = {};

            this.director = function() {
                return director;
            };

            this.emit = function(eventName) {
                var i, n, args,
                    contexts = eventContexts[eventName],
                    callbacks = eventCallbacks[eventName];
                if (contexts && callbacks) {
                    args = slice.call(arguments, 1);
                    for (i = 0, n = callbacks.length; i < n; ++i) {
                        callbacks[i].apply(contexts[i], args);
                    }
                }
                return this;
            };

            this.register = function(eventName, context, callback) {
                if (!isObject(context) || !isFunction(callback)) {
                    return this;
                }
                var contexts = eventContexts[eventName],
                    callbacks = eventCallbacks[eventName];
                if (contexts === undefined || callbacks === undefined) {
                    contexts = eventContexts[eventName] = [];
                    callbacks = eventCallbacks[eventName] = [];
                }
                contexts.push(context);
                callbacks.push(callback);
                return this;
            };

            this.unregister = function(eventName, context) {
                var i, contexts = eventContexts[eventName],
                    callbacks = eventCallbacks[eventName];
                if (contexts && callbacks) {
                    for (i = contexts.length - 1; i >= 0; --i) {
                        if (contexts[i] === context) {
                            contexts.splice(i, 1);
                            callbacks.splice(i, 1);
                        }
                    }
                }
                return this;
            };

            this.unregisterContext = function(context) {
                for (var event in eventContexts) {
                    if (eventContexts.hasOwnProperty(event)) {
                        this.unregister(event, context);
                    }
                }
                return this;
            };

            this.unregisterEvent = function(eventName) {
                var contexts = eventContexts[eventName],
                    callbacks = eventCallbacks[eventName];
                if (contexts && callbacks) {
                    eventContexts[eventName].length = 0;
                    eventCallbacks[eventName].length = 0;
                }
                return this;
            };

            this.unregisterAll = function() {
                for (var event in eventContexts) {
                    if (eventContexts.hasOwnProperty(event)) {
                        this.unregisterEvent(event);
                    }
                }
                return this;
            };

            this.valid = function() {
                return (director !== undefined);
            };

            this.destroy = function() {
                this.unregisterAll();
                director = undefined;
            };
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
            }

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
            if (systemCount > 64) {
                throw 'Exceeded 64 System types.';
            }
            var categoryId = (systemCount === 0) ? 0 : 1 << (systemCount-1);
            systemCount++;
            this.category = function() {
                return categoryId;
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
     * @constructor
     */

    var Factory = System.extend('cog.Factory', {

        entityTag: null,

        components: {},

        spawn: function() {

        },

        despawn: function(entity) {

        },

        despawnAll: function(entity) {

        }

    });

    // ------------------------------------------
    // Emit API

    root.cog = extend(cog, {

        // Util
        extend: extend,
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
        createDirector: createDirector,

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

}).call(this);