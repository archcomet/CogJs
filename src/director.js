define([
    './core',
    './eventManager',
    './entityManager',
    './systemManager',
    './polyfill/requestAnimationFrame'
], function(cog, EventManager, EntityManager, SystemManager) {

    /**
     * @class Director
     * @classdesc The Director represents an instance of cog.
     * This class creates an EntityManager, SystemManager, and EventManager.
     * The Director also manages the timer, calling update/render on each step.
     *
     * @augments Construct
     * @memberof cog
     *
     * @param [config] {config} Optional configuration for the director and systems.
     * @returns {instance}
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

            /**
             * @member config
             * @summary Gets the configuration passed to the Director during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {config}
             */

            config: { get: function() { return this._config; } },

            /**
             * @member events
             * @summary Gets the EventManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {EventManager}
             */

            events: { get: function() { return this._eventManager; } },

            /**
             * @member entities
             * @summary Gets the EntityManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {EntityManager}
             */

            entities: { get: function() { return this._entityManager; } },

            /**
             * @member systems
             * @summary Gets the SystemManager created during initialization.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {SystemManager}
             */

            systems: { get: function() { return this._systemManager; } },

            /**
             * @member valid
             * @summary True after the Director is initialized. False once destroyed.
             *
             * @readonly
             * @instance
             * @memberof cog.Director
             *
             * @type {boolean}
             */

            valid: { get: function() {
                return (this._entityManager !== undefined &&
                    this._systemManager !== undefined &&
                    this._eventManager !== undefined);
            }}
        },

        /**
         * @name init
         * @summary Initializes the director
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {config} [config] Configuration options.
         */

        init: function(config) {
            this._config = config;
            this._eventManager = new EventManager(this);
            this._entityManager = new EntityManager(this);
            this._systemManager = new SystemManager(this);
            this._beginUpdateCallback = null;
            this._animationFrame = null;

            this._fixedDt = config && cog.isBoolean(config.fixedDt) ? config.fixedDt : false;
        },

        /**
         * @name destroy
         * @summary Destroy the director.
         * @desc Destroys the instance of the director and cleans up the attached managers
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

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

        /**
         * @name start
         * @desc Starts the Director's timer.
         * Schedules the step function via requestAnimationFrame
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

        start:function() {
            if (!this._animationFrame) {
                this._lastFrame = 0;
                this._animationFrame = requestAnimationFrame(this.step.bind(this));
            }
        },

        /**
         * @name stop
         * @desc Stops the Director's timer.
         * Un-schedules the step function via cancelAnimationFrame
         *
         * @instance
         * @method
         * @memberof cog.Director
         */

        stop: function() {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = null;
            }
        },

        /**
         * @name step
         * @desc Steps the attached Systems
         * On step, systems are updated, then rendered.
         * If fixedDt is enabled, update may be called multiple times per step.
         * Render will only be called once.
         *
         * @method
         * @event
         * @memberof cog.Director
         *
         * @param {number} timestamp Timestamp passed by requestAnimationFrame
         */

        step: function(timestamp) {
            var targetDt = this._targetDt,
                lastFrame = this._lastFrame,
                accumulator = this._accumulator,
                dt =  lastFrame === 0 ? targetDt : timestamp - lastFrame;

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

        /**
         * @name update
         * @desc Updates the attached Systems
         *
         * @method
         * @event
         * @memberof cog.Director
         *
         * @param {number} dt Number of milliseconds passed since last update.
         */

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

        /**
         * @name render
         * @desc Renders the attached Systems
         *
         * @method
         * @event
         * @memberof cog.Director
         */

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

        /**
         * @name onBeginUpdate
         * @desc Set a callback on the beginning of the update event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onBeginUpdate: function(callback) {
            this._beginUpdateCallback = callback;
            return this;
        },

        /**
         * @name onEndUpdate
         * @desc Set a callback on the ending of the update event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onEndUpdate: function(callback) {
            this._endUpdateCallback = callback;
            return this;
        },

        /**
         * @name onBeginStep
         * @desc Set a callback on the beginning of the step event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

        onBeginStep: function(callback) {
            this._beginStepCallback = callback;
            return this;
        },

        /**
         * @name onEndStep
         * @desc Set a callback on the ending of the step event.
         *
         * @instance
         * @method
         * @memberof cog.Director
         *
         * @param {callback} callback
         * @returns {this}
         */

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
