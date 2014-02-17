(function(){

    var tests = [
        'perf/helloCogTests'
    ];

    var benchmarker = window.benchmarker = {

        suite: (function() {
            return new Benchmark.Suite;
        }()),

        log: function(msg) {
            var li = $('<li>'+msg+'</li>');
            $('#results').append(li);
        },

        load: function() {

            benchmarker.log('CogJs initialized');
            requirejs.config({
                baseUrl: './',
                paths: {
                    unit: './perf'
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
                benchmarker.suite.run({ async: true })
                    .on('cycle', function(event) {
                        benchmarker.log(String(event.target));
                    })
                    .on('complete', function() {
                        benchmarker.log('Fastest is ' + this.filter('fastest').pluck('name'));
                        benchmarker.log('Done');
                    });
                benchmarker.log('Tests initialized');
                benchmarker.log('Starting tests...');
            }));
        }
    };

    if (typeof define === "function" && define.amd) {
        define('benchmarker', function() { return benchmarker; });
    }

}());