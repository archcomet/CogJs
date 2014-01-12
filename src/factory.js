define([
    './core',
    './system'
], function(cog) {
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
                    entity.components.assign(component.constructor, componentOptions);
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

    return Factory;
});