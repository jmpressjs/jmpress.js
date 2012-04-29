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
	$jmpress('loadSteps', function( step, eventData ) {
		if (!step) {
			return;
		}
		var settings = eventData.settings,
			jmpress = $(this);
		if ( $(settings.stepSelector).filter('[data-src],[href]').length < 1 ) {
			return;
		}
		var siblings = $(step).near( settings.stepSelector )
			.add( $(step).near( settings.stepSelector, true) )
			.add( jmpress.jmpress('selectPrev', step, {
				stepData: $(step).data('stepData')
			}))
			.add( jmpress.jmpress('selectNext', step, {
				stepData: $(step).data('stepData')
			}));
		siblings.each(function() {
			var step = this;
			if ($(step).hasClass( settings.loadedClass )) {
				return;
			}
			setTimeout(function() {
				if ($(step).hasClass( settings.loadedClass )) {
					return;
				}
				jmpress.jmpress('loadStep', step, {
					stepData: $(step).data('stepData')
				});
				$(step).addClass( settings.loadedClass );
			}, settings.transitionDuration - 100);
		});
		if ($(step).hasClass( settings.loadedClass )) {
			return;
		}
		jmpress.jmpress('loadStep', step, {
			stepData: $(step).data('stepData')
		});
		$(step).addClass( settings.loadedClass );
	});

}(jQuery, document, window));