/*global config:true, task:true*/
require("./.grunt/css_min");
config.init({
	pkg: '<json:package.json>',
	meta: {
		banner: '/*!\n' +
		' * <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
		' <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
		' *\n' +
		' * <%= pkg.description %>\n' +
		' *\n' +
		' * Copyright <%= template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
		' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
		' *\n' +
		' * Based on the foundation laid by Bartek Szopka @bartaz\n' +
		' */',
		pluginbanner: '/*!\n' +
		' * plugin for <%= pkg.name || pkg.title %> v<%= pkg.version %>\n' +
		' *\n' +
		' * Copyright <%= template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
		' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
		' */'
	},
	watch: {
		files: ['src/**'],
		tasks: 'default'
	},
	lint: {
		files: ['src/components/*', 'src/plugins/*', 'test/*.js']
	},
	qunit: {
		files: ['test/**/*.html']
	},
	concat: {
		'dist/jmpress.js': ['<banner>',
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
		'dist/jmpress.impress.js': ['<banner>',
			'src/components/core.js',
			'src/components/near.js',
			'src/components/transform.js',
			'src/components/active.js',
			'src/components/circular.js',
			'src/components/hash.js',
			'src/components/keyboard.js',
			'src/components/mouse.js'],
		'dist/jmpress.allplugins.js': ['<banner:meta.pluginbanner>',
			'src/plugins/toggle.js',
			'src/plugins/secondary.js',
			'src/plugins/duration.js',
			'src/plugins/presentation-mode.js'],
		'dist/jmpress.demo.js': [
			'dist/jmpress.js',
			'dist/jmpress.allplugins.js',
			'src/components/demo.js'],
		'dist/jmpress.all.js': [
			'dist/jmpress.js',
			'dist/jmpress.allplugins.js'],
		'dist/plugins/jmpress.secondary.js': ['<banner:meta.pluginbanner>', 'src/plugins/secondary.js'],
		'dist/plugins/jmpress.toggle.js': ['<banner:meta.pluginbanner>', 'src/plugins/toggle.js'],
		'dist/plugins/jmpress.duration.js': ['<banner:meta.pluginbanner>', 'src/plugins/duration.js'],
		'dist/plugins/jmpress.presentation-mode.js': ['<banner:meta.pluginbanner>', 'src/plugins/presentation-mode.js'],

		'dist/basic-animations.css': ['<banner>', 'src/css/animations/basic/*'],
		'dist/advanced-animations.css': ['<banner>', 'src/css/animations/advanced/*']
	},
	min: {
		'dist/jmpress.min.js': ['<banner>', 'dist/jmpress.js'],
		'dist/jmpress.impress.min.js': ['<banner>', 'dist/jmpress.impress.js'],
		'dist/jmpress.all.min.js': ['<banner>', 'dist/jmpress.all.js'],
		'dist/jmpress.allplugins.min.js': ['<banner:meta.pluginbanner>', 'dist/jmpress.allplugins.js'],
		'dist/plugins/jmpress.secondary.min.js': ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.secondary.js'],
		'dist/plugins/jmpress.toggle.min.js': ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.toggle.js'],
		'dist/plugins/jmpress.duration.min.js': ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.duration.js'],
		'dist/plugins/jmpress.presentation-mode.min.js': ['<banner:meta.pluginbanner>', 'dist/plugins/jmpress.presentation-mode.js']
	},
	css_min: {
		'dist/basic-animations.min.css': ['dist/basic-animations.css'],
		'dist/advanced-animations.min.css': ['dist/advanced-animations.css']
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
	sqwish: {},
	uglify: {}
});
task.registerTask('default', 'lint concat min css_min');