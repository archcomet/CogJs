
var Director = cog.Director,
    EntityManager = cog.EntityManager,
    SystemManager = cog.SystemManager,
    EventManager = cog.EventManager,
    Entity = cog.Entity,
    Component = cog.Component;

var Position = Component.extend({
    defaults: { x:0, y:0 }
});

var Movement = Component.extend({
    defaults: { dx:0, dy:0 }
});

var Size = Component.extend({
    defaults: { width:0, height:0 }
});

module('Entity Tests', {});

test('Create/Remove Entity via EntityManager', function() {
    var dir = cog.createDirector(),
        entities = dir.entities();

    var entity = entities.add('TestEntity');
    ok(entity instanceof Entity, 'Entity created');
    strictEqual(entity.id(), 1, 'Has expected id');
    strictEqual(entity.valid(), true, 'Entity is valid');
    strictEqual(entity.manager(), entities, 'Has ref to manager');

    var search1 = entities.withTag('TestEntity');
    strictEqual(search1.length, 1, 'Search by tag returns one result');
    strictEqual(search1[0], entity, 'Search contains created entity');

    entities.remove(entity);
    strictEqual(entity.valid(), false, 'Entity no longer valid after remove');

    var search2 = entities.withTag('TestEntity');
    strictEqual(search2.length, 0, 'Search has no result after remove');
});

test('Create/Remove Entity with Tags via EntityManager', function() {
    var dir = cog.createDirector(),
        entities = dir.entities();

    var entity1 = entities.add('TypeA'),
        entity2 = entities.add(),
        entity3 = entities.add('TypeA'),
        entity4 = entities.add('TypeB'),
        entity5 = entities.add('TypeA');

    ok(entity1.valid(), 'Entity 1 is valid');
    ok(entity2.valid(), 'Entity 2 is valid');
    ok(entity3.valid(), 'Entity 3 is valid');
    ok(entity4.valid(), 'Entity 4 is valid');
    ok(entity5.valid(), 'Entity 5 is valid');

    var search1 = entities.all();
    strictEqual(search1.length, 5, 'Found all 5');

    ok(search1.indexOf(entity1) > -1, 'Entity 1 found');
    ok(search1.indexOf(entity2) > -1, 'Entity 2 found');
    ok(search1.indexOf(entity3) > -1, 'Entity 3 found');
    ok(search1.indexOf(entity4) > -1, 'Entity 4 found');
    ok(search1.indexOf(entity5) > -1, 'Entity 5 found');

    entities.removeWithTag('TypeA');

    var search2 = entities.all();
    strictEqual(search2.length, 2, 'Found 2');

    ok(search2.indexOf(entity2) > -1, 'Entity 2 found');
    ok(search2.indexOf(entity4) > -1, 'Entity 4 found');
});

test('Destroy Entity removes from EntityManager', function() {
    var dir = cog.createDirector(),
        entities = dir.entities();

    var entity = entities.add('TestEntity');
    var search1 = entities.all();
    strictEqual(search1.length, 1, 'Search by tag returns one result');
    strictEqual(search1[0], entity, 'Search contains created entity');

    entity.destroy();
    strictEqual(entity.valid(), false, 'Entity no longer valid after destroy');

    var search2 = entities.all();
    strictEqual(search2.length, 0, 'Search by tag returns one result');
});


test('Add/Get/Remove a Component via Entity', function() {

    var dir = cog.createDirector(),
        entity = dir.entities().add('TestEntity');

    var position = entity.add(Position, { x:10, y:42 });
    ok(position instanceof Position, 'Created: Position');
    strictEqual(position.x, 10, 'Created: Correct x');
    strictEqual(position.y, 42, 'Created: Correct y');

    var retPosition = entity.get(Position);
    ok(entity.has(Position), 'After add: Has a Position');
    strictEqual(retPosition, position, 'After add: Get Position returns object');

    entity.remove(Position);
    ok(!entity.has(Position), 'After remove: Has no Position');
    strictEqual(entity.get(Position), undefined, 'After remove: Get Position returns undefined');
});

test('Add no-op if not passed Component type', function() {

    var dir = cog.createDirector(),
        entity = dir.entities().add('TestEntity');

    var ret = entity.add({});

    strictEqual(ret, undefined, 'Return value is undefined');
});

