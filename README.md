# CogJs - Entity Component System

CogJs is an entity-component system framework for making web-based games and real time simulations.

This project grew out of previous web projects/experiments and is intended to provide a performant framework
for rapid prototyping. It is still in an early stage of development and the API is not yet stabilized.

The primary design goals of this project are:

* Modularity
* Date-driven
* Portability
* Performance

Repository: [https://github.com/archcomet/CogJs](https://github.com/archcomet/CogJs)  
Documentation: [http://archcomet.github.io/CogJs/docs](http://archcomet.github.io/CogJs/docs)

Additional documentation will soon follow :)

Compatibility
-----------------
* Chrome 19+
* Firefox 4+
* Internet Explorer 9+
* Safari 6+
* iOS 6+
* Android (Not yet tested)

What is Entity Component System?
---------------------------------

Entity-component systems (ECS) attempt to solve problems found in traditional inheritance models.
Instead of deep class hierarchies, ECSs focus on composition to improve code management and modularity.
All game objects are _Entities_ (Identity), which are modeled by a set of _Components_ (State),
while their behaviors are implemented by _Systems_ (Logic). By separating identity, state, and logic,
ECSs allow for rapid development easy code re-use across varied objects.

For an in-depth overview of ECS see the following articles:

* [Evolve Your Hierarchy](http://cowboyprogramming.com/2007/01/05/evolve-your-heirachy/)
* [What is an entity system framework?](http://www.richardlord.net/blog/what-is-an-entity-framework)
* [Why use an entity system framework?](http://www.richardlord.net/blog/why-use-an-entity-framework)

Tutorial
--------

Getting Started

Creating Components

Creating Entities

Creating Systems

Querying Entities

Using Events

Factories
