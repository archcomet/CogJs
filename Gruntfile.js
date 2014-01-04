module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            all: {
                files: {
                    "cog.min.js": [ "cog.js" ]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "cog.min.map",
                    sourceMappingURL: "cog.min.map",
                    report: "min",
                    beautify: {
                        ascii_only: true
                    },
                    banner: "/*! Cog.js v<%= pkg.version %> | " +
                        "(c) 2013-2014 Michael Good | " +
                        "MIT license. */",
                    compress: {
                        hoist_funs: false,
                        loops: false,
                        unused: false
                    }
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load tasks
    grunt.loadTasks('build/tasks');

    // Register dev build
    grunt.registerTask('dev', ['build']);

    // Register default build
    grunt.registerTask('default', ['dev', 'uglify']);

};