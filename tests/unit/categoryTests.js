define([
    'cog'
], function(cog){

    var Category = cog.Category;

    module('Category tests', {});

    test('Can create category', function() {

        _test(new Category(), 0, 0, 'InitDefault');
        _test(new Category(16), 65536, 0, 'Init16');
        _test(new Category(31), -2147483648, 0, 'Init31');
        _test(new Category(42), 0, 1024, 'Init42');
        _test(new Category(63), 0, -2147483648, 'Init63');
    });

    test('Can add/remove/test category', function() {
        var mask,
            // set 1
            a = new Category(0),
            b = new Category(1),
            c = new Category(2),
            d = new Category(31),
            // set 2
            e = new Category(32),
            f = new Category(42),
            g = new Category(50),
            h = new Category(63);

        mask = _testAddRemoveHas(a, b, 1, 0, 3, 0, 'a+b');
        mask = _testAddRemoveHas(mask, c, 3, 0, 7, 0, 'mask+c');
        mask = _testAddRemoveHas(mask, d, 7, 0, -2147483641, 0, 'mask+d');

        ok(mask.hasBits(a), 'Mask has a');
        ok(mask.hasBits(b), 'Mask has b');
        ok(mask.hasBits(c), 'Mask has c');
        ok(mask.hasBits(d), 'Mask has d');

        mask = _testAddRemoveHas(mask, e, -2147483641, 0, -2147483641, 1, 'mask+e');
        mask = _testAddRemoveHas(mask, f, -2147483641, 1, -2147483641, 1025, 'mask+f');
        mask = _testAddRemoveHas(mask, g, -2147483641, 1025, -2147483641, 263169, 'mask+g');
        mask = _testAddRemoveHas(mask, h, -2147483641, 263169, -2147483641, -2147220479, 'mask+h');

        ok(mask.hasBits(e), 'Mask has a');
        ok(mask.hasBits(f), 'Mask has b');
        ok(mask.hasBits(g), 'Mask has c');
        ok(mask.hasBits(h), 'Mask has d');
    });

    test('Initialize standard array', function() {

        var bu_Int32Array = window.Int32Array;

        window.Int32Array = window.Array;

        _test(new Category(), 0, 0, 'InitDefault');

        window.Int32Array = bu_Int32Array;
    });

    function _test(category, expectedBitsSet0, expectedBitsSet1, name) {
        strictEqual(category.bits.length, 2, name + ': has expected set length');
        strictEqual(category.bits[0], expectedBitsSet0, name + ': set 0 at ' + expectedBitsSet0);
        strictEqual(category.bits[1], expectedBitsSet1, name + ': set 1 at ' + expectedBitsSet1);
    }

    function _testAddRemoveHas(category1, category2, set0Before, set1Before, set0After, set1After, name) {
        _test(category1, set0Before, set1Before, name + ' before');
        category1.addBits(category2);

        _test(category1, set0After, set1After, name + ' after add');
        ok(category1.hasBits(category2), name + ' has bits after add');
        category1.removeBits(category2);

        _test(category1, set0Before, set1Before, name + ' after remove');
        ok(!category1.hasBits(category2), name + ' does not have bits after remove');

        var mask = Category.mask([category1, category2]);
        _test(mask, set0After, set1After, name + ' as mask');

        return mask;
    }

});