/**
 * Viewport Key Zoom In & Out
 * Ability to press + and - to zoom the viewport in and out.
 * 
 * Adds the option:
 * $(selector).jmpress({ viewPort: { keyZoomAmount: 1000 } });
 */
(function( $, document, window, undefined ) {
	'use strict';
	$.jmpress("defaults").viewPort.keyZoomAmount = 100;
	$.extend(true, $.jmpress('defaults').keyboard.keys, {
		187: 'zoomin' // plus
		,189: 'zoomout' // minus
	});
	$.jmpress("register", "zoomin", function() {
		var settings = $(this).jmpress('settings');
		if ( settings.viewPort.width ) {
			settings.viewPort.width += settings.viewPort.keyZoomAmount;
		}
		if ( settings.viewPort.height ) {
			settings.viewPort.height += settings.viewPort.keyZoomAmount;
		}
		$(this).jmpress("select", $(this).jmpress("active"), "resize");
	});
	$.jmpress("register", "zoomout", function() {
		var settings = $(this).jmpress('settings');
		if ( settings.viewPort.width ) {
			settings.viewPort.width -= settings.viewPort.keyZoomAmount;
		}
		if ( settings.viewPort.height ) {
			settings.viewPort.height -= settings.viewPort.keyZoomAmount;
		}
		$(this).jmpress("select", $(this).jmpress("active"), "resize");
	});
}(jQuery, document, window));