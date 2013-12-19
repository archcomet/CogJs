define([
    'cog'
], function(cog) {

    var Component = cog.Component,
        Factory = cog.Factory,
        Entity = cog.Entity;

    var Position = Component.extend({
        defaults: { x:0, y:0 }
    });

    var Movement = Component.extend({
        defaults: { dx:0, dy:0 }
    });

    var Size = Component.extend({
        defaults: { width:11, height:22 }
    });

    var TestFactory = Factory.extend({
        entityTag: 'TestObj',
        components: {
            position: {
                constructor: Position
            },
            movement: {
                constructor: Movement,
                defaults: {
                    dx: 10, dy: 15
                }
            },
            size: {
                constructor: Size,
                defaults: {
                    width: 200
                }
            }
        }
    });

    module('Factory tests', {});

    test('Create entity from factory', function() {

        var dir = cog.createDirector(),
            testFactory = dir.systems.add(TestFactory),
            testEntity1 = testFactory.spawn();

        ok(testFactory instanceof Factory, 'Is a Factory');
        ok(testFactory instanceof TestFactory, 'Is a TestFactory');
        ok(testEntity1 instanceof Entity, 'Is an Entity');
        ok(testEntity1.has(Position, Movement, Size), 'Has Components');
        strictEqual(testEntity1.get(Position).x, 0, 'Position x correct');
        strictEqual(testEntity1.get(Position).y, 0, 'Position x correct');
        strictEqual(testEntity1.get(Movement).dx, 10, 'Movement dx correct');
        strictEqual(testEntity1.get(Movement).dy, 15, 'Movement dy correct');
        strictEqual(testEntity1.get(Size).width, 200, 'Size width correct');
        strictEqual(testEntity1.get(Size).height, 22, 'Size height correct');

        var testEntity2 = testFactory.spawn({
            position: {
                x: 10, y:30
            },
            size: {
                height: 33
            }
        });

        strictEqual(testEntity2.get(Position).x, 10, 'Position x correct');
        strictEqual(testEntity2.get(Position).y, 30, 'Position x correct');
        strictEqual(testEntity2.get(Movement).dx, 10, 'Movement dx correct');
        strictEqual(testEntity2.get(Movement).dy, 15, 'Movement dy correct');
        strictEqual(testEntity2.get(Size).width, 200, 'Size width correct');
        strictEqual(testEntity2.get(Size).height, 33, 'Size height correct');

        testFactory.despawn(testEntity1);
        testFactory.despawn(testEntity2);

        strictEqual(testEntity1.valid, false, 'Entity1 destroyed');
        strictEqual(testEntity2.valid, false, 'Entity2 destroyed');
    });

    test('Create entity from factory via event', function() {

        var dir = cog.createDirector(),
            events = dir.events,
            entities = dir.entities;

        dir.systems.add(TestFactory);

        events.emit('spawn TestObj', {
            position: {
                x: 10, y:30
            },
            size: {
                height: 33
            }
        });

        var entity = entities.withTag('TestObj')[0];
        strictEqual(entity.get(Position).x, 10, 'Position x correct');
        strictEqual(entity.get(Position).y, 30, 'Position x correct');
        strictEqual(entity.get(Movement).dx, 10, 'Movement dx correct');
        strictEqual(entity.get(Movement).dy, 15, 'Movement dy correct');
        strictEqual(entity.get(Size).width, 200, 'Size width correct');
        strictEqual(entity.get(Size).height, 33, 'Size height correct');
    });

});
