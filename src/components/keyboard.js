(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	$.jmpress('defaults').keyboard = {
		use: true
		,keys: {
			33: "prev" // pg up
			,37: "prev" // left
			,38: "prev" // up

			,9: "next:prev" // tab
			,32: "next" // space
			,34: "next" // pg down
			,39: "next" // right
			,40: "next" // down

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
	$.jmpress('afterInit', function( nil, eventData ) {
		var mysettings = eventData.settings.keyboard;
		var jmpress = this;


		// tabindex make it focusable so that it can recieve key events
		if(!eventData.settings.fullscreen) {
			$(this).attr("tabindex", 0);
		}

		eventData.current.keyboardNamespace = ".jmpress-"+randomString();

		// KEYPRESS EVENT: this fixes a Opera bug
		$(eventData.settings.fullscreen ? document : this)
			.bind("keypress"+eventData.current.keyboardNamespace, function( event ) {

			for( var nodeName in mysettings.ignore ) {
				if ( event.target.nodeName === nodeName && mysettings.ignore[nodeName].indexOf(event.which) !== -1 ) {
					return;
				}
			}
			if(event.keyCode >= 37 && event.keyCode <= 40) {
				event.preventDefault();
				event.stopPropagation();
			}
		});
		// KEYDOWN EVENT
		$(eventData.settings.fullscreen ? document : this)
			.bind("keydown"+eventData.current.keyboardNamespace, function( event ) {
			if ( !eventData.settings.fullscreen && !$(event.target).closest(jmpress).length || !mysettings.use ) {
				return;
			}

			for( var nodeName in mysettings.ignore ) {
				if ( event.target.nodeName === nodeName && mysettings.ignore[nodeName].indexOf(event.which) !== -1 ) {
					return;
				}
			}

			var reverseSelect = false;
			var nextFocus;
			if (event.which === 9) {
				// tab
				if ( !$(event.target).closest( $(jmpress).jmpress('active') ).length ) {
					if ( !event.shiftKey ) {
						nextFocus = $(jmpress).jmpress('active').find("a[href], :input").filter(":visible").first();
					} else {
						reverseSelect = true;
					}
				} else {
					nextFocus = $(event.target).near( mysettings.tabSelector, event.shiftKey );
					if( !$(nextFocus)
						.closest( eventData.settings.stepSelector )
						.is($(jmpress).jmpress('active') ) ) {
						nextFocus = undefined;
					}
				}
				if( nextFocus && nextFocus.length > 0 ) {
					nextFocus.focus();
					$(jmpress).jmpress("scrollFix");
					event.preventDefault();
					event.stopPropagation();
					return;
				} else {
					if(event.shiftKey) {
						reverseSelect = true;
					}
				}
			}

			var action = mysettings.keys[ event.which ];
			if ( typeof action === "string" ) {
				if (action.indexOf(":") !== -1) {
					action = action.split(":");
					action = event.shiftKey ? action[1] : action[0];
				}
				$(jmpress).jmpress( action );
				event.preventDefault();
				event.stopPropagation();
			} else if ( action ) {
				$(jmpress).jmpress.apply( $(this), action );
				event.preventDefault();
				event.stopPropagation();
			}

			if (reverseSelect) {
				// tab
				nextFocus = $(jmpress).jmpress('active').find("a[href], :input").filter(":visible").last();
				nextFocus.focus();
				$(jmpress).jmpress("scrollFix");
			}
		});
	});
	$.jmpress('afterDeinit', function( nil, eventData ) {
		$(document).unbind(eventData.current.keyboardNamespace);
	});


}(jQuery, document, window));