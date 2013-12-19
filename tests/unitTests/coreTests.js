define([
    'cog'
], function(cog) {

    module('Core Tests');

    test('Safe api can be called with new', function() {
        var cog2 = new cog();
        ok(cog2 instanceof cog);
    });

});