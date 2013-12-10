(function() {
    'use strict';

    // --------------------------------------------
    // Components

    var Position = cog.Component.extend({
        defaults: {
            _x: 0,
            _y: 0,
            _rotation: 0,
            _scale: 1,
            _dirty: false
        }
    });

    Object.defineProperty(Position.prototype, 'x', {
        get: function() {
            return this._x;
        },
        set: function(value) {
            this._x = value;
            this._dirty = true;
        }
    });

    Object.defineProperty(Position.prototype, 'y', {
        get: function() {
            return this._y;
        },
        set: function(value) {
            this._y = value;
            this._dirty = true;
        }
    });

    Object.defineProperty(Position.prototype, 'rotation', {
        get: function() {
            return this._rotation;
        },
        set: function(value) {
            this._rotation = value;
            this._dirty = true;
        }
    });

    Object.defineProperty(Position.prototype, 'scale', {
        get: function() {
            return this._scale;
        },
        set: function(value) {
            this._scale = value;
            this._dirty = true;
        }
    });

    Object.defineProperty(Position.prototype, 'dirty', {
        get: function() {
            return this._dirty;
        }
    });

    var CircleShape = cog.Component.extend({
        defaults: {
            radius: 10
        }
    });

    var RectShape = cog.Component.extend({
       defaults: {
           width: 100,
           height: 30
       }
    });

    var DrawStyle = cog.Component.extend({
        defaults: {
            fillColor: '#FFFFFF',
            strokeColor: '#000000',
            lineJoin: 'mitter',
            thickness: 1
        }
    });

    // --------------------------------------------
    // Factories

    var BallFactory = cog.Factory.extend({
        entityTag: 'ball',
        components: {
            position: {
                constructor: Position
            },
            circleShape: {
                constructor: CircleShape
            },
            drawStyle: {
                constructor: DrawStyle,
                defaults: {
                    fillColor: '#BB0000'
                }
            }
        }
    });

    var BlockFactory = cog.Factory.extend({
        entityTag: 'block',
        components: {
            position: {
                constructor: Position
            },
            circleShape: {
                constructor: RectShape
            },
            drawStyle: {
                constructor: DrawStyle,
                defaults: {
                    fillColor: '#0000BB'
                }
            }
        }
    });

}());