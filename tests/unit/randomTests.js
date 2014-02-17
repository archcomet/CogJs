define([
    'cog'
], function(cog) {

    module('Random (PRNG) Tests', {});

    // ========================================================
    // Seed manipulation tests

    test('Can seed and generate deterministic output', function() {
        cog.rand.seed(42424242);
        var r1 = cog.rand.arc4rand255(),
            r2 = cog.rand.arc4rand255(),
            r3 = cog.rand.arc4rand255();

        strictEqual(r1, 44, 'expected output');
        strictEqual(r2, 228, 'expected output');
        strictEqual(r3, 130, 'expected output');

        cog.rand.seed(42424242);
        var r4 = cog.rand.arc4rand255(),
            r5 = cog.rand.arc4rand255(),
            r6 = cog.rand.arc4rand255();

        strictEqual(r4, 44, 'expected output');
        strictEqual(r5, 228, 'expected output');
        strictEqual(r6, 130, 'expected output');
    });

    test('Can set and read seed', function() {
        cog.rand.seed('helloSeed');
        var seed = cog.rand.seed();
        strictEqual(seed, 'helloSeed', 'Seed return same input');
    });

    test('Can seed with Math.rand()', function() {
        cog.rand.seed('reset');
        cog.rand.seedRand();
        var seed = cog.rand.seed();

        ok(cog.isNumber(seed), 'Math.random should set a number');
        ok(seed >= 0, 'seed is greater than or equal to 0');
        ok(seed < 1, 'seed is less than 1');
    });

    test('Can seed with Date.now()', function() {
        var before = Date.now();

        cog.rand.seed('reset');
        cog.rand.seedTime();

        var seed = cog.rand.seed();

        ok(cog.isNumber(seed), 'Date.now should return a number');
        ok(before <= seed, 'Seed should be above before');
    });

    // ========================================================
    // Trial tests

    test('Can generate random 255', function() {
        assertStats(testRandomFn('arc4rand255', 0, 256), 39.0625);
    });

    test('Can generate random double', function() {
        assertStats(testRandomFn('arc4rand', 0, 1), 10000);
    });

    test('Can generate random double below N', function() {
        assertStats(testRandomFn('arc4rand', 0, 10, 10), 1000);
    });

    test('Can generate random double between N & M', function() {
        assertStats(testRandomFn('arc4rand', 100, 200, 100, 200), 100);
    });

    test('Can generate random double', function() {
        assertStats(testRandomFn('arc4randInt', 0, 2), 5000);
    });

    test('Can generate random double', function() {
        assertStats(testRandomFn('arc4randInt', 0, 20, 19), 500);
    });

    test('Can generate random double', function() {
        assertStats(testRandomFn('arc4randInt', 10, 30, 10, 29), 500);
    });


    // Helper functions

    function assertStats(histogram, expectedMean) {
        var stats = _stats(histogram);
        strictEqual(stats.mean, expectedMean, 'Mean has expected value');
    }

    function testRandomFn(fnName, min, max, N, M) {
        var len = arguments.length, r, i, trials = 10000, inRange = true, histogram = {};
        for (i = 0; i < trials; ++i) {

            if (len === 4) {
                r = cog.rand[fnName](N);
            } else if (len === 5) {
                r = cog.rand[fnName](N, M);
            } else {
                r = cog.rand[fnName]();
            }

            if (!(r >=min && r < max)) {
                inRange = false;
                break;
            }
            var sample = Math.floor(r);
            histogram[sample] = (histogram[sample] || 0) + 1;
        }

        ok(inRange, 'All numbers in range');
        return histogram;
    }

    function _stats(histogram) {
        var key, std,
            count = 0,
            mean = 0,
            varience = 0;

        for (key in histogram) {
            if (histogram.hasOwnProperty(key)) {
                mean += histogram[key];
                count++;
            }
        }
        mean /= count;

        for (key in histogram) {
            if (histogram.hasOwnProperty(key)) {
                varience += Math.pow(histogram[key] - mean, 2);
            }
        }
        varience /= count;
        std = Math.sqrt(varience);

        return {
            count: count,
            mean: mean,
            varience: varience,
            std: std
        }
    }
});