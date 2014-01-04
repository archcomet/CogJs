define([
    './core'
], function(cog) {
    if (typeof define === "function" && define.amd) {
        define('cog', function() { return cog; });
    }
});