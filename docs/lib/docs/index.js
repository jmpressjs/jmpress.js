module.exports = function(element, hash) {
	element.html(require("./page.jade")());
	var list = element.find("ul");
	document.title = "jmpress.js - docs";
	var content = element.find(".content");
	try {
		require("bundle!./yamyam!../../../src/docs/"+hash[0]+".md")(function(doc) {
			content.html(doc);
			list.find("#docs-"+hash[0]).addClass("active");
		});
	} catch(e) {
		content.html(require("./notFound.jade"));
	}
}