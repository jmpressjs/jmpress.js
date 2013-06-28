/* jshint node:true */
module.exports = function(grunt) {
	var banner = grunt.file.read('src/banners/dist.js');
	var pluginBanner = grunt.file.read('src/banners/plugins.js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			all: {
				files: ['src/**', 'test/components/*.js'],
				tasks: ['default']
			}
		},
		jshint: {
			all: {
				src: ['Gruntfile.js', 'src/**/*.js', 'test/components/*.js'],
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},
		qunit: {
			all: ['test/*.html']
		},
		concat: {
			dist: {
				options: {banner: banner},
				files: [{
					'dist/jmpress.js': [
						'src/components/core.js',
						'src/components/near.js',
						'src/components/transform.js',
						'src/components/active.js',
						'src/components/circular.js',
						'src/components/start.js',
						'src/components/ways.js',
						'src/components/ajax.js',
						'src/components/hash.js',
						'src/components/keyboard.js',
						'src/components/viewport.js',
						'src/components/mouse.js',
						'src/components/mobile.js',
						'src/components/templates.js',
						'src/components/jqevents.js',
						'src/components/animation.js'
					],
					'dist/jmpress.impress.js': [
						'src/components/core.js',
						'src/components/near.js',
						'src/components/transform.js',
						'src/components/active.js',
						'src/components/circular.js',
						'src/components/hash.js',
						'src/components/keyboard.js',
						'src/components/mouse.js'
					]
				}]
			},
			plugins: {
				options: {banner: pluginBanner},
				files: [{
					'dist/jmpress.allplugins.js': [
						'src/plugins/toggle.js',
						'src/plugins/secondary.js',
						'src/plugins/duration.js',
						'src/plugins/presentation-mode.js'
					],
					'dist/jmpress.all.js': [
						'dist/jmpress.js',
						'dist/jmpress.allplugins.js'
					],
					'dist/plugins/jmpress.secondary.js': [
						'src/plugins/secondary.js'
					],
					'dist/plugins/jmpress.toggle.js': [
						'src/plugins/toggle.js'
					],
					'dist/plugins/jmpress.duration.js': [
						'src/plugins/duration.js'
					],
					'dist/plugins/jmpress.presentation-mode.js': [
						'src/plugins/presentation-mode.js'
					]
				}]
			},
			css: {
				options: {banner: banner},
				files: [{
					'dist/basic-animations.css': ['src/css/animations/basic/*']
					//'dist/advanced-animations.css': ['src/css/animations/advanced/*']
				}]
			}
		},
		uglify: {
			options: {stripBanners: true, banner: banner},
			dist: {
				files: [{
					'dist/jmpress.min.js': ['dist/jmpress.js'],
					'dist/jmpress.impress.min.js': ['dist/jmpress.impress.js'],
					'dist/jmpress.all.min.js': ['dist/jmpress.all.js']
				}]
			},
			plugins: {
				options: {stripBanners: true, banner: pluginBanner},
				files: [{
					'dist/jmpress.allplugins.min.js': ['dist/jmpress.allplugins.js'],
					'dist/plugins/jmpress.secondary.min.js': ['dist/plugins/jmpress.secondary.js'],
					'dist/plugins/jmpress.toggle.min.js': ['dist/plugins/jmpress.toggle.js'],
					'dist/plugins/jmpress.duration.min.js': ['dist/plugins/jmpress.duration.js'],
					'dist/plugins/jmpress.presentation-mode.min.js': ['dist/plugins/jmpress.presentation-mode.js']
				}]
			}
		},
		cssmin: {
			all: {
				files: [{
					'dist/basic-animations.min.css': ['dist/basic-animations.css'],
					'dist/demo.css': ['dist/basic-animations.css', 'src/css/demo/*.css'],
					//'dist/advanced-animations.min.css': ['dist/advanced-animations.css']
				}]
			}
		},
		clean: ['dist/**/*']
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify', 'cssmin']);
};