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
		files: ['components/*', 'plugins/*']
	},
	concat: {
		'js/jmpress.js': ['<banner>',
			'components/core.js',
			'components/near.js',
			'components/transform.js',
			'components/active.js',
			'components/circular.js',
			'components/start.js',
			'components/ways.js',
			'components/ajax.js',
			'components/hash.js',
			'components/keyboard.js',
			'components/viewport.js',
			'components/mouse.js',
			'components/templates.js',
			'components/jqevents.js',
			'components/animation.js'],
		'js/jmpress.impress.js': ['<banner>',
			'components/core.js',
			'components/near.js',
			'components/transform.js',
			'components/active.js',
			'components/circular.js',
			'components/hash.js',
			'components/keyboard.js',
			'components/mouse.js'],
		'js/jmpress.all.js': ['<banner>', 'js/jmpress.js', 'plugins/*']
	},
	min: {
		'js/jmpress.min.js': ['<banner>', 'js/jmpress.js'],
		'js/jmpress.impress.min.js': ['<banner>', 'js/jmpress.impress.js'],
		'js/jmpress.all.min.js': ['<banner>', 'js/jmpress.all.js'],
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