var $ = require("jquery");
require("jquery-hashchange");

$(function() {
	$("body").html(require("./body.jade")());
	$(".navbar .dropdown").dropdown();
	$(window).hashchange(function() {
		$(window).scrollTop(0);
		var hash = location.hash;
		hash = hash.replace(/^#/, "").split("-");
		switch(hash.shift()) {
		case "builder":
			require("bundle!./builder")(function(page) {
				page($(".page"), hash);
			});
			break;
		case "docs":
			require("bundle!./docs")(function(page) {
				page($(".page"), hash);
			});
			break;
		default:
			require("bundle!./docs")(function(page) {
				page($(".page"), ["index"]);
			});
			break;
		}
	});
	$(window).hashchange();
});