define([
    'cog'
], function(cog){

    var ArrayWrapper = cog.ArrayWrapper;

    function assertFunctions(obj) {
        var i = 1, n = arguments.length;
        for (; i<n; ++i) {
            var fn = arguments[i];
            ok(cog.isFunction(obj[fn]), fn + ' is a function');
        }
    }

    function assertNotFunctions(obj) {
        var i = 1, n = arguments.length;
        for (; i<n; ++i) {
            var fn = arguments[i];
            ok(!cog.isFunction(obj[fn]), fn + ' is not a function');
        }
    }

    module('ArrayWrapper Tests', {});

    test('Create', function() {
        var testArray = new ArrayWrapper();

        ok(testArray instanceof ArrayWrapper, 'Returns instance');
        strictEqual(testArray.length(), 0, 'Empty by default');

        assertFunctions(testArray, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');
    });

    test('Create with Array', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);
        source.length = 0;

        strictEqual(testArray.length(), 3, 'Has expected length');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 2, 'Correct value at index 1');
        strictEqual(testArray.get(2), 3, 'Correct value at index 2');

        assertFunctions(testArray, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');
    });

    test('Create with ArrayWrapper', function() {
        var source = new ArrayWrapper([1, 2, 3]);
        var testArray = new ArrayWrapper(source);
        source.removeAll();

        strictEqual(testArray.length(), 3, 'Has expected length');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 2, 'Correct value at index 1');
        strictEqual(testArray.get(2), 3, 'Correct value at index 2');

        assertFunctions(testArray, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');
    });

    test('Create with capacity', function() {
        var testArray = new ArrayWrapper(10);

        strictEqual(testArray.length(), 10, 'Has expected length');

        assertFunctions(testArray, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');
    });

    test('Create read only array', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source, true);
        source.length = 0;

        strictEqual(testArray.length(), 3, 'Has expected length');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 2, 'Correct value at index 1');
        strictEqual(testArray.get(2), 3, 'Correct value at index 2');

        assertNotFunctions(testArray, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');
    });

    test('Add', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.add(4);

        strictEqual(ret, testArray, 'Add chains');
        strictEqual(testArray.length(), 4, 'Length increased');
        strictEqual(testArray.get(3), 4, 'Can get value');
    });

    test('Insert', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.insert(5, 1);

        strictEqual(ret, testArray, 'Insert chains');

        strictEqual(testArray.length(), 4, 'Length increased');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 5, 'Correct value at index 1');
        strictEqual(testArray.get(2), 2, 'Correct value at index 2');
        strictEqual(testArray.get(3), 3, 'Correct value at index 3');
    });

    test('Remove', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.remove(2);

        strictEqual(ret, testArray, 'Remove chains');

        strictEqual(testArray.length(), 2, 'Length decreases');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 3, 'Correct value at index 1');
    });

    test('RemoveAtIndex', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.removeAtIndex(1);

        strictEqual(ret, testArray, 'RemoveAtIndex chains');

        strictEqual(testArray.length(), 2, 'Length decreases');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 3, 'Correct value at index 1');
    });

    test('RemoveAll', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.removeAll();

        strictEqual(ret, testArray, 'RemoveAll chains');

        strictEqual(testArray.length(), 0, 'Length decreases');
        strictEqual(testArray.get(0), undefined, 'Correct value at index 0');
        strictEqual(testArray.get(1), undefined, 'Correct value at index 1');
        strictEqual(testArray.get(2), undefined, 'Correct value at index 2');
    });

    test('RemoveLast', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var ret = testArray.removeLast();

        strictEqual(ret, testArray, 'RemoveLast chains');

        strictEqual(testArray.length(), 2, 'Length decreases');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 2, 'Correct value at index 1');
    });

    test('Serialize', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var output = testArray.serialize();

        ok(cog.isArray(output), 'Output is a native array');
        notStrictEqual(source, output, 'Output does not reference source');

        strictEqual(output[0], source[0], 'Correct value at index 0');
        strictEqual(output[1], source[1], 'Correct value at index 1');
        strictEqual(output[2], source[2], 'Correct value at index 2');

        output.push(4);

        strictEqual(testArray.length(), 3, 'Modifying output does not change length');
    });

    test('Clone', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var output = testArray.clone();

        ok(output instanceof ArrayWrapper, 'Output is an ArrayWrapper');
        notStrictEqual(testArray, output, 'Not the same instance');

        assertFunctions(output, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');

        strictEqual(output.get(0), testArray.get(0), 'Correct value at index 0');
        strictEqual(output.get(1), testArray.get(1), 'Correct value at index 1');
        strictEqual(output.get(2), testArray.get(2), 'Correct value at index 2');

        output.removeAll();


        strictEqual(testArray.length(), 3, 'Length stays the same');
        strictEqual(testArray.get(0), 1, 'Correct value at index 0');
        strictEqual(testArray.get(1), 2, 'Correct value at index 1');
        strictEqual(testArray.get(2), 3, 'Correct value at index 2');
    });

    test('ReadOnly', function() {
        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var output = testArray.readyOnly();

        ok(output instanceof ArrayWrapper, 'Output is an ArrayWrapper');
        notStrictEqual(testArray, output, 'Not the same instance');

        assertNotFunctions(output, 'add', 'insert', 'remove', 'removeAll', 'removeAtIndex', 'removeLast');

        strictEqual(output.get(0), testArray.get(0), 'Correct value at index 0');
        strictEqual(output.get(1), testArray.get(1), 'Correct value at index 1');
        strictEqual(output.get(2), testArray.get(2), 'Correct value at index 2');

        testArray.removeAll();

        strictEqual(output.length(), 3, 'Length stays the same');
        strictEqual(output.get(0), 1, 'Correct value at index 0');
        strictEqual(output.get(1), 2, 'Correct value at index 1');
        strictEqual(output.get(2), 3, 'Correct value at index 2');
    });

    test('Each', function() {

        var source = [1, 2, 3];
        var testArray = new ArrayWrapper(source);

        var counter = 1;

        testArray.each(function(val) {
            strictEqual(val, counter, 'Has correct value');
            counter++;
        });
    })

});