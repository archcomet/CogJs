(function(){

    window.loadTests = function() {
        var tests = [
            'unit/coreTests.js',
            'unit/categoryTests.js',
            'unit/constructTests.js',
            'unit/debugTests.js',
            'unit/directorTests.js',
            'unit/entityTests.js',
            'unit/componentTests.js',
            'unit/systemTests.js',
            'unit/eventTests.js',
            'unit/modeTests.js',
            'unit/nodeTests.js',
            'unit/factoryTests.js',
            'unit/utilityTests.js',
            'unit/randomTests.js',
            'unit/arrayWrapperTests.js',
            'unit/setWrapperTests.js',
            'unit/sequencingTests.js'
        ];

        requirejs.config({
            baseUrl: './',
            paths: {
                unit: './unit'
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