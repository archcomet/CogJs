CogJs - Entity Component System
=====

Starting to get the doc up. More coming soon! :)

Core
-------

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

cog.Director({config})

##### Instance Properties

director.config → {config}

director.entities → {[entityManager](https://github.com/archcomet/CogJs#entitymanager)}

director.systems → {[systemManager](https://github.com/archcomet/CogJs#systemmanager)}

director.events → {[eventManager](https://github.com/archcomet/CogJs#eventmanager)}

director.valid → {boolean}

##### Instance Methods

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

cog.EntityManager([director](https://github.com/archcomet/CogJs#director))

##### Instance Properties

entityManager.director → [director](https://github.com/archcomet/CogJs#director)

entityManager.valid → {boolean}

##### Instance Methods

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

cog.SystemManager([director](https://github.com/archcomet/CogJs#director))

##### Instance Properties

systemManager.director → [director](https://github.com/archcomet/CogJs#director)

systemManager.valid → {boolean}

##### Instance Methods

systemManager.init([director](https://github.com/archcomet/CogJs#director))

systemManager.destroy()

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

cog.EventManager([director](https://github.com/archcomet/CogJs#director))

##### Instance Properties

eventManager.director → [director](https://github.com/archcomet/CogJs#director)

eventManager.valid → {boolean}

##### Instance Methods

eventManager.init([director](https://github.com/archcomet/CogJs#director))

eventManager.destroy()

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

cog.Entity([entityManager](https://github.com/archcomet/CogJs#entitymanager), id, tag)

##### Instance Properties

entity.manager → {[entityManager](https://github.com/archcomet/CogJs#entitymanager)}

entity.id → {integer}

entity.valid → {boolean}

entity.tag → {tag}

entity.mask → {[component](https://github.com/archcomet/CogJs#component) mask}

entity.parent -> {[entity](https://github.com/archcomet/CogJs#entity)}

entity.children -> [{[entity](https://github.com/archcomet/CogJs#entity)}]

##### Instance Methods

entity.init([entityManager](https://github.com/archcomet/CogJs#entitymanager), id, tag)

entity.destroy()

entity.clone() → {[entity](https://github.com/archcomet/CogJs#entity)}

entity.add([Component](https://github.com/archcomet/CogJs#component), options) → {[component](https://github.com/archcomet/CogJs#component)}

entity.has([Component1](https://github.com/archcomet/CogJs#component), [Component2](https://github.com/archcomet/CogJs#component), ...) → {boolean}

entity.get([Component](https://github.com/archcomet/CogJs#component)) → {[component](https://github.com/archcomet/CogJs#component)}

entity.remove([Component](https://github.com/archcomet/CogJs#component))

entity.removeAll()

entity.addChild([entity](https://github.com/archcomet/CogJs#entity))

entity.removeChild([entity](https://github.com/archcomet/CogJs#entity))

entity.removeAllChildren()

Component
------------

Inherits: [cog.Map](https://github.com/archcomet/CogJs#map)

##### Constructor

cog.Component([entity](https://github.com/archcomet/CogJs#entity), options)

##### Static Properties

Component.category → {category bit}

Component.count → {integer}

Component.defaults → {defaults}

##### Static Methods

Component.setup()

##### Instance Properties

component.entity → {[entity](https://github.com/archcomet/CogJs#entity)}

component.valid → {boolean}

##### Instance Methods

component.init([entity](https://github.com/archcomet/CogJs#entity), options)

component.destroy()

component.clone() → {[component](https://github.com/archcomet/CogJs#component)}

component.set(options)

component.prop(propName) → value

component.prop(propName, value)

component.on(key, handler)

component.off(key)

component.trigger(key, value, oldValue)

component.keys() → [keys]

component.serialize() → {options}


System
----------

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct)

##### Constructor

cog.System([systemManager](https://github.com/archcomet/CogJs#systemmanager))

##### Static Methods

System.setup()

System.systemId() → {system id}

##### Instance Methods

system.init([systemManager](https://github.com/archcomet/CogJs#systemmanager))

system.destroy()

system.configure([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), config)

system.update([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), dt)

system.render([entityManager](https://github.com/archcomet/CogJs#entitymanager))

Factory
------------

Inherits: [cog.Construct](https://github.com/archcomet/CogJs#construct) → [cog.System](https://github.com/archcomet/CogJs#system)

##### Constructor

cog.Factory([systemManager](https://github.com/archcomet/CogJs#systemmanager))

##### Static Methods

Factory.setup()

Factory.systemId() → {system id}

##### Instance properties

factory.entityTag → {tag}

factory.components → {options}

##### Instance Methods

factory.init([systemManager](https://github.com/archcomet/CogJs#systemmanager))

factory.destroy()

factory.spawn(options)

factory.despawn([entity](https://github.com/archcomet/CogJs#entity))

factory.configure([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), config)

factory.update([entityManager](https://github.com/archcomet/CogJs#entitymanager), [eventManager](https://github.com/archcomet/CogJs#eventmanager), dt)


Construct
------------

##### Static Properties

Construct.fullName → {fullName}

Construct.defaults -> {defaults}

Construct.properties → {properties}

Construct.dirtyOnChange → {boolean}

##### Static Methods

Construct.extend(fullName, static, prototype) → {Constructor}

Construct.setup()
