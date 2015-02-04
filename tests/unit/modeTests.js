define([
    'cog'
], function(cog) {

    module('Mode Tests');

    asyncTest('Creates default Mode', function() {

        var dir = cog.createDirector();

        dir.start();

        ok(dir.mode instanceof cog.Mode, 'Created Mode');

        strictEqual(dir.mode.director, dir, 'Set director on mode');

        dir.onEndStep(function() {
            ok(dir.running, 'Is running');
            dir.destroy();
            start();
        });
    });

    test('Creates default Mode - without updates', function() {

        var dir = cog.createDirector();

        dir.start(false);

        ok(dir.mode instanceof cog.Mode, 'Created Mode');

        strictEqual(dir.mode.director, dir, 'Set director on mode');

        ok(!dir._animationFrame, 'Did not schedule frame');

        dir.destroy();
    });

    test('Creates Custom Mode', function() {

        var TestMode = cog.Mode.extend({});
        var dir = cog.createDirector();

        dir.start(TestMode, false);

        ok(dir.mode instanceof TestMode, 'Created TestMode');

        strictEqual(dir.mode.director, dir, 'Set director on mode');

        dir.destroy();
    });

    test('Creates Custom Mode - without updates', function() {

        var TestMode = cog.Mode.extend({});
        var dir = cog.createDirector();

        dir.start(TestMode, false);

        ok(dir.mode instanceof TestMode, 'Created TestMode');

        strictEqual(dir.mode.director, dir, 'Set director on mode');

        ok(!dir._animationFrame, 'Did not schedule frame');

        dir.destroy();
    });

});