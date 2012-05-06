var YamYam = require("YamYam");

module.exports = function(source) {
	var cb = this.callback;
	YamYam.parse(source, function(err, html) {
		cb(err, html && ("module.exports =\n\t" + JSON.stringify(html) + ";"));
	});
}