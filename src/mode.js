define([
    './core'
], function(cog) {

    /**
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @constructor
     */

    var Mode = cog.Construct.extend('cog.Mode', {

        properties: {

            director: { get: function() { return this._director; } },

            state: {
                enumerable: false,
                configurable: false,
                writable: true,
                value: null
            }
        },

        init: function(director) {
            this._director = director;
            this.state = {};
        },

        configure: function(entityManager, eventManager, config) {},

        start: function(entityManager, eventManager) {},

        update: function(entityManager, eventManager, dt) {},

        stop: function(entityManager, eventManager) {}
    });

    cog.extend({
        Mode: Mode
    });

    return Mode;
});