test('Add sets Component', function() {

    var dir = cog.createDirector(),
        entity = dir.entities().add('TestEntity');

    var position = entity.add(Position, { x:10, y:42 });
    var position2 = entity.add(Position, { x: 42, y: 10 });

    strictEqual(position, position2, 'Same object');
    strictEqual(position.x, 42, 'Updated x');
    strictEqual(position.y, 10, 'Updated y');
});

test('WithComponents matching', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        entity0 = entities.add(),
        entity1 = entities.add(),
        entity2 = entities.add(),
        entity3 = entities.add();

    entity1.add(Position);
    entity2.add(Position);
    entity2.add(Movement);
    entity3.add(Position);
    entity3.add(Movement);
    entity3.add(Size);

    ok(entity1.has(Position), 'Match 1');
    ok(entity2.has(Position, Movement), 'Match 2');
    ok(entity3.has(Position, Movement, Size), 'Match 3');

    var match0 = entities.withComponents(),
        match1 = entities.withComponents(Position),
        match2 = entities.withComponents(Position, Movement),
        match3 = entities.withComponents(Position, Movement, Size);

    strictEqual(match0.length, 4, 'Found 4');
    strictEqual(match1.length, 3, 'Found 3');
    strictEqual(match2.length, 2, 'Found 2');
    strictEqual(match3.length, 1, 'Found 1');

    ok(match0.indexOf(entity0) > -1, 'Contains entity0');
    ok(match0.indexOf(entity1) > -1, 'Contains entity1');
    ok(match0.indexOf(entity2) > -1, 'Contains entity2');
    ok(match0.indexOf(entity3) > -1, 'Contains entity3');
    ok(match1.indexOf(entity1) > -1, 'Contains entity1');
    ok(match1.indexOf(entity2) > -1, 'Contains entity2');
    ok(match1.indexOf(entity3) > -1, 'Contains entity3');
    ok(match2.indexOf(entity2) > -1, 'Contains entity2');
    ok(match2.indexOf(entity3) > -1, 'Contains entity3');
    ok(match3.indexOf(entity3) > -1, 'Contains entity3');
});

test('Add/Remove Component - Mask is correct', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        entity = entities.add();

    var posCat = Position.category(),
        moveCat = Movement.category(),
        sizeCat = Size.category();

    var position = entity.add(Position);
    strictEqual(entity.mask(), posCat, 'After add 1: Mask correct');
    strictEqual(position.entity(), entity, 'After add 1: Entity correct');

    var movement = entity.add(Movement);
    strictEqual(entity.mask(), posCat | moveCat, 'After add 2: Mask correct');
    strictEqual(movement.entity(), entity, 'After add 2: Entity correct');

    var size = entity.add(Size);
    strictEqual(entity.mask(), posCat | moveCat | sizeCat, 'After add 3: Mask correct');
    strictEqual(size.entity(), entity, 'After add 3: Entity correct');

    entity.remove(Position);
    strictEqual(entity.mask(), moveCat | sizeCat, 'After remove 1: Mask correct');
    strictEqual(position.entity(), undefined, 'After remove 1: Entity undefined');

    entity.remove(Movement);
    strictEqual(entity.mask(), sizeCat, 'After remove 2: Mask correct');
    strictEqual(movement.entity(), undefined, 'After remove 2: Entity undefined');

    entity.remove(Size);
    strictEqual(entity.mask(), 0, 'After remove 3: Mask correct');
    strictEqual(size.entity(), undefined, 'After remove 3: Entity undefined');
});

test('RemoveAll Components', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        entity = entities.add();

    entity.add(Position);
    entity.add(Movement);
    entity.add(Size);
    ok(entity.has(Position, Movement, Size), 'Before RemoveAll: Contains Components');

    entity.removeAll();
    strictEqual(entity.mask(), 0, 'After RemoveAll: Has no Components');
});

test('Destroy removes all Components', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        entity = entities.add();

    entity.add(Position);
    entity.add(Movement);
    entity.add(Size);
    ok(entity.has(Position, Movement, Size), 'Before RemoveAll: Contains Components');

    entity.destroy();
    strictEqual(entity.mask(), 0, 'After Destroy: Has no Components');
});

