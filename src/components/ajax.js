/*!
 * ajax.js
 * Load steps via ajax
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* DEFINES */
	var afterStepLoaded = 'afterStepLoaded';

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/* REGISTER EVENTS */
	$jmpress('register', afterStepLoaded);

	/* HOOKS */
	$jmpress('initStep', function( step, eventData ) {
		eventData.stepData.src = $(step).attr('href') || eventData.data.src || false;
	});
	$jmpress('loadStep', function( step, eventData ) {
		var stepData = eventData.stepData,
			href = stepData && stepData.src;
		if ( href ) {
			$(step).load(href, function(response, status, xhr) {
				$(eventData.jmpress).jmpress('fire', afterStepLoaded, step, $.extend({}, eventData, {
					response: response
					,status: status
					,xhr: xhr
				}));
			});
		}
	});

}(jQuery, document, window));