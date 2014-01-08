define([
    '../core'
], function(cog) {

    var debug = {

        enable: function() {
            this._enabled = true;
        },

        disable: function() {
            this._enabled = false;
        },

        log: function(msg) {
            if (this._enabled) {
                console.log(msg);
            }
        }
    };

    cog.extend({
        debug: debug
    });

    return cog;

});