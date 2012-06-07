/*!
 * hash.js
 * Detect and set the URL hash
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress,
		hashLink = "a[href^=#]";

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}
	/**
	 * getElementFromUrl
	 *
	 * @return String or undefined
	 */
	function getElementFromUrl(settings) {
		// get id from url # by removing `#` or `#/` from the beginning,
		// so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
		// TODO SECURITY check user input to be valid!
		try {
			var el = $( '#' + window.location.hash.replace(/^#\/?/,"") );
			return el.length > 0 && el.is(settings.stepSelector) ? el : undefined;
		} catch(e) {}
	}
	function setHash(stepid) {
		var shouldBeHash = "#/" + stepid;
		if(window.history && window.history.pushState) {
			// shouldBeHash = "#" + stepid;
			// consider this for future versions
			//  it has currently issues, when startup with a link with hash (webkit)
			if(window.location.hash !== shouldBeHash) {
				window.history.pushState({}, '', shouldBeHash);
			}
		} else {
			if(window.location.hash !== shouldBeHash) {
				window.location.hash = shouldBeHash;
			}
		}
	}

	/* DEFAULTS */
	$jmpress('defaults').hash = {
		use: true
		,update: true
		,bindChange: true
		// NOTICE: {use: true, update: false, bindChange: true}
		// will cause a error after clicking on a link to the current step
	};

	/* HOOKS */
	$jmpress('selectInitialStep', function( step, eventData ) {
		var settings = eventData.settings,
			hashSettings = settings.hash,
			current = eventData.current,
			jmpress = $(this);
		eventData.current.hashNamespace = ".jmpress-"+randomString();
		// HASH CHANGE EVENT
		if ( hashSettings.use ) {
			if ( hashSettings.bindChange ) {
				$(window).bind('hashchange'+current.hashNamespace, function(event) {
					var urlItem = getElementFromUrl(settings);
					if ( jmpress.jmpress('initialized') ) {
						jmpress.jmpress("scrollFix");
					}
					if(urlItem && urlItem.length) {
						if(urlItem.attr("id") !== jmpress.jmpress("active").attr("id")) {
							jmpress.jmpress('select', urlItem);
						}
						setHash(urlItem.attr("id"));
					}
					event.preventDefault();
				});
				$(hashLink).on("click"+current.hashNamespace, function(event) {
					var href = $(this).attr("href");
					try {
						if($(href).is(settings.stepSelector)) {
							jmpress.jmpress("select", href);
							event.preventDefault();
							event.stopPropagation();
						}
					} catch(e) {}
				});
			}
			return getElementFromUrl(settings);
		}
	});
	$jmpress('afterDeinit', function( nil, eventData ) {
		$(hashLink).off(eventData.current.hashNamespace);
		$(window).unbind(eventData.current.hashNamespace);
	});
	$jmpress('setActive', function( step, eventData ) {
		var settings = eventData.settings,
			current = eventData.current;
		// `#/step-id` is used instead of `#step-id` to prevent default browser
		// scrolling to element in hash
		if ( settings.hash.use && settings.hash.update ) {
			clearTimeout(current.hashtimeout);
			current.hashtimeout = setTimeout(function() {
				setHash($(eventData.delegatedFrom).attr('id'));
			}, settings.transitionDuration + 200);
		}
	});

}(jQuery, document, window));