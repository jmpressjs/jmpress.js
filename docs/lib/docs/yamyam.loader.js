var YamYam = require("YamYam");

module.exports = function(source) {
	var cb = this.callback;
	YamYam.parse(source, {
		format: {
			line: {
				tag: "",
				_prepend: " ",
				_prependStart: ""
			},
			codeContainer: {
				tag: "pre",
				"class": function(buffer, params, element) {
					if(element.language)
						buffer.push("language-" + element.language.replace(/"/g, "&quot;"));
				}
			},
			code: "",
			codeText: "",
			annotations: {
				"@attrs": YamYam.HtmlFormater.ATTRS
			}
		}
	}, function(err, html) {
		cb(err, html && ("module.exports =\n\t" + JSON.stringify(html) + ";"));
	});
}
