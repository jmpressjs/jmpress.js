/*!
 * plugin for jmpress.js v0.3.5
 *
 * Copyright 2012 Kyle Robinson Young @shama & Tobias Koppers @sokra
 * Licensed MIT
 * http://www.opensource.org/licenses/mit-license.php
 */

/*!
 * jmpress.toggle plugin
 * For binding a key to toggle de/initialization of jmpress.js.
 */
(function( $, document, window, undefined ) {
	'use strict';
	$.jmpress("register", "toggle", function( key, config, initial ) {
		var jmpress = this;
		$(document).bind("keydown", function( event ) {
			if ( event.keyCode === key ) {
				if ($(jmpress).jmpress("initialized")) {
					$(jmpress).jmpress("deinit");
				} else {
					$(jmpress).jmpress(config);
				}
			}
		});
		if ( initial ) {
			$(jmpress).jmpress(config);
		}
	});
}(jQuery, document, window));

/*!
 * jmpress.secondary plugin
 * Apply a secondary animation when step is selected.
 */
(function( $, document, window, undefined ) {
	'use strict';
	$.jmpress("initStep", function( step, eventData ) {
		for(var name in eventData.data) {
			if(name.indexOf("secondary") === 0) {
				eventData.stepData[name] = eventData.data[name];
			}
		}
	});
	function exchangeIf(childStepData, condition, step) {
		if(childStepData.secondary &&
			childStepData.secondary.split(" ").indexOf(condition) !== -1) {
			for(var name in childStepData) {
				if(name.length > 9 && name.indexOf("secondary") === 0) {
					var tmp = childStepData[name];
					var normal = name.substr(9);
					normal = normal.substr(0, 1).toLowerCase() + normal.substr(1);
					childStepData[name] = childStepData[normal];
					childStepData[normal] = tmp;
				}
			}
			$(this).jmpress("reapply", $(step));
		}
	}
	$.jmpress("beforeActive", function( step, eventData ) {
		exchangeIf.call(eventData.jmpress, $(step).data("stepData"), "self", step);
		var parent = $(step).parent();
		$(parent)
			.children(eventData.settings.stepSelector)
			.each(function(idx, child) {
				var childStepData = $(child).data("stepData");
				exchangeIf.call(eventData.jmpress, childStepData, "siblings", child);
			});
		function grandchildrenFunc(idx, child) {
			var childStepData = $(child).data("stepData");
			exchangeIf.call(eventData.jmpress, childStepData, "grandchildren", child);
		}
		for(var i = 1; i < eventData.parents.length; i++) {
			$(eventData.parents[i])
				.children(eventData.settings.stepSelector)
				.each();
		}
	});
	$.jmpress("setInactive", function( step, eventData ) {
		exchangeIf.call(eventData.jmpress, $(step).data("stepData"), "self", step);
		var parent = $(step).parent();
		$(parent)
			.children(eventData.settings.stepSelector)
			.each(function(idx, child) {
				var childStepData = $(child).data("stepData");
				exchangeIf.call(eventData.jmpress, childStepData, "siblings", child);
			});
		function grandchildrenFunc(idx, child) {
			var childStepData = $(child).data("stepData");
			exchangeIf.call(eventData.jmpress, childStepData, "grandchildren", child);
		}
		for(var i = 1; i < eventData.parents.length; i++) {
			$(eventData.parents[i])
				.children(eventData.settings.stepSelector)
				.each(grandchildrenFunc);
		}
	});
}(jQuery, document, window));

/*!
 * jmpress.duration plugin
 * For auto advancing steps after a given duration and optionally displaying a
 * progress bar.
 */
(function( $, document, window, undefined ) {
	'use strict';

	$.jmpress("defaults").duration = {
		defaultValue: -1
		,defaultAction: "next"
		,barSelector: undefined
		,barProperty: "width"
		,barPropertyStart: "0"
		,barPropertyEnd: "100%"
	};
	$.jmpress("initStep", function( step, eventData ) {
		eventData.stepData.duration = eventData.data.duration;
		eventData.stepData.durationAction = eventData.data.durationAction;
	});
	$.jmpress("setInactive", function( step, eventData ) {
		var settings = eventData.settings,
			durationSettings = settings.duration,
			current = eventData.current;
		var dur = eventData.stepData.duration || durationSettings.defaultValue;
		if( dur && dur > 0 ) {
			if( durationSettings.barSelector ) {
				var css = {
					transitionProperty: durationSettings.barProperty
					,transitionDuration: '0'
					,transitionDelay: '0'
					,transitionTimingFunction: 'linear'
				};
				css[durationSettings.barProperty] = durationSettings.barPropertyStart;
				var bars = $(durationSettings.barSelector);
				$.jmpress("css", bars, css);
				bars.each(function(idx, element) {
					var next = $(element).next();
					var parent = $(element).parent();
					$(element).detach();
					if(next.length) {
						next.insertBefore(element);
					} else {
						parent.append(element);
					}
				});
			}
			if(current.durationTimeout) {
				clearTimeout(current.durationTimeout);
				current.durationTimeout = undefined;
			}
		}
	});
	$.jmpress("setActive", function( step, eventData ) {
		var settings = eventData.settings,
			durationSettings = settings.duration,
			current = eventData.current;
		var dur = eventData.stepData.duration || durationSettings.defaultValue;
		if( dur && dur > 0 ) {
			if( durationSettings.barSelector ) {
				var css = {
					transitionProperty: durationSettings.barProperty
					,transitionDuration: (dur-settings.transitionDuration*2/3-100)+"ms"
					,transitionDelay: (settings.transitionDuration*2/3)+'ms'
					,transitionTimingFunction: 'linear'
				};
				css[durationSettings.barProperty] = durationSettings.barPropertyEnd;
				$.jmpress("css", $(durationSettings.barSelector), css);
			}
			var jmpress = this;
			if(current.durationTimeout) {
				clearTimeout(current.durationTimeout);
				current.durationTimeout = undefined;
			}
			current.durationTimeout = setTimeout(function() {
				var action = eventData.stepData.durationAction || durationSettings.defaultAction;
				$(jmpress).jmpress(action);
			}, dur);
		}
	});
}(jQuery, document, window));
