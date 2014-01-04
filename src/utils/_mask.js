define([
    '../core'
],function(cog) {
    /**
     * _mask
     *  Creates a bit mask from the arguments array.
     * @returns {number}
     * @private
     */

    function _mask() {
        var arg, ret = 0, i = 0, n = arguments.length;
        for(; i < n; ++i) {
            if ((arg = arguments[i]) && arg.category) {
                ret |= arg.category;
            }
        }
        return ret;
    }

    return _mask;
});