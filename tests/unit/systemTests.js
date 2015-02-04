define([
    'cog'
], function(cog) {

    var System = cog.System;

    module('System Tests', {});

    test('Extend assigns unique bit category', function() {

        var count = System.count;
        var TestSystem1 = System.extend({}),
            TestSystem2 = System.extend({}),
            TestSystem3 = System.extend({});

        strictEqual(System.count, count + 3, 'Count increments');
        strictEqual(TestSystem1.systemId, count + 0, 'systemId correct');
        strictEqual(TestSystem2.systemId, count + 1, 'systemId correct');
        strictEqual(TestSystem3.systemId, count + 2, 'systemId correct');
    });

    test('Add System returns undefined in not passed a System', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var ret = systems.add({});

        strictEqual(ret, undefined, 'Return value is undefined');
    });

    test('Add/Get/Remove System', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var TestSystem = System.extend({});

        var system = systems.add(TestSystem);
        ok(system instanceof TestSystem, 'Add returns correct instance');
        strictEqual(system.manager, systems, 'Manager property has correct reference');

        var ret = systems.get(TestSystem);
        strictEqual(system, ret, 'Get returns correct instance');
    });

    test('Add/Get/Remove System', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var TestSystem1 = System.extend({}),
            TestSystem2 = System.extend({}),
            TestSystem3 = System.extend({});

        systems.add(TestSystem1);
        systems.add(TestSystem2);
        systems.add(TestSystem3);

        systems.removeAll();

        strictEqual(systems.get(TestSystem1), undefined, 'System1 removed');
        strictEqual(systems.get(TestSystem2), undefined, 'System1 removed');
        strictEqual(systems.get(TestSystem3), undefined, 'System1 removed');
    });

    test('Destroy removes System', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var TestSystem = System.extend({});
        var system = systems.add(TestSystem);

        system.destroy();
        strictEqual(systems.get(TestSystem), undefined, 'TestSystem destroy forwards to manager');
    });

    test('Remove System invalid', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var sys = systems.remove({});
        strictEqual(sys, systems, 'Does not throw error');
    });

    test('Update Systems', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var testArgs1 = [],
            testArgs2 = [],
            testArgs3 = [];

        var TestSystem1 = System.extend({
                update: function(entities, events, dt) {
                    console.log(arguments);
                    testArgs1 = arguments;
                }
            }),
            TestSystem2 = System.extend({
                update: function(entities, events, dt) {
                    testArgs2 = arguments;
                }
            }),
            TestSystem3 = System.extend({
                update: function(entities, events, dt) {
                    testArgs3 = arguments;
                }
            });

        systems.add(TestSystem1);
        systems.add(TestSystem2);
        systems.add(TestSystem3);

        dir.update(16);

        strictEqual(testArgs1[0], dir.entities, 'Entities passed to system 1');
        strictEqual(testArgs2[0], dir.entities, 'Entities passed to system 2');
        strictEqual(testArgs3[0], dir.entities, 'Entities passed to system 3');

        strictEqual(testArgs1[1], dir.events, 'Events passed to system 1');
        strictEqual(testArgs2[1], dir.events, 'Events passed to system 2');
        strictEqual(testArgs3[1], dir.events, 'Events passed to system 3');

        strictEqual(testArgs1[2], 16, 'dt passed to system 1');
        strictEqual(testArgs2[2], 16, 'dt passed to system 2');
        strictEqual(testArgs3[2], 16, 'dt passed to system 3');
    });

    test('Configure Systems', function() {

        var dir = cog.createDirector(),
            systems = dir.systems;

        var testArgs1 = [];

        var TestSystem1 = System.extend({
            configure: function(entities, events) {
                testArgs1 = arguments;
            }
        });

        systems.add(TestSystem1);

        strictEqual(testArgs1[0], dir.entities, 'Entities passed to system 1');
        strictEqual(testArgs1[1], dir.events, 'Events passed to system 1');
    });

    test('Auto Events Systems', function() {

        var dir = cog.createDirector(),
            systems = dir.systems,
            events = dir.events;

        var testArgs1 = [];
        var TestSystem1 = System.extend({
            'test event':function() {
                testArgs1 = arguments;
            }
        });

        systems.add(TestSystem1);
        events.emit('test', 1, 2, 3);

        strictEqual(testArgs1[0], 1, 'Arg 0 passed');
        strictEqual(testArgs1[1], 2, 'Arg 1 passed');
        strictEqual(testArgs1[2], 3, 'Arg 2 passed');

        systems.remove(TestSystem1);
        events.emit('test', 2, 3, 4);

        strictEqual(testArgs1[0], 1, 'Arg 0 Event not received after system removed');
        strictEqual(testArgs1[1], 2, 'Arg 1 Event not received after system removed');
        strictEqual(testArgs1[2], 3, 'Arg 2 Event not received after system removed');
    });

    test('RemoveAll does not throw after Remove', function() {

        var dir = cog.createDirector();
        var TestSystem1 = System.extend({});

        dir.systems.add(TestSystem1);
        dir.systems.remove(TestSystem1);
        dir.systems.removeAll();

        ok(true, 'Did not throw error');
    });
});