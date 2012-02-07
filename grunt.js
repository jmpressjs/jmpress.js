/*global config:true, task:true*/
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
		' */'
	},
	watch: {
		files: '<config:lint.files>',
		tasks: 'concat'
	},
	lint: {
		files: ['src/components/*', 'src/plugins/*']
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
		'dist/jmpress.demo.js': [
			'dist/jmpress.js',
			'src/plugins/jmpress.duration.js',
			'src/plugins/jmpress.secondary.js',
			'src/plugins/jmpress.toggle.js',
			'src/components/demo.js'],
		'dist/jmpress.all.js': ['<banner>', 'dist/jmpress.js', 'src/plugins/*']
	},
	min: {
		'dist/jmpress.min.js': ['<banner>', 'dist/jmpress.js'],
		'dist/jmpress.impress.min.js': ['<banner>', 'dist/jmpress.impress.js'],
		'dist/jmpress.all.min.js': ['<banner>', 'dist/jmpress.all.js']
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
task.registerTask('default', 'lint concat min');