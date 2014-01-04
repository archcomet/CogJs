(function(){

    function _requireQueue(files, callback) {
        function load(files) {
            if (files.length === 0) {
                callback();
                return;
            }
            require([files.shift()], function() {
                load(files);
            })
        }
        load(files);
    }

    requirejs.config({
        baseUrl: '../',
        paths: {
            unitTests: './tests/unitTests'
        }
    });

    _requireQueue([
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

}());