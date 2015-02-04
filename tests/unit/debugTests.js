define([
    'cog'
], function(cog) {

    module('Debug Tests');

    test('Debug coverage', function() {
        cog.debug.enable();
        cog.debug.log('Test');
        strictEqual(cog.debug._enabled, true, 'Is enabled');

        cog.debug.setFilter('hello');
        cog.debug.log('Test');
        cog.debug.log('Test hello');

        cog.debug.disable();
        cog.debug.log('Test');
        strictEqual(cog.debug._enabled, false, 'Is disabled');
    });

});