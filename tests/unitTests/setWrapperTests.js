define([
    'cog'
], function(cog) {

    var SetWrapper = cog.SetWrapper;

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

    module('SetWrapper Tests', {});

    test('Create', function() {
        var testSet = new SetWrapper();

        ok(testSet instanceof SetWrapper, 'Returns instance');
        strictEqual(testSet.count(), 0, 'Empty by default');

        assertFunctions(testSet, 'set', 'remove', 'removeKey', 'removeAll', 'extend');
    });

    test('Create with Object', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);
        delete source.cat;
        delete source.dog;
        delete source.fish;

        strictEqual(testSet.count(), 3, 'Has expected length');
        strictEqual(testSet.get('cat'), 'meow', 'Correct value for cat');
        strictEqual(testSet.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(testSet.get('fish'), 'bloop', 'Correct value for fish');

        assertFunctions(testSet, 'set', 'remove', 'removeKey', 'removeAll', 'extend');
    });

    test('Create with SetWrapper', function() {
        var source = new SetWrapper({ cat: 'meow', dog: 'bark', fish: 'bloop'});
        var testSet = new SetWrapper(source);
        source.removeAll();

        strictEqual(testSet.count(), 3, 'Has expected length');
        strictEqual(testSet.get('cat'), 'meow', 'Correct value for cat');
        strictEqual(testSet.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(testSet.get('fish'), 'bloop', 'Correct value for fish');

        assertFunctions(testSet, 'set', 'remove', 'removeKey', 'removeAll', 'extend');
    });

    test('Create read only', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source, true);
        delete source.cat;
        delete source.dog;
        delete source.fish;

        strictEqual(testSet.count(), 3, 'Has expected length');
        strictEqual(testSet.get('cat'), 'meow', 'Correct value for cat');
        strictEqual(testSet.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(testSet.get('fish'), 'bloop', 'Correct value for fish');

        assertNotFunctions(testSet, 'set', 'remove', 'removeKey', 'removeAll', 'extend');
    });

    test('Set', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var ret = testSet.set('bird', 'chirp');

        strictEqual(ret, testSet, 'Add chains');
        strictEqual(testSet.count(), 4, 'Length increased');
        strictEqual(testSet.get('bird'), 'chirp', 'Can get value');
    });

    test('Remove', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var ret = testSet.remove(source.dog);

        strictEqual(ret, testSet, 'Add chains');
        strictEqual(testSet.count(), 2, 'Length increased');
        strictEqual(testSet.get('dog'), undefined, 'Key and value removed');
    });

    test('Remove - no op', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var ret = testSet.remove('not valid');
        strictEqual(ret, testSet, 'Remove chains chains');
        strictEqual(testSet.count(), 3, 'Length increased');
    });

    test('RemoveKey', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var ret = testSet.removeKey('dog');

        strictEqual(ret, testSet, 'Add chains');
        strictEqual(testSet.count(), 2, 'Length increased');
        strictEqual(testSet.get('dog'), undefined, 'Key and value removed');
    });

    test('RemoveAll', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var ret = testSet.removeAll();

        strictEqual(ret, testSet, 'RemoveAll chains');

        strictEqual(testSet.count(), 0, 'Count decreases');
        strictEqual(testSet.get('cat'), undefined, 'Correct value for cat');
        strictEqual(testSet.get('dog'), undefined, 'Correct value for dog');
        strictEqual(testSet.get('fish'), undefined, 'Correct value for fish');
    });

    test('Extend', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var extend1 = { cat: 'purr', bird: 'chirp' };
        var extend2 = { cat: 'roar', snake: 'hiss' };

        var ret = testSet.extend(extend1, extend2);

        strictEqual(ret, testSet, 'Extend chains');

        strictEqual(testSet.count(), 5, 'Count increases');
        strictEqual(testSet.get('cat'), 'roar', 'Correct value for cat');
        strictEqual(testSet.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(testSet.get('fish'), 'bloop', 'Correct value for fish');
        strictEqual(testSet.get('bird'), 'chirp', 'Correct value for bird');
        strictEqual(testSet.get('snake'), 'hiss', 'Correct value for hiss');
    });

    test('Serialize', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var output = testSet.serialize();

        ok(cog.isObject(output), 'Output is an object');
        notStrictEqual(source, output, 'Output does not reference source');

        strictEqual(output.cat, source.cat, 'Correct value for cat');
        strictEqual(output.dog, source.dog, 'Correct value for dog');
        strictEqual(output.fish, source.fish, 'Correct value for fish');

        output.bird = 'chirp';

        strictEqual(testSet.count(), 3, 'Modifying output does not change set');
        strictEqual(testSet.get('bird'), undefined, 'Modifying output does not change set');
    });

    test('Clone', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var output = testSet.clone();

        ok(output instanceof SetWrapper, 'Output is a SetWrapper');
        notStrictEqual(testSet, output, 'Not the same instance');

        assertFunctions(output, 'set', 'remove', 'removeKey', 'removeAll', 'extend');

        strictEqual(output.get('cat'), testSet.get('cat'), 'Correct value for cat');
        strictEqual(output.get('dog'), testSet.get('dog'), 'Correct value for dog');
        strictEqual(output.get('fish'), testSet.get('fish'), 'Correct value for fish');

        output.removeAll();

        strictEqual(testSet.count(), 3, 'Has expected length');
        strictEqual(testSet.get('cat'), 'meow', 'Correct value for cat');
        strictEqual(testSet.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(testSet.get('fish'), 'bloop', 'Correct value for fish');
    });

    test('ReadOnly', function() {
        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var output = testSet.readOnly();

        ok(output instanceof SetWrapper, 'Output is an SetWrapper');
        notStrictEqual(testSet, output, 'Not the same instance');

        assertNotFunctions(output, 'set', 'remove', 'removeKey', 'removeAll', 'extend');

        strictEqual(output.get('cat'), testSet.get('cat'), 'Correct value for cat');
        strictEqual(output.get('dog'), testSet.get('dog'), 'Correct value for dog');
        strictEqual(output.get('fish'), testSet.get('fish'), 'Correct value for fish');

        testSet.removeAll();

        strictEqual(output.count(), 3, 'Has expected length');
        strictEqual(output.get('cat'), 'meow', 'Correct value for cat');
        strictEqual(output.get('dog'), 'bark', 'Correct value for dog');
        strictEqual(output.get('fish'), 'bloop', 'Correct value for fish');
    });

    test('Each', function() {

        var source = { cat: 'meow', dog: 'bark', fish: 'bloop'};
        var testSet = new SetWrapper(source);

        var counter = 0;
        testSet.each(function(val) {
            counter++;
        });
        strictEqual(counter, 3, 'Has correct count');
    });

});