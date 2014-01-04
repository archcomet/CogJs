define([
    './core',
    './utils/collections',
    './utils/random',
    './entity',
    './component',
    './system',
    './factory',
    './entityManager',
    './eventManager',
    './systemManager',
    './director',
    './amd'
], function(cog) {
    this.cog = cog;
    return cog;
});