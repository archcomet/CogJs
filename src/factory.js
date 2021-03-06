define([
    './core',
    './system'
], function(cog) {

    /**
     * An abstract system class.
     *
     * @class
     * @abstract
     * @memberof cog
     * @augments cog.System
     *
     * @param {systemManager} manager - SystemManager that created the Entity
     * @constructor
     */

    var Factory = cog.System.extend('cog.Factory', {

        entityTag: null,

        parentEntity: null,

        components: {},

        init: function(manager) {
            this._entityManager = manager.director.entities;
            this._super(manager);
            this._entities = [];

            if (cog.isString(this.entityTag)) {
                var self = this;
                this['spawn ' + this.entityTag + ' event'] = function() {
                    self.spawn.apply(self, arguments);
                };
                this['despawn ' + this.entityTag + ' event'] = function() {
                    self.despawn.apply(self, arguments);
                };
            }
        },

        spawn: function(options) {
            var key,
                tag = (options && cog.isString(options.tag)) ? options.tag : this.entityTag,
                entity = this._entityManager.add(tag),
                components = this.components,
                component,
                componentOptions;

            for (key in components) {
                if (key !== 'tag' && components.hasOwnProperty(key)) {
                    component = components[key];
                    componentOptions = (options && options[key]) ? options[key] : {};
                    cog.defaults(componentOptions, component.defaults);
                    entity.components.assign(component.constructor, componentOptions);
                }
            }

            this._entities.push(entity);

            if (this.parentEntity) {
                this.parentEntity.addChild(entity);
            }

            return entity;
        },

        despawn: function(entity) {
            var index = this._entities.indexOf(entity);
            if (index > -1) {

                if (this.parentEntity) {
                    this.parentEntity.removeChild(entity);
                }

                this._entities.splice(index, 1);
                entity.destroy();
            }
        }
    });

    cog.extend({
        Factory: Factory
    });

    return Factory;
});