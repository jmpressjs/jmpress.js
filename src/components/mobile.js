/*!
 * ways.js
 * Control the flow of the steps
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
		$(settings.fullscreen ? document : jmpress)
			.bind("touchstart"+current.mobileNamespace, function( event ) {

			var data = event.orginalEvent.touches[0];
			var start = [ data.pageX, data.pageY ];
			
			$(this).one("touchend", function( event ) {
				var data = event.orginalEvent.touches[0],
					end = [ data.pageX, data.pageY ],
					diff = [ end[0]-start[0], end[1]-start[1] ];

				if(Math.max(Math.abs(diff[0]), Math.abs(diff[1])) > 50) {
					diff = Math.abs(diff[0]) > Math.abs(diff[1]) ? diff[0] : diff[1];
					$(eventData.jmpress).jmpress(diff < 0 ? "prev" : "next");
				}
			});
		});
	});
	$jmpress('afterDeinit', function( nil, eventData ) {
		var settings = eventData.settings,
			current = eventData.current,
			jmpress = eventData.jmpress;
		$(settings.fullscreen ? document : jmpress).unbind(current.mobileNamespace);
	});

}(jQuery, document, window));