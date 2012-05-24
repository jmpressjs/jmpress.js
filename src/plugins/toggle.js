/*!
 * jmpress.toggle plugin
 * For binding a key to toggle de/initialization of jmpress.js.
 */
(function( $, document, window, undefined ) {
	'use strict';
	$.jmpress("register", "toggle", function( key, config, initial ) {
		var jmpress = this;
		$(document).bind("keydown", function( event ) {
			if ( event.keyCode === key ) {
				if ($(jmpress).jmpress("initialized")) {
					$(jmpress).jmpress("deinit");
				} else {
					$(jmpress).jmpress(config);
				}
			}
		});
		if ( initial ) {
			$(jmpress).jmpress(config);
		}
	});
}(jQuery, document, window));
