/*
* JSHinter Grunt Tasks
*
* @author Ryan Nickell
*/
module.exports = function(grunt) {
     var IIFEopen = '(function() {\n"use strict";\n\n';
     var IIFEclose = '\n})();';

    /*
    * Helper method to load configuration files for Grunt
    */
    function loadConfig(path) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option) {
            key = option.replace(/\.js$/,'');
            object[key] = require(path + option);
        });

        return  object;
    }

    var jshintSrc = [
        'src/**',
        'Gruntfile.js'
    ];

    var defaultJshintOptions = {
        curly: true,
        eqeqeq: false,
        eqnull: true,
        browser: true,
        es3: true, //To catch trailing commas
        reporter: require('jshint-stylish')
    };

    var config = {
        header: IIFEopen,
        footer: IIFEclose,
        js_build_path: 'build',
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: defaultJshintOptions,
            all: {
                src: jshintSrc
            }
        },
        concat: {
            options: {
                stripBanners: 'true',
                banner: '<%= header %>',
                footer: '<%= footer %>'
            },
            dist: {
                src: [
                    'src/logger.js',
                    'src/engine.js',
                    'src/simple-firework.js'
                ],
                dest: '<%= js_build_path %>/app.js'
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            js: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= js_build_path %>/app.min.js'
            }
        },
        watch: {
            scripts: {
                files: jshintSrc,
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        }
    };

    // Project configuration.
    grunt.initConfig(config);

    /*
    * Only JSHint the files that change by dynamically modifying the 
    * file list.
    *
    * See: https://github.com/gruntjs/grunt-contrib-watch
    */
    grunt.event.on('watch', function(action, filepath, target) {
        grunt.config('jshint.all.src', filepath);
    });

    // Load all available tasks
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['jshint','concat','uglify']);
};
