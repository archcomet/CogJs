CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

### Static Functions

cog.createDirector() -> {director}

cog.extend(target, source1, source2, ...) -> {target}

cog.defaults(target, source1, source2, ...) -> {target}


Util
------

### Static Functions

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

director.init(config)

director.destroy()

### Instance Methods - Managers

director.config -> {config}

director.entities -> {entityManager}

director.systems -> {systemManager}

director.events -> {eventManager}

director.valid -> {boolean}

### Instance Methods - Timers

director.start()

director.stop()

director.step(timestamp)

director.update(dt)

director.preUpdate(callback)

director.postUpdate(callback)


EntityManager
---------------

### Memory

EntityManager.create(director) -> {entityManager}

entityManager.init(director)

entityManager.destroy()

### Instance Methods - Add Entity

entityManager.add(tag) -> {entity}

### Instance Methods - Get Entities

entityManager.all() -> [entity array]

entityManager.withTag(tag) -> [entity array]

entityManager.withComponents(Component1, Component2, ...) -> [entity array]

### Instance Methods - Remove Entities

entityManager.remove(entity)

entityManager.removeAll()

entityManager.removeWithTag(tag)

entityManager.removeWithComponents(Component1, Component2, ...)