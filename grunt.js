/*global module:false*/
module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*!\n' +
			' * <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
			' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			' *\n' +
			' * <%= pkg.description %>\n' +
			' *\n' +
			' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
			' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
			' *\n' +
			' * Based on the foundation laid by Bartek Szopka @bartaz\n' +
			' */',
			pluginbanner: '/*!\n' +
			' * plugin for <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
			' *\n' +
			' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
			' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
			' */',
			docsindex: '<!DOCTYPE html><html><head>' +
			'<script type="text/javascript" charset="utf-8" ' +
			'src="asserts/<%= docsStats.hash %>.js"></script>' +
			'</head><body></body></html>'
		},
		watch: {
			files: ['src/**', 'docs/**', 'test/**'],
			tasks: 'default'
		},
		lint: {
			files: ['src/**/*.js', 'test/lib/*.js']
		},
		qunit: {
			files: ['test/*.html']
		},
		concat: {
			dist: {
				src: ['<banner:meta.banner>',
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
				src: ['<banner:meta.banner>',
					'src/components/core.js',
					'src/components/near.js',
					'src/components/transform.js',
					'src/components/active.js',
					'src/components/circular.js',
					'src/components/hash.js',
					'src/components/keyboard.js',
					'src/components/mouse.js'],
				dest: 'dist/jmpress.impress.js'
			},
			dist_allplugins: {
				src: ['<banner:meta.pluginbanner>',
					'src/plugins/toggle.js',
					'src/plugins/secondary.js',
					'src/plugins/duration.js',
					'src/plugins/presentation-mode.js'],
				dest: 'dist/jmpress.allplugins.js'
			},
			dist_demo: {
				src: ['<banner:meta.banner>',
					'dist/jmpress.js',
					'dist/jmpress.allplugins.js',
					'src/components/demo.js'],
				dest: 'dist/jmpress.demo.js'
			},
			dist_all: {
				src: ['<banner:meta.banner>',
					'dist/jmpress.js',
					'dist/jmpress.allplugins.js'],
				dest: 'dist/jmpress.all.js'
			},
			dist_plugin_secondary: {
				src: ['<banner:meta.pluginbanner>',
					'src/plugins/secondary.js'],
				dest: 'dist/plugins/jmpress.secondary.js'
			},
			dist_plugin_toggle: {
				src: ['<banner:meta.pluginbanner>',
					'src/plugins/toggle.js'],
				dest: 'dist/plugins/jmpress.toggle.js'
			},
			dist_plugin_duration: {
				src: ['<banner:meta.pluginbanner>',
					'src/plugins/duration.js'],
				dest: 'dist/plugins/jmpress.duration.js'
			},
			dist_plugin_presentation_mode: {
				src: ['<banner:meta.pluginbanner>',
					'src/plugins/presentation-mode.js'],
				dest: 'dist/plugins/jmpress.presentation-mode.js'
			},
			dist_css_basic_animations: {
				src: ['<banner:meta.banner>',
					'src/css/animations/basic/*'],
				dest: 'dist/basic-animations.css'
			},
			/*dist_css_advanced_animations: {
				src: ['<banner:meta.banner>',
					'src/css/animations/advanced/*'],
				dest: 'dist/advanced-animations.css'
			},*/
			docs: {
				src: ['<banner:meta.docsindex>'],
				dest: 'docs/index.html'
			}
		},
		min: {
			dist: {
				src: ['<banner>', 'dist/jmpress.js'],
				dest: 'dist/jmpress.min.js'
			},
			dist_impress: {
				src: ['<banner>', 'dist/jmpress.impress.js'],
				dest: 'dist/jmpress.impress.min.js'
			},
			dist_all: {
				src: ['<banner>', 'dist/jmpress.all.js'],
				dest: 'dist/jmpress.all.min.js'
			},
			dist_allplugins: {
				src: ['<banner:meta.pluginbanner>', 'dist/jmpress.allplugins.js'],
				dest: 'dist/jmpress.allplugins.min.js'
			},
			dist_plugin_secondary: {
				src: ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.secondary.js'],
				dest: 'dist/plugins/jmpress.secondary.min.js'
			},
			dist_plugin_toggle: {
				src: ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.toggle.js'],
				dest: 'dist/plugins/jmpress.toggle.min.js'
			},
			dist_plugin_duration: {
				src: ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.duration.js'],
				dest: 'dist/plugins/jmpress.duration.min.js'
			},
			dist_plugin_presentation_mode: {
				src: ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.presentation-mode.js'],
				dest: 'dist/plugins/jmpress.presentation-mode.min.js'
			}
		},
		cssmin: {
			dist_basic: {
				src: ['dist/basic-animations.css'],
				dest: 'dist/basic-animations.min.css'
			}
			/*dist_advanced: {
				src: ['dist/advanced-animations.css'],
				dest: 'dist/advanced-animations.min.css'
			}*/
		},
		webpack: {
			docs: {
				src: "docs/lib/index.js",
				scriptSrcPrefix: "asserts/",
				statsTarget: "docsStats",
				dest: "docs/asserts/[hash].js"
			}
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
				eqnull: true,
				browser: true,
				laxcomma: true,
				smarttabs: true,
				validthis: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {}
	});
	grunt.registerTask('default', 'lint webpack concat min cssmin');
};