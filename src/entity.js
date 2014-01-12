define([
    './core',
    './utils/_mask'
], function(cog, _mask) {

    /**
     * @class Entity
     * @classdesc Entity Object
     *
     * @augments Construct
     * @memberof cog
     *
     * @param {EntityManager} manager - EntityManager that created the Entity
     * @param {number} id - Unique numeric Id assigned by the EntityManager
     * @param {string} [tag] - Entity Tag
     * @constructor
     */

    var Entity = cog.Construct.extend('cog.Entity', {

        components: null,
        _manager: null,
        _tag: null,

        properties: {

            /**
             * @member manager
             * @summary Gets the EntityManager
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {EntityManager}
             */

            manager: { get: function() { return this._manager; } },

            /**
             * @member id
             * @summary Gets the entity id
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

            valid: { get: function() { return (this._manager && this._id) ? true : false; } },

            /**
             * @member parent
             * @summary Gets the the Entity's parent.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {Entity}
             */

            parent: { get: function() { return this._parent; } },

            /**
             * @member children
             * @summary Gets an array of the Entity's children.
             *
             * @readonly
             * @instance
             * @memberof cog.Entity
             *
             * @type {Array}
             */

            children: { get: function() { return this._children.slice(0); } }
        },


        /**
         * @name init
         * @summary Initializes the Entity
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
            this._manager = manager;
            this._id = id;
            this._tag = tag || null;
            this._components = {};
            this._parent = null;
            this._children = [];
            this.components = componentApi.make(this);
        },

        /**
         * @name destroy
         * @summary Destroy the Entity.
         * @desc Destroys the instance of the Entity
         *
         * @instance
         * @method
         * @memberof cog.Entity
         */

        destroy: function(managed) {
            if (this._manager && !managed) {
                this._manager.remove(this);
                return;
            }
            this.components.removeAll();
            this._manager = undefined;
            this._id = undefined;
            this._tag = undefined;
            this._children = undefined;
        },

        /**
         * @name clone
         * @summary Clones the Entity.
         * @desc Creates a new instance of the Entity. Components and enumerable properties are copied to the new Entity.
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @example
         * // Creates a clone of the entity.
         * var clonedEntity = entity.clone();
         * @returns {Entity}
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


    var componentApi = {

        /**
         * @summary Adds a Component to the Entity.
         * @desc This method creates a Component and assigns it to the Entity.
         *
         * @instance
         * @memberof cog.Entity
         *
         * @example
         *  var PositionComponent = cog.Component.extend({...});
         *  ...
         *  // Create an entity and add a PositionComponent
         *  var entity = director.entities.add('exampleEntity');
         *  var component = entity.add(PositionComponent, { x: 0, y: 100 });
         * @param {Component} Component - Constructor function for the entity.
         * @param {Object} [options] - Component Options to be passed to the Component Constructor.
         * @returns {Component}
         */

        assign: function (Component, options) {
            if (!Component || !Component.category) {
                return null;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                component.set(options);
            } else {
                component = this._components[category] = new Component(this._entity, options);
                this._componentMask |= category;
                this._eventManager.emit(Component.eventTarget + ' assigned', component, this._entity);
            }
            return component;
        },

        /**
         *
         * @param {Component} Component
         */

        remove: function (Component) {
            if (Component instanceof cog.Component) {
                Component = Component.constructor;
            }
            var component, category = Component.category;
            if ((category & this._componentMask) === category) {
                component = this._components[category];
                this._componentMask &= ~(category);
                this._components[category] = undefined;
                this._eventManager.emit(Component.eventTarget + ' removed', component, this._entity);
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

        /**
         * @function has
         * @summary Checks if the entity contains one or more matching Components
         *
         * @instance
         * @memberof cog.Entity
         *
         * @param {...Component} Component - 1...N Component Constructor(s) to match the components against.
         * @returns {boolean}
         */

        has: function(Component) {
            var inputMask = _mask.apply(_mask, arguments);
            return inputMask !== 0 && (inputMask & this._componentMask) === inputMask;
        },

        /**
         * @name components.mask
         * @summary Gets current component mask
         *
         * @instance
         * @method
         * @memberof cog.Entity
         *
         * @returns {number}
         */

        mask: function() {
            return this._componentMask;
        },

        /* initial mask value */
        _entity: null,
        _components: null,
        _componentMask: 0,
        _eventManager: null,

        /* Wrap storage in a componentAPI  */
        make: function (entity) {

            /**
             * @name components
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
             * @returns {instance|Array} - The component that matches the Constructor or an Array of all components
             */

            function components(Component) {
                var key, array, storage = components._components;

                if (Component) {
                    return Component.category ? storage[Component.category] : null;
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

            components._componentMask = this._componentMask;
            components._components = entity._components;
            components._eventManager = entity.manager.director.events;
            components._entity = entity;
            components.has = this.has;
            components.mask = this.mask;
            components.assign = this.assign;
            components.remove = this.remove;
            components.removeAll = this.removeAll;

            return components;
        }
    };


    cog.extend({
        Entity: Entity,
        entityComponents: componentApi
    });

    return Entity;
});