define(function() {
    function assertLimit(num, limit, msg) {
        if (num > limit) {
            throw msg;
        }
    }
    return assertLimit;
});