test('Add/Remove Entity emits correct event', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        events = dir.events();

    var testListener = {
        createdCallback: function() {
            ok(arguments[0].valid(), 'Valid during callback');
            this.createdArgs = arguments;
        },

        destroyedCallback: function () {
            ok(arguments[0].valid(), 'Valid during callback');
            this.destroyedArgs = arguments;
        }
    };

    events.register('entityCreated', testListener, testListener.createdCallback);
    events.register('entityDestroyed', testListener, testListener.destroyedCallback);

    var entity = entities.add('test.Entity');
    strictEqual(testListener.createdArgs[0], entity, 'Entity passed via created event');

    entity.destroy();
    strictEqual(testListener.destroyedArgs[0], entity, 'Entity passed via destroy event');
});


test('RemoveAll emits correct event', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        events = dir.events();

    var testListener = {
        createdCallback: function() {
            ok(arguments[0].valid(), 'Valid during callback');
            this.createdArgs = arguments;
        },

        destroyedCallback: function () {
            ok(arguments[0].valid(), 'Valid during callback');
            this.destroyedArgs = arguments;
        }
    };

    events.register('entityCreated', testListener, testListener.createdCallback);
    events.register('entityDestroyed', testListener, testListener.destroyedCallback);

    var entity = entities.add('test.Entity');
    strictEqual(testListener.createdArgs[0], entity, 'Entity passed via created event');

    entities.removeAll();
    strictEqual(testListener.destroyedArgs[0], entity, 'Entity passed via destroy event');
});


test('RemoveWithTag emits correct event', function() {

    var dir = cog.createDirector(),
        entities = dir.entities(),
        events = dir.events();

    var testListener = {
        createdCallback: function() {
            ok(arguments[0].valid(), 'Valid during callback');
            this.createdArgs = arguments;
        },

        destroyedCallback: function () {
            ok(arguments[0].valid(), 'Valid during callback');
            this.destroyedArgs = arguments;
        }
    };

    events.register('entityCreated', testListener, testListener.createdCallback);
    events.register('entityDestroyed', testListener, testListener.destroyedCallback);

    var entity = entities.add('test.Entity');
    strictEqual(testListener.createdArgs[0], entity, 'Entity passed via created event');

    entities.removeWithTag('test.Entity');
    strictEqual(testListener.destroyedArgs[0], entity, 'Entity passed via destroy event');
});

test('Add/Remove Component emits correct event', function() {
    var dir = cog.createDirector(),
        entities = dir.entities(),
        events = dir.events();

    var TestComponent = Component.extend({});

    var testListener = {
        createdArgs: [],
        destroyedArgs: [],
        createdCallback: function() {
            ok(arguments[0].entity().valid(), 'Valid during callback');
            this.createdArgs = arguments;
        },

        destroyedCallback: function () {
            ok(arguments[0].entity().valid(), 'Valid during callback');
            this.destroyedArgs = arguments;
        }
    };

    events.register('componentCreated', testListener, testListener.createdCallback);
    events.register('componentDestroyed', testListener, testListener.destroyedCallback);

    var entity = entities.add('test.Entity'),
        comp = entity.add(TestComponent);
    strictEqual(testListener.createdArgs[0], comp, 'Component passed via created event');
    strictEqual(testListener.createdArgs[1], entity, 'Entity passed via created event');

    entity.remove(TestComponent);
    strictEqual(testListener.destroyedArgs[0], comp, 'Component passed via destroy event');
    strictEqual(testListener.destroyedArgs[1], entity, 'Entity passed via destroy event');
});

test('Clone Entity', function() {
    var dir = cog.createDirector(),
        entities = dir.entities(),
        entity = entities.add('test.Clone');

    entity.add(Position, {x:42, y:31});
    entity.add(Movement, {dx:1.0, dy:0.4});
    entity.add(Size, {width:22, height:10});

    var entity2 = entity.clone(),
        position = entity2.get(Position),
        movement = entity2.get(Movement),
        size = entity2.get(Size);

    ok(entity2 instanceof Entity, 'Is an Entity');
    strictEqual(entity2.id(), 2, 'Has expected id');
    strictEqual(entity2.tag(), 'test.Clone', 'Has expected tag');
    strictEqual(entity2.valid(), true, 'Entity is valid');
    strictEqual(entity2.manager(), entities, 'Has ref to manager');

    strictEqual(position.x, 42, 'X correct');
    strictEqual(position.y, 31, 'X correct');
    strictEqual(movement.dx, 1.0, 'dx correct');
    strictEqual(movement.dy, 0.4, 'dy correct');
    strictEqual(size.width, 22, 'width correct');
    strictEqual(size.height, 10, 'height correct');
});