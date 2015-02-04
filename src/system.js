define([
    './core'
], function(cog) {

    var systemCount = 0;

    /**
     * A system for creating entities.
     *
     * @class
     * @memberof cog
     * @augments cog.System
     *
     * @param {systemManager} manager - SystemManager that created the Entity
     * @constructor
     */

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

        update: function(entityManager, eventManager, dt, mode) {},

        render: function(entityManager) {},

        start: function(entityManager, eventManager, mode) {},

        stop: function(entityManager, eventManager, mode) {}

    });

    cog.extend({
        System: System
    });

    return System;
});