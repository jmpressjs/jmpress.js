/*!
 * mouse.js
 * Clicking to select a step
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/* DEFAULTS */
	$jmpress("defaults").mouse = {
		clickSelects: true
	};

	/* HOOKS */
	$jmpress("afterInit", function( nil, eventData ) {
		var settings = eventData.settings,
			stepSelector = settings.stepSelector,
			current = eventData.current,
			jmpress = $(this);
		current.clickableStepsNamespace = ".jmpress-"+randomString();
		jmpress.bind("click"+current.clickableStepsNamespace, function(event) {
			if (!settings.mouse.clickSelects || current.userZoom) {
				return;
			}

			// get clicked step
			var clickedStep = $(event.target).closest(stepSelector);

			// clicks on the active step do default
			if ( clickedStep.is( jmpress.jmpress("active") ) ) {
				return;
			}

			if (clickedStep.length) {
				// select the clicked step
				jmpress.jmpress("select", clickedStep[0], "click");
				event.preventDefault();
				event.stopPropagation();
			}
		});
	});
	$jmpress('afterDeinit', function( nil, eventData ) {
		$(this).unbind(eventData.current.clickableStepsNamespace);
	});

}(jQuery, document, window));