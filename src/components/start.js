/*!
 * start.js
 * Set the first step to start on
 */
(function( $, document, window, undefined ) {

	'use strict';

	/* HOOKS */
	$.jmpress( 'selectInitialStep', function( nil, eventData ) {
		return eventData.settings.start;
	});

}(jQuery, document, window));