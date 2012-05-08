var hljs = require("highlight.js");

module.exports = function(element, hash) {
	element.html(require("./page.jade")());
	var list = element.find("ul");
	document.title = "jmpress.js - docs";
	var content = element.find(".content");
	var editButton = element.find(".edit-button");
	try {
		require("bundle!./yamyam!../../../src/docs/"+hash[0]+".md")(function(doc) {
			content.html(doc);
			editButton.attr("href", "https://github.com/shama/jmpress.js/edit/dev/src/docs/" + hash[0] + ".md");
			content.find("pre").each(function() {
				hljs.highlightBlock(this);
			});
			list.find("#docs-"+hash[0]).addClass("active");
		});
	} catch(e) {
		content.html(require("./notFound.jade"));
	}
}