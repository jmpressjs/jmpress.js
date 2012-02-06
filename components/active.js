(function( $, document, window, undefined ) {

	'use strict';

	$.jmpress("defaults").nestedActiveClass = "nested-active";
	$.jmpress( 'defaults' ).activeClass = "active";
	$.jmpress( 'setInactive', function( step, eventData ) {
		if(eventData.settings.activeClass) {
			$(step).removeClass( eventData.settings.activeClass );
		}
		if(eventData.settings.nestedActiveClass) {
			$.each(eventData.parents, function(idx, element) {
				$(element).removeClass(eventData.settings.nestedActiveClass);
			});
		}
	});
	$.jmpress( 'setActive', function( step, eventData ) {
		if(eventData.settings.activeClass) {
			$(step).addClass( eventData.settings.activeClass );
		}
		if(eventData.settings.nestedActiveClass) {
			$.each(eventData.parents, function(idx, element) {
				$(element).addClass(eventData.settings.nestedActiveClass);
			});
		}
	});

}(jQuery, document, window));