module.exports = function (grunt) {
  grunt.initConfig({
    supervisor: {
      target: {
        script: "app.js"
      }
    }
  });

  grunt.option('debug', true);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-supervisor");

  grunt.registerTask('default', ['supervisor']);
};
