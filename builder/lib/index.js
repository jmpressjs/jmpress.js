var $ = require("jquery");

var config = require("./config.json");

$(function() {
	$("body").html(require("./body.jade")());
	config.components.forEach(function(component) {
		$("<div>")
			.addClass("control-group")
			.html(require("./component.jade")(component))
			.insertBefore("#form-actions");
	});
	$("#download").click(function() {
		$(this).attr("disabled", true);
		$("#progress").show();
		process.nextTick(function() {
			download(true);
		});
	});
	config.settings.forEach(function(setting) {
		$("<p>").html(require("./setting.jade")(setting))
			.appendTo("#settings")
			.click(function() {
				loadSetting(setting);
			});
	});
	loadSetting(config.settings[0]);
});

function loadSetting(setting) {
	config.components.forEach(function(component) {
		$("#component-"+component.name).attr("checked", false);
	});
	setting.components.forEach(function(component) {
		$("#component-"+component).attr("checked", true);
	});
}

function download(navigate, init) {
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
					swf: 'web_modules/downloadify/media/downloadify.swf',
					width: 78,
					height: 28,
					transparent: true,
					downloadImage: "download.png"
				});
			});
			return;
		}
		function getFile() {
			var build = require("./build");
			var options = {};
			config.components.forEach(function(component) {
				options[component.name] = $("#component-"+component.name).attr("checked");
			});
			return build(options);
		}
		var file = getFile();
		if(navigate) {
			var base64_encode = require("./base64_encode");
			var dataUrl = "data:application/javascript;base64," + base64_encode(file);
			window.location = dataUrl;
		} else {
			return file;
		}
	});
}

download(false, true);