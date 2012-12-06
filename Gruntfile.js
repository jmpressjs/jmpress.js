/*global module:false*/
module.exports = function(grunt) {

	// Banner for dist
	var banner = '/*!\n' +
		' * <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
		' <%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		' *\n' +
		' * <%= pkg.description %>\n' +
		' *\n' +
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
		' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
		' *\n' +
		' * Based on the foundation laid by Bartek Szopka @bartaz\n' +
		' */';

	// Banner for plugins
	var pluginBanner = '/*!\n' +
		' * plugin for <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
		' *\n' +
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
		' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
		' */';

	// Main grunt config
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
					curly: true,
					eqeqeq: true,
					immed: true,
					latedef: true,
					newcap: true,
					noarg: true,
					sub: true,
					undef: true,
					eqnull: true,
					browser: true,
					laxcomma: true,
					smarttabs: true,
					validthis: true,
					globals: {
						jQuery: true
					}
				}
			}
		},
		qunit: {
			all: {
				src: ['test/*.html']
			}
		},
		concat: {
			dist: {
				options: {banner: banner},
				src: [
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
					'src/components/animation.js'],
				dest: 'dist/jmpress.js'
			},
			dist_impress: {
				options: {banner: banner},
				src: [
					'src/components/core.js',
					'src/components/near.js',
					'src/components/transform.js',
					'src/components/active.js',
					'src/components/circular.js',
					'src/components/hash.js',
					'src/components/keyboard.js',
					'src/components/mouse.js'
				],
				dest: 'dist/jmpress.impress.js'
			},
			dist_allplugins: {
				options: {banner: pluginBanner},
				src: [
					'src/plugins/toggle.js',
					'src/plugins/secondary.js',
					'src/plugins/duration.js',
					'src/plugins/presentation-mode.js'
				],
				dest: 'dist/jmpress.allplugins.js'
			},
			dist_all: {
				options: {banner: banner},
				src: [
					'dist/jmpress.js',
					'dist/jmpress.allplugins.js'
				],
				dest: 'dist/jmpress.all.js'
			},
			dist_plugin_secondary: {
				options: {banner: pluginBanner},
				src: [
					'src/plugins/secondary.js'
				],
				dest: 'dist/plugins/jmpress.secondary.js'
			},
			dist_plugin_toggle: {
				options: {banner: pluginBanner},
				src: [
					'src/plugins/toggle.js'
				],
				dest: 'dist/plugins/jmpress.toggle.js'
			},
			dist_plugin_duration: {
				options: {banner: pluginBanner},
				src: [
					'src/plugins/duration.js'
				],
				dest: 'dist/plugins/jmpress.duration.js'
			},
			dist_plugin_presentation_mode: {
				options: {banner: pluginBanner},
				src: [
					'src/plugins/presentation-mode.js'
				],
				dest: 'dist/plugins/jmpress.presentation-mode.js'
			},
			dist_css_basic_animations: {
				options: {banner: banner},
				src: [
					'src/css/animations/basic/*'
				],
				dest: 'dist/basic-animations.css'
			}
			/*dist_css_advanced_animations: {
				options: {banner: banner},
				src: [
					'src/css/animations/advanced/*'
				],
				dest: 'dist/advanced-animations.css'
			},*/
		},
		uglify: {
			dist: {
				options: {stripBanners: true, banner: banner},
				src: ['dist/jmpress.js'],
				dest: 'dist/jmpress.min.js'
			},
			dist_impress: {
				options: {stripBanners: true, banner: banner},
				src: ['dist/jmpress.impress.js'],
				dest: 'dist/jmpress.impress.min.js'
			},
			dist_all: {
				options: {stripBanners: true, banner: banner},
				src: ['dist/jmpress.all.js'],
				dest: 'dist/jmpress.all.min.js'
			},
			dist_allplugins: {
				options: {stripBanners: true, banner: pluginBanner},
				src: ['dist/jmpress.allplugins.js'],
				dest: 'dist/jmpress.allplugins.min.js'
			},
			dist_plugin_secondary: {
				options: {stripBanners: true, banner: pluginBanner},
				src: ['dist/plugins/jmpress.secondary.js'],
				dest: 'dist/plugins/jmpress.secondary.min.js'
			},
			dist_plugin_toggle: {
				options: {stripBanners: true, banner: pluginBanner},
				src: ['dist/plugins/jmpress.toggle.js'],
				dest: 'dist/plugins/jmpress.toggle.min.js'
			},
			dist_plugin_duration: {
				options: {stripBanners: true, banner: pluginBanner},
				src: ['dist/plugins/jmpress.duration.js'],
				dest: 'dist/plugins/jmpress.duration.min.js'
			},
			dist_plugin_presentation_mode: {
				options: {stripBanners: true, banner: pluginBanner},
				src: ['dist/plugins/jmpress.presentation-mode.js'],
				dest: 'dist/plugins/jmpress.presentation-mode.min.js'
			}
		},
		mincss: {
			dist_basic: {
				src: ['dist/basic-animations.css'],
				dest: 'dist/basic-animations.min.css'
			},
			dist_demo: {
				src: ['dist/basic-animations.css', 'src/css/demo/*.css'],
				dest: 'dist/demo.css'
			}
			/*dist_advanced: {
				src: ['dist/advanced-animations.css'],
				dest: 'dist/advanced-animations.min.css'
			}*/
		},
		clean: {
			all: ['dist/**/*']
		}
	});

	// Load external tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-mincss');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Tasks
	grunt.registerTask('default', ['clean', 'jshint', 'concat', 'uglify', 'mincss']);
};