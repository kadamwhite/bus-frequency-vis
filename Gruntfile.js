'use strict';

module.exports = function( grunt ) {

  // Reusable file globbing
  var files = {
    grunt: [ 'Gruntfile.js' ],
    lib: [
      'app.js',
      'public/**/*.js',
      '!public/js/lib/**/*.js',
      'routes/**/*.js',
      'views/filters/**/*.js'
    ]
  };

  // Reusable JSHintRC options
  var jshintrc = grunt.file.readJSON( '.jshintrc' );

  // Load tasks.
  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require( 'jscs-stylish' ).path
      },
      grunt: {
        src: files.grunt
      },
      lib: {
        src: files.lib
      }
    },

    jshint: {
      options: {
        reporter: require( 'jshint-stylish' )
      },
      grunt: {
        options: jshintrc,
        src: files.grunt
      },
      lib: {
        options: jshintrc,
        src: files.lib
      }
      // tests: {
      //   options: extend({
      //     globals: {
      //       'beforeEach': false,
      //       'describe': false,
      //       'it': false
      //     }
      //   }, jshintrc ),
      //   src: files.tests
      // }
    },

    watch: {
      lib: {
        files: files.lib,
        tasks: [ 'jscs:lib', 'jshint:lib' ]
      }
    }

  });

  grunt.registerTask( 'lint', [ 'jshint', 'jscs' ] );
  grunt.registerTask( 'default', [ 'lint' ] );
};
