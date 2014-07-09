define([
    'cog'
], function(cog) {

    module('Core Tests');

    test('Safe api can be called with new', function() {
        var cog2 = new cog();
        ok(cog2 instanceof cog);
    });

    test('Extend - NoOp', function() {
        var emptyRet = cog.extend(),
            boolRet = cog.extend(true),
            strRet = cog.extend("FooBar");

        ok(cog.isObject(emptyRet), 'No parameters: Shallow copy returns an object');
        ok(cog.isObject(boolRet), 'Bool only: Deep copy returns an object');
        ok(cog.isObject(strRet) && !cog.isString(strRet), 'String only: Returns an object');
    });

    test('Extend - Shallow Copy', function() {
        var object1 = {
            apple: 0,
            banana: { weight: 52, price: 100 },
            cherry: 97
        };
        var object2 = {
            banana: { price: 200 },
            durian: 100
        };

        cog.extend(object1, object2);

        strictEqual(object1.apple, 0, 'apple is 0');
        strictEqual(object1.banana.price, 200, 'banana.price is 200');
        strictEqual(object1.banana.weight, undefined, 'banana.weight is undefined');
        strictEqual(object1.cherry, 97, 'cheery is 97');
        strictEqual(object1.durian, 100, 'durian is 97');
    });


    test('Extend - Deep Copy', function() {
        var object1 = {
            apple: 0,
            banana: { weight: 52, price: 100 },
            cherry: 97
        };
        var object2 = {
            banana: { price: 200 },
            durian: 100
        };

        cog.extend(true, object1, object2);

        strictEqual(object1.apple, 0, 'apple is 0');
        strictEqual(object1.banana.price, 200, 'banana.price is 200');
        strictEqual(object1.banana.weight, 52, 'banana.weight is 52');
        strictEqual(object1.cherry, 97, 'cheery is 97');
        strictEqual(object1.durian, 100, 'durian is 97');
    });

    test('Extend - Deep Copy Nesting', function() {
        var object1 = {};
        var object2 = {
            arr: [1, 2, {'foo':'bar'}]
        };

        cog.extend(true, object1, object2);

        ok(cog.isArray(object1.arr), 'Is an array');
        strictEqual(object1.arr[0], 1, 'Arr[0] is 1');
        strictEqual(object1.arr[1], 2, 'Arr[1] is 2');
        strictEqual(object1.arr[2].foo, 'bar', 'Arr[2].foo is bar');
        notStrictEqual(object1.arr, object2.arr, 'Arr is not a ref');
        notStrictEqual(object1.arr[2], object2.arr[2], 'Inner object is not a ref');
    });

    test('Extend - Deep Copy Self Recursion', function() {
        var object1 = {
        };

        object1.object2 = {
            object1: object1
        };

        var ret = cog.extend(true, object1, object1.object2);
        strictEqual(ret, object1, 'Did not loop for ever on self recursion.');
    });

    test('Defaults - merges object', function() {

        var target = { foo: 1, fizz: 1 },
            source1 = { foo: 2, bar: 2 },
            source2 = { obj: {}, bar: 3 };

        var ret = cog.defaults(target, source1, source2);

        strictEqual(ret, target, 'Return value is first argument');
        strictEqual(target.foo, 1, 'Foo was not overwritten');
        strictEqual(target.fizz, 1, 'Fizz was not overwritten');
        strictEqual(target.bar, 2, 'Bar was copied from source1');
        strictEqual(target.obj, source2.obj, 'Obj was copied from source2');
    });

    test('Defaults - merge objects deep copy', function() {

        var target = {
            foo: {
                red: 42,
                yellow: 5,
                blue: undefined
            },
            vector: [2,3],
            rotation: undefined
        };

        var defaults1 = {
            foo: {
                red: 0,
                yellow: 0,
                blue: 0,
                alpha: 1
            },
            bar: {
                hello: 'world'
            },
            vector: [0, 0],
            rotation: [3, 2]
        };

        var defaults2 = {
            foo: {},
            bar: {
                oneMoreThing: null
            },
            rotation: [5, 6, 1]
        };

        var fooRef = target.foo;
        var barRef1 = defaults1.bar;
        var barRef2 = defaults2.bar;
        var vectorRef = target.vector;
        var rotationRef = defaults1.rotation;

        var result = cog.defaults(true, target, defaults1, defaults2);

        strictEqual(result, target, 'Returns target object');

        strictEqual(result.foo, fooRef, 'Retained foo reference');
        strictEqual(result.foo.red, 42, 'has original value');
        strictEqual(result.foo.yellow, 5,'has original value');
        strictEqual(result.foo.blue, 0, 'has original value');
        strictEqual(result.foo.alpha, 1, 'has copied value');

        notStrictEqual(result.bar, barRef1, 'not ref from defaults1');
        notStrictEqual(result.bar, barRef2, 'not ref from defaults2');
        ok(cog.isPlainObject(result.bar), 'created a copy');
        strictEqual(result.bar.hello, 'world', 'copied value');
        strictEqual(result.bar.oneMoreThing, null, 'copied null value');

        strictEqual(result.vector, vectorRef, 'Retained vector ref');
        strictEqual(result.vector[0], 2, 'Retained vector value');
        strictEqual(result.vector[1], 3, 'Retained vector value');

        notStrictEqual(result.rotation, rotationRef, 'Did not ref defaults rotation');
        ok(cog.isArray(result.rotation), 'created new array');
        strictEqual(result.rotation[0], 3, 'copied rotation value 0');
        strictEqual(result.rotation[1], 2, 'copied rotation value 1');
        strictEqual(result.rotation[2], 1, 'copied rotation value 2');
    });

    test('Defaults - target is undefined', function() {

        var source = {
            hello: {
                world: true
            }
        };

        var result = cog.defaults(22, source);

        ok(cog.isPlainObject(result));
        notStrictEqual(result, source);
        strictEqual(result.hello, source.hello);
    });

    test('Defaults - prevents recursive copy', function() {

        var target = {};

        var source = {
            target: target
        };

        var result = cog.defaults(target, source);

        strictEqual(result.target, undefined);
    });
});