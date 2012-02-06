/*!
 * jmpress.js
 *
 * a jQuery port of https://github.com/bartaz/impress.js based on the power of
 * CSS3 transforms and transitions in modern browsers and inspired by the idea
 * behind prezi.com.
 *
 * Copyright 2012, Kyle Robinson Young @shama
 * Copyright 2012, Tobias Koppers @sokra
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Based on the foundation laid by Bartek Szopka @bartaz
 */

(function( $, document, window, undefined ) {

	'use strict';

	/**
	 * Set supported prefixes
	 *
	 * @access protected
	 * @return Function to get prefixed property
	 */
	var pfx = (function () {
		var style = document.createElement('dummy').style,
			prefixes = 'Webkit Moz O ms Khtml'.split(' '),
			memory = {};
		return function ( prop ) {
			if ( typeof memory[ prop ] === "undefined" ) {
				var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
					props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
				memory[ prop ] = null;
				for ( var i in props ) {
					if ( style[ props[i] ] !== undefined ) {
						memory[ prop ] = props[i];
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
		var index = 1 + name.substr(1).search(/[A-Z]/);
		var prefix = name.substr(0, index).toLowerCase();
		var postfix = name.substr(index).toLowerCase();
		return "-" + prefix + "-" + postfix;
	}

	/**
	 * Default Settings
	 */
	var defaults = {
		/* CLASSES */
		stepSelector: '.step'
		,containerClass: ''
		,canvasClass: ''
		,areaClass: ''
		,notSupportedClass: 'not-supported'
		,loadedClass: 'loaded'

		/* CONFIG */
		,fullscreen: true

		/* ANIMATION */
		,animation: {
			transformOrigin: 'top left'
			,transitionProperty: mapProperty(pfx('transform')) + ', opacity'
			,transitionDuration: '1s'
			,transitionDelay: '500ms'
			,transitionTimingFunction: 'ease-in-out'
			,transformStyle: "preserve-3d"
		}
		,transitionDuration: 1500

		/* CALLBACKS */
		// TODO documentation
		,beforeChange: []
		,beforeInitStep: []
		,initStep: []
		,beforeInit: []
		,afterInit: []
		,beforeDeinit: []
		,afterDeinit: []
		,applyStep: []
		,unapplyStep: []
		,setInactive: []
		,beforeActive: []
		,setActive: []
		,selectInitialStep: []
		,selectPrev: []
		,selectNext: []
		,selectHome: []
		,selectEnd: []
		,loadStep: []
		,applyTarget: []

		/* TEST */
		,test: false
	};
	var callbacks = {
		'beforeChange': 1
		,'beforeInitStep': 1
		,'initStep': 1
		,'beforeInit': 1
		,'afterInit': 1
		,'beforeDeinit': 1
		,'afterDeinit': 1
		,'applyStep': 1
		,'unapplyStep': 1
		,'setInactive': 1
		,'beforeActive': 1
		,'setActive': 1
		,'selectInitialStep': 1
		,'selectPrev': 1
		,'selectNext': 1
		,'selectHome': 1
		,'selectEnd': 1
		,'loadStep': 1
		,'applyTarget': 1
	};


	/**
	 * Initialize jmpress
	 */
	function init( args ) {
		args = $.extend(true, {}, args || {});

		// accept functions and arrays of functions as callbacks
		var callbackArgs = {};
		var callbackName = null;
		for (callbackName in callbacks) {
			callbackArgs[callbackName] = $.isFunction( args[callbackName] ) ?
				[ args[callbackName] ] :
				args[callbackName];
			args[callbackName] = [];
		}

		// MERGE SETTINGS
		var settings = $.extend(true, {}, defaults, args);

		for (callbackName in callbacks) {
			if (callbackArgs[callbackName]) {
				Array.prototype.push.apply(settings[callbackName], callbackArgs[callbackName]);
			}
		}

		/*** MEMBER VARS ***/

		var jmpress = $( this )
			,container = null
			,area = null
			,oldStyle = {
				container: ""
				,area: ""
			}
			,canvas = null
			,current = null
			,active = false
			,activeDelegated = false;


		/*** MEMBER FUNCTIONS ***/
		// functions have to be called with this

		/**
		 * Init a single step
		 *
		 * @param element the element of the step
		 * @param idx number of step
		 */
		function doStepInit( element, idx ) {
			var data = dataset( element );
			var step = {
				oldStyle: $(element).attr("style") || ""
			};

			var callbackData = {
				data: data
				,stepData: step
			};
			callCallback.call(this, 'beforeInitStep', $(element), callbackData);
			step.delegate = data.delegate;
			callCallback.call(this, 'initStep', $(element), callbackData);

			$(element).data('stepData', step);

			if ( !$(element).attr('id') ) {
				$(element).attr('id', 'step-' + (idx + 1));
			}

			callCallback.call(this, 'applyStep', $(element), callbackData);
		}
		/**
		 * Deinit a single step
		 *
		 * @param element the element of the step
		 */
		function doStepDeinit( element ) {
			var stepData = $(element).data('stepData');

			$(element).attr("style", stepData.oldStyle);

			callCallback.call(this, 'unapplyStep', $(element), {
				stepData: stepData
			});
		}
		/**
		 * Reapplies stepData to the element
		 *
		 * @param element
		 */
		function doStepReapply( element ) {
			callCallback.call(this, 'unapplyStep', $(element), {
				stepData: element.data("stepData")
			});

			callCallback.call(this, 'applyStep', $(element), {
				stepData: element.data("stepData")
			});
		}
		/**
		 * Completly deinit jmpress
		 *
		 */
		function deinit() {
			if ( active ) {
				callCallback.call(this, 'setInactive', active, {
					stepData: $(active).data('stepData')
					,reason: "deinit"
				} );
			}
			if (current.jmpressClass) {
				$(jmpress).removeClass(current.jmpressClass);
			}

			callCallback.call(this, 'beforeDeinit', $(this), {});

			$(settings.stepSelector, jmpress).each(function( idx ) {
				doStepDeinit.call(jmpress, this );
			});

			container.attr("style", oldStyle.container);
			area.attr("style", oldStyle.area);
			$(canvas).children().each(function() {
				jmpress.append( $( this ) );
			});
			if( settings.fullscreen ) {
				canvas.remove();
			} else {
				canvas.remove();
				area.remove();
			}

			callCallback.call(this, 'afterDeinit', $(this), {});

			$(jmpress).data("jmpressmethods", undefined);
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
			eventData.parents = element ? getStepParents(element) : null;
			eventData.current = current;
			eventData.jmpress = this;
			var result = {};
			$.each( settings[callbackName], function(idx, callback) {
				result.value = callback.call( jmpress, element, eventData ) || result.value;
			});
			return result.value;
		}
		/**
		 * Load Siblings
		 *
		 * @access protected
		 * @return void
		 */
		function loadSiblings() {
			if (!active) {
				return;
			}
			var siblings = $(active).near( settings.stepSelector )
				.add( $(active).near( settings.stepSelector, true) )
				.add( callCallback.call(this, 'selectPrev', active, {
					stepData: $(active).data('stepData')
				}))
				.add( callCallback.call(this, 'selectNext', active, {
					stepData: $(active).data('stepData')
				}));
			siblings.each(function() {
				var step = this;
				if ($(step).hasClass( settings.loadedClass )) {
					return;
				}
				setTimeout(function() {
					if ($(step).hasClass( settings.loadedClass )) {
						return;
					}
					callCallback.call(jmpress, 'loadStep', step, {
						stepData: $(step).data('stepData')
					});
					$(step).addClass( settings.loadedClass );
				}, settings.transitionDuration - 100);
			});
			if ($(active).hasClass( settings.loadedClass )) {
				return;
			}
			callCallback.call(jmpress, 'loadStep', active, {
				stepData: $(active).data('stepData')
			});
			$(active).addClass( settings.loadedClass );
		}
		/**
		 *
		 */
		function getStepParents( el ) {
			var parents = [];
			var currentEl = el;
			while($(currentEl).parent().length &&
						$(currentEl).parent().is(settings.stepSelector)) {
				currentEl = $(currentEl).parent();
				parents.push(currentEl[0]);
			}
			return parents;
		}
		/**
		 * Select a given step
		 *
		 * @param el element to select
		 * @param type reason of changing step
		 * @return Object element selected
		 */
		function select( el, type ) {
			if ( typeof el === 'string') {
				el = jmpress.find( el ).first();
			}
			if ( !el || !$(el).data('stepData') ) {
				return false;
			}

			// Sometimes it's possible to trigger focus on first link with some keyboard action.
			// Browser in such a case tries to scroll the page to make this element visible
			// (even that body overflow is set to hidden) and it breaks our careful positioning.
			//
			// So, as a lousy (and lazy) workaround we will make the page scroll back to the top
			// whenever slide is selected
			//
			// If you are reading this and know any better way to handle it, I'll be glad to hear about it!
			scrollFix.call(this);

			var step = $(el).data('stepData');

			var cancelSelect = false;
			callCallback.call(this, "beforeChange", el, {
				stepData: step
				,reason: type
				,cancel: function() {
					cancelSelect = true;
				}
			});
			if (cancelSelect) {
				return undefined;
			}

			var target = {};

			var delegated = el;
			if($(el).data("stepData").delegate) {
				delegated = $(el).parentsUntil(jmpress).filter(settings.stepSelector).filter(step.delegate) ||
					$(el).near(step.delegate) ||
					$(el).near(step.delegate, true) ||
					$(step.delegate, jmpress);
				step = delegated.data("stepData");
			}
			if ( activeDelegated ) {
				callCallback.call(this, 'setInactive', activeDelegated, {
					stepData: $(activeDelegated).data('stepData')
					,delegatedFrom: active
					,reason: type
					,target: target
					,nextStep: delegated
					,nextStepData: step
				} );
			}
			var callbackData = {
				stepData: step
				,delegatedFrom: el
				,reason: type
				,target: target
				,prevStep: activeDelegated
				,prevStepData: activeDelegated && $(activeDelegated).data('stepData')
			};
			callCallback.call(this, 'beforeActive', delegated, callbackData);
			callCallback.call(this, 'setActive', delegated, callbackData);

			// Set on step class on root element
			if (current.jmpressClass) {
				$(jmpress).removeClass(current.jmpressClass);
			}
			$(jmpress).addClass(current.jmpressClass = 'step-' + $(delegated).attr('id') );
			if (current.jmpressDelegatedClass) {
				$(jmpress).removeClass(current.jmpressDelegatedClass);
			}
			$(jmpress).addClass(current.jmpressDelegatedClass = 'delegating-step-' + $(el).attr('id') );

			callCallback.call(this, "applyTarget", active, $.extend({
				canvas: canvas
				,area: area
			}, callbackData));

			active = el;
			activeDelegated = delegated;

			loadSiblings.call(this);

			return delegated;
		}
		/**
		 * This should fix ANY kind of buggy scrolling
		 */
		function scrollFix() {
			function fix() {
				if ($(container)[0].tagName === "BODY") {
					window.scrollTo(0, 0);
				}
				$(container).scrollTop(0);
				$(container).scrollLeft(0);
				function check() {
					if ($(container).scrollTop() !== 0 ||
						$(container).scrollLeft() !== 0) {
							fix();
						}
				}
				setTimeout(check, 1);
				setTimeout(check, 10);
				setTimeout(check, 100);
				setTimeout(check, 200);
				setTimeout(check, 400);
			}
			fix();
		}
		/**
		 * Alias for select
		 */
		function goTo( el ) {
			return select.call(this, el, "jump" );
		}
		/**
		 * Goto Next Slide
		 *
		 * @return Object newly active slide
		 */
		function next() {
			return select.call(this, callCallback.call(this, 'selectNext', active, {
				stepData: $(active).data('stepData')
			}), "next" );
		}
		/**
		 * Goto Previous Slide
		 *
		 * @return Object newly active slide
		 */
		function prev() {
			return select.call(this, callCallback.call(this, 'selectPrev', active, {
				stepData: $(active).data('stepData')
			}), "prev" );
		}
		/**
		 * Goto First Slide
		 *
		 * @return Object newly active slide
		 */
		function home() {
			return select.call(this, callCallback.call(this, 'selectHome', active, {
				stepData: $(active).data('stepData')
			}), "home" );
		}
		/**
		 * Goto Last Slide
		 *
		 * @return Object newly active slide
		 */
		function end() {
			return select.call(this,   callCallback.call(this, 'selectEnd', active, {
				stepData: $(active).data('stepData')
			}), "end" );
		}
		/**
		 * Manipulate the canvas
		 *
		 * @param props
		 * @return Object
		 */
		function canvasMod( props ) {
			css(canvas, props || {});
			return $(canvas);
		}
		/**
		 * Return current settings
		 *
		 * @return Object
		 */
		function getSettings() {
			return settings;
		}
		/**
		 * Return current step
		 *
		 * @return Object
		 */
		function getActive() {
			return activeDelegated && $(activeDelegated);
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
			if( !callbacks[callbackName] ) {
				$.error( "callback " + callbackName + " is not registered." );
			} else {
				callCallback.call(this, callbackName, element, eventData);
			}
		}

		/**
		 * PUBLIC METHODS LIST
		 */
		jmpress.data("jmpressmethods", {
			select: select
			,scrollFix: scrollFix
			,goTo: goTo
			,next: next
			,prev: prev
			,home: home
			,end: end
			,canvas: canvasMod
			,settings: getSettings
			,active: getActive
			,fire: fire
			,deinit: deinit
			,reapply: doStepReapply
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
			var supported = ( ua.search(/(iphone)|(ipod)|(android)/) === -1 );
			return supported;
		}

		// BEGIN INIT

		// CHECK FOR SUPPORT
		if (checkSupport() === false) {
			if (settings.notSupportedClass) {
				jmpress.addClass(settings.notSupportedClass);
			}
			return;
		} else {
			if (settings.notSupportedClass) {
				jmpress.removeClass(settings.notSupportedClass);
			}
		}

		// grabbing all steps
		var steps = $(settings.stepSelector, jmpress);

		// GERNERAL INIT OF FRAME
		container = jmpress;
		area = $('<div />');
		canvas = $('<div />');
		$(jmpress).children().filter(steps).each(function() {
			canvas.append( $( this ) );
		});
		if(settings.fullscreen) {
			container = $('body');
			area = jmpress;
		}
		oldStyle.area = area.attr("style") || "";
		oldStyle.container = container.attr("style") || "";
		if(settings.fullscreen) {
			container.css({
				height: '100%'
			});
			jmpress.append( canvas );
		} else {
			container.css({
				position: "relative"
			});
			area.append( canvas );
			jmpress.append( area );
		}

		$(container).addClass(settings.containerClass);
		$(area).addClass(settings.areaClass);
		$(canvas).addClass(settings.canvasClass);

		document.documentElement.style.height = "100%";
		container.css({
			overflow: 'hidden'
		});

		var props = {
			position: "absolute"
			,transitionDuration: '0s'
		};
		props = $.extend({}, settings.animation, props);
		css(area, props);
		css(area, {
			top: '50%'
			,left: '50%'
			,perspective: '1000px'
		});
		css(canvas, props);

		current = {
			scalex: 1
		};

		callCallback.call(this, 'beforeInit', null, {});

		// INITIALIZE EACH STEP
		steps.each(function( idx ) {
			doStepInit.call(jmpress, this, idx );
		});

		callCallback.call(this, 'afterInit', null, {});

		// START
		select.call(this,  callCallback.call(this, 'selectInitialStep', "init", {}) );

		if (settings.initClass) {
			$(steps).removeClass(settings.initClass);
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
	function register(name, func) {
		if( $.isFunction(func) ) {
			if( methods[name] ) {
				$.error( "function " + name + " is already registered." );
			} else {
				methods[name] = func;
			}
		} else {
			if( callbacks[name] ) {
				$.error( "callback " + name + " is already registered." );
			} else {
				callbacks[name] = 1;
				defaults[name] = [];
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
			if ( props.hasOwnProperty(key) ) {
				pkey = pfx(key);
				if ( pkey !== null ) {
					cssObj[pkey] = props[key];
				}
			}
		}
		$(el).css(cssObj);
		return el;
	}
	/**
	 * Return dataset for element
	 *
	 * @param el element
	 * @return Object
	 */
	function dataset( el ) {
		if ( $(el)[0].dataset ) {
			return $.extend({}, $(el)[0].dataset);
		}
		function toCamelcase( str ) {
			str = str.split( '-' );
			for( var i = 1; i < str.length; i++ ) {
				str[i] = str[i].substr(0, 1).toUpperCase() + str[i].substr(1);
			}
			return str.join( '' );
		}
		var returnDataset = {};
		var attrs = $(el)[0].attributes;
		$.each(attrs, function ( idx, attr ) {
			if ( attr.nodeName.substr(0, 5) === "data-" ) {
				returnDataset[ toCamelcase(attr.nodeName.substr(5)) ] = attr.nodeValue;
			}
		});
		return returnDataset;
	}


	/**
	 * PUBLIC STATIC METHODS LIST
	 */
	var methods = {
		init: init
		,deinit: function() {}
		,css: css
		,pfx: pfx
		,defaults: getDefaults
		,register: register
		,dataset: dataset
	};

	/**
	 * $.jmpress()
	 */
	$.fn.jmpress = function( method ) {
		function f() {
			var jmpressmethods = $(this).data("jmpressmethods");
			if ( jmpressmethods && jmpressmethods[method] ) {
				if ( method.substr(0, 1) === '_' && jmpressmethods.settings().test === false) {
					$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
				} else {
					return jmpressmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
				}
			} else if ( methods[method] ) {
				if ( method.substr(0, 1) === '_' && defaults.test === false) {
					$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
				} else {
					return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
				}
			} else if ( callbacks[method] && jmpressmethods ) {
				var settings = jmpressmethods.settings();
				var func = Array.prototype.slice.call( arguments, 1 )[0];
				if ($.isFunction( func )) {
					settings[method] = settings[method] || [];
					settings[method].push(func);
				}
			} else if ( typeof method === 'object' || ! method ) {
				return init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.jmpress' );
			}
			// to allow chaining
			return this;
		}
		var args = arguments;
		var result;
		$(this).each(function(idx, element) {
			result = f.apply(element, args);
		});
		return result;
	};
	$.extend({
		jmpress: function( method ) {
			if ( methods[method] ) {
				if ( method.substr(0, 1) === '_' && defaults.test === false) {
					$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
				} else {
					return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
				}
			} else if ( callbacks[method] ) {
				// plugin interface
				var func = Array.prototype.slice.call( arguments, 1 )[0];
				if ($.isFunction( func )) {
					defaults[method].push(func);
				} else {
					$.error( 'Second parameter should be a function: $.jmpress( callbackName, callbackFunction )' );
				}
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.jmpress' );
			}
		}
	});

}(jQuery, document, window));

(function( $, document, window, undefined ) {

	'use strict';

	(function() { // add near( selector, backwards = false) to jquery
		function checkAndGo( elements, func, selector, backwards ) {
			var next;
			elements.each(function(idx, element) {
				if(backwards) {
					next = func(element, selector, backwards);
					if (next) {
						return false;
					}
				}
				if( $(element).is(selector) ) {
					next = element;
					return false;
				}
				if(!backwards) {
					next = func(element, selector, backwards);
					if (next) {
						return false;
					}
				}
			});
			return next;
		}
		function findNextInChildren(item, selector, backwards) {
			var children = $(item).children();
			if(backwards) {
				children = $(children.get().reverse());
			}
			return checkAndGo( children, findNextInChildren, selector, backwards );
		}
		function findNextInSiblings(item, selector, backwards) {
			return checkAndGo(
				$(item)[backwards ? "prevAll" : "nextAll"](),
				findNextInChildren, selector, backwards );
		}
		function findNextInParents(item, selector, backwards) {
			var next;
			var parents = $(item).parents();
			parents = $(parents.get());
			$.each(parents.get(), function(idx, element) {
				if( backwards && $(element).is(selector) ) {
					next = element;
					return false;
				}
				next = findNextInSiblings(element, selector, backwards);
				if(next) {
					return false;
				}
			});
			return next;
		}

		$.fn.near = function( selector, backwards ) {
			var array = [];
			$(this).each(function(idx, element) {
				var near = (backwards ?
						false :
						findNextInChildren( element, selector, backwards )) ||
					findNextInSiblings( element, selector, backwards ) ||
					findNextInParents( element, selector, backwards );
				if( near ) {
					array.push(near);
				}
			});
			return $(array);
		};
	}());

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/* DEFAULT PLUGINS */
	// The plugins should be independent from above code
	// They may read settings from eventData.settings and
	// store state to eventData.current.
	// They can modify the defaults with $.jmpress( 'defaults' )
	// and register own callbacks with $.jmpress( 'register', '<callbackName>' )
	// own callbacks may be fired with $.jmpress( 'fire', step, eventData )

	(function() { // translate scale rotate

		/**
		 * 3D and 2D engines
		 */
		var engines = {
			3: {
				_transform: function( el, data ) {
					var transform = 'translate(-50%,-50%)';
					if ( data.revertRotate ) {
						transform += engine._rotate(data);
						transform += engine._translate(data);
					} else {
						transform += engine._translate(data);
						transform += engine._rotate(data);
					}
					transform += engine._scale(data);
					$.jmpress("css", el, $.extend({}, { transform: transform }, data.css));
					return true;
				}
				/**
				 * Translate
				 *
				 * @access protected
				 * @return String CSS for translate3d
				 */
				,_translate: function ( t ) {
					return t.x || t.y || t.z ? " translate3d(" + Math.round(t.x,4) + "px," + Math.round(t.y,4) + "px," + Math.round(t.z,4) + "px)" : "";
				}
				/**
				 * Rotate
				 *
				 * @access protected
				 * @return String CSS for rotate
				 */
				,_rotate: function ( r ) {
					var rX = r.rotateX !== undefined ? " rotateX(" + Math.round(r.rotateX,4) + "deg)" : "",
						rY = r.rotateY !== undefined ? " rotateY(" + Math.round(r.rotateY,4) + "deg)" : "",
						rZ = r.rotateZ !== undefined ? " rotateZ(" + Math.round(r.rotateZ,4) + "deg)" : "";
					return r.revertRotate ? rZ + rY + rX : rX + rY + rZ;
				}
				/**
				 * Scale
				 *
				 * @access protected
				 * @return String CSS for scale
				 */
				,_scale: function ( s ) {
					return (s.scaleX && s.scaleX !== 1 ? " scaleX(" + s.scaleX + ")" : "") +
						(s.scaleY && s.scaleY !== 1 ? " scaleY(" + s.scaleY + ")" : "") +
						(s.scaleZ && s.scaleZ !== 1 ? " scaleZ(" + s.scaleZ + ")" : "");
				}
			}
			,2: {
				_transform: function( el, data ) {
					var transform = 'translate(-50%,-50%)';
					if ( data.revertRotate ) {
						transform += engine._rotate(data);
						transform += engine._translate(data);
					} else {
						transform += engine._translate(data);
						transform += engine._rotate(data);
					}
					transform += engine._scale(data);
					$.jmpress("css", el, $.extend({}, { transform: transform }, data.css));
					return true;
				}
				/**
				 * Translate
				 *
				 * @access protected
				 * @return String CSS for translate3d
				 */
				,_translate: function ( t ) {
					return t.x || t.y ? " translate(" + Math.round(t.x,4) + "px," + Math.round(t.y,4) + "px)" : "";
				}
				/**
				 * Rotate
				 *
				 * @access protected
				 * @return String CSS for rotate
				 */
				,_rotate: function ( r ) {
					return r.rotateZ !== undefined ? " rotate(" + r.rotateZ + "deg) " : "";
				}
				/**
				 * Scale
				 *
				 * @access protected
				 * @return String CSS for scale
				 */
				,_scale: function ( s ) {
					return (s.scaleX && s.scaleX !== 1 ? " scaleX(" + s.scaleX + ")" : "") +
						(s.scaleY && s.scaleY !== 1 ? " scaleY(" + s.scaleY + ")" : "");
				}
			}
			,1: {
				_transform: function( el, data ) {
					if ( data.x || data.y ) {
						el.animate({
							top: data.y - ( el.height() / 2 ) + 'px'
							,left: data.x - ( el.width() / 2 ) + 'px'
						}, 1000); // TODO: Use animation duration
					}
					return true;
				}
			}
		};

		/**
		 * Engine to power cross-browser translate, scale and rotate.
		 */
		var engine = (function() {
			if ($.jmpress("pfx", "perspective")) {
				return engines[3];
			} else if ($.jmpress("pfx", "transform")) {
				return engines[2];
			} else {
				return engines[1];
			}
		}());

		$.jmpress("initStep", function( step, eventData ) {
			var data = eventData.data;
			var stepData = eventData.stepData;
			$.extend(stepData, {
				x: parseFloat(data.x) || 0
				,y: parseFloat(data.y) || 0
				,z: parseFloat(data.z) || 0
				,r: parseFloat(data.r) || 0
				,phi: parseFloat(data.phi) || 0
				,rotate: parseFloat(data.rotate) || 0
				,rotateX: parseFloat(data.rotateX) || 0
				,rotateY: parseFloat(data.rotateY) || 0
				,rotateZ: parseFloat(data.rotateZ) || 0
				,revertRotate: false
				,scale: parseFloat(data.scale) || 1
				,scaleX: parseFloat(data.scaleX) || false
				,scaleY: parseFloat(data.scaleY) || false
				,scaleZ: parseFloat(data.scaleZ) || 1
			});
		});
		$.jmpress("applyStep", function( step, eventData ) {
			$.jmpress("css", $(step), {
				position: "absolute"
				,transformStyle: "preserve-3d"
			});
			if ( eventData.parents.length > 0 ) {
				$.jmpress("css", $(step), {
					top: "50%"
					,left: "50%"
				});
			}
			var transform = $.extend({}, eventData.stepData);
			transform.rotateZ = transform.rotateZ || transform.rotate;
			transform.scaleX = transform.scaleX || transform.scale;
			transform.scaleY = transform.scaleY || transform.scale;
			transform.x = transform.x || (transform.r * Math.sin(transform.phi*Math.PI/180));
			transform.y = transform.y || (-transform.r * Math.cos(transform.phi*Math.PI/180));
			engine._transform( $(step), transform );
		});
		$.jmpress("setActive", function( step, eventData ) {
			var target = eventData.target;
			var stepData = eventData.stepData;
			$.extend(target, {
				rotateX: -stepData.rotateX
				,rotateY: -stepData.rotateY
				,rotateZ: -(stepData.rotateZ || stepData.rotate)
				,revertRotate: true
				,scaleX: 1 / (stepData.scaleX || stepData.scale)
				,scaleY: 1 / (stepData.scaleY || stepData.scale)
				,scaleZ: 1 / (stepData.scaleZ)
				,x: -(stepData.x || (stepData.r * Math.sin(stepData.phi*Math.PI/180)))
				,y: -(stepData.y || (-stepData.r * Math.cos(stepData.phi*Math.PI/180)))
				,z: -stepData.z
			});
			$.each(eventData.parents, function(idx, element) {
				var stepD = $(element).data("stepData");
				var inverseScale = {
					x: 1 / (stepD.scaleX || stepD.scale)
					,y: 1 / (stepD.scaleY || stepD.scale)
					,z: 1 / (stepD.scaleZ)
				};
				target.x /= inverseScale.x;
				target.y /= inverseScale.y;
				target.z /= inverseScale.z;
				// TODO: implement complete matrix transformation
				var rZ = -(stepD.rotateZ || stepD.rotate)/180*Math.PI
					,sinZ = Math.sin(rZ), cosZ = Math.cos(rZ);
				var rY = -(stepD.rotateY)/180*Math.PI
					,sinY = Math.sin(rY), cosY = Math.cos(rY);
				var rX = -(stepD.rotateX)/180*Math.PI
					,sinX = Math.sin(rX), cosX = Math.cos(rX);
				var tx, ty, tz;
				// apply rZ
				ty = -target.x * sinZ + target.y * cosZ;
				tx = target.x * cosZ + target.y * sinZ;
				tz = target.z;
				target.x = tx; target.y = ty; target.z = tz;
				// apply rY
				ty = target.y;
				tx = target.x * cosY + target.z * sinY;
				tz = target.x * sinY + target.z * cosY;
				target.x = tx; target.y = ty; target.z = tz;
				// apply rX
				ty = target.y * cosX + target.z * sinX;
				tx = target.x;
				tz = - target.y * sinX + target.z * cosX;
				target.x = tx; target.y = ty; target.z = tz;

				target.rotateX -= (stepD.rotateX);
				target.rotateY -= (stepD.rotateY);
				target.rotateZ -= (stepD.rotateZ || stepD.rotate);
				target.x -= stepD.x || (stepD.r * Math.sin(stepD.phi*Math.PI/180));
				target.y -= stepD.y || (-stepD.r * Math.cos(stepD.phi*Math.PI/180));
				target.z -= stepD.z;
				target.scaleX *= inverseScale.x;
				target.scaleY *= inverseScale.y;
				target.scaleZ *= inverseScale.z;
			});
			function lowRotate(name) {
				if(eventData.current[name] === undefined)
					eventData.current[name] = target[name];
				var cur = eventData.current[name], tar = target[name],
					curmod = cur % 360, tarmod = tar % 360;
				if(curmod < 0) curmod += 360;
				if(tarmod < 0) tarmod += 360;
				var diff = tarmod - curmod;
				if(diff < -180) diff += 360;
				else if(diff > 180) diff -= 360;
				eventData.current[name] = target[name] = cur + diff;
			}
			lowRotate("rotateX");
			lowRotate("rotateY");
			lowRotate("rotateZ");
		});
		$.jmpress("applyTarget", function( active, eventData ) {

			var target = eventData.target,
				props, step = eventData.stepData,
				settings = eventData.settings,
				zoomin = target.scaleX >= eventData.current.scalex;

			props = {
				// to keep the perspective look similar for different scales
				// we need to 'scale' the perspective, too
				perspective: step.scaleX * 1000 + "px"
			};
			props = $.extend({}, settings.animation, props);
			if (!zoomin) {
				props.transitionDelay = '0';
			}
			if (!active) {
				props.transitionDuration = '0';
				props.transitionDelay = '0';
			}
			$.jmpress("css", eventData.area, props);
			engine._transform(eventData.area, {
				scaleX: target.scaleX
				,scaleY: target.scaleY
				,scaleZ: target.scaleZ
			});

			props = $.extend({}, settings.animation);
			if (zoomin) {
				props.transitionDelay = '0';
			}
			if (!active) {
				props.transitionDuration = '0';
				props.transitionDelay = '0';
			}
			eventData.current.scalex = target.scaleX;

			target.scaleX = 1;
			target.scaleY = 1;
			target.scaleZ = 1;
			engine._transform(eventData.canvas, $.extend({}, {
				css: props
			}, target));
		});
	}());

	(function() { // active class
		$.jmpress("defaults").nestedActiveClass = "nested-active";
		$.jmpress( 'defaults' ).activeClass = "active";
		$.jmpress( 'setInactive', function( step, eventData ) {
			if(eventData.settings.activeClass)
				$(step).removeClass( eventData.settings.activeClass );
			if(eventData.settings.nestedActiveClass)
				$.each(eventData.parents, function(idx, element) {
					$(element).removeClass(eventData.settings.nestedActiveClass);
				});
		});
		$.jmpress( 'setActive', function( step, eventData ) {
			if(eventData.settings.activeClass)
				$(step).addClass( eventData.settings.activeClass );
			if(eventData.settings.nestedActiveClass)
				$.each(eventData.parents, function(idx, element) {
					$(element).addClass(eventData.settings.nestedActiveClass);
				});
		});
	}());

	(function() { // circular stepping
		$.jmpress( 'initStep', function( step, eventData ) {
			eventData.stepData.exclude = eventData.data.exclude && ["false", "no"].indexOf(eventData.data.exclude) == -1;
		});
		function firstSlide( step, eventData ) {
			return $(this).find(eventData.settings.stepSelector).first();
		}
		$.jmpress( 'selectInitialStep', firstSlide);
		$.jmpress( 'selectHome', firstSlide);
		$.jmpress( 'selectEnd', function( step, eventData ) {
			return $(this).find(eventData.settings.stepSelector).last();
		});
		$.jmpress( 'selectPrev', function( step, eventData ) {
			if (!step) {
				return false;
			}
			do {
				var prev = $(step).near( eventData.settings.stepSelector, true );
				if (prev.length === 0 || $(prev).closest(this).length === 0) {
					prev = $(this).find(eventData.settings.stepSelector).last();
				}
				if (!prev.length) {
					return false;
				}
				step = prev;
			} while( step.data("stepData").exclude );
			return step;
		});
		$.jmpress( 'selectNext', function( step, eventData ) {
			if (!step) {
				return false;
			}
			do {
				var next = $(step).near( eventData.settings.stepSelector );
				if (next.length === 0 || $(next).closest(this).length === 0) {
					next = $(this).find(eventData.settings.stepSelector).first();
				}
				if (!next.length) {
					return false;
				}
				step = next;
			} while( step.data("stepData").exclude );
			return step;
		});
	}());

	(function() { // start on defined step
		$.jmpress( 'selectInitialStep', function( nil, eventData ) {
			return eventData.settings.start;
		});
	}());

	(function() { // ways
		// TODO allow call of route after init
		function routeFunc( route, type ) {
			for(var i = 0; i < route.length - 1; i++) {
				var from = route[i];
				var to = route[i+1];
				$(from, this).attr('data-' + type, to);
			}
		}
		$.jmpress( 'register', 'route', function( route, unidirectional, reversedRoute ) {
			routeFunc.call(this, route, reversedRoute ? "prev" : "next");
			if (!unidirectional) {
				routeFunc.call(this, route.reverse(), reversedRoute ? "next" : "prev");
			}
		});
		$.jmpress( 'initStep', function( step, eventData ) {
			eventData.stepData.next = eventData.data.next;
			eventData.stepData.prev = eventData.data.prev;
		});
		$.jmpress( 'selectNext', function( step, eventData ) {
			if(eventData.stepData.next) {
				var near = $(step).near(eventData.stepData.next);
				if(near && near.length) return near;
				near = $(eventData.stepData.next, this).first();
				if(near && near.length) return near;
			}
		});
		$.jmpress( 'selectPrev', function( step, eventData ) {
			if(eventData.stepData.prev) {
				var near = $(step).near(eventData.stepData.prev, true);
				if(near && near.length) return near;
				near = $(eventData.stepData.prev, this).last();
				if(near && near.length) return near;
			}
		});
	}());

	(function() { // load steps from ajax
		$.jmpress('register', 'afterStepLoaded');
		$.jmpress('initStep', function( step, eventData ) {
			eventData.stepData.src = $(step).attr('href') || eventData.data.src || false;
		});
		$.jmpress('loadStep', function( step, eventData ) {
			var href = eventData.stepData.src;
			if ( href ) {
				$(step).load(href, function(response, status, xhr) {
					$(eventData.jmpress).jmpress('fire', 'afterStepLoaded', step, $.extend({}, eventData, {
						response: response
						,status: status
						,xhr: xhr
					}));
				});
			}
		});
	}());

	(function() { // use hash in url
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
						if($(id).attr("id") != $(jmpress).jmpress("active").attr("id")) {
							$(jmpress).jmpress('select', id);
						}
						var shouldBeHash = "#/" + $(id).attr("id");
						if(window.location.hash != shouldBeHash)
						window.location.hash = shouldBeHash;
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
	}());

	(function() { // keyboard
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
			if(!eventData.settings.fullscreen)
				$(this).attr("tabindex", 0);

			eventData.current.keyboardNamespace = ".jmpress-"+randomString();

			// KEYPRESS EVENT: this fixes a Opera bug
			$(eventData.settings.fullscreen ? document : this)
				.bind("keypress"+eventData.current.keyboardNamespace, function( event ) {

				for( var nodeName in mysettings.ignore ) {
					if ( event.target.nodeName == nodeName && mysettings.ignore[nodeName].indexOf(event.which) != -1 ) {
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
					if ( event.target.nodeName == nodeName && mysettings.ignore[nodeName].indexOf(event.which) != -1 ) {
						return;
					}
				}

				var reverseSelect = false;
				var nextFocus;
				if (event.which == 9) {
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
							.is($(jmpress).jmpress('active') ) )
							nextFocus = undefined;
					}
					if( nextFocus && nextFocus.length > 0 ) {
						nextFocus.focus();
						$(jmpress).jmpress("scrollFix");
						event.preventDefault();
						event.stopPropagation();
						return;
					} else {
						if(event.shiftKey)
							reverseSelect = true;
					}
				}

				var action = mysettings.keys[ event.which ];
				if ( typeof action == "string" ) {
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
	}());

	(function() { // viewPort
		$.jmpress("defaults").viewPort = {
			width: false
			,height: false
			,maxScale: 0
			,minScale: 0
		};
		$.jmpress("afterInit", function( nil, eventData ) {
			var jmpress = this;
			eventData.current.viewPortNamespace = ".jmpress-"+randomString();
			$(window).bind("resize"+eventData.current.viewPortNamespace, function (event) {
				$(jmpress).jmpress("select", $(jmpress).jmpress("active"), "resize");
			});
		});
		$.jmpress('afterDeinit', function( nil, eventData ) {
			$(window).unbind("resize"+eventData.current.viewPortNamespace);
		});
		$.jmpress("setActive", function( step, eventData ) {
			var viewPort = eventData.settings.viewPort;
			// Correct the scale based on the window's size
			var windowScaleY = viewPort.height && $(eventData.container).innerHeight()/viewPort.height;
			var windowScaleX = viewPort.width && $(eventData.container).innerWidth()/viewPort.width;
			var windowScale = (windowScaleX || windowScaleY) && Math.min( windowScaleX || windowScaleY, windowScaleY || windowScaleX );

			if (windowScale) {
				if (viewPort.maxScale) {
					windowScale = Math.min(windowScale, viewPort.maxScale);
				}
				if (viewPort.minScale) {
					windowScale = Math.max(windowScale, viewPort.minScale);
				}
				eventData.target.scaleX *= windowScale;
				eventData.target.scaleY *= windowScale;
				eventData.target.scaleZ *= windowScale;
			}
		});
	}());

	(function() { // clickable inactive steps
		$.jmpress("defaults").mouse = {
			clickSelects: true
		};
		$.jmpress("afterInit", function( nil, eventData ) {
			eventData.current.clickableStepsNamespace = ".jmpress-"+randomString();
			var jmpress = this;
			$(this).bind("click"+eventData.current.clickableStepsNamespace, function(event) {
				if (!eventData.settings.mouse.clickSelects) {
					return;
				}
				// clicks on the active step do default
				if ( $(event.target)
					.closest( eventData.settings.stepSelector)
					.is( $(jmpress).jmpress("active") ) ) {
						return;
					}

				// get clicked step
				var clickedStep = $(event.target).closest(eventData.settings.stepSelector);

				if (clickedStep.length) {
					// select the clicked step
					$(this).jmpress("select", clickedStep[0], "click");
					event.preventDefault();
					event.stopPropagation();
				}
			});
		});
		$.jmpress('afterDeinit', function( nil, eventData ) {
			$(this).unbind(eventData.current.clickableStepsNamespace);
		});
	}());

	(function() { // templates
		var templates = {};
		function addUndefined( target, values, prefix ) {
			for( var name in values ) {
				var targetName = name;
				if ( prefix ) {
					targetName = prefix + targetName.substr(0, 1).toUpperCase() + targetName.substr(1);
				}
				if ( $.isPlainObject(values[name]) ) {
					addUndefined( target, values[name], targetName );
				} else if( target[targetName] === undefined ) {
					target[targetName] = values[name];
				}
			}
		}
		function applyChildrenTemplates( children, templateChildren ) {
			if ($.isArray(templateChildren)) {
				if (templateChildren.length < children.length) {
					$.error("more nested steps than children in template");
				} else {
					children.each(function(idx, child) {
						var tmpl = $(child).data("_template_") || {};
						addUndefined(tmpl, templateChildren[idx]);
						$(child).data("_template_", tmpl);
					});
				}
			} else if($.isFunction(templateChildren)) {
				children.each(function(idx, child) {
					var tmpl = $(child).data("_template_") || {}
					addUndefined(tmpl, templateChildren(idx, child));
					$(child).data("_template_", tmpl);
				});
			} // TODO: else if(object)
		}
		$.jmpress("beforeInitStep", function( step, eventData ) {
			function applyTemplate( data, element, template ) {
				if (template.children) {
					var children = $(element).children( eventData.settings.stepSelector );
					applyChildrenTemplates( children, template.children );
				}
				applyTemplateData( data, template );
			}
			function applyTemplateData( data, template ) {
				addUndefined(data, template);
			}
			var templateToApply = eventData.data.template;
			if(templateToApply) {
				$.each(templateToApply.split(" "), function(idx, tmpl) {
					var template = templates[tmpl];
					applyTemplate( eventData.data, step, template );
				});
			}
			var templateFromApply = $(step).data("_applied_template_");
			if (templateFromApply) {
				applyTemplate( eventData.data, step, templateFromApply );
			}
			var templateFromParent = $(step).data("_template_");
			if (templateFromParent) {
				applyTemplate( eventData.data, step, templateFromParent );
				step.data("_template_", null);
				if(templateFromParent.template) {
					$.each(templateFromParent.template.split(" "), function(idx, tmpl) {
						var template = templates[tmpl];
						applyTemplate( eventData.data, step, template );
					});
				}
			}
		});
		$.jmpress("beforeInit", function( nil, eventData ) {
			var data = $.jmpress("dataset", this);
			if (data.template) {
				var template = templates[data.template];
				applyChildrenTemplates( $(this).find(eventData.settings.stepSelector).filter(function() {
					return !$(this).parent().is(eventData.settings.stepSelector);
				}), template.children );
			}
		});
		$.jmpress("register", "template", function( name, tmpl ) {
			if (templates[name]) {
				templates[name] = $.extend(true, {}, templates[name], tmpl);
			} else {
				templates[name] = $.extend(true, {}, tmpl);
			}
		});
		$.jmpress("register", "apply", function( selector, tmpl ) {
			if( !tmpl ) {
				// TODO ERROR because settings not found
				var stepSelector = $(this).jmpress("settings").stepSelector;
				applyChildrenTemplates( $(this).find(stepSelector).filter(function() {
					return !$(this).parent().is(stepSelector);
				}), selector );
			} else if($.isArray(tmpl)) {
				applyChildrenTemplates( $(selector), tmpl );
			} else {
				var template;
				if(typeof tmpl === "string") {
					template = templates[tmpl];
				} else {
					template = $.extend(true, {}, tmpl);
				}
				$(selector).each(function(idx, element) {
					var tmpl = $(element).data("_applied_template_") || {};
					addUndefined(tmpl, template);
					$(element).data("_applied_template_", tmpl);
				});
			}
		});
	}());

}(jQuery, document, window));
