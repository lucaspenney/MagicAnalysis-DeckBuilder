module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			php: {
				src: '*.php',
				dest: 'release/',
			},
			images: {
				src: 'images/*',
				dest: 'release/',
			}
		},
		concat: {
			compiled: {
				src: 'js/*', // source files mask
				dest: 'builder.js', // destination folder
			}
		},
		uglify: {
			files: {
				src: 'js/*', // source files mask
				dest: 'release/scripts/', // destination folder
				expand: true, // allow dynamic building
				flatten: true, // remove all unnecessary nesting
				ext: '.min.js' // replace .js to .min.js
			}
		},
		watch: {
			scripts: {
				files: 'js/**.js',
				tasks: ['concat'],
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat']);

};