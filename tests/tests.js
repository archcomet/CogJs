requirejs.config({
    baseUrl: '../',
    paths: {
        unitTests: './tests/unitTests'
    }
});

requirejs([
    'unitTests/coreTests.js',
    'unitTests/constructTests.js',
    'unitTests/directorTests.js',
    'unitTests/entityTests.js',
    'unitTests/componentTests.js',
    'unitTests/systemTests.js',
    'unitTests/eventTests.js',
    'unitTests/factoryTests.js',
    'unitTests/utilityTests.js',
    'unitTests/arrayWrapperTests.js',
    'unitTests/setWrapperTests.js'
], function() {
    QUnit.load();
    QUnit.start();
});