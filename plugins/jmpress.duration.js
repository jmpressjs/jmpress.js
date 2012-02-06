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
		var dur = eventData.stepData.duration || eventData.settings.duration.defaultValue;
		if( dur && dur > 0 ) {
			if( eventData.settings.duration.barSelector ) {
				var css = {
					transitionProperty: eventData.settings.duration.barProperty
					,transitionDuration: '0'
					,transitionDelay: '0'
					,transitionTimingFunction: 'linear'
				};
				css[eventData.settings.duration.barProperty] = eventData.settings.duration.barPropertyStart
				var bars = $(eventData.settings.duration.barSelector);
				$.jmpress("css", bars, css);
				bars.each(function(idx, element) {
					var next = $(element).next();
					var parent = $(element).parent();
					$(element).detach();
					if(next.length)
						next.insertBefore(element);
					else
						parent.append(element);
				});
			}
			if(eventData.current.durationTimeout) {
				clearTimeout(eventData.current.durationTimeout);
				eventData.current.durationTimeout = undefined;
			}
		}
	});
	$.jmpress("setActive", function( step, eventData ) {
		var dur = eventData.stepData.duration || eventData.settings.duration.defaultValue;
		if( dur && dur > 0 ) {
			if( eventData.settings.duration.barSelector ) {
				var css = {
					transitionProperty: eventData.settings.duration.barProperty
					,transitionDuration: (dur-eventData.settings.transitionDuration*2/3-100)+"ms"
					,transitionDelay: (eventData.settings.transitionDuration*2/3)+'ms'
					,transitionTimingFunction: 'linear'
				};
				css[eventData.settings.duration.barProperty] = eventData.settings.duration.barPropertyEnd
				$.jmpress("css", $(eventData.settings.duration.barSelector), css);
			}
			var jmpress = this;
			if(eventData.current.durationTimeout) {
				clearTimeout(eventData.current.durationTimeout);
				eventData.current.durationTimeout = undefined;
			}
			eventData.current.durationTimeout = setTimeout(function() {
				var action = eventData.stepData.durationAction || eventData.settings.duration.defaultAction;
				$(jmpress).jmpress(action);
			}, dur);
		}
	});
})(jQuery, document, window);
