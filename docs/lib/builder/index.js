var $ = require("jquery");

var config = require("./config.json");

module.exports = function(element) {
	document.title = "jmpress.js builder";
	element.html(require("./page.jade")());
	config.components.forEach(function(component) {
		$("<div>")
			.addClass("control-group")
			.html(require("./component.jade")(component))
			.insertBefore(element.find("#form-actions"));
	});
	element.find("input").change(invalidate);
	config.settings.forEach(function(setting) {
		$("<p>").html(require("./setting.jade")(setting))
			.appendTo(element.find("#settings"))
			.click(function() {
				loadSetting(setting);
				invalidate();
			});
	});
	loadSetting(config.settings[0]);
	invalidate()
	download(true);

	function loadSetting(setting) {
		config.components.forEach(function(component) {
			element.find("#component-"+component.name).attr("checked", false);
		});
		setting.components.forEach(function(component) {
			element.find("#component-"+component).attr("checked", true);
		});
	}
	function invalidate() {
		element.find("#dataurl").addClass("disabled");
		element.find("#dataurl").attr("href", "");
		download(false, function(dataUrl) {
			element.find("#dataurl").removeClass("disabled");
			element.find("#dataurl").attr("href", dataUrl);
		});
	}
	function download(init, dataUrlCb) {
		return require.ensure([], function(require) {
			if(init) {
				require.ensure([], function(require) {
					var downloadify = require("downloadify");
					downloadify.create("downloadify", {
						filename: function() {
							return "jmpress.js";
						},
						data: function() {
							return getFile();
						},
						swf: require("file/swf!./downloadify.swf"),
						width: 78,
						height: 28,
						transparent: true,
						downloadImage: require("file/png!./download.png")
					});
				});
				return;
			}
			function getFile() {
				var build = require("./build");
				var options = {};
				config.components.forEach(function(component) {
					options[component.name] = element.find("#component-"+component.name).attr("checked");
				});
				return build(options);
			}
			var file = getFile();
			if(dataUrlCb) {
				var base64_encode = require("./base64_encode");
				var dataUrl = "data:text/javascript;headers=Content-Disposition%3A%20attachment%3B%20jmpress.js%22%0D%0AContent-Language%3A%20en;charset=utf-8;base64," + base64_encode(file);
				dataUrlCb(dataUrl);
			}
			return file;
		});
	}
}
