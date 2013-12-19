define([
    'cog'
], function(cog) {

    module('Event Tests', {});

    test('Register/Emit/Unregister Event', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var context = {},
            callbackArgs = [],
            callbackContext = null,
            callbackCount = 0;

        function callback() {
            callbackArgs = arguments;
            callbackContext = this;
            callbackCount++;
        }

        events.register('testEvent', context, callback);
        events.emit('testEvent', 1, 2, 3);

        strictEqual(callbackArgs[0], 1, 'Arg0 is correct');
        strictEqual(callbackArgs[1], 2, 'Arg1 is correct');
        strictEqual(callbackArgs[2], 3, 'Arg2 is correct');
        strictEqual(callbackContext, context, 'After register: Callback context is correct');
        strictEqual(callbackCount, 1, 'After register: Callback count correct');

        events.unregister('testEvent', context);
        events.emit('testEvent', 2, 3, 4);
        strictEqual(callbackCount, 1, 'After unregister: Callback count correct');
    });

    test('Register/Emit/Unregister Multiple Callbacks', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var context1 = {},
            context2 = {},
            callbackArgs = [],
            callbackContext = null,
            callbackCount = 0;

        function callback() {
            callbackArgs = arguments;
            callbackContext = this;
            callbackCount++;
        }

        events.register('testEvent', context1, callback);
        events.register('testEvent', context1, callback);
        events.register('testEvent', context2, callback);
        events.register('testEvent', context2, callback);

        events.emit('testEvent', 1, 2, 3);
        strictEqual(callbackCount, 4, 'After register: Callback count correct');

        events.unregister('testEvent', context1);
        events.emit('testEvent', 2, 3, 4);
        strictEqual(callbackCount, 6, 'After unregister: Callback count correct');
    });

    test('Register event ', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var ret1 = events.register('testEvent', 1, function(){}),
            ret2 = events.register('testEvent', {}, 'foo');

        strictEqual(ret1, events, 'Did not throw error on invalid context');
        strictEqual(ret2, events, 'Did not throw error on invalid callback');

        events.emit('testEvent');
        ok(true, 'Did not throw error on emit');

    });

    test('Unregister Context', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var context1 = {},
            context2 = {},
            callbackArgs = [],
            callbackContext = null,
            callbackCount = 0;

        function callback() {
            callbackArgs = arguments;
            callbackContext = this;
            callbackCount++;
        }

        events.register('testEvent1', context1, callback);
        events.register('testEvent2', context1, callback);
        events.register('testEvent3', context1, callback);
        events.register('testEvent3', context2, callback);

        events.emit('testEvent1', 1, 2, 3);
        strictEqual(callbackCount, 1, 'After register: Callback count correct');

        events.unregisterContext(context1);
        events.emit('testEvent1', 2, 3, 4);
        strictEqual(callbackCount, 1, 'After unregister: Callback count correct');

        events.emit('testEvent3', 2, 3, 4);
        strictEqual(callbackCount, 2, 'After unregister: Callback count correct');
    });

    test('Unregister Event', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var context1 = {},
            callbackArgs = [],
            callbackContext = null,
            callbackCount = 0;

        function callback() {
            callbackArgs = arguments;
            callbackContext = this;
            callbackCount++;
        }

        events.register('testEvent1', context1, callback);
        events.register('testEvent2', context1, callback);
        events.register('testEvent3', context1, callback);

        events.emit('testEvent1', 1, 2, 3);
        events.emit('testEvent2', 1, 2, 3);
        events.emit('testEvent3', 1, 2, 3);
        strictEqual(callbackCount, 3, 'After register: Callback count correct');

        events.unregisterEvent('testEvent2');

        events.emit('testEvent1', 2, 3, 4);
        events.emit('testEvent2', 1, 2, 3);
        events.emit('testEvent3', 2, 3, 4);
        strictEqual(callbackCount, 5, 'After unregister: Callback count correct');
    });

    test('Unregister All', function() {

        var dir = cog.createDirector(),
            events = dir.events;

        var context1 = {},
            context2 = {},
            callbackArgs = [],
            callbackContext = null,
            callbackCount = 0;

        function callback() {
            callbackArgs = arguments;
            callbackContext = this;
            callbackCount++;
        }

        events.register('testEvent1', context1, callback);
        events.register('testEvent2', context1, callback);
        events.register('testEvent3', context1, callback);
        events.register('testEvent3', context2, callback);

        events.emit('testEvent1', 1, 2, 3);
        events.emit('testEvent2', 1, 2, 3);
        events.emit('testEvent3', 1, 2, 3);
        strictEqual(callbackCount, 4, 'After register: Callback count correct');

        events.unregisterAll();
        events.emit('testEvent1', 1, 2, 3);
        events.emit('testEvent2', 1, 2, 3);
        events.emit('testEvent3', 1, 2, 3);
        strictEqual(callbackCount, 4, 'After unregister: Callback count correct');
    });

});