define([
    './core'
], function(cog) {
    /**
     * System
     *
     * @param manager
     * @constructor
     */

    var systemCount = 0;

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

        update: function(entityManager, eventManager, dt) {},

        render: function(entityManager) {}

    });

    cog.extend(cog, {
        System: System
    });

    return System;
});