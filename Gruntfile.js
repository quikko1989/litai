// Generated on 2015-02-01 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {};

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      sass: {
        files: ['sass/{,*/}*.scss'],
        tasks: ['sass']
      },
      livereload: {
        files: [
          'signUp.html',
          'js/{,*/}*.js',
          'sass/{,*/}*.sass'
        ],
        options: {
          livereload: 1337
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      app: {
        files: [{
          expand: true,
          cwd: 'sass/',
          src: ['*.scss'],
          dest: 'css/',
          ext: '.css'
        }]
      }
    }

    
  });

  // 开发
  grunt.registerTask('default', [
    'sass',
    'watch'
  ]);


};
