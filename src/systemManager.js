define([
    './core'
], function(cog) {

    /**
     * A manager for systems.
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @param {director} director - A director
     * @constructor
     */

    var SystemManager = cog.Construct.extend('cog.SystemManager', {

        properties: {
            director: { get: function() { return this._director; } },
            valid: { get: function() { return (this._director !== undefined); } }
        },

        init: function(director) {
            this._systems = {};
            this._systemOrder = [];
            this._director = director;
        },

        destroy: function() {
            this.removeAll();
            this._director = undefined;
        },

        add: function(System) {
            if (!System || !System.systemId) {
                return undefined;
            }

            var systemId = System.systemId,
                system = this._systems[systemId];

            if (!system) {
                system = new System(this);
                this._systems[systemId] = system;
                this._systemOrder.push(system);
                this._director.events.registerContext(system);
                system.configure(this._director.entities, this._director.events, this._director.config)
            }
            return system;
        },

        get: function(System) {
            var systemId = System.systemId;
            return this._systems[systemId];
        },

        remove: function(System) {
            var index, systemId, system;

            if (System instanceof cog.System) {
                system = System;
                System = system.constructor;
            }

            if (!System || !System.systemId) {
                return this;
            }

            systemId = System.systemId;

            if (!system) {
                system = this._systems[systemId];
            }

            if (system) {
                index = this._systemOrder.indexOf(system);

                this._director.events.unregisterContext(system);
                this._systemOrder.splice(index, 1);
                this._systems[systemId] = undefined;

                system.destroy(true);
            }

            return this;
        },

        removeAll: function() {
            var index, systemId, system;
            for (systemId in this._systems) {
                if (this._systems.hasOwnProperty(systemId)) {
                    system = this._systems[systemId];
                    if (system) {
                        index = this._systemOrder.indexOf(system);

                        this._director.events.unregisterContext(system);
                        this._systemOrder.splice(index, 1);
                        this._systems[systemId] = undefined;

                        system.destroy(true);
                    }
                }
            }
            return this;
        },

        update: function(dt) {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities,
                events = this._director.events;
            for (; i < n; ++i) {
                systems[i].update(entities, events, dt);
            }
            return this;
        },

        render: function() {
            var i = 0,
                n = this._systemOrder.length,
                systems = this._systemOrder,
                entities = this._director.entities;
            for (; i < n; ++i) {
                systems[i].render(entities);
            }
            return this;
        }
    });

    cog.extend({
        SystemManager: SystemManager
    });

    return SystemManager;
});