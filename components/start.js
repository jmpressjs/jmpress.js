(function( $, document, window, undefined ) {

	'use strict';

	$.jmpress( 'selectInitialStep', function( nil, eventData ) {
		return eventData.settings.start;
	});

}(jQuery, document, window));