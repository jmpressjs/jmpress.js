/*!
 * mobile.js
 * Adds support for swipe on touch supported browsers
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/* HOOKS */
	$jmpress( 'afterInit', function( step, eventData ) {
		var settings = eventData.settings,
			current = eventData.current,
			jmpress = eventData.jmpress;
		current.mobileNamespace = ".jmpress-"+randomString();
		var data, start = [0,0];
		$(settings.fullscreen ? document : jmpress)
			.bind("touchstart"+current.mobileNamespace, function( event ) {

			data = event.originalEvent.touches[0];
			start = [ data.pageX, data.pageY ];

		}).bind("touchmove"+current.mobileNamespace, function( event ) {
			data = event.originalEvent.touches[0];
			event.preventDefault();
			return false;
		}).bind("touchend"+current.mobileNamespace, function( event ) {
			var end = [ data.pageX, data.pageY ],
				diff = [ end[0]-start[0], end[1]-start[1] ];

			if(Math.max(Math.abs(diff[0]), Math.abs(diff[1])) > 50) {
				diff = Math.abs(diff[0]) > Math.abs(diff[1]) ? diff[0] : diff[1];
				$(jmpress).jmpress(diff > 0 ? "prev" : "next");
				event.preventDefault();
				return false;
			}
		});
	});
	$jmpress('afterDeinit', function( nil, eventData ) {
		var settings = eventData.settings,
			current = eventData.current,
			jmpress = eventData.jmpress;
		$(settings.fullscreen ? document : jmpress).unbind(current.mobileNamespace);
	});

}(jQuery, document, window));