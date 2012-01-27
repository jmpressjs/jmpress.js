(function( $, document, window, undefined ) {
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
				$.jmpress("css", $(eventData.settings.duration.barSelector), css);
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
					,transitionDuration: (dur-1000)+"ms"
					,transitionDelay: '1000ms' // TODO use step transition time
					,transitionTimingFunction: 'linear'
				};
				css[eventData.settings.duration.barProperty] = eventData.settings.duration.barPropertyEnd
				setTimeout(function() {
					$.jmpress("css", $(eventData.settings.duration.barSelector), css);
				}, 10);
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
