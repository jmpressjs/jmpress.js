/*!
 * ajax.js
 * Load steps via ajax
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* DEFINES */
	var afterStepLoaded = 'ajax:afterStepLoaded',
		loadStep = 'ajax:loadStep';

	/* REGISTER EVENTS */
	$jmpress('register', loadStep);
	$jmpress('register', afterStepLoaded);

	/* DEFAULTS */
	$jmpress('defaults').ajaxLoadedClass = "loaded";

	/* HOOKS */
	$jmpress('initStep', function( step, eventData ) {
		eventData.stepData.src = $(step).attr('href') || eventData.data.src || false;
		eventData.stepData.srcLoaded = false;
	});
	$jmpress(loadStep, function( step, eventData ) {
		var stepData = eventData.stepData,
			href = stepData && stepData.src,
			settings = eventData.settings;
		if ( href ) {
			$(step).addClass( settings.ajaxLoadedClass );
			stepData.srcLoaded = true;
			$(step).load(href, function(response, status, xhr) {
				$(eventData.jmpress).jmpress('fire', afterStepLoaded, step, $.extend({}, eventData, {
					response: response
					,status: status
					,xhr: xhr
				}));
			});
		}
	});
	$jmpress('idle', function( step, eventData ) {
		if (!step) {
			return;
		}
		var settings = eventData.settings,
			jmpress = $(this),
			stepData = eventData.stepData;
		var siblings = $(step)
			.add( $(step).near( settings.stepSelector ) )
			.add( $(step).near( settings.stepSelector, true) )
			.add( jmpress.jmpress('fire', 'selectPrev', step, {
				stepData: $(step).data('stepData')
			}))
			.add( jmpress.jmpress('fire', 'selectNext', step, {
				stepData: $(step).data('stepData')
			}));
		siblings.each(function() {
			var step = this,
				stepData = $(step).data("stepData");
			if(!stepData.src || stepData.srcLoaded) {
				return;
			}
			jmpress.jmpress('fire', loadStep, step, {
				stepData: $(step).data('stepData')
			});
		});
	});
	$jmpress("setActive", function(step, eventData) {
		var stepData = $(step).data("stepData");
		if(!stepData.src || stepData.srcLoaded) {
			return;
		}
		$(this).jmpress('fire', loadStep, step, {
			stepData: $(step).data('stepData')
		});
	});

}(jQuery, document, window));