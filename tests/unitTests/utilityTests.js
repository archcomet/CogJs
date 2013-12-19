define([
    'cog'
], function(cog) {

    module('Utility Tests', {});

    var types = {
        Array: [],
        Boolean: true,
        Date: new Date(),
        Function: function() {},
        Number: 42,
        Object: {},
        RegExp: new RegExp(),
        String: "Hello"
    };

    function testFn(fnName, expected) {
        var fnTest = cog[fnName];
        for(var key in types) {
            if (types.hasOwnProperty(key)) {
                strictEqual(fnTest(types[key]), expected[key], fnName + ' ' + key + ' is ' + expected[key]);
            }
        }
    }

    test('type - null/undefined', function() {
        strictEqual(cog.type(null), 'null', 'Returns null');
        strictEqual(cog.type(undefined), 'undefined', 'Returns undefined');
        strictEqual(cog.type({}), 'object', 'Returns object');
    });

    test('Test isArray', function() {
        testFn('isArray', {
            Array: true,
            Boolean: false,
            Date: false,
            Function: false,
            Number: false,
            Object: false,
            RegExp: false,
            String: false
        });
    });

    test('Test isBoolean', function() {
        testFn('isBoolean', {
            Array: false,
            Boolean: true,
            Date: false,
            Function: false,
            Number: false,
            Object: false,
            RegExp: false,
            String: false
        });
    });

    test('Test isDate', function() {
        testFn('isDate', {
            Array: false,
            Boolean: false,
            Date: true,
            Function: false,
            Number: false,
            Object: false,
            RegExp: false,
            String: false
        });
    });

    test('Test isFunction', function() {
        testFn('isFunction', {
            Array: false,
            Boolean: false,
            Date: false,
            Function: true,
            Number: false,
            Object: false,
            RegExp: false,
            String: false
        })
    });

    test('Test isNumber', function() {
        testFn('isNumber', {
            Array: false,
            Boolean: false,
            Date: false,
            Function: false,
            Number: true,
            Object: false,
            RegExp: false,
            String: false
        });
    });

    test('Test isObject', function() {
        testFn('isObject', {
            Array: true,
            Boolean: false,
            Date: true,
            Function: true,
            Number: false,
            Object: true,
            RegExp: true,
            String: false
        });
    });

    test('Test isString', function() {
        testFn('isString', {
            Array: false,
            Boolean: false,
            Date: false,
            Function: false,
            Number: false,
            Object: false,
            RegExp: false,
            String: true
        });
    });

    test('Test isPlainObject', function() {
        testFn('isPlainObject', {
            Array: false,
            Boolean: false,
            Date: false,
            Function: false,
            Number: false,
            Object: true,
            RegExp: false,
            String: false
        });
        strictEqual(cog.isPlainObject(window), false, 'isPlainObject window is false');
        strictEqual(cog.isPlainObject(document.createElement('div')), false, 'isPlainObject element is false');
    });

    test('Test isPlainObject - error', function() {
        var obj = { constructor: {} };
        strictEqual(cog.isPlainObject(obj), false, 'Override on constructor may return false');
    });

    test('Test isRegExp', function() {
        testFn('isRegExp', {
            Array: false,
            Boolean: false,
            Date: false,
            Function: false,
            Number: false,
            Object: false,
            RegExp: true,
            String: false
        });
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
});