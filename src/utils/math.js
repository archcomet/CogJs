define([
    '../core'
], function(cog) {

    /**
     *
     * @namespace math
     * @memberof cog
     */

    var math = (function() {

        return {

            radians: function(degrees) {

            },

            degrees: function(radians) {

            },

            sign: function(x) {

            },

            fract: function(x) {

            },

            clamp: function(x, minVal, maxVal) {

            },

            mix: function(x, y, a) {

            },

            step: function(edge, x) {

            },

            length: function(x) {

            },

            distance: function(p0, p1) {

            },

            dot: function(x, y) {

            },

            cross: function(x, y) {

            },

            normalize: function(x) {

            },

            faceforward: function(N, I, Nref) {

            },

            reflect: function(I, N) {

            },

            refract: function(I, N, etc) {

            }
        };

    }());

    cog.extend({
        math: math
    });

    return math;

});