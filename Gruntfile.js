module.exports = function(grunt) {

  grunt.initConfig({
    lintspaces: {
      all: {
        src: [
          '*',
          'app/**/*',
          'config/**/*',
          'public/css/**/*',
          'public/js/**/*',
          'public/views/**/*'
        ],
        filter: 'isFile',
        options: {
          newline: true,
          newlineMaximum: 2,
          trailingspaces: true,
          indentation: 'spaces',
          spaces: 2
        }
      },
    },

    trimtrailingspaces: {
      main: {
        src: [
          '*',
          'app/**/*',
          'config/**/*',
          'public/css/**/*',
          'public/js/**/*',
          'public/views/**/*'
        ],
        filter: 'isFile',
        options: {
          encoding: 'utf8',
          failIfTrimmed: false
        }
      }
    },

    exec: {
      tabs2spaces: 'find . \\\( -name "*.js" -o -name "*.html" -o -name "*.css" \\\) ' +
                   '-not \\\( -type d -o -path "./public/lib/*" -o -path "./node_modules/*" -o -path "./.vagrant/*" -o -path "./.git/*" \\\) ' +
                   '-exec bash -c \'expand -t 2 "$0" > /tmp/e && mv /tmp/e "$0"\' {} \\\;',

      spaces2tabs: 'find . \\\( -name "*.js" -o -name "*.html" -o -name "*.css" \\\) ' +
                   '-not \\\( -type d -o -path "./public/lib/*" -o -path "./node_modules/*" -o -path "./.vagrant/*" -o -path "./.git/*" \\\) ' +
                   '-exec bash -c \'unexpand -t 2 "$0" > /tmp/e && mv /tmp/e "$0"\' {} \\\;'
    }
  });

  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-trimtrailingspaces');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('check-spaces', ['lintspaces']);

  grunt.registerTask('fix-spaces', ['trimtrailingspaces', 'exec:tabs2spaces']);

};
