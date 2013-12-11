CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

### Static

cog.createDirector() -> {director}

cog.extend(target, source1, source2, ...) -> {target}

cog.defaults(target, source1, source2, ...) -> {target}


Util
------

### Static

cog.isArray() -> {boolean}

cog.isBoolean() -> {boolean}

cog.isDate() -> {boolean}

cog.isFunction() -> {boolean}

cog.isNumber() -> {boolean}

cog.isObject() -> {boolean}

cog.isPlainObject() -> {boolean}

cog.isRegExp() -> {boolean}

cog.isString() -> {boolean}


Director
----------

### Memory

cog.createDirector(config) -> {director}

director.destroy()

### Instance - Managers

director.config -> {config}

director.entities -> {entityManager}

director.systems -> {systemManager}

director.events -> {eventManager}

director.valid -> {boolean}

### Instance - Timers

director.start()

director.stop()

director.step(timestamp)

director.update(dt)

director.preUpdate(callback)

director.postUpdate(callback)

