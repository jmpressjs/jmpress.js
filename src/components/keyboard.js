/*!
 * keyboard.js
 * Keyboard event mapping and default keyboard actions
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress,
		jmpressNext = "next",
		jmpressPrev = "prev";

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}
	function stopEvent(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	/* DEFAULTS */
	$jmpress('defaults').keyboard = {
		use: true
		,keys: {
			33: jmpressPrev // pg up
			,37: jmpressPrev // left
			,38: jmpressPrev // up

			,9: jmpressNext+":"+jmpressPrev // tab
			,32: jmpressNext // space
			,34: jmpressNext // pg down
			,39: jmpressNext // right
			,40: jmpressNext // down

			,36: "home" // home

			,35: "end" // end
		}
		,ignore: {
			"INPUT": [
				32 // space
				,37 // left
				,38 // up
				,39 // right
				,40 // down
			]
			,"TEXTAREA": [
				32 // space
				,37 // left
				,38 // up
				,39 // right
				,40 // down
			]
			,"SELECT": [
				38 // up
				,40 // down
			]
		}
		,tabSelector: "a[href]:visible, :input:visible"
	};

	/* HOOKS */
	$jmpress('afterInit', function( nil, eventData ) {
		var settings = eventData.settings,
			keyboardSettings = settings.keyboard,
			ignoreKeyboardSettings = keyboardSettings.ignore,
			current = eventData.current,
			jmpress = $(this);

		// tabindex make it focusable so that it can recieve key events
		if(!settings.fullscreen) {
			jmpress.attr("tabindex", 0);
		}

		current.keyboardNamespace = ".jmpress-"+randomString();

		// KEYPRESS EVENT: this fixes a Opera bug
		$(settings.fullscreen ? document : jmpress)
			.bind("keypress"+current.keyboardNamespace, function( event ) {

			for( var nodeName in ignoreKeyboardSettings ) {
				if ( event.target.nodeName === nodeName && ignoreKeyboardSettings[nodeName].indexOf(event.which) !== -1 ) {
					return;
				}
			}
			if(event.which >= 37 && event.which <= 40 || event.which === 32) {
				stopEvent(event);
			}
		});
		// KEYDOWN EVENT
		$(settings.fullscreen ? document : jmpress)
			.bind("keydown"+current.keyboardNamespace, function( event ) {
			var eventTarget = $(event.target);

			if ( !settings.fullscreen && !eventTarget.closest(jmpress).length || !keyboardSettings.use ) {
				return;
			}

			for( var nodeName in ignoreKeyboardSettings ) {
				if ( eventTarget[0].nodeName === nodeName && ignoreKeyboardSettings[nodeName].indexOf(event.which) !== -1 ) {
					return;
				}
			}

			var reverseSelect = false;
			var nextFocus;
			if (event.which === 9) {
				// tab
				if ( !eventTarget.closest( jmpress.jmpress('active') ).length ) {
					if ( !event.shiftKey ) {
						nextFocus = jmpress.jmpress('active').find("a[href], :input").filter(":visible").first();
					} else {
						reverseSelect = true;
					}
				} else {
					nextFocus = eventTarget.near( keyboardSettings.tabSelector, event.shiftKey );
					if( !$(nextFocus)
						.closest( settings.stepSelector )
						.is(jmpress.jmpress('active') ) ) {
						nextFocus = undefined;
					}
				}
				if( nextFocus && nextFocus.length > 0 ) {
					nextFocus.focus();
					jmpress.jmpress("scrollFix");
					stopEvent(event);
					return;
				} else {
					if(event.shiftKey) {
						reverseSelect = true;
					}
				}
			}

			var action = keyboardSettings.keys[ event.which ];
			if ( typeof action === "string" ) {
				if (action.indexOf(":") !== -1) {
					action = action.split(":");
					action = event.shiftKey ? action[1] : action[0];
				}
				jmpress.jmpress( action );
				stopEvent(event);
			} else if ( $.isFunction(action) ) {
				action.call(jmpress, event);
			} else if ( action ) {
				jmpress.jmpress.apply( jmpress, action );
				stopEvent(event);
			}

			if (reverseSelect) {
				// tab
				nextFocus = jmpress.jmpress('active').find("a[href], :input").filter(":visible").last();
				nextFocus.focus();
				jmpress.jmpress("scrollFix");
			}
		});
	});
	$jmpress('afterDeinit', function( nil, eventData ) {
		$(document).unbind(eventData.current.keyboardNamespace);
	});


}(jQuery, document, window));