define([
    './core'
], function(cog) {
    'use strict';

    /**
     * Node
     *
     * @class
     * @memberof cog
     * @augments cog.Construct
     *
     * @constructor
     */

    var Node = cog.Construct.extend('cog.Node', {

        _parent: null,

        _children: null,

        properties: {

            /**
             * @member parent
             * @summary Gets the the Node's parent.
             *
             * @readonly
             * @instance
             * @memberof cog.Node
             *
             * @type {cog.Node}
             */

            parent: { get: function() { return this._parent; } },

            /**
             * Gets an array of the Node's children.
             *
             * @readonly
             * @instance
             * @memberof cog.Node
             *
             * @type {cog.Node[]}
             */

            children: { get: function() { return this._children.slice(0); } }

        },

        /**
         * Initializes the node
         *
         * @instance
         * @method
         * @memberof cog.Node
         *
         */

        init: function() {
            this._parent = null;
            this._children = [];
        },

        /**
         * Destroys the node node
         *
         * @instance
         * @method
         * @memberof cog.Node
         *
         */

        destroy: function() {
            this.removeAllChildren();
            if (this._parent) {
                this._parent.removeChild(this);
            }
            this._children = undefined;
        },

        /**
         * Adds a child to the node.
         *
         * @instance
         * @method
         * @memberof cog.Node
         *
         * @param {cog.Node} node - The node to be added
         * @returns {this}
         */

        addChild: function(node) {
            if (node.parent) {
                node.parent.removeChild(node);
            }

            node._parent = this;
            this._children.push(node);
            this._manager.director.events.emit('node addChild', this, node);
            return this;
        },

        /**
         * Removes a child from the node.
         *
         * @instance
         * @method
         * @memberof cog.Node
         *
         * @param {cog.Node} node - The node to be removed
         * @returns {this}
         */

        removeChild: function(node) {
            var index;
            if (node.parent === this) {
                node._parent = null;
                index = this._children.indexOf(node);
                if (index > -1) {
                    this._children.splice(index, 1);
                    this._manager.director.events.emit('node removeChild', this, node);
                }
            }
            return this;
        },

        /**
         * Removes all children.
         *
         * @instance
         * @method
         * @memberof cog.Node
         *
         * @returns {this}
         */

        removeAllChildren: function() {
            var children = this._children,
                n = children.length - 1;
            for (; n >= 0; --n) {
                this.removeChild(children[n]);
            }
            return this;
        }
    });

    cog.Node = Node;

    return Node;

});