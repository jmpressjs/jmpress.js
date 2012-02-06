(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	var templates = {};
	function addUndefined( target, values, prefix ) {
		for( var name in values ) {
			var targetName = name;
			if ( prefix ) {
				targetName = prefix + targetName.substr(0, 1).toUpperCase() + targetName.substr(1);
			}
			if ( $.isPlainObject(values[name]) ) {
				addUndefined( target, values[name], targetName );
			} else if( target[targetName] === undefined ) {
				target[targetName] = values[name];
			}
		}
	}
	function applyChildrenTemplates( children, templateChildren ) {
		if ($.isArray(templateChildren)) {
			if (templateChildren.length < children.length) {
				$.error("more nested steps than children in template");
			} else {
				children.each(function(idx, child) {
					var tmpl = $(child).data("_template_") || {};
					addUndefined(tmpl, templateChildren[idx]);
					$(child).data("_template_", tmpl);
				});
			}
		} else if($.isFunction(templateChildren)) {
			children.each(function(idx, child) {
				var tmpl = $(child).data("_template_") || {};
				addUndefined(tmpl, templateChildren(idx, child));
				$(child).data("_template_", tmpl);
			});
		} // TODO: else if(object)
	}
	$.jmpress("beforeInitStep", function( step, eventData ) {
		function applyTemplate( data, element, template ) {
			if (template.children) {
				var children = $(element).children( eventData.settings.stepSelector );
				applyChildrenTemplates( children, template.children );
			}
			applyTemplateData( data, template );
		}
		function applyTemplateData( data, template ) {
			addUndefined(data, template);
		}
		var templateToApply = eventData.data.template;
		if(templateToApply) {
			$.each(templateToApply.split(" "), function(idx, tmpl) {
				var template = templates[tmpl];
				applyTemplate( eventData.data, step, template );
			});
		}
		var templateFromApply = $(step).data("_applied_template_");
		if (templateFromApply) {
			applyTemplate( eventData.data, step, templateFromApply );
		}
		var templateFromParent = $(step).data("_template_");
		if (templateFromParent) {
			applyTemplate( eventData.data, step, templateFromParent );
			step.data("_template_", null);
			if(templateFromParent.template) {
				$.each(templateFromParent.template.split(" "), function(idx, tmpl) {
					var template = templates[tmpl];
					applyTemplate( eventData.data, step, template );
				});
			}
		}
	});
	$.jmpress("beforeInit", function( nil, eventData ) {
		var data = $.jmpress("dataset", this);
		if (data.template) {
			var template = templates[data.template];
			applyChildrenTemplates( $(this).find(eventData.settings.stepSelector).filter(function() {
				return !$(this).parent().is(eventData.settings.stepSelector);
			}), template.children );
		}
	});
	$.jmpress("register", "template", function( name, tmpl ) {
		if (templates[name]) {
			templates[name] = $.extend(true, {}, templates[name], tmpl);
		} else {
			templates[name] = $.extend(true, {}, tmpl);
		}
	});
	$.jmpress("register", "apply", function( selector, tmpl ) {
		if( !tmpl ) {
			// TODO ERROR because settings not found
			var stepSelector = $(this).jmpress("settings").stepSelector;
			applyChildrenTemplates( $(this).find(stepSelector).filter(function() {
				return !$(this).parent().is(stepSelector);
			}), selector );
		} else if($.isArray(tmpl)) {
			applyChildrenTemplates( $(selector), tmpl );
		} else {
			var template;
			if(typeof tmpl === "string") {
				template = templates[tmpl];
			} else {
				template = $.extend(true, {}, tmpl);
			}
			$(selector).each(function(idx, element) {
				var tmpl = $(element).data("_applied_template_") || {};
				addUndefined(tmpl, template);
				$(element).data("_applied_template_", tmpl);
			});
		}
	});

}(jQuery, document, window));