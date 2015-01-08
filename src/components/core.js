/*
 * core.js
 * The core of jmpress.js
 */
(function( $, document, window, undefined ) {

	"use strict";

	var methods, defaults, callbacks, callbackName,
		/**
		 * Set supported prefixes
		 *
		 * @access protected
		 * @return Function to get prefixed property
		 */
		pfx = (function() {
			var style = document.createElement( "dummy" ).style,
				prefixes = [ "Webkit", "Moz", "O", "ms", "Khtml", "" ],
				memory = {};
			return function( prop ) {
				var i, ucProp, props;
				if ( typeof memory[ prop ] === "undefined" ) {
					ucProp  = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 );
					props = ( prop + " " + prefixes.join( ucProp + " " ) + ucProp ).split( " " );
					memory[ prop ] = null;
					for ( i in props ) {
						if ( style[ props[ i ] ] !== undefined ) {
							memory[ prop ] = props[ i ];
							break;
						}
					}
				}
				return memory[ prop ];
			};
		}());

	/**
	 * map ex. "WebkitTransform" to "-webkit-transform"
	 */
	function mapProperty( name ) {
		var index, prefix, postfix;
		if ( !name ) {
			return;
		}
		index = 1 + name.substr( 1 ).search( /[A-Z]/ );
		prefix = name.substr( 0, index ).toLowerCase();
		if ( prefix === "" ) {
			return name.toLowerCase();
		}
		postfix = name.substr( index ).toLowerCase();
		return "-" + prefix + "-" + postfix;
	}
	function addComma( attribute ) {
		if ( !attribute ) {
			return "";
		}
		return attribute + ",";
	}
	/**
	 * Return an jquery object only if it's not empty
	 */
	function ifNotEmpty( el ) {
		if ( el.length > 0 ) {
			return el;
		}
		return null;
	}

	/**
	 * Default Settings
	 */
	defaults = {
		/* CLASSES */
		stepSelector: ".step",
		containerClass: "",
		canvasClass: "",
		areaClass: "",
		notSupportedClass: "not-supported",

		/* CONFIG */
		fullscreen: true,

		/* ANIMATION */
		animation: {
			transformOrigin: "top left",
			transitionProperty:
				addComma( mapProperty( pfx( "transform" ) ) ) +
				addComma( mapProperty( pfx( "perspective" ) ) ) +
				"opacity",
			transitionDuration: "1s",
			transitionDelay: "500ms",
			transitionTimingFunction: "ease-in-out",
			transformStyle: "preserve-3d"
		},
		transitionDuration: 1500
	};

	callbacks = {
		"beforeChange": 1,
		"beforeInitStep": 1,
		"initStep": 1,
		"checkNoSupport": 1,
		"beforeInit": 1,
		"afterInit": 1,
		"beforeDeinit": 1,
		"afterDeinit": 1,
		"applyStep": 1,
		"unapplyStep": 1,
		"setInactive": 1,
		"beforeActive": 1,
		"setActive": 1,
		"selectInitialStep": 1,
		"selectPrev": 1,
		"selectNext": 1,
		"selectHome": 1,
		"selectEnd": 1,
		"idle": 1,
		"applyTarget": 1
	};

	for ( callbackName in callbacks ) {
		defaults[ callbackName ] = [];
	}

	/**
	 * Initialize jmpress
	 */
	function init( args ) {
		var props, steps, callbackArgs, callbackName, settings,

			/*** MEMBER VARS ***/

			jmpress = $( this ),
			container = null,
			area = null,
			oldStyle = {
				container: "",
				area: ""
			},
			canvas = null,
			current = null,
			active = false,
			activeSubstep = null,
			activeDelegated = false;

		args = $.extend( true, {}, args || {} );

		// accept functions and arrays of functions as callbacks
		callbackArgs = {};
		callbackName = null;
		for ( callbackName in callbacks ) {
			callbackArgs[ callbackName ] = $.isFunction( args[ callbackName ] ) ?
				[ args[ callbackName ] ] :
				args[ callbackName ];
			args[ callbackName ] = [];
		}

		// MERGE SETTINGS
		settings = $.extend( true, {}, defaults, args );

		for ( callbackName in callbacks ) {
			if ( callbackArgs[ callbackName ] ) {
				Array.prototype.push.apply(
					settings[ callbackName ],
					callbackArgs[ callbackName ]
				);
			}
		}

		/*** MEMBER FUNCTIONS ***/
		// functions have to be called with this

		/**
		 * Init a single step
		 *
		 * @param element the element of the step
		 * @param idx number of step
		 */
		function doStepInit( element, idx ) {
			var callbackData,
				data = dataset( element ),
				step = {
					oldStyle: $( element ).attr( "style" ) || ""
				};

			callbackData = {
				data: data,
				stepData: step
			};
			callCallback.call( this, "beforeInitStep", $( element ), callbackData );
			step.delegate = data.delegate;
			callCallback.call( this, "initStep", $( element ), callbackData );

			$( element ).data( "stepData", step );

			if ( !$( element ).attr( "id" ) ) {
				$( element ).attr( "id", "step-" + ( idx + 1 ) );
			}

			callCallback.call( this, "applyStep", $( element ), callbackData );
		}
		/**
		 * Deinit a single step
		 *
		 * @param element the element of the step
		 */
		function doStepDeinit( element ) {
			var stepData = $( element ).data( "stepData" );

			$( element ).attr( "style", stepData.oldStyle );

			callCallback.call( this, "unapplyStep", $( element ), {
				stepData: stepData
			});
		}
		/**
		 * Reapplies stepData to the element
		 *
		 * @param element
		 */
		function doStepReapply( element ) {
			callCallback.call( this, "unapplyStep", $( element ), {
				stepData: element.data( "stepData" )
			});

			callCallback.call( this, "applyStep", $( element ), {
				stepData: element.data( "stepData" )
			});
		}
		/**
		 * Completly deinit jmpress
		 *
		 */
		function deinit() {
			if ( active ) {
				callCallback.call( this, "setInactive", active, {
					stepData: $( active ).data( "stepData" ),
					reason: "deinit"
				});
			}
			if ( current.jmpressClass ) {
				$( jmpress ).removeClass( current.jmpressClass );
			}

			callCallback.call( this, "beforeDeinit", $( this ), {} );

			$( settings.stepSelector, jmpress ).each(function( idx ) {
				doStepDeinit.call( jmpress, this );
			});

			container.attr( "style", oldStyle.container );
			if ( settings.fullscreen ) {
				$( "html" ).attr( "style", "" );
			}
			area.attr( "style", oldStyle.area );
			$( canvas ).children().each(function() {
				jmpress.append( $( this ) );
			});
			if ( settings.fullscreen ) {
				canvas.remove();
			} else {
				canvas.remove();
				area.remove();
			}

			callCallback.call( this, "afterDeinit", $(this), {} );

			$( jmpress ).data( "jmpressmethods", false );

			if ( current.idleTimeout ) {
				clearTimeout( current.idleTimeout );
			}
		}
		/**
		 * Call a callback
		 *
		 * @param callbackName String callback which should be called
		 * @param element some arguments to the callback
		 * @param eventData
		 */
		function callCallback( callbackName, element, eventData ) {
			eventData.settings = settings;
			eventData.current = current;
			eventData.container = container;
			eventData.parents = element ? getStepParents( element ) : null;
			eventData.current = current;
			eventData.jmpress = this;
			var result = {};
			$.each( settings[ callbackName ], function( idx, callback ) {
				result.value = callback.call( jmpress, element, eventData ) || result.value;
			});
			return result.value;
		}
		/**
		 *
		 */
		function getStepParents( el ) {
			return $( el ).parentsUntil( jmpress ).not( jmpress ).filter( settings.stepSelector );
		}
		/**
		 * Reselect the active step
		 *
		 * @param String type reason of reselecting step
		 */
		function reselect( type ) {
			return select({
				step: active,
				substep: activeSubstep
			}, type );
		}
		/**
		 * Select a given step
		 *
		 * @param el element to select
		 * @param type reason of changing step
		 * @return Object element selected
		 */
		function select( el, type ) {
			var substep, step, cancelSelect, target, delegated, callbackData;
			if ( $.isPlainObject( el ) ) {
				substep = el.substep;
				el = el.step;
			}
			if ( typeof el === "string" ) {
				el = jmpress.find( el ).first();
			}
			if ( !el || !$( el ).data( "stepData" ) ) {
				return false;
			}

			scrollFix.call( this );

			step = $( el ).data( "stepData" );

			cancelSelect = false;
			callCallback.call( this, "beforeChange", el, {
				stepData: step,
				reason: type,
				cancel: function() {
					cancelSelect = true;
				}
			});
			if ( cancelSelect ) {
				return undefined;
			}

			target = {};

			delegated = el;
			if ( $( el ).data( "stepData" ).delegate ) {
				delegated = ifNotEmpty(
					$( el )
						.parentsUntil( jmpress )
						.filter( settings.stepSelector )
						.filter( step.delegate )
				) ||
				ifNotEmpty( $( el ).near( step.delegate ) ) ||
				ifNotEmpty( $( el ).near( step.delegate, true ) ) ||
				ifNotEmpty( $( step.delegate, jmpress ) );
				if ( delegated ) {
					step = delegated.data( "stepData" );
				} else {
					// Do not delegate if expression not found
					delegated = el;
				}
			}
			if ( activeDelegated ) {
				callCallback.call( this, "setInactive", activeDelegated, {
					stepData: $( activeDelegated ).data( "stepData" ),
					delegatedFrom: active,
					reason: type,
					target: target,
					nextStep: delegated,
					nextSubstep: substep,
					nextStepData: step
				});
			}
			callbackData = {
				stepData: step,
				delegatedFrom: el,
				reason: type,
				target: target,
				substep: substep,
				prevStep: activeDelegated,
				prevSubstep: activeSubstep,
				prevStepData: activeDelegated && $( activeDelegated ).data( "stepData" )
			};
			callCallback.call( this, "beforeActive", delegated, callbackData );
			callCallback.call( this, "setActive", delegated, callbackData );

			// Set on step class on root element
			if ( current.jmpressClass ) {
				$( jmpress ).removeClass( current.jmpressClass );
			}
			$( jmpress ).addClass( current.jmpressClass = "step-" + $( delegated ).attr( "id" ) );
			if ( current.jmpressDelegatedClass ) {
				$( jmpress ).removeClass( current.jmpressDelegatedClass );
			}
			$( jmpress ).addClass(
				current.jmpressDelegatedClass = "delegating-step-" + $( el ).attr( "id" )
			);

			callCallback.call( this, "applyTarget", delegated, $.extend({
				canvas: canvas,
				area: area,
				beforeActive: activeDelegated
			}, callbackData ) );

			active = el;
			activeSubstep = callbackData.substep;
			activeDelegated = delegated;

			if ( current.idleTimeout ) {
				clearTimeout( current.idleTimeout );
			}
			current.idleTimeout = setTimeout(function() {
				callCallback.call( this, "idle", delegated, callbackData );
			}, Math.max( 1, settings.transitionDuration - 100 ) );

			return delegated;
		}
		/**
		 * This should fix ANY kind of buggy scrolling
		 */
		function scrollFix() {
			(function fix() {
				if ( $( container )[ 0 ].tagName === "BODY" ) {
					try {
						window.scrollTo( 0, 0 );
					} catch ( e ) {}
				}
				$( container ).scrollTop( 0 );
				$( container ).scrollLeft( 0 );
				function check() {
					if ( $( container ).scrollTop() !== 0 || $( container ).scrollLeft() !== 0 ) {
						fix();
					}
				}
				setTimeout( check, 1 );
				setTimeout( check, 10 );
				setTimeout( check, 100 );
				setTimeout( check, 200 );
				setTimeout( check, 400 );
			}());
		}
		/**
		 * Alias for select
		 */
		function goTo( el ) {
			return select.call( this, el, "jump" );
		}
		/**
		 * Goto Next Slide
		 *
		 * @return Object newly active slide
		 */
		function next() {
			return select.call( this, callCallback.call(this, "selectNext", active, {
				stepData: $( active ).data( "stepData" ),
				substep: activeSubstep
			}), "next" );
		}
		/**
		 * Goto Previous Slide
		 *
		 * @return Object newly active slide
		 */
		function prev() {
			return select.call( this, callCallback.call(this, "selectPrev", active, {
				stepData: $( active ).data( "stepData" ),
				substep: activeSubstep
			}), "prev" );
		}
		/**
		 * Goto First Slide
		 *
		 * @return Object newly active slide
		 */
		function home() {
			return select.call( this, callCallback.call( this, "selectHome", active, {
				stepData: $( active ).data( "stepData" )
			}), "home" );
		}
		/**
		 * Goto Last Slide
		 *
		 * @return Object newly active slide
		 */
		function end() {
			return select.call( this, callCallback.call( this, "selectEnd", active, {
				stepData: $( active ).data( "stepData" )
			}), "end" );
		}
		/**
		 * Manipulate the canvas
		 *
		 * @param props
		 * @return Object
		 */
		function canvasMod( props ) {
			css( canvas, props || {} );
			return $( canvas );
		}
		/**
		 * Return current step
		 *
		 * @return Object
		 */
		function getActive() {
			return activeDelegated && $( activeDelegated );
		}
		/**
		 * fire a callback
		 *
		 * @param callbackName
		 * @param element
		 * @param eventData
		 * @return void
		 */
		function fire( callbackName, element, eventData ) {
			if ( !callbacks[ callbackName ] ) {
				$.error( "Callback " + callbackName + " is not registered." );
			} else {
				return callCallback.call( this, callbackName, element, eventData );
			}
		}

		/**
		 * PUBLIC METHODS LIST
		 */
		jmpress.data( "jmpressmethods", {
			select: select,
			reselect: reselect,
			scrollFix: scrollFix,
			goTo: goTo,
			next: next,
			prev: prev,
			home: home,
			end: end,
			canvas: canvasMod,
			container: function() {
				return container;
			},
			settings: function() {
				return settings;
			},
			active: getActive,
			current: function() {
				return current;
			},
			fire: fire,
			init: function( step ) {
				doStepInit.call( this, $( step ), current.nextIdNumber++ );
			},
			deinit: function( step ) {
				if ( step ) {
					doStepDeinit.call( this, $( step ) );
				} else {
					deinit.call( this );
				}
			},
			reapply: doStepReapply
		});

		/**
		 * Check for support
		 * This will be removed in near future, when support is coming
		 *
		 * @access protected
		 * @return void
		 */
		function checkSupport() {
			var ua = navigator.userAgent.toLowerCase();
			return ua.search( /(iphone)|(ipod)|(android)/ ) === -1 ||
				ua.search( /(chrome)/ ) !== -1;
		}

		// BEGIN INIT

		// CHECK FOR SUPPORT
		if ( checkSupport() === false || callCallback.call( this, "checkNoSupport", null, {} ) ) {
			// not supported
			if ( settings.notSupportedClass ) {
				jmpress.addClass( settings.notSupportedClass );
			}
			return;
		} else {
			if ( settings.notSupportedClass ) {
				jmpress.removeClass( settings.notSupportedClass );
			}
		}

		// grabbing all steps
		steps = $( settings.stepSelector, jmpress );

		// GERNERAL INIT OF FRAME
		container = jmpress;
		area = $( "<div />" );
		canvas = $( "<div />" );
		$( jmpress ).children().filter( steps ).each(function() {
			canvas.append( $( this ) );
		});
		if ( settings.fullscreen ) {
			container = $( "body" );
			$( "html" ).css({
				overflow: "hidden"
			});
			area = jmpress;
		}
		oldStyle.area = area.attr( "style" ) || "";
		oldStyle.container = container.attr( "style" ) || "";
		if ( settings.fullscreen ) {
			container.css({
				height: "100%"
			});
			jmpress.append( canvas );
		} else {
			container.css({
				position: "relative"
			});
			area.append( canvas );
			jmpress.append( area );
		}

		$( container ).addClass( settings.containerClass );
		$( area ).addClass( settings.areaClass );
		$( canvas ).addClass( settings.canvasClass );

		document.documentElement.style.height = "100%";
		container.css({
			overflow: "hidden"
		});

		props = {
			position: "absolute",
			transitionDuration: "0s"
		};
		props = $.extend( {}, settings.animation, props );
		css( area, props );
		css( canvas, props );

		current = {};

		callCallback.call( this, "beforeInit", null, {
			canvas: canvas,
			area: area
		});

		// INITIALIZE EACH STEP
		steps.each(function( idx ) {
			doStepInit.call( jmpress, this, idx );
		});
		current.nextIdNumber = steps.length;

		callCallback.call( this, "afterInit", null, {} );

		// START
		select.call( this,  callCallback.call( this, "selectInitialStep", "init", {} ) );

		if ( settings.initClass ) {
			$( steps ).removeClass( settings.initClass );
		}
	}
	/**
	 * Return default settings
	 *
	 * @return Object
	 */
	function getDefaults() {
		return defaults;
	}
	/**
	 * Register a callback or a jmpress function
	 *
	 * @access public
	 * @param name String the name of the callback or function
	 * @param func Function? the function to be added
	 */
	function register( name, func ) {
		if ( $.isFunction( func ) ) {
			if ( methods[ name ] ) {
				$.error( "Function " + name + " is already registered." );
			} else {
				methods[ name ] = func;
			}
		} else {
			if ( callbacks[ name ] ) {
				$.error( "Callback " + name + " is already registered." );
			} else {
				callbacks[ name ] = 1;
				defaults[ name ] = [];
			}
		}
	}
	/**
	 * Set CSS on element w/ prefixes
	 *
	 * @return Object element which properties were set
	 *
	 * TODO: Consider bypassing pfx and blindly set as jQuery
	 * already checks for support
	 */
	function css( el, props ) {
		var key, pkey, cssObj = {};
		for ( key in props ) {
			if ( props.hasOwnProperty( key ) ) {
				pkey = pfx( key );
				if ( pkey !== null ) {
					cssObj[ pkey ] = props[ key ];
				}
			}
		}
		$( el ).css( cssObj );
		return el;
	}
	/**
	 * Return dataset for element
	 *
	 * @param el element
	 * @return Object
	 */
	function dataset( el ) {
		var attrs,
			returnDataset = {};
		if ( $( el )[ 0 ].dataset ) {
			return $.extend( {}, $( el )[ 0 ].dataset );
		}
		function toCamelcase( str ) {
			str = str.split( "-" );
			for ( var i = 1; i < str.length; i++ ) {
				str[ i ] = str[ i ].substr( 0, 1 ).toUpperCase() + str[ i ].substr( 1 );
			}
			return str.join( "" );
		}
		attrs = $( el )[ 0 ].attributes;
		$.each( attrs, function( idx, attr ) {
			if ( attr.nodeName.substr( 0, 5 ) === "data-" ) {
				returnDataset[ toCamelcase( attr.nodeName.substr( 5 ) ) ] = attr.nodeValue;
			}
		});
		return returnDataset;
	}
	/**
	 * Returns true, if jmpress is initialized
	 *
	 * @return bool
	 */
	function initialized() {
		return !!$( this ).data( "jmpressmethods" );
	}

	/**
	 * PUBLIC STATIC METHODS LIST
	 */
	methods = {
		init: init,
		initialized: initialized,
		deinit: function() {},
		css: css,
		pfx: pfx,
		defaults: getDefaults,
		register: register,
		dataset: dataset
	};

	/**
	 * $.jmpress()
	 */
	$.fn.jmpress = function( method ) {
		var result,
			args = arguments;

		function f() {
			var settings, func,
				jmpressmethods = $( this ).data( "jmpressmethods" );
			if ( jmpressmethods && jmpressmethods[ method ] ) {
				return jmpressmethods[ method ].apply(
					this,
					Array.prototype.slice.call( arguments, 1 )
				);
			} else if ( methods[ method ] ) {
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			} else if ( callbacks[ method ] && jmpressmethods ) {
				settings = jmpressmethods.settings();
				func = Array.prototype.slice.call( arguments, 1 )[ 0 ];
				if ( $.isFunction( func ) ) {
					settings[ method ] = settings[ method ] || [];
					settings[ method ].push( func );
				}
			} else if ( typeof method === "object" || !method ) {
				return init.apply( this, arguments );
			} else {
				$.error( "Method " +  method + " does not exist on jQuery.jmpress" );
			}
			// to allow chaining
			return this;
		}

		$( this ).each(function( idx, element ) {
			result = f.apply( element, args );
		});

		return result;
	};
	$.extend({
		jmpress: function( method ) {
			if ( methods[ method ] ) {
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( callbacks[ method ] ) {
				// plugin interface
				var func = Array.prototype.slice.call( arguments, 1 )[ 0 ];
				if ( $.isFunction( func ) ) {
					defaults[ method ].push( func );
				} else {
					$.error(
						"Second parameter should be a function: " +
						"$.jmpress( callbackName, callbackFunction )"
					);
				}
			} else {
				$.error( "Method " +  method + " does not exist on jQuery.jmpress" );
			}
		}
	});

}( jQuery, document, window ));
