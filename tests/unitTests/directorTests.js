
var Director = cog.Director,
    EntityManager = cog.EntityManager,
    SystemManager = cog.SystemManager,
    EventManager = cog.EventManager,
    Entity = cog.Entity,
    Component = cog.Component;

module('Director Tests', {});

test('Create Director function', function() {

    var config = { test: 42 };
    var testDir = cog.createDirector(config);

    ok(testDir instanceof Director, 'Creates director');
    ok(testDir.entities() instanceof EntityManager, 'Creates EntityManager');
    ok(testDir.systems() instanceof SystemManager, 'Creates SystemManager');
    ok(testDir.events() instanceof EventManager, 'Creates EventManager');
    ok(testDir.valid(), 'Director is valid');
    ok(testDir.entities().valid(), 'EntityManager is valid');
    ok(testDir.systems().valid(), 'SystemManager is valid');
    ok(testDir.events().valid(), 'EventManager is valid');

    strictEqual(testDir.config(), config, 'Returns config');

    strictEqual(testDir.entities().director(), testDir, 'EntityManager refs director');
    strictEqual(testDir.systems().director(), testDir, 'SystemManager refs director');
    strictEqual(testDir.events().director(), testDir, 'EventManager refs director');

    testDir.destroy();
    strictEqual(testDir.entities(), undefined, 'Destroys EntityManager');
    strictEqual(testDir.systems(), undefined, 'Destroys SystemManager');
    strictEqual(testDir.events(), undefined, 'Destroys EventManager');
    strictEqual(testDir.valid(), false, 'Is no longer valid');
});

test('PreUpdate and PostUpdate hooks', function() {

    var testDir = cog.createDirector(),
        preUpdate = false,
        postUpdate = false;

    testDir.preUpdate(function() {
        preUpdate = true;
    });

    testDir.postUpdate(function() {
        postUpdate = true;
    });

    testDir.update(16);

    ok(preUpdate, 'PreUpdate fired');
    ok(postUpdate, 'PostUpdate fired');

});

asyncTest('Start/stop animation frames', function() {

    var updateCount = 0,
        times = [];

    var dir = cog.createDirector();
    var TestSystem = System.extend({
        update: function(entities, events, dt) {

            updateCount++;
            times.push(dt);

            if (updateCount >= 3) {
                ok(true, 'Ran 3 steps');
                strictEqual(entities, dir.entities(), 'Passed EntityManager');
                strictEqual(events, dir.events(), 'Passed EventManager');
                for(var i = 0, n = times.length; i < n; ++i) {
                    ok(times[i] > 0 , 'Time ' + i + ' is in correct range: ' + times[i]);
                }
                dir.stop();
                start();
            }
        }
    });

    dir.systems().add(TestSystem);
    dir.start();
});
