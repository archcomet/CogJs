define([
    'cog',
    'benchmarker'
], function(cog, benchmarker){

    benchmarker.suite
        .add('RegExp#test', function() {
            /o/.test('Hello World!');
        })
        .add('String#indexOf', function() {
            'Hello World!'.indexOf('o') > -1;
        })
        .add('String#match', function() {
            !!'Hello World!'.match(/o/);
        })


});