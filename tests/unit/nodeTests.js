define([
    'cog'
], function(cog) {

    var eventManager = new cog.EventManager();

    module('Node tests', {});


    test('destroy - removes node from parent', function() {

        var node1 = new cog.Node(eventManager),
            node2 = new cog.Node(eventManager);

        node1.addChild(node2);

        strictEqual(node1.children[0], node2, 'Has child');

        node2.destroy();

        strictEqual(node1.children[0], undefined, 'Has no child');
    });



});