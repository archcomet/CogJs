define([
    '../core'
], function(cog) {

    /**
     * @namespace debug
     * @memberof cog
     */

    var debug = {

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
         * log debug messages
         * @memberof cog.debug
         * @param {string} msg
         */

        log: function(msg) {
            if (this._enabled) {
                console.log(msg);
            }
        }
    };

    cog.extend({
        debug: debug
    });

    return debug;

});