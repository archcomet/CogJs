define([
    './core'

], function(cog) {
    'use strict';

    var Category = cog.Construct.extend('cog.Category', {
        size: 64,

        mask: function(categories) {

            var category, mask = new Category(), i = 0, n = categories.length;
            for(; i < n; ++i) {
                category = categories[i];
                if (!(category instanceof Category)) {
                    category = category.category;
                }
                mask.addBits(category);
            }
            return mask;
        }

    },{
        init: function(bit) {
            this.bits = new Int32Array(Math.ceil(Category.size / 32));
            if (cog.isNumber(bit)) {
                this.bit = bit;
                this.bits[Math.floor(bit / 32)] = 1 << (bit % 32);
            }
        },

        addBits: function(category) {
            var i = 0, n = this.bits.length;
            for (; i < n; ++i) {
                this.bits[i] |= category.bits[i];
            }
        },

        removeBits: function(category) {
            var i = 0, n = this.bits.length;
            for (; i < n; ++i) {
                this.bits[i] &= ~(category.bits[i]);
            }
        },

        hasBits: function(category) {
            var ret, i = 0, n = this.bits.length;
            for (; i < n; ++i) {
                ret = (this.bits[i] & category.bits[i]) === category.bits[i];
                if (!ret) {
                    break;
                }
            }
            return ret;
        }
    });

    cog.extend({
        Category: Category
    });

    return Category;
});