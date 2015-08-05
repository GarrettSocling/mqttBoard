module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    supervisor: {
      target: {
        script: "app.js"
      }
    },
    bower: {
      install: {
        options: {
          "targetDir": "./public/bower",
          "verbose" : true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks("grunt-supervisor");

  grunt.registerTask('default', ['bower','supervisor']);
};
