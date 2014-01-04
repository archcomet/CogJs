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
});