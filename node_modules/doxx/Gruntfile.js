"use strict";

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      files: ['grunt.js', 'bin/**/*', 'lib/**/*.js']
    },
    shell: {
      doxx:{// --template docs/template.jade
        command:'./bin/doxx --source lib --target docs',
        stdout:true,
        stderr:true
      },
      nodeunit: {//--reporter minimal
        command: './node_modules/nodeunit/bin/nodeunit test/*.test.js',
        stdout: true,
        stderr: true,
        failOnError:false,
        warnOnError: true
      }
    },
    watch: {
      files: ['<config:lint.files>','views/*', 'test/*'],
      tasks: 'default shell:doxx test'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');
  grunt.registerTask('test', 'shell:nodeunit');
};
