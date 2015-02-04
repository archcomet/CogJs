define([
    'cog'
], function(cog) {

    module('Sequence Tests', {});

    asyncTest('Sequence Ordering Test', function() {

        var order = [];

        var TestSystem1 = createTestSystem('TestSystem1'),
            TestSystem2 = createTestSystem('TestSystem2'),
            TestMode1 = createTestMode('TestMode1', changeMode),
            TestMode2 = createTestMode('TestMode2', finishTest);

        var dir = cog.createDirector();
        dir.systems.add(TestSystem1);
        dir.systems.add(TestSystem2);

        dir.start(TestMode1);

        function changeMode() {
            dir.start(TestMode2);
        }

        function finishTest() {
            dir.destroy();

            var expectedOrder = [

                // Init / configure systems on systems.add
                "TestSystem1.init",
                "TestSystem1.configure",
                "TestSystem2.init",
                "TestSystem2.configure",

                // Init / configure mode on dir.start
                "TestMode1.init",
                "TestMode1.configure",
                "TestMode1.start",
                "TestSystem1.start",
                "TestSystem2.start",

                // Normal update step, mode 1
                "TestMode1.update",
                "TestSystem1.update",
                "TestSystem2.update",

                // Mode1 starts mode2, aborting the rest of the update,
                // stopping everything,
                // creating the new mode,
                // then starting everything again
                "TestMode1.update",
                "TestMode1.stop",
                "TestSystem1.stop",
                "TestSystem2.stop",
                "TestMode1.destroy",
                "TestMode2.init",
                "TestMode2.configure",
                "TestMode2.start",
                "TestSystem1.start",
                "TestSystem2.start",

                // Normal update step, mode 2
                "TestMode2.update",
                "TestSystem1.update",
                "TestSystem2.update",

                // Final update,
                // director is destroyed in mode2 update,
                // stop and destroy everything
                "TestMode2.update",
                "TestMode2.stop",
                "TestSystem1.stop",
                "TestSystem2.stop",
                "TestMode2.destroy",
                "TestSystem1.destroy",
                "TestSystem2.destroy"
            ];

            for (var i = 0, n = order.length; i < n; ++i) {
                strictEqual(order[i], expectedOrder[i], '[' + i + '] ' +  expectedOrder[i]);
            }

            start();
        }

        function createTestMode(name, callback) {
            return cog.Mode.extend({

                _updateCount: 0,

                init: function(director) {
                    this._super(director);
                    order.push(name+'.init');
                },

                destroy: function() {
                    this._super();
                    order.push(name+'.destroy');
                },

                configure: function(entityManager, eventManager, config) {
                    order.push(name+'.configure');
                },

                start: function(entityManager, eventManager, mode) {
                    order.push(name+'.start');
                },

                update: function(entityManager, eventManager, dt, mode) {
                    order.push(name+'.update');
                    this._updateCount++;
                    if (this._updateCount === 2) {
                        callback();
                    }
                },

                stop: function(entityManager, eventManager, mode) {
                    order.push(name+'.stop');
                }
            });
        }

        function createTestSystem(name) {
            return cog.System.extend(name, {
                init: function(manager) {
                    this._super(manager);
                    order.push(name + '.init');
                },

                destroy: function() {
                    order.push(name+'.destroy');
                },

                configure: function(entityManager, eventManager, config) {
                    order.push(name+'.configure');
                },

                start: function(entityManager, eventManager, mode) {
                    order.push(name+'.start');
                },

                update: function(entityManager, eventManager, dt, mode) {
                    order.push(name+'.update');
                },

                stop: function(entityManager, eventManager, mode) {
                    order.push(name+'.stop');
                }
            });
        }

    });


});