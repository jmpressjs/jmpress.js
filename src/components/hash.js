(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	$.jmpress('defaults').hash = {
		use: true
		,update: true
		,bindChange: true
		// NOTICE: {use: true, update: false, bindChange: true}
		// will cause a error after clicking on a link to the current step
	};
	$.jmpress('selectInitialStep', function( step, eventData ) {
		/**
		 * getElementFromUrl
		 *
		 * @return String or undefined
		 */
		function getElementFromUrl() {
			// get id from url # by removing `#` or `#/` from the beginning,
			// so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
			// TODO SECURITY check user input to be valid!
			try {
				var el = $( '#' + window.location.hash.replace(/^#\/?/,"") );
				return el.length > 0 && el.is(eventData.settings.stepSelector) ? el : undefined;
			} catch(e) {}
		}
		eventData.current.hashNamespace = ".jmpress-"+randomString();
		// HASH CHANGE EVENT
		if ( eventData.settings.hash.use && eventData.settings.hash.bindChange ) {
			var jmpress = this;
			$(window).bind('hashchange'+eventData.current.hashNamespace, function() {
				var id = getElementFromUrl();
				$(jmpress).jmpress("scrollFix");
				if(id) {
					if($(id).attr("id") !== $(jmpress).jmpress("active").attr("id")) {
						$(jmpress).jmpress('select', id);
					}
					var shouldBeHash = "#/" + $(id).attr("id");
					if(window.location.hash !== shouldBeHash) {
						window.location.hash = shouldBeHash;
					}
				}
			});
			$("a[href^=#]").on("click"+eventData.current.hashNamespace, function(event) {
				var href = $(this).attr("href");
				try {
					if($(href).is(eventData.settings.stepSelector)) {
						$(jmpress).jmpress("select", href);
						event.preventDefault();
						event.stopPropagation();
					}
				} catch(e) {}
			});
		}
		if ( eventData.settings.hash.use ) {
			return getElementFromUrl();
		}
	});
	$.jmpress('afterDeinit', function( nil, eventData ) {
		$("a[href^=#]").off(eventData.current.hashNamespace);
		$(window).unbind(eventData.current.hashNamespace);
	});
	$.jmpress('setActive', function( step, eventData ) {
		// `#/step-id` is used instead of `#step-id` to prevent default browser
		// scrolling to element in hash
		if ( eventData.settings.hash.use && eventData.settings.hash.update ) {
			clearTimeout(eventData.current.hashtimeout);
			eventData.current.hashtimeout = setTimeout(function() {
				window.location.hash = "#/" + $(eventData.delegatedFrom).attr('id');
			}, eventData.settings.transitionDuration + 200);
		}
	});

}(jQuery, document, window));