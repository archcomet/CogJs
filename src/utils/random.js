define([
    '../core'
], function(cog) {

    /**
     * Seed-able random number generator based on ARC4
     * @namespace rand
     * @memberof cog
     */

    var rand = (function() {

        var lastSeed,
            width = 256, // Size of RC4 output
            chunks = 6, // Number of RC4 outputs for each double
            digits = 52, // Significant digits in a double
            S = new Array(width), // Entropy pool
            key = [], // Key array
            denominator = Math.pow(width, chunks),
            significance = Math.pow(2, digits),
            overflow = significance * 2,
            mask = width - 1;

        /**
         * Key mixing
         * Converts seed to an array of integers with a max length 256
         * @param seed
         */

        function _mixKey(seed) {
            var smear, i = 0, seedString = seed + '';
            key.length = 0;
            for (; i < seedString.length; ++i) {
                key[mask & i] =  mask & ((smear ^= key[mask & i] * 19) + seedString.charCodeAt(i))
            }
        }

        /**
         * Key scheduling
         * Initializes permutations in the entropy pool
         */

        function _scheduleKey() {
            var swap, i, j = 0, keyLength = key.length;
            for (i = 0; i < width; ++i) {
                S[i] = i;
            }

            for (i = 0; i < width; ++i) {
                j = (j + S[i] + key[i % keyLength]) % width;
                swap = S[i];
                S[i] = S[j];
                S[j] = swap;
            }
        }

        /**
         * generator
         * @type {{i: number, j: number, out: out}}
         * @private
         */

        var _gen = {
            i: 0, j: 0,
            out: function(count) {
                var i = this.i,
                    j = this.j,
                    swap, K = 0;
                while(count--) {
                    swap = S[i = (i + 1) % mask];
                    K = K * width + S[mask & ((S[i] = S[j = mask & (j + swap)]) + (S[j] = swap))];
                }
                this.i = i;
                this.j = j;
                return K;
            }
        };

        /**
         * Generate a random double between 0 and 1;
         * @returns {number}
         * @private
         */

        function _randDouble() {
            var n = _gen.out(chunks),
                d = denominator,
                x = 0;

            while (n < significance) {
                n = (n + x) * width;
                d *= width;
                x = _gen.out(1);
            }

            while (n >= overflow) {
                n /= 2;
                d /= 2;
                x >>>= 1;
            }

            return (n + x) / d;
        }

        /**
         * Gets/Sets seed
         *
         * seed(*) sets a seed
         * seed() gets the last seed
         *
         * Input can be a strings or a number.
         *
         * @memberof cog.rand
         *
         * @param {string|number} [seed] - An object to seed the RNG.
         * @return {string|number} - The current seed.
         */

        function seed(seed) {
            if (arguments.length > 0) {
                _mixKey(seed);
                _scheduleKey();
                _gen.i = 0;
                _gen.j = 0;
                lastSeed = seed;
                return seed;
            }
            return lastSeed;
        }

        /**
         * Seeds generator with output from Math.random()
         *
         * @memberof cog.rand
         * @return {string|number} - The current seed.
         */

        function seedRand() {
            return seed(Math.random());
        }

        /**
         * Seeds generator with output from Date.now()
         * Default seed is initialized with this.
         *
         * @memberof cog.rand
         * @return {string|number} - The current seed.
         */

        function seedTime() {
            return seed(Date.now());
        }

        /**
         * Generates a random integer between 0 and 255
         *
         * Gets the next byte of the output stream.
         * Not as 'random', but is about 5 times faster
         *
         * arc4rand255()    output is 0<= x < 256
         *
         * @memberof cog.rand
         *
         * @returns {number} - A random integer between 0 and 255
         */

        function arc4rand255() {
            return _gen.out(1);
        }

        /**
         * Generates a random double
         *
         * arc4rand()       output is 0 <= x < 1
         * arc4rand(N)      output is 0 <= x < N
         * arc4rand(N, M)   output is N <= x < M
         *
         * @memberof cog.rand
         *
         * @param {number} [N] - The max value if N is the sole argument or the min value if N and M are passed.
         * @param {number} [M] - The max value.
         * @return {number}  - A random double.
         */

        function arc4rand(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return r;
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return r * (M - N) + N;
        }

        /**
         * Generates a random integer
         *
         * arc4randInt()        output is 0 <= x <= 1
         * arc4randInt(N)       output is 0 <= x <= N
         * arc4randInt(N, M)    output is N <= x <= M
         *
         * @memberof cog.rand
         *
         * @param {number} [N] - The max value if N is the sole argument or the min value if N and M are passed.
         * @param {number} [M] - The max value.
         * @return {number} - A random integer.
         */

        function arc4randInt(N, M) {
            var r = _randDouble(),
                argLen = arguments.length;

            if (argLen === 0) {
                return Math.floor(r * 2);
            } else if (argLen === 1) {
                M = N;
                N = 0;
            }

            return Math.floor(r * (M - N + 1)) + N;
        }

        // Initialize seed with time
        seedTime();

        return {
            seed: seed,
            seedRand: seedRand,
            seedTime: seedTime,
            arc4rand: arc4rand,
            arc4randInt: arc4randInt,
            arc4rand255: arc4rand255
        };
    }());

    cog.extend({
        rand: rand
    });

    return rand;

});