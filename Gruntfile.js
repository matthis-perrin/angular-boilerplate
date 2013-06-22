'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		tempDist: 'temp-dist',
		generated: 'scripts/generated',
		dist: 'dist'
	};

	try {
		yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
	} catch (e) {}

	grunt.initConfig({
		yeoman: yeomanConfig,

		watch: {
			css: {
				files: ['<%= yeoman.app %>/styles/**/*.scss'],
				tasks: ['compass:dist'],
				options: {
					nospawn: true,
					debounceDelay: 100
				}
			},
			scripts: {
				files: ['<%= yeoman.app %>/scripts/**/*.js'],
				tasks: ['jshint'],
				options: {
					nospawn: true,
					debounceDelay: 100
				}
			},
			livereload: {
				files: [
					'<%= yeoman.app %>/**/*.html',
					'<%= yeoman.app %>/styles/**/*.css',
					'<%= yeoman.app %>/scripts/**/*.js',
					'<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
				],
				tasks: ['livereload'],
				options: {
					nospawn: true,
					debounceDelay: 100
				}
			}
		},

		connect: {
			options: {
				port: 9080,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			}
		},

		open: {
      server: {
        url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
      }
    },

		clean: {
			tempDist: {
				files: [{
					dot: true,
					src: ['.tmp', '<%= yeoman.tempDist %>']
				}]
			},
			dist: {
				files: [{
					dot: true,
					src: ['.tmp', '<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*']
				}]
			},
			generated: '<%= yeoman.app%>/<%= yeoman.generated %>/*.js'
		},

		jshint: {
			options: {
				'-W117': false,
				'-W098': false,
				'node': true,
				'browser': true,
				'es5': true,
				'esnext': true,
				'bitwise': false,
				'curly': true,
				'eqeqeq': true,
				'immed': true,
				'indent': 2,
				'latedef': true,
				'newcap': true,
				'noarg': true,
				'quotmark': 'single',
				'regexp': true,
				'undef': true,
				'unused': true,
				'strict': true,
				'multistr': true,
				'trailing': true,
				'smarttabs': true,
				'globals': {
					'angular': true
				}
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/**/*.js',
			]
		},

		html2js: {
			main: {
				options: {
					base: '<%= yeoman.app %>'
				},
				src: ['<%= yeoman.app %>/views/**/*.html'],
				dest: '<%= yeoman.app%>/<%= yeoman.generated %>/templates.js'
			},
		},

		compass: {
			options: {
				force: true,
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '<%= yeoman.app %>/styles',
				specify: '<%= yeoman.app %>/styles/all.scss'
			},
			dist: {},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		concat: { },

		useminPrepare: {
			html: ['<%= yeoman.app %>/index.html'],
			options: {
				dest: '<%= yeoman.tempDist %>'
			}
		},

		usemin: {
			html: ['<%= yeoman.tempDist %>/index.html'],
			css: ['<%= yeoman.tempDist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.tempDist %>']
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: ['*.{png,jpg,jpeg}', 'images/**/*.{png,jpg,jpeg}'],
					dest: '<%= yeoman.tempDist %>'
				}]
			}
		},

		cssmin: { },

		uglify: {
			options: {
				mangle: false,
				compress: true,
				beautify: false,
				report: 'min',
				preserveComments: false
			}
		},

		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.tempDist %>/scripts/**/*.js',
						'<%= yeoman.tempDist %>/styles/{,*/}*.css',
						'<%= yeoman.tempDist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
					]
				}
			}
		},

		copy: {
			tempDist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.tempDist %>',
					src: [
						'*.{ico,txt}',
						'*.html',
					]
				}]
			},
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.tempDist %>',
					dest: '<%= yeoman.dist %>',
					src: ['**/*']
				}]
			}
		},

	});


	grunt.registerTask('html2jsReset', function() {
		var templateJsPath = yeomanConfig.app + '/' + yeomanConfig.generated + '/templates.js';
		grunt.log.ok('Resetting : ' + templateJsPath);
		if (grunt.file.exists(templateJsPath)) {
			grunt.file.delete(templateJsPath);
		}
		grunt.file.write(templateJsPath,'angular.module(\'templates-main\', []);');
	});

	grunt.renameTask('regarde', 'watch');

	grunt.registerTask('server', [
		'livereload-start',
		'connect:livereload',
    'open',
		'watch'
	]);

	grunt.registerTask('build', [
		'compass:dist',
		'clean:generated',
		'jshint',
		'html2js',
		'useminPrepare',
		'concat',
		'uglify',
		'imagemin',
		'cssmin',
		'rev',
		'clean:dist',
		'copy:tempDist',
		'usemin',
		'clean:dist',
		'copy:dist',
		'html2jsReset',
		'clean:tempDist',
	]);

	grunt.registerTask('default', ['build']);
};
