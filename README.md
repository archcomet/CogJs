CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

#### Static Functions

cog.createDirector() → {[director](https://github.com/archcomet/CogJs#director)}

cog.extend(target, source1, source2, ...) → {target}

cog.defaults(target, source1, source2, ...) → {target}


Utilities
------

#### Static Functions

cog.isArray() → {boolean}

cog.isBoolean() → {boolean}

cog.isDate() → {boolean}

cog.isFunction() → {boolean}

cog.isNumber() → {boolean}

cog.isObject() → {boolean}

cog.isPlainObject() → {boolean}

cog.isRegExp() → {boolean}

cog.isString() → {boolean}


Director
----------

#### Memory

cog.createDirector(config) → {[director](https://github.com/archcomet/CogJs#director)}

director.init(config)

director.destroy()

#### Instance Properties

director.config → {config}

director.entities → {[entityManager](https://github.com/archcomet/CogJs#entitymanager)}

director.systems → {[systemManager](https://github.com/archcomet/CogJs#systemmanager)}

director.events → {[eventManager](https://github.com/archcomet/CogJs#eventmanager)}

director.valid → {boolean}

#### Instance Methods

director.start()

director.stop()

director.step(timestamp)

director.update(dt)

director.preUpdate(callback)

director.postUpdate(callback)


EntityManager
---------------

#### Memory

entityManager.init([director](https://github.com/archcomet/CogJs#director))

entityManager.destroy()

#### Instance Properties

entityManager.director → [director](https://github.com/archcomet/CogJs#director)

entityManager.valid

#### Instance Methods

entityManager.add(tag) → {[entity](https://github.com/archcomet/CogJs#entity)}

entityManager.all() → [[entity array](https://github.com/archcomet/CogJs#entity)]

entityManager.withTag(tag) → [[entity array](https://github.com/archcomet/CogJs#entity)]

entityManager.withComponents([Component1](https://github.com/archcomet/CogJs#component), [Component2](https://github.com/archcomet/CogJs#component), ...) → [[entity array](https://github.com/archcomet/CogJs#entity)]

entityManager.remove([entity](https://github.com/archcomet/CogJs#entity))

entityManager.removeAll()

entityManager.removeWithTag(tag)

entityManager.removeWithComponents([Component1](https://github.com/archcomet/CogJs#component), [Component2](https://github.com/archcomet/CogJs#component), ...)


SystemManager
--------------

#### Memory

systemManager.init([director](https://github.com/archcomet/CogJs#director))

systemManager.destroy()

#### Instance Properties

systemManager.director → [director](https://github.com/archcomet/CogJs#director)

systemManager.valid

#### Instance Methods

systemManager.add([System](https://github.com/archcomet/CogJs#system)) → {[system](https://github.com/archcomet/CogJs#system)}

systemManager.get([System](https://github.com/archcomet/CogJs#system)) → {[system](https://github.com/archcomet/CogJs#system)}

systemManager.remove([System](https://github.com/archcomet/CogJs#system))

systemManager.removeAll([System](https://github.com/archcomet/CogJs#system))

systemManager.update(dt)


EventManager
--------------

#### Memory

eventManager.init([director](https://github.com/archcomet/CogJs#director))

eventManager.destroy()

#### Instance Properties

eventManager.director → [director](https://github.com/archcomet/CogJs#director)

eventManager.valid

#### Instance Methods

eventManager.emit(eventName, arg1, arg2, ...)

eventManager.register(eventName, context, callback)

eventManager.registerContext(context)

eventManager.unregister(eventName, context)

eventManager.unregisterContext(context)

eventManager.unregisterEvent(eventName)

eventManager.unregisterAll()


Entity
----------

#### Memory

entity.init([entityManager](https://github.com/archcomet/CogJs#entitymanager), id, tag)

entity.destroy()

entity.clone() → {[entity](https://github.com/archcomet/CogJs#entity)}

#### Instance Properties

entity.manager → {[entityManager](https://github.com/archcomet/CogJs#entitymanager)}

entity.id → {integer}

entity.valid → {boolean}

entity.tag → {tag}

entity.mask → {[component](https://github.com/archcomet/CogJs#component) mask}

#### Instance Methods

entity.add([Component](https://github.com/archcomet/CogJs#component), options) → {[component](https://github.com/archcomet/CogJs#component)}

entity.has([Component1](https://github.com/archcomet/CogJs#component), [Component2](https://github.com/archcomet/CogJs#component), ...) → {boolean}

entity.get([Component](https://github.com/archcomet/CogJs#component)) → {[component](https://github.com/archcomet/CogJs#component)}

entity.remove([Component](https://github.com/archcomet/CogJs#component))

entity.removeAll()


Component
------------

#### Memory

Component.setup()

component.init([entity](https://github.com/archcomet/CogJs#entity), options)

component.destroy()

component.clone() → {[component](https://github.com/archcomet/CogJs#component)}

#### Static Properties

Component.category → {category bit}

Component.count → {integer}

#### Prototype

Component.prototype.defaults → {options}

#### Instance Properties

component.entity → {[entity](https://github.com/archcomet/CogJs#entity)}

component.valid → {boolean}

#### Instance Methods

component.set(options)

component.serialize() → {options}


System
----------

#### Memory

System.setup()

system.init([systemManager](https://github.com/archcomet/CogJs#systemmanager))

system.destroy()

#### Static Methods

System.systemId() → {system id}

#### Instance Methods

system.configure([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), config)

system.update([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), dt)


Factory
------------

#### Memory

Factory.setup()

Factory.init([systemManager](https://github.com/archcomet/CogJs#systemmanager))

factory.destroy()

#### Static Methods

Factory.systemId() → {system id}

#### Prototype

Factory.prototype.entityTag → {tag}

Factory.prototype.components → {options}

#### Instance Methods

factory.spawn(options)

factory.despawn([entity](https://github.com/archcomet/CogJs#entity))

factory.configure([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), config)

factory.update([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), dt)


Construct
------------

#### Inheritance

Construct.extend(fullName, static, prototype) → {Constructor}

Construct.fullName() → {fullName}

Construct.setup()

#### Static Prototype

properties → {properties def}

#### Instance Prototype

properties → {properties def}
