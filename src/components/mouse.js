(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	$.jmpress("defaults").mouse = {
		clickSelects: true
	};
	$.jmpress("afterInit", function( nil, eventData ) {
		eventData.current.clickableStepsNamespace = ".jmpress-"+randomString();
		var jmpress = this;
		$(this).bind("click"+eventData.current.clickableStepsNamespace, function(event) {
			if (!eventData.settings.mouse.clickSelects || eventData.current.userZoom) {
				return;
			}
			// clicks on the active step do default
			if ( $(event.target)
				.closest( eventData.settings.stepSelector)
				.is( $(jmpress).jmpress("active") ) ) {
					return;
				}

			// get clicked step
			var clickedStep = $(event.target).closest(eventData.settings.stepSelector);

			if (clickedStep.length) {
				// select the clicked step
				$(this).jmpress("select", clickedStep[0], "click");
				event.preventDefault();
				event.stopPropagation();
			}
		});
	});
	$.jmpress('afterDeinit', function( nil, eventData ) {
		$(this).unbind(eventData.current.clickableStepsNamespace);
	});

}(jQuery, document, window));