/*!
 * active.js
 * Set the active classes on steps
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* DEFINES */
	var activeClass = 'activeClass',
		nestedActiveClass = 'nestedActiveClass';

	/* DEFAULTS */
	var defaults = $jmpress( 'defaults' );
	defaults[nestedActiveClass] = "nested-active";
	defaults[activeClass]       = "active";

	/* HOOKS */
	$jmpress( 'setInactive', function( step, eventData ) {
		var settings = eventData.settings,
			activeClassSetting = settings[activeClass],
			nestedActiveClassSettings = settings[nestedActiveClass];
		if(activeClassSetting) {
			$(step).removeClass( activeClassSetting );
		}
		if(nestedActiveClassSettings) {
			$.each(eventData.parents, function(idx, element) {
				$(element).removeClass(nestedActiveClassSettings);
			});
		}
	});
	$jmpress( 'setActive', function( step, eventData ) {
		var settings = eventData.settings,
			activeClassSetting = settings[activeClass],
			nestedActiveClassSettings = settings[nestedActiveClass];
		if(activeClassSetting) {
			$(step).addClass( activeClassSetting );
		}
		if(nestedActiveClassSettings) {
			$.each(eventData.parents, function(idx, element) {
				$(element).addClass(nestedActiveClassSettings);
			});
		}
	});

}(jQuery, document, window));