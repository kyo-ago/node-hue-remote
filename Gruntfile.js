'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        src: ['./test/**/*.js'],
        options: {
          ui: 'bdd',
          reporter: 'spec'
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-mocha-chai-sinon");
  grunt.loadNpmTasks('grunt-version');

  grunt.registerTask('test', ['mocha-chai-sinon']);
};