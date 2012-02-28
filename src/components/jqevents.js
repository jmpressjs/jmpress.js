/*!
 * jqevents.js
 */
(function( $, document, window, undefined ) {

	'use strict';

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/* HOOKS */
	// the events should not bubble up the tree
	// elsewise nested jmpress would cause buggy behavior
	$.jmpress("setActive", function( step, eventData ) {
		if(eventData.prevStep !== step) {
			$(step).triggerHandler("enterStep");
		}
	});
	$.jmpress("setInactive", function( step, eventData ) {
		if(eventData.nextStep !== step) {
			$(step).triggerHandler("leaveStep");
		}
	});

}(jQuery, document, window));