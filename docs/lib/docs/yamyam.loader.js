var YamYam = require("YamYam");

module.exports = function(source) {
	var cb = this.callback;
	YamYam.parse(source, {
		format: {
			line: {
				tag: "",
				_prepend: " ",
				_prependStart: ""
			}
		}
	}, function(err, html) {
		cb(err, html && ("module.exports =\n\t" + JSON.stringify(html) + ";"));
	});
}