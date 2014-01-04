module.exports = function(grunt) {

    var requirejs = require('requirejs'),
        rdefineEnd = /\}\);[^}\w]*$/,
        version = grunt.config('pkg.version'),
        name = 'cog.js',
        config = {
            name: 'cog',
            baseUrl: 'src',
            optimize: 'none',
            findNestedDependencies: true,
            skipSemiColonInsertion: true,
            wrap: {
                startFile: 'src/wrap/intro.txt',
                endFile: 'src/wrap/outro.txt'
            },
            onBuildWrite: convert,

            out: function( compiled ) {
                compiled = compiled
                    // Embed Version
                    .replace( /@VERSION/g, version )
                    // Embed Date
                    // yyyy-mm-ddThh:mmZ
                    .replace( /@DATE/g, ( new Date() ).toLocaleDateString() );

                // Write concatenated source to file
                grunt.file.write( name, compiled );
            }
        };

    /**
     * Strip all definitions generated by requirejs
     * Convert "var" modules to var declarations
     * "var module" means the module only contains a return statement that should be converted to a var declaration
     * This is indicated by including the file in any "var" folder
     * @param {String} name
     * @param {String} path
     * @param {String} contents The contents to be written (including their AMD wrappers)
     */
    function convert( name, path, contents ) {
        var amdName;
        // Convert var modules
        if ( /.\/var\//.test( path ) ) {
            contents = contents
                .replace( /define\([\w\W]*?return/, "    var " + (/var\/([\w-]+)/.exec(name)[1]) + " =" )
                .replace( rdefineEnd, "" );

            // Sizzle treatment
        } else if ( /^sizzle$/.test( name ) ) {
            contents = "var Sizzle =\n" + contents
                // Remove EXPOSE lines from Sizzle
                .replace( /\/\/\s*EXPOSE[\w\W]*\/\/\s*EXPOSE/, "return Sizzle;" );

            // AMD Name
        } else if ( (amdName = grunt.option( "amd" )) != null && /^exports\/amd$/.test( name ) ) {
            // Remove the comma for anonymous defines
            contents = contents
                .replace( /(\s*)"jquery"(\,\s*)/, amdName ? "$1\"" + amdName + "\"$2" : "" );

        } else {

            contents = contents
                .replace( /\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1" )
                // Multiple exports
                .replace( /\s*exports\.\w+\s*=\s*\w+;/g, "" );

            // Remove define wrappers, closure ends, and empty declarations
            contents = contents
                .replace( /define\([^{]*?{/, "" )
                .replace( rdefineEnd, "" );

            // Remove anything wrapped with
            // /* ExcludeStart */ /* ExcludeEnd */
            // or a single line directly after a // BuildExclude comment
            contents = contents
                .replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "" )
                .replace( /\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "" );

            // Remove empty definitions
            contents = contents
                .replace( /define\(\[[^\]]+\]\)[\W\n]+$/, "" );
        }
        return contents;
    }


    // Default task(s).
    grunt.registerTask('build', function() {
        var done = this.async();

        requirejs.optimize(config, function (buildResponse) {
            grunt.verbose.writeln( buildResponse );
            grunt.log.ok( 'File \''+name+'\' created.');
            done();
        }, function(err) {
            done(err);
        });
    });
};