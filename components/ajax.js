(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	$.jmpress('register', 'afterStepLoaded');
	$.jmpress('initStep', function( step, eventData ) {
		eventData.stepData.src = $(step).attr('href') || eventData.data.src || false;
	});
	$.jmpress('loadStep', function( step, eventData ) {
		var href = eventData.stepData.src;
		if ( href ) {
			$(step).load(href, function(response, status, xhr) {
				$(eventData.jmpress).jmpress('fire', 'afterStepLoaded', step, $.extend({}, eventData, {
					response: response
					,status: status
					,xhr: xhr
				}));
			});
		}
	});

}(jQuery, document, window));