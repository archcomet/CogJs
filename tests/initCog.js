(function() {

    QUnit.config.urlConfig.push({
        id: "amd",
        label: "Load with AMD",
        tooltip: "Load the AMD file (and its dependencies)"
    });
    var path = QUnit.urlParams.amd === 'true' ? '../src' : '../';


    QUnit.config.urlConfig.push({
        id: "dev",
        label: "Load unminified",
        tooltip: "Load the development (unminified) file"
    });
    var src = QUnit.urlParams.dev === 'true' ||QUnit.urlParams.amd === 'true'  ? 'cog' : 'cog.min';

    require.config({
        baseUrl: path
    });
    require([src], loadTests);

}());