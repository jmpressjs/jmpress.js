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
		process.nextTick(function() {
			download(false, function(dataUrl) {
				$("#dataurl").show();
				$("#dataurl").attr("href", dataUrl);
			});
		});
	});
	function invalidate() {
		$("#dataurl").hide();
		$("#download").attr("disabled", false);
	}
	$("input").change(invalidate);
	config.settings.forEach(function(setting) {
		$("<p>").html(require("./setting.jade")(setting))
			.appendTo("#settings")
			.click(function() {
				loadSetting(setting);
				invalidate();
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
		if(dataUrlCb) {
			var base64_encode = require("./base64_encode");
			var dataUrl = "data:text/javascript;headers=Content-Disposition%3A%20attachment%3B%20jmpress.js%22%0D%0AContent-Language%3A%20en;charset=utf-8;base64," + base64_encode(file);
			dataUrlCb(dataUrl);
		}
		return file;
	});
}

download(true);