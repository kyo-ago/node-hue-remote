'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'esteWatch': {
      options: {
        dirs: ['lib', 'test'],
        livereload: {
          enabled: false
        }
      },
      '*': function() { return 'mocha-chai-sinon'; }
    },
    'version': {
      options: {
        release: 'patch'
      },
      defaults: {
        src: ['package.json']
      }
    },
    'mocha-chai-sinon': {
      build: {
        src: ['./lib/*.js', './test/*.js'],
        options: {
          ui: 'bdd',
          reporter: 'spec'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-chai-sinon');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-este-watch');

  grunt.registerTask('test', ['mocha-chai-sinon']);
  grunt.registerTask('default', ['test', 'esteWatch']);
};