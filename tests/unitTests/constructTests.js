
var Construct = cog.Construct;

module('Construct Tests', {});

test('Derived throws error without new keyword', function() {
    var Derived = Construct.extend();
    try {
        Derived();
        ok(false, 'Did not throw error');
    }
    catch(ex) {
        strictEqual(ex, 'Constructor called without new keyword', 'Correct error message');
    }
});

test('Construct with instanceProps', function() {
    var initArgs = [], fooCalled = false;

    var Derived = Construct.extend({
        init: function() {
            initArgs = arguments;
        },
        foo: function() {
            fooCalled = true;
        },
        obj: {
            val: 42
        }
    });

    var instance = new Derived(1, 2);
    instance.foo();

    ok(instance instanceof Construct, 'Is Construct');
    ok(instance instanceof Derived, 'Is Derived');
    strictEqual(instance.obj.val, 42, 'Extends objects');
    strictEqual(initArgs[0], 1, 'First arg');
    strictEqual(initArgs[1], 2, 'Second arg');
    strictEqual(fooCalled, true, 'Foo called');
    strictEqual(Derived.fullName, null, 'Has no name');
});

test('Construct with fullName and instanceProps', function() {
    var initArgs = [], fooCalled = false;

    var Derived = Construct.extend('test.Derived', {
        init: function() {
            initArgs = arguments;
        },
        foo: function() {
            fooCalled = true;
        },
        obj: {
            val: 42
        }
    });

    var instance = new Derived(1, 2);
    instance.foo();

    ok(instance instanceof Construct, 'Is Construct');
    ok(instance instanceof Derived, 'Is Derived');
    strictEqual(instance.obj.val, 42, 'Extends objects');
    strictEqual(initArgs[0], 1, 'First arg');
    strictEqual(initArgs[1], 2, 'Second arg');
    strictEqual(fooCalled, true, 'Foo called');
    strictEqual(Derived.fullName, 'test.Derived', 'Has correct name');
});

test('Construct with staticProps and instanceProps', function() {
    var initArgs = [], setupCalled = false, fooCalled = false;

    var Derived = Construct.extend({
        setup: function() {
            setupCalled = true;
        },
        obj: {
            val: 13
        }
    }, {
        init: function() {
            initArgs = arguments;
        },
        foo: function() {
            fooCalled = true;
        },
        obj: {
            val: 42
        }
    });

    var instance = new Derived(1, 2);
    instance.foo();

    ok(instance instanceof Construct, 'Is Construct');
    ok(instance instanceof Derived, 'Is Derived');
    strictEqual(initArgs[0], 1, 'First arg');
    strictEqual(initArgs[1], 2, 'Second arg');
    strictEqual(fooCalled, true, 'Foo called');
    strictEqual(setupCalled, true, 'Setup called');
    strictEqual(Derived.obj.val, 13, 'Extends constructor');
    strictEqual(instance.obj.val, 42, 'Extends prototype');
    strictEqual(Derived.fullName, null, 'Has correct name');
});

test('Construct with fullName, staticProps, and instanceProps', function() {
    var initArgs = [], setupCalled = false, fooCalled = false;

    var Derived = Construct.extend('test.Derived', {
        setup: function() {
            setupCalled = true;
        },
        obj: {
            val: 13
        }
    }, {
        init: function() {
            initArgs = arguments;
        },
        foo: function() {
            fooCalled = true;
        },
        obj: {
            val: 42
        }
    });

    var instance = new Derived(1, 2);
    instance.foo();

    ok(instance instanceof Construct, 'Is Construct');
    ok(instance instanceof Derived, 'Is Derived');
    strictEqual(initArgs[0], 1, 'First arg');
    strictEqual(initArgs[1], 2, 'Second arg');
    strictEqual(fooCalled, true, 'Foo called');
    strictEqual(setupCalled, true, 'Setup called');
    strictEqual(Derived.obj.val, 13, 'Extends constructor');
    strictEqual(instance.obj.val, 42, 'Extends prototype');
    strictEqual(Derived.fullName, 'test.Derived', 'Has correct name');
});

