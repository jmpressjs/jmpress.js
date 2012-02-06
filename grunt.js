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
	lint: {
		files: ['js/jmpress.js', 'plugins/*']
	},
	concat: {
		'js/jmpress.all.js': ['<banner>', 'js/jmpress.js', 'plugins/*']
	},
	min: {
		'js/jmpress.all.min.js': ['<banner>', 'js/jmpress.js', 'plugins/*'],
		'js/jmpress.min.js': ['<banner>', 'js/jmpress.js']
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
task.registerTask('default', 'lint min');