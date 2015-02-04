define([
    '../core'
], function(cog) {

    /**
     * @namespace debug
     * @memberof cog
     */

    var debug = {

        _enabled: false,

        _filter: null,

        /**
         * enable debug
         * @memberof cog.debug
         */

        enable: function() {
            this._enabled = true;
        },

        /**
         * disable debug
         * @memberof cog.debug
         */

        disable: function() {
            this._enabled = false;
        },

        /**
         * setFilter
         * @param filterString
         */

        setFilter: function(filterString) {
            this._filter = filterString ? new RegExp(filterString) : null;
        },

        /**
         * log debug messages
         * @memberof cog.debug
         * @param {string} msg
         */

        log: function(msg) {
            if (this._enabled) {
                var args = Array.prototype.slice.call(arguments, 0);
                if (this._checkFilter(args)) {
                    window.console.log.apply(window.console, args);
                }
            }
        },

        _checkFilter: function(args) {
            var msg = args.join('');
            return this._filter ? !!msg.match(this._filter) : true;
        }
    };

    cog.extend({
        debug: debug
    });

    return debug;

});