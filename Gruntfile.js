module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			build: {
				src: 'js/*.js', // source files mask
				dest: 'builder.js', // destination folder
			}
		},
		copy: {
			build: {
				files: [{
					src: ['builder.js'],
					dest: 'build/'
				}, {
					src: ['css/style.css'],
					dest: 'build/style.css'
				}],
			}
		},
		uglify: {
			files: {
				src: 'js/*', // source files mask
				dest: 'release/', // destination folder
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

	grunt.registerTask('build', ['concat', 'copy:build']);
	grunt.registerTask('default', ['concat']);

};