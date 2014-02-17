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
});