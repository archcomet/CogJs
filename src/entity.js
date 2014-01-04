define([
    './core',
    './utils/_mask'
], function(cog, _mask) {
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

    return Entity;
});