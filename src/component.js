define([
    './core',
    './category',
    './asserts/limit'
], function(cog, Category, assertLimit) {

    var componentCount = 0;

    /**
     * A component class.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {entity} entity - Entity that created the component
     * @param {props} props - Options for the component
     * @constructor
     */

    var Component = cog.Construct.extend('cog.Component', {

        eventTarget: 'component',

        properties: {
            category: { get: function() { return this._category; } },
            count: { get: function() { return componentCount - 1; } }
        },

        setup: function() {
            assertLimit(componentCount, Category.size,
                'Exceeded 64 Component types. To increase cog.Category.size to increase the number of components'
            );
            this._category = (componentCount === 0) ? new Category() : new Category(componentCount-1);
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
            this.configure(props);
        },

        configure: function(props) {
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
            if (!managed && this._entity && this._entity.components) {
                this._entity.components.remove(this);
                return;
            }
            this.off();
            this._entity = undefined;
        }
    });

    cog.extend({
        Component: Component
    });

    return Component;
});
