(function() {

    var amd = false,
        dev = false;

    var path = (amd === 'true') ? '../src' : '../',
        src = (dev === 'true' || amd === 'true')  ? 'cog' : 'cog.min';

    require.config({
        baseUrl: path
    });
    require([src], benchmarker.load);

}());