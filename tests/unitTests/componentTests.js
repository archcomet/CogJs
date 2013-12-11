
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

test('Create Component with options (recursive copy)', function() {
    var TestComponent = Component.extend({
        defaults: {
            number: 42,
            string: "hello",
            object: { x:1, y:'2', z:[3] },
            arr: [10, "stuff", { foo: 'bar'}]
        }
    });

    var comp = new TestComponent();

    // Test Values
    strictEqual(comp.number, 42, 'Number copied');
    strictEqual(comp.string, 'hello', 'String copied');
    strictEqual(comp.object.x, 1, 'Object x copied');
    strictEqual(comp.object.y, '2', 'Object y copied');
    strictEqual(comp.object.z[0], 3, 'Object z copied');
    strictEqual(comp.arr[0], 10, 'Object arr[0] copied');
    strictEqual(comp.arr[1], 'stuff', 'Object arr[1] copied');
    strictEqual(comp.arr[2].foo, 'bar', 'Object arr[2] copied');

    var def = TestComponent.prototype.defaults;
    notStrictEqual(comp.object, def.object, 'object is not a ref');
    notStrictEqual(comp.object.z, def.object.z, 'object.z is a ref');
    notStrictEqual(comp.arr, def.arr, 'arr is not a ref');
    notStrictEqual(comp.arr[2], def.arr[2], 'arr[2] is not a ref');
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
        },
        foo:function(){}
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
    notStrictEqual(copy.arr, comp.arr, 'Array is a copy');
    notStrictEqual(copy.arr[2], comp.arr[2], 'Array is a copy');
    notStrictEqual(copy.object.z, comp.object.z, 'Object is a copy');
    notStrictEqual(copy.object, comp.object, 'Object is a copy');
    notStrictEqual(copy.construct, undefined, 'Instance is not copied');

    strictEqual(copy.prop, undefined, 'Prop is not copied');
    strictEqual(copy._prop, 10, 'Private number is copied');
});
