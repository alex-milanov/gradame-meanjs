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
    },

    sass: {
			dist: {
				files: {
					'public/css/style.css' : 'public/css/style.sass'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.sass',
				tasks: ['sass']
			}
		}
  });

  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-trimtrailingspaces');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('check-spaces', ['lintspaces']);

  grunt.registerTask('fix-spaces', ['trimtrailingspaces', 'exec:tabs2spaces']);

  grunt.registerTask('default',['watch']);

};
