define([
    './core',
    './eventManager',
    './entityManager',
    './systemManager',
    './polyfill/requestAnimationFrame'
], function(cog, EventManager, EntityManager, SystemManager) {
    /**
     * Director
     * @constructor
     */

    var Director = cog.Construct.extend('cog.Director', {
        create: function(config) {
            return new Director(config);
        }
    }, {

        defaults: {
            _targetDt: 1000 / 60,
            _accumulator: 0,
            _lastFrame: 0
        },

        properties: {
            config: { get: function() { return this._config; } },
            events: { get: function() { return this._eventManager; } },
            entities: { get: function() { return this._entityManager; } },
            systems: { get: function() { return this._systemManager; } },
            valid: { get: function() {
                return (this._entityManager !== undefined &&
                    this._systemManager !== undefined &&
                    this._eventManager !== undefined);
            }}
        },

        init: function(config) {
            this._config = config;
            this._eventManager = new EventManager(this);
            this._entityManager = new EntityManager(this);
            this._systemManager = new SystemManager(this);
            this._beginUpdateCallback = null;
            this._animationFrame = null;

            this._fixedDt = config && cog.isBoolean(config.fixedDt) ? config.fixedDt : false;
        },

        destroy: function() {
            this.stop();
            this._entityManager.destroy();
            this._eventManager.destroy();
            this._systemManager.destroy();
            this._entityManager = undefined;
            this._systemManager = undefined;
            this._eventManager = undefined;
            this._beginUpdateCallback = undefined;
            this._endUpdateCallback = undefined;
        },

        start:function() {
            if (!this._animationFrame) {
                this._lastFrame = performance.now();
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        stop: function() {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = null;
            }
        },

        step: function(timestamp) {
            var targetDt = this._targetDt,
                lastFrame = this._lastFrame,
                accumulator = this._accumulator,
                dt =  timestamp - lastFrame;

            /* ExcludeStart */
            cog.debug.log('step dt: ' + dt + ' accumulator: ' +accumulator);
            /* ExcludeEnd */

            if (this._beginStepCallback) {
                this._beginStepCallback();
            }

            if (this._fixedDt) {
                accumulator += dt;
                while (accumulator > targetDt) {
                    this.update(targetDt);
                    accumulator -= targetDt;
                }
                this._accumulator = accumulator;
            } else {
                this.update(dt);
            }
            this.render();

            if (this._endStepCallback) {
                this._endStepCallback();
            }

            if (this._animationFrame) {
                this._lastFrame = timestamp;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        update: function(dt) {
            if (this._beginUpdateCallback) {
                this._beginUpdateCallback();
            }

            /* ExcludeStart */
            cog.debug.log('update dt: ' + dt);
            /* ExcludeEnd */

            this._systemManager.update(dt);
            if (this._endUpdateCallback) {
                this._endUpdateCallback();
            }
        },

        render: function() {
            /* ExcludeStart */
            var start = performance.now();
            /* ExcludeEnd */

            this._systemManager.render();

            /* ExcludeStart */
            var end = performance.now();
            cog.debug.log('render dt: ' + (end-start));
            /* ExcludeEnd */
        },

        onBeginUpdate: function(callback) {
            this._beginUpdateCallback = callback;
            return this;
        },

        onEndUpdate: function(callback) {
            this._endUpdateCallback = callback;
            return this;
        },

        onBeginStep: function(callback) {
            this._beginStepCallback = callback;
            return this;
        },

        onEndStep: function(callback) {
            this._endStepCallback = callback;
            return this;
        }
    });

    cog.extend({
        Director: Director,
        createDirector: Director.create
    });

    return Director;
});
