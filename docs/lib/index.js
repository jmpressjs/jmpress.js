var $ = require("jquery");
require("jquery-hashchange");

$(function() {
	$("body").html(require("./body.jade")());
	$(".navbar .dropdown").dropdown();
	$(window).hashchange(function() {
		$(window).scrollTop(0);
		var hash = location.hash;
		hash = hash.replace(/^#/, "").split("-");
		window._gaq.push(['_trackPageview', "/jmpress.js/docs/" + hash.join("/")]);
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
//
// IGNORE BELOW THIS LINE
//
var _gaq = window._gaq = window._gaq || [];
_gaq.push(['_setAccount', 'UA-28251006-1']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();