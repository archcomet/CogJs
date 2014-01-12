define([
    'cog'
], function(cog){

    var Entity = cog.Entity,
        Component = cog.Component,
        Construct = cog.Construct;

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
            comp = entity.components.assign(TestComponent);

        strictEqual(comp.entity, entity, 'Has correct entity ref');
        strictEqual(entity.components(TestComponent), comp, 'Has correct component ref');

        comp.destroy();

        strictEqual(comp.entity, undefined, 'Has no entity ref');
        strictEqual(entity.components(TestComponent), undefined, 'Has no component ref');
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
            },
            properties: {
                x: {
                    value: 30,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
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
        strictEqual(copy.x, 30, 'x is copied');

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

    test('Dirtyable Component triggers handlers', function() {

        var _value, _oldValue;
        function testHandler(value, oldValue) {
            _value = value;
            _oldValue = oldValue;
        }

        var TestComponent = Component.extend({
            dirtyOnChange: true
        }, {
            defaults: {
                foo: 42
            }
        });

        var component = new TestComponent();
        component.on('foo', testHandler);

        component.foo = 43;

        strictEqual(_value, 43, 'Handler received value');
        strictEqual(_oldValue, 42, 'Handler received oldValue');
    });

    test('Dirtyable Component handlers can be turned off', function() {

        var _value, _oldValue;
        function testHandler(value, oldValue) {
            _value = value;
            _oldValue = oldValue;
        }

        var TestComponent = Component.extend({
            dirtyOnChange: true
        }, {
            defaults: {
                foo: 42
            }
        });

        var component = new TestComponent();
        component.on('foo', testHandler);
        component.on('foo2', testHandler);
        component.on('foo3', testHandler);

        component.off('foo');
        component.off();

        component.foo = 43;

        strictEqual(_value, undefined, 'Handler did not receive value');
        strictEqual(_oldValue, undefined, 'Handler did not receive oldValue');
    });

    test('component.prop can set a value and trigger a callback', function() {

        var _value, _oldValue;
        function testHandler(value, oldValue) {
            _value = value;
            _oldValue = oldValue;
        }

        var TestComponent = Component.extend({});
        var comp = new TestComponent({});

        comp.on('foo', testHandler);
        comp.prop('foo', 42);

        strictEqual(_value, 42, 'Handler received value');
        strictEqual(_oldValue, undefined, 'Handler received oldValue');
    });

    test('component.prop can read a value', function() {

        var TestComponent = Component.extend({
            defaults: {
                foo: 42
            }
        });

        var comp = new TestComponent({});
        var val = comp.prop('foo');

        strictEqual(val, 42, 'Prop returned value');
    });



    test('Keys from component', function() {

        var TestComponent = Component.extend({
            dirtyOnChange: true
        }, {
            defaults: {
                foo: 42,
                bar: 'Hello',
                x: 0,
                y: 1
            },

            properties: {
                x: { value: 1 },
                z: { value: 2 }
            }
        });

        var comp = new TestComponent();
        var keys = comp.keys();

        strictEqual(keys.length, 5, 'Has correct length');
        ok(keys.indexOf('foo') > -1, 'Has foo');
        ok(keys.indexOf('bar') > -1, 'Has foo');
        ok(keys.indexOf('x') > -1, 'Has x');
        ok(keys.indexOf('y') > -1, 'Has y');
        ok(keys.indexOf('z') > -1, 'Has z');
    });

    test('Keys from component with no properties', function() {

        var TestComponent = Component.extend({}, {});
        var comp = new TestComponent();
        var keys = comp.keys();

        strictEqual(keys.length, 0, 'Has correct length');
    });
});