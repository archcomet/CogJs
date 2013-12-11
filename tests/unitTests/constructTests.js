
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
    strictEqual(Derived.fullName(), null, 'Has no name');
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
    strictEqual(Derived.fullName(), 'test.Derived', 'Has correct name');
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
    strictEqual(Derived.fullName(), null, 'Has correct name');
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
    strictEqual(Derived.fullName(), 'test.Derived', 'Has correct name');
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

test('Inherit properties', function() {

    var Derived1 = Construct.extend({
        _x: 10
    });

    Object.defineProperty(Derived1.prototype, 'x', {
        get: function() {
            return this._x;
        },
        set: function(value) {
            this._x = value;
        }
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