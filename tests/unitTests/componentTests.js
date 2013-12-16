
var Director = cog.Director,
    EntityManager = cog.EntityManager,
    SystemManager = cog.SystemManager,
    EventManager = cog.EventManager,
    Entity = cog.Entity,
    Component = cog.Component,
    System = cog.System;

module('Component tests', {});

test('Create/Destroy Component', function() {
    var entity = {};
    var TestComponent = Component.extend({});
    var comp = new TestComponent(entity);

    ok(comp instanceof Component, 'Is a component type');
    strictEqual(comp.entity, entity, 'Exposes entity after create');
    strictEqual(comp.valid, true, 'Component is valid');

    comp.destroy();
    strictEqual(comp.entity, undefined, 'Removes entity after destroy');
    strictEqual(comp.valid, false, 'Component is valid');
});

test('Destroy Component removes from Entity', function() {
    var dir = cog.createDirector(),
       entities = dir.entities,
       entity = entities.add();

    var TestComponent = Component.extend({}),
        comp = entity.add(TestComponent);

    strictEqual(comp.entity, entity, 'Has correct entity ref');
    strictEqual(entity.get(TestComponent), comp, 'Has correct component ref');

    comp.destroy();

    strictEqual(comp.entity, undefined, 'Has no entity ref');
    strictEqual(entity.get(TestComponent), undefined, 'Has no component ref');
});

test('Component assigned unique category bit', function() {
    var count = Component.count;

    var TestComponent1 = Component.extend({}),
        TestComponent2 = Component.extend({}),
        TestComponent3 = Component.extend({});

    strictEqual(Component.category, 0, 'Component has a category of 0');
    strictEqual(Component.category, 0, 'Component has a category of 0 (2nd call)');
    strictEqual(TestComponent1.category, 1 << (count + 0), 'TestComponent1 has a category of 1');
    strictEqual(TestComponent1.category, 1 << (count + 0), 'TestComponent1 has a category of 1 (2nd call)');
    strictEqual(TestComponent2.category, 1 << (count + 1), 'TestComponent2 has a category of 2');
    strictEqual(TestComponent2.category, 1 << (count + 1), 'TestComponent2 has a category of 2 (2nd call)');
    strictEqual(TestComponent3.category, 1 << (count + 2), 'TestComponent3 has a category of 4');
    strictEqual(TestComponent3.category, 1 << (count + 2), 'TestComponent3 has a category of 4 (2nd call)');
});

test('Create Component with defaults', function() {
    var TestComponent = Component.extend({
        defaults: {
            number: 42,
            string: "hello",
            object: { x:1, y:'2', z:[3] },
            arr: [10, "stuff", { foo: 'bar'}]
        }
    });

    var comp = new TestComponent();
    var def = TestComponent.prototype.defaults;

    strictEqual(comp.number, 42, 'Number copied');
    strictEqual(comp.string, 'hello', 'String copied');
    strictEqual(comp.object, def.object, 'object is a ref');
    strictEqual(comp.arr, def.arr, 'arr is a ref');
});

test('Serialize Component', function() {

    var construct = new Construct();
    var TestComponent = Component.extend({
        defaults: {
            number: 42,
            string: "hello",
            object: { x:1, y:'2', z:[3] },
            arr: [10, "stuff", { foo: 'bar'}],
            construct: construct,
            _prop: 10
        }
    });

    Object.defineProperty(TestComponent.prototype, 'prop', {
        get: function() {
            return this._prop;
        }
    });

    var comp = new TestComponent();
    var copy = comp.serialize();

    ok(cog.isPlainObject(copy), 'Is an object');
    strictEqual(copy.number, 42, 'Copied number');
    strictEqual(copy.string, 'hello', 'Copied string');
    strictEqual(copy.arr, comp.arr, 'Array is a copy');
    strictEqual(copy.arr[2], comp.arr[2], 'Array is a ref');
    strictEqual(copy.object.z, comp.object.z, 'Object is a ref');
    strictEqual(copy.object, comp.object, 'Object is a ref');
    strictEqual(copy.construct, construct, 'Instance is copied');

    strictEqual(copy.prop, undefined, 'Prop is not copied');
    strictEqual(copy._prop, 10, 'Private number is copied');
});

test('Dirtyable Component', function() {

    var TestComponent = Component.extend({
        dirtyOnChange: true
    }, {
        defaults: {
            foo: 42,
            bar: 'Hello',
            x: 0,
            y: 1
        }
    });

    var comp = new TestComponent();

    strictEqual(comp.dirty, true, 'Dirty starts true');
    strictEqual(comp.foo, 42, 'Foo has default value');
    strictEqual(comp.bar, 'Hello', 'Bar has default value');
    strictEqual(comp.x, 0, 'x has default value');
    strictEqual(comp.y, 1, 'y has default value');

    comp.dirty = false;
    strictEqual(comp.dirty, false, 'Dirty set to false');

    comp.foo = 43;
    strictEqual(comp.foo, 43, 'Foo changed');
    strictEqual(comp.dirty, true, 'Dirty now true');

    var copy = comp.serialize();
    strictEqual(copy.dirty, undefined, 'Dirty is undefined on copy');
    strictEqual(copy.foo, 43, 'Foo has copy value');
    strictEqual(copy.bar, 'Hello', 'Copy Bar has copy value');
    strictEqual(copy.x, 0, 'x has copy value');
    strictEqual(copy.y, 1, 'y has copy value');
});