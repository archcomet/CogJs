(function(){

    window.loadTests = function() {
        var tests = [
            'unitTests/coreTests.js',
            'unitTests/constructTests.js',
            'unitTests/directorTests.js',
            'unitTests/entityTests.js',
            'unitTests/componentTests.js',
            'unitTests/systemTests.js',
            'unitTests/eventTests.js',
            'unitTests/factoryTests.js',
            'unitTests/utilityTests.js',
            'unitTests/randomTests.js',
            'unitTests/arrayWrapperTests.js',
            'unitTests/setWrapperTests.js'
        ];

        requirejs.config({
            baseUrl: './',
            paths: {
                unitTests: './unitTests'
            }
        });

        (function (files, callback) {
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
        }(tests, function() {
            QUnit.load();
            QUnit.start();
        }));
    }

}());