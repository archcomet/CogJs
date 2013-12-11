CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

#### Static Functions

cog.createDirector() -> {[director](https://github.com/archcomet/CogJs#director)}

cog.extend(target, source1, source2, ...) -> {target}

cog.defaults(target, source1, source2, ...) -> {target}


Utilities
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

cog.createDirector(config) -> {[director](https://github.com/archcomet/CogJs#director)}

director.init(config)

director.destroy()

### Instance Properties

director.config -> {config}

director.entities -> {entityManager}

director.systems -> {systemManager}

director.events -> {eventManager}

director.valid -> {boolean}

### Instance Methods

director.start()

director.stop()

director.step(timestamp)

director.update(dt)

director.preUpdate(callback)

director.postUpdate(callback)


EntityManager
---------------

### Memory

EntityManager.create([director](https://github.com/archcomet/CogJs#director)) -> {entityManager}

entityManager.init([director](https://github.com/archcomet/CogJs#director))

entityManager.destroy()

### Instance Properties

entityManager.director -> [director](https://github.com/archcomet/CogJs#director)

entityManager.valid

### Instance Methods

entityManager.add(tag) -> {entity}

entityManager.all() -> [entity array]

entityManager.withTag(tag) -> [entity array]

entityManager.withComponents(Component1, Component2, ...) -> [entity array]

entityManager.remove(entity)

entityManager.removeAll()

entityManager.removeWithTag(tag)

entityManager.removeWithComponents(Component1, Component2, ...)


SystemManager
--------------

### Memory

SystemManager.create([director](https://github.com/archcomet/CogJs#director)) -> {systemManager}

systemManager.init([director](https://github.com/archcomet/CogJs#director))

systemManager.destroy()

### Instance Properties

systemManager.director -> [director](https://github.com/archcomet/CogJs#director)

systemManager.valid

### Instance Methods

systemManager.add(System) -> {system}

systemManager.get(System) -> {system}

systemManager.remove(System)

systemManager.removeAll(System)

systemManager.update(dt)


EventManager
--------------

### Memory

EventManager.create([director](https://github.com/archcomet/CogJs#director)) -> {eventManager}

eventManager.init([director](https://github.com/archcomet/CogJs#director))

eventManager.destroy()

### Instance Properties

systemManager.director -> [director](https://github.com/archcomet/CogJs#director)

systemManager.valid

### Instance Methods

systemManager.emit(eventName, arg1, arg2, ...)

systemManager.register(eventName, context, callback)

systemManager.registerContext(context)

systemManager.unregister(eventName, context)

systemManager.unregisterContext(context)

systemManager.unregisterEvent(eventName)

systemManager.unregisterAll()


Entity
----------

### Memory

entity.init(manager, id, tag)

entity.destroy()

entity.clone() -> {entity}

### Instance Properties

entity.manager -> {entityManager}

entity.id -> {integer}

entity.valid -> {boolean}

entity.tag -> {tag}

entity.mask -> {component mask}

### Instance Methods

entity.add(Component, options) -> {component}

entity.has(Component1, Component2, ...) -> {boolean}

entity.get(Component) -> {component}

entity.remove(Component)

entity.removeAll()


Component
------------

### Memory

Component.setup()

component.init(entity, options)

component.destroy()

component.clone() -> {component}

### Static Properties

Component.category -> {category bit}

Component.count -> {integer}

### Prototype

Component.prototype.defaults -> {options}

### Instance Properties

component.entity -> {entity}

component.valid -> {boolean}

### Instance Methods

component.set(options)

component.serialize() -> {options}


System
----------

### Memory

System.setup()

system.init(manager)

system.destroy()

### Static Methods

System.systemId() -> {system id}

### Instance Methods

system.configure(entityManager, eventManager, config)

system.update(entityManager, eventManager, dt)

Factory
------------

### Memory

Factory.setup()

Factory.init(manager)

factory.destroy()

### Static Methods

Factory.systemId() -> {system id}

### Prototype

Factory.prototype.entityTag -> {tag}

Factory.prototype.components -> {options}

### Instance Methods

factory.spawn(options)

factory.configure(entityManager, eventManager, config)

factory.update(entityManager, eventManager, dt)


Construct
------------

### Inheritance

Construct.extend(fullName, static, prototype) -> {Constructor}

Construct.fullName() -> {fullName}

Construct.setup()

### Static Prototype

properties -> {properties def}

### Instance Prototype

properties -> {properties def}
