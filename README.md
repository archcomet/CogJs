CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

##### Engine Functions

cog.createDirector(config) → {[director](https://github.com/archcomet/CogJs#director)}

##### Object Manipulation

cog.extend(target, source1, source2, ...) → {target}

cog.defaults(target, source1, source2, ...) → {target}

##### Type Checking

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

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.Director()

##### Properties

director.config → {config}

director.entities → {[entityManager](https://github.com/archcomet/CogJs#entitymanager)}

director.systems → {[systemManager](https://github.com/archcomet/CogJs#systemmanager)}

director.events → {[eventManager](https://github.com/archcomet/CogJs#eventmanager)}

director.valid → {boolean}

##### Methods

director.init(config)

director.destroy()

director.start()

director.stop()

director.step(timestamp)

director.update(dt)

director.render()

director.onBeginUpdate(callback)

director.onEndUpdate(callback)

director.onBeginStep(callback)

director.onEndStep(callback)


EntityManager
---------------

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.EntityManager()

##### Properties

entityManager.director → [director](https://github.com/archcomet/CogJs#director)

entityManager.valid

##### Methods

entityManager.init([director](https://github.com/archcomet/CogJs#director))

entityManager.destroy()

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

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.SystemManager()

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

systemManager.render()


EventManager
--------------

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.EventManager()

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

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.Entity()

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

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.Component()

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

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.System()

#### Memory

System.setup()

system.init([systemManager](https://github.com/archcomet/CogJs#systemmanager))

system.destroy()

#### Static Methods

System.systemId() → {system id}

#### Instance Methods

system.configure([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), config)

system.update([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), dt)

system.render([entityManager](https://github.com/archcomet/CogJs#entitymanager))

Factory
------------

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct) → [cog.System](https://github.com/archcomet/CogJs#system)

##### Constructor

cog.Factory()

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

Construct.fullName → {fullName}

Construct.setup()

#### Static Prototype

properties → {properties def}

#### Instance Prototype

properties → {properties def}
