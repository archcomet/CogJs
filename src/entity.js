define([
    './core',
    './category',
    './node',
    './utils/_mask'
], function(cog, Category, Node, _mask) {

    /**
     * Entity provides identity to all game objects.
     *
     * @class
     * @memberof cog
     * @augments cog.Node
     *
     * @param {EntityManager} manager - EntityManager that created the Entity
     * @param {number} id - Unique numeric Id assigned by the EntityManager
     * @param {string} [tag] - Entity Tag
     * @constructor
     */

    var Entity = Node.extend('cog.Entity', {

        components: null,
        _manager: null,
        _tag: null,

        properties: {

            /**
             * Gets the EntityManager
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {EntityManager}
             */

            manager: { get: function() { return this._manager; } },

            /**
             * Gets the entity id
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {number}
             */

            id: { get: function() { return this._id } },

            /**
             * @member tag
             * @summary Gets the entity tag
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {string}
             */

            tag: { get: function() { return this._tag } },

            /**
             * @member valid
             * @summary True after the Entity is initialized. False once destroyed.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {boolean}
             */

            valid: { get: function() { return (this._manager && this._id) ? true : false; } }
        },

        /**
         * Initializes the Entity
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @param {EntityManager} [manager] - EntityManager that created the Entity.
         * @param {number} [id] - Id assigned by the EntityManager.
         * @param {string} [tag] - Entity Tag.
         */

        init: function(manager, id, tag) {
            this._super(manager.director.events);
            this._manager = manager;
            this._id = id;
            this._tag = tag || null;
            this._components = {};

            /**
             * @name components
             * @memberof cog.Entity
             * @instance
             *
             * @type {cog.Entity~components}
             */

            this.components = components.make(this);
        },

        /**
         * Destroys the instance of the Entity
         *
         * @instance
         * @method
         * @memberof cog.Entity
         */

        destroy: function(managed) {

            var children = this._children.slice(0),
                i = 0,
                n = children.length;

            for (; i < n; ++i) {
                children[i].destroy();
            }

            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this._manager = undefined;

            this._super();
            this.components.removeAll();
            this._eventManager.emit('entity destroyed', this);

            this._id = undefined;
            this._tag = undefined;
        },

        /**
         * Creates a new instance of the Entity. Components and enumerable properties are copied to the new Entity.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @returns {Entity}
         *
         * @example
         * // Creates a clone of the entity.
         * var clonedEntity = entity.clone();
         */

        clone: function() {
            var key,
                component,
                components = this.components._components,
                clone = this._manager.add(this._tag);

            for (key in components) {
                if (components.hasOwnProperty(key)) {
                    component = components[key];
                    clone.components.assign(component.constructor, component.serialize());
                }
            }
            return clone;
        }

    });

    /**
     * @mixin
     * @inner
     * @memberof cog.Entity
     */

    var components = {

        /**
         * @instance
         *
         * @example
         *  var PositionComponent = cog.Component.extend({...});
         *  ...
         *  // Create an entity and add a PositionComponent
         *  var entity = director.entities.add('exampleEntity');
         *  var component = entity.add(PositionComponent, { x: 0, y: 100 });
         * @param {Component} Component - Constructor function for the entity.
         * @param {Object} [options] - Component Options to be passed to the Component Constructor.
         * @returns {component}
         */

        assign: function (Component, options) {
            if (!Component || !Component.category) {
                return null;
            }
            var component, category = Component.category;
            if (this._componentMask.hasBits(category)) {
                component = this._components[category.bit];
                component.set(options);
            } else {
                component = this._components[category.bit] = new Component(this._entity, options);
                this._componentMask.addBits(category);
                this._eventManager.emit(Component.eventTarget + ' assigned', component, this._entity);
            }
            return component;
        },

        /**
         * @instance
         * @param {Component} Component
         */

        remove: function (Component) {
            if (Component instanceof cog.Component) {
                Component = Component.constructor;
            }
            var component, category = Component.category;
            if (this._componentMask.hasBits(category)) {
                component = this._components[category.bit];
                this._componentMask.removeBits(category);
                this._components[category.bit] = undefined;
                this._eventManager.emit(Component.eventTarget + ' removed', component, this._entity);
                component.destroy(true);
            }
            return this;
        },

        /**
         * @instance
         * @returns {*}
         */

        removeAll: function() {
            var key;
            for (key in this._components) {
                if (this._components.hasOwnProperty(key)) {
                    this.remove(this._components[key]);
                }
            }
            return this;
        },

        /**
         * Checks if the entity contains one or more matching Components
         *
         * @instance
         *
         * @param {...Component} Component - 1...N Component Constructor(s) to match the components against.
         * @returns {boolean}
         */

        has: function(Component) {
            var inputMask = Category.mask(arguments);
            return arguments.length > 0 && this._componentMask.hasBits(inputMask);
        },

        /* initial mask value */
        _entity: null,
        _components: null,
        _componentMask: null,
        _eventManager: null,

        /* Wrap storage in a componentAPI  */
        make: function (entity) {

            /**
             * @summary Gets component(s) from the entity
             * @desc The components method gets a component or an array of components.
             * If a Component constructor is passed to the function, this method will find and return the matching component.
             * If no arguments are passed, this method will create an array containing all of the components on the entity.
             *
             * @instance
             * @method
             * @memberof cog.Entity
             *
             * @param {Component} [Component] - If passed, components will get the matching component.
             * @returns {component|Array} - The component that matches the Constructor or an Array of all components
             */

            function components(Component) {
                var key, array, storage = components._components;

                if (Component) {
                    return Component.category && cog.isNumber(Component.category.bit) ? storage[Component.category.bit] : null;
                }

                // Get All Components
                array = [];
                for (key in storage) {
                    if (storage.hasOwnProperty(key)) {
                        array.push(storage[key]);
                    }
                }
                return array;
            }

            components._componentMask = new Category();
            components._components = entity._components;
            components._eventManager = entity.manager.director.events;
            components._entity = entity;
            components.has = this.has;
            components.mask = this.mask;
            components.assign = this.assign;
            components.remove = this.remove;
            components.removeAll = this.removeAll;

            Object.defineProperties(components, {

                /**
                 * Gets current component mask
                 * @alias mask
                 * @instance
                 * @memberof cog.Entity~components
                 * @type {number}
                 */

                mask: {
                    get: function() {
                        return this._componentMask;
                    }
                }
            });

            return components;
        }
    };

    cog.extend({
        Entity: Entity
    });

    return Entity;
});