test('_super for static functions', function() {
    var derived1Setup = false,
        derived2Setup = false,
        derived1Foo = false,
        derived2Foo = false;

    var Derived1 = Construct.extend({
        setup: function() {
            derived1Setup = true;
        },
        foo: function() {
            derived1Foo = true;
        }
    }, {});

    var Derived2 = Derived1.extend({
        setup: function() {
            this._super();
            derived2Setup = true;
        },
        foo: function() {
            derived2Foo = true;
        }
    }, {});

    new Derived2();
    Derived2.foo();

    strictEqual(derived1Setup, true, 'Derived1 setup called via _super');
    strictEqual(derived2Setup, true, 'Derived2 setup called directly');
    strictEqual(derived1Foo, false, 'Derived1 foo override');
    strictEqual(derived2Foo, true, 'Derived2 foo override');
});

test('_super for instance functions', function() {
    var derived1Setup = false,
        derived2Setup = false,
        derived1Foo = false,
        derived2Foo = false;

    var Derived1 = Construct.extend({
        init: function() {
            derived1Setup = true;
        },
        foo: function() {
            derived1Foo = true;
        }
    });

    var Derived2 = Derived1.extend({
        init: function() {
            this._super();
            derived2Setup = true;
        },
        foo: function() {
            derived2Foo = true;
        }
    });

    var inst = new Derived2();
    inst.foo();

    strictEqual(derived1Setup, true, 'Derived1 setup called via _super');
    strictEqual(derived2Setup, true, 'Derived2 setup called directly');
    strictEqual(derived1Foo, false, 'Derived1 foo override');
    strictEqual(derived2Foo, true, 'Derived2 foo override');
});

test('Inherit instance properties', function() {

    var Derived1 = Construct.extend({
        properties: {
            x: { get: function() { return this._x; },
                 set: function(val) { this._x = val } }
        },
        _x: 10
    });

    var d1 = new Derived1();
    d1.x = 42;

    strictEqual(d1._x, 42, 'Property sets private');


    var Derived2 = Derived1.extend({
        y: 10
    });

    var d2 = new Derived2();
    d2.x = 42;
    strictEqual(d2._x, 42, 'Property carries to Derived2');

});

test('Inherit static properties', function() {
    var Derived1 = Construct.extend({
        properties: {
            x: { get: function() { return this._x; },
                set: function(val) { this._x = val } }
        },
        _x: 10
    },{});


    Derived1.x = 42;
    strictEqual(Derived1._x, 42, 'Property sets private');

    var Derived2 = Derived1.extend({
        y: 10
    });

    Derived2.x = 42;
    strictEqual(Derived2._x, 42, 'Property carries to Derived2');
});

test('Construct provides a create function', function() {
    var Derived1 = Construct.extend({
        init: function() {
            this.args = Array.prototype.slice.call(arguments);
        }
    });

    var Derived2 = Derived1.extend({});
    var derived1 = Derived1.create('foo', 13),
        derived2 = Derived2.create('bar', 23);

    ok(derived1 instanceof Derived1, 'derived1 instanceof Derived1');
    ok(derived2 instanceof Derived2, 'derived2 instanceof Derived2');
    strictEqual(derived1.args[0], 'foo', 'Derived1.create passes arguments to new Derived1');
    strictEqual(derived1.args[1], 13, 'Derived1.create passes arguments to new Derived1');
    strictEqual(derived2.args[0], 'bar', 'Derived2.create passes arguments to new Derived2');
    strictEqual(derived2.args[1], 23, 'Derived2.create passes arguments to new Derived2');
});

test('Construct provides a destroy function', function() {
    var Derived1 = Construct.extend({});

    var Derived2 = Derived1.extend({
        destroy: function() {
            this.x = 0;
        }
    });

    var derived1 = Derived1.create('foo', 13),
        derived2 = Derived2.create('bar', 23);

    ok(cog.isFunction(derived1.destroy), 'derived1 has a destroy function');
    ok(cog.isFunction(derived2.destroy), 'derived2 has a destroy function');

    derived2.destroy();
    strictEqual(derived2.x, 0, 'derived2.destroy called override function');
});

test('Construct dirtyable properties not shared between instances', function() {
    var Derived = Construct.extend({
        dirtyOnChange:true
    },{
        defaults: {
            x: 0
        }
    });

    var d1 = new Derived(),
        d2 = new Derived();

    d1.x = 22;

    strictEqual(d1.x, 22, 'D1 property has changed');
    strictEqual(d2.x, 0, 'D2 property has not changed');

});