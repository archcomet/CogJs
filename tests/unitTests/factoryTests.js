
var Director = cog.Director,
    Factory = cog.Factory;

var Position = Component.extend({
    defaults: { x:0, y:0 }
});

var Movement = Component.extend({
    defaults: { dx:0, dy:0 }
});

var Size = Component.extend({
    defaults: { width:11, height:22 }
});

module('Factory tests', {});

test('Create entity from factory', function() {

    var TestFactory = Factory.extend({
        entityTag: 'TestObj',
        components: {
            position: {
                constructor: Position,
                defaults: {
                    x: 10, y: 32
                }
            },
            movement: {
                constructor: Movement,
                defaults: {
                    dx: 10, dz: 15
                }
            },
            size: {
                constructor: Size
            }
        }
    });

    var dir = cog.createDirector(),
        testFactory = dir.systems().add(TestFactory),
        testEntity = testFactory.spawn();

    ok(testFactory instanceof Factory, 'Is a Factory');
    ok(testFactory instanceof TestFactory, 'Is a TestFactory');
    ok(testEntity instanceof Entity, 'Is an Entity');
    ok(testEntity.has(Position, Movement, Size), 'Has Components');
    strictEqual(testEntity.get(Position).x, 10, 'Position x correct');
    strictEqual(testEntity.get(Position).y, 32, 'Position x correct');
    strictEqual(testEntity.get(Movement).dx, 10, 'Movement dx correct');
    strictEqual(testEntity.get(Movement).dy, 15, 'Movement dy correct');
    strictEqual(testEntity.get(Size).width, 11, 'Size width correct');
    strictEqual(testEntity.get(Size).height, 12, 'Size height correct');

});

