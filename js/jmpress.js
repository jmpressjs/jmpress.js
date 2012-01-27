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
			,transitionProperty: 'all'
			,transitionDuration: '1s'
			,transitionDelay: '500ms'
			,transitionTimingFunction: 'ease-in-out'
			,transformStyle: "preserve-3d"
		}

		/* CALLBACKS */
		// TODO documentation
		,beforeChange: []
		,initStep: []
		,afterInit: []
		,applyStep: []
		,setInactive: []
		,setActive: []
		,selectInitialStep: []
		,selectPrev: []
		,selectNext: []
		,selectHome: []
		,selectEnd: []
		,loadStep: []

		/* TEST */
		,test: false
	};
	var callbacks = {
		'beforeChange': 1
		,'initStep': 1
		,'afterInit': 1
		,'applyStep': 1
		,'setInactive': 1
		,'setActive': 1
		,'selectInitialStep': 1
		,'selectPrev': 1
		,'selectNext': 1
		,'selectHome': 1
		,'selectEnd': 1
		,'loadStep': 1
	};

	/**
	 * 3D and 2D engines
	 */
	var engines = {
		3: {
			_transform: function( el, data ) {
				var transform = data.prepend || '';
				if ( data.rotate && data.rotate.revert ) {
					transform += data.rotate ? engine._rotate(data.rotate) : '';
					transform += data.translate ? engine._translate(data.translate) : '';
				} else {
					transform += data.translate ? engine._translate(data.translate) : '';
					transform += data.rotate ? engine._rotate(data.rotate) : '';
				}
				transform += data.scale ? engine._scale(data.scale) : '';
				css(el, $.extend({}, { transform: transform }, data.css));
				return true;
			}
			/**
			 * Translate
			 *
			 * @access protected
			 * @return String CSS for translate3d
			 */
			,_translate: function ( t ) {
				return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
			}
			/**
			 * Rotate
			 *
			 * @access protected
			 * @return String CSS for rotate
			 */
			,_rotate: function ( r ) {
				var rX = " rotateX(" + r.x + "deg) ",
					rY = " rotateY(" + r.y + "deg) ",
					rZ = " rotateZ(" + r.z + "deg) ";
				return r.revert ? rZ + rY + rX : rX + rY + rZ;
			}
			/**
			 * Scale
			 *
			 * @access protected
			 * @return String CSS for scale
			 */
			,_scale: function ( s ) {
				return " scaleX(" + s.x + ") scaleY(" + s.y + ") scaleZ(" + s.z + ") ";
			}
		}
		,2: {
			_transform: function( el, data ) {
				var transform = data.prepend || '';
				if ( data.rotate && data.rotate.revert ) {
					transform += data.rotate ? engine._rotate(data.rotate) : '';
					transform += data.translate ? engine._translate(data.translate) : '';
				} else {
					transform += data.translate ? engine._translate(data.translate) : '';
					transform += data.rotate ? engine._rotate(data.rotate) : '';
				}
				transform += data.scale ? engine._scale(data.scale) : '';
				css(el, $.extend({}, { transform: transform }, data.css));
				return true;
			}
			/**
			 * Translate
			 *
			 * @access protected
			 * @return String CSS for translate3d
			 */
			,_translate: function ( t ) {
				return " translate(" + t.x + "px," + t.y + "px) ";
			}
			/**
			 * Rotate
			 *
			 * @access protected
			 * @return String CSS for rotate
			 */
			,_rotate: function ( r ) {
				return " rotate(" + r.z + "deg) ";
			}
			/**
			 * Scale
			 *
			 * @access protected
			 * @return String CSS for scale
			 */
			,_scale: function ( s ) {
				return " scaleX(" + s.x + ") scaleY(" + s.y + ") ";
			}
		}
		,1: {
			_transform: function( el, data ) {
				if ( data.translate ) {
					el.animate({
						top: data.translate.y - ( el.height() / 2 ) + 'px'
						,left: data.translate.x - ( el.width() / 2 ) + 'px'
					}, 1000); // TODO: Use animation duration
				}
				return true;
			}
		}
	};

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
		}
	})();
	/**
	 * Check for support
	 *
	 * @access protected
	 * @return void
	 */
	function checkSupport() {
		var ua = navigator.userAgent.toLowerCase();
		var supported = ( ua.search(/(iphone)|(ipod)|(android)/) == -1 );
		if (!supported) {
			jmpress.addClass( settings.notSupportedClass );
		}
		return supported;
	}
	/**
	 * Engine to power cross-browser translate, scale and rotate.
	 */
	var engine = (function() {
		if (pfx("perspective")) {
			return engines[3];
		} else if (pfx("transform")) {
			return engines[2];
		} else {
			return engines[1];
		}
	})();



	/**
	 * Initialize jmpress
	 */
	function init( args ) {
		// MERGE SETTINGS
		var settings = $.extend(true, {}, defaults, args);

		// accept functions and arrays of functions as callbacks
		for (var callbackName in callbacks) {
			if ( settings[callbackName] == null ) {
				settings[callbackName] = [];
			} else if ( $.isFunction( settings[callbackName] ) ) {
				settings[callbackName] = $.merge(defaults[callbackName], [ settings[callbackName] ]);
			}
		}

		/*** MEMBER VARS ***/

		var jmpress = $( this )
			,container = null
			,area = null
			,canvas = null
			,steps = null
			,current = null
			,active = false


		/*** MEMBER FUNCTIONS ***/
		// functions have to be called with this

		/**
		 * Call a callback
		 *
		 * @param callbackName String callback which should be called
		 * @param arguments some arguments to the callback
		 */
		function callCallback( callbackName, element, eventData ) {
			eventData.settings = settings;
			eventData.current = current;
			eventData.container = container;
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
				return false;
			}
			var siblings = $(active).siblings( settings.stepSelector );
			siblings.push( active );
			siblings.each(function() {
				if ($(this).hasClass( settings.loadedClass )) {
					return;
				}
				callCallback.call(this, 'loadStep', this, {
					stepData: $(this).data('stepData')
				});
				$(this).addClass( settings.loadedClass );
			});
		}
		/**
		 * Select a given step
		 *
		 * @param Object|String el element to select
		 * @param String type reason of changing step
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
				return;
			}

			var target = {
				rotate: {
					x: -parseInt(step.rotate.x, 10)
					,y: -parseInt(step.rotate.y, 10)
					,z: -parseInt(step.rotate.z, 10)
					,revert: false
				},
				scale: {
					x: 1 / parseFloat(step.scale.x)
					,y: 1 / parseFloat(step.scale.y)
					,z: 1 / parseFloat(step.scale.z)
				},
				translate: {
					x: -step.translate.x
					,y: -step.translate.y
					,z: -step.translate.z
				}
			};

			if ( active ) {
				callCallback.call(this, 'setInactive', active, {
					stepData: $(active).data('stepData')
					,reason: type
					,target: target
					,nextStep: el
					,nextStepData: step
				} );
			}
			callCallback.call(this, 'setActive', el, {
				stepData: step
				,reason: type
				,target: target
			});

			// Set on step class on root element
			current.jmpressClass = ( $(jmpress).attr('class') || '' )
				.replace(/step-[A-Za-z0-9_-]+/gi, '').trim()
				+ ' step-' + $(el).attr('id');
			$(jmpress).attr('class', current.jmpressClass);

			var props,
				zoomin = target.scale.x >= current.scalex;

			props = {
				// to keep the perspective look similar for different scales
				// we need to 'scale' the perspective, too
				perspective: step.scale.x * 1000 + "px"
			};
			props = $.extend({}, settings.animation, props);
			if (!zoomin) {
				props.transitionDelay = '0';
			}
			if (!active) {
				props.transitionDuration = '0';
				props.transitionDelay = '0';
			}
			css(area, props);
			engine._transform(area, {
				scale: target.scale
			});

			target.rotate.revert = true;
			props = {
			};
			props = $.extend({}, settings.animation, props);
			if (zoomin) {
				props.transitionDelay = '0';
			}
			if (!active) {
				props.transitionDuration = '0';
				props.transitionDelay = '0';
			}
			//css(canvas, props);
			engine._transform(canvas, {
				translate: target.translate
				,rotate: target.rotate
				,css: props
			});

			$( settings.stepSelector ).css('z-index', 9);
			$(el).css('z-index', 10);

			current.scalex = target.scale.x;
			active = el;

			loadSiblings.call(this);

			return el;
		}
		/**
		 * This should fix ANY kind of buggy scrolling
		 */
		function scrollFix() {
			function fix() {
				if($(container)[0].tagName == "BODY")
					window.scrollTo(0, 0);
				$(container).scrollTop(0);
				$(container).scrollLeft(0);
				function check() {
					if($(container).scrollTop() != 0 ||
						$(container).scrollLeft() != 0)
						fix();
				}
				setTimeout(check, 1);
				setTimeout(check, 10);
				setTimeout(check, 100);
				setTimeout(check, 200);
				setTimeout(check, 400);
				setTimeout(check, 1000);
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
				,steps: steps
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
				,steps: steps
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
				,steps: steps
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
				,steps: steps
			}), "end" );
		}
		/**
		 * Manipulate the canvas
		 *
		 * @param Object props
		 * @return Object canvas
		 */
		function canvas( props ) {
			css(canvas, props);
			return canvas;
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
			return active && $(active);
		}
		/**
		 * fire a callback
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
			,canvas: canvas
			,settings: getSettings
			,active: getActive
			,fire: fire
		});


		// BEGIN INIT

		// CHECK FOR SUPPORT
		if (checkSupport() === false) {
			jmpress.addClass(settings.notSupportedClass);
			return;
		}

		container = jmpress;
		area = $('<div />');
		canvas = $('<div />');
		jmpress.children().each(function() {
			canvas.append( $( this ) );
		});
		if(settings.fullscreen) {
			container = $('body');
			area = jmpress;
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

		steps = $(settings.stepSelector, jmpress);

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

		// INITIALIZE EACH STEP
		steps.each(function( idx ) {
			var data = dataset( this );
			var step = {
				translate: {
					x: data.x || 0
					,y: data.y || 0
					,z: data.z || 0
				}
				,rotate: {
					x: data.rotateX || 0
					,y: data.rotateY || 0
					,z: data.rotateZ || data.rotate || 0
				}
				,scale: {
					x: data.scaleX || data.scale || 1
					,y: data.scaleY || data.scale || 1
					,z: data.scaleZ || 1
				}
				,prepend: 'translate(-50%,-50%)'
			};

			var callbackData = {
				data: data
				,stepData: step
			}
			callCallback.call(this, 'initStep', $(this), callbackData);

			$(this).data('stepData', step);

			if ( !$(this).attr('id') ) {
				$(this).attr('id', 'step-' + (idx + 1));
			}

			css($(this), {
				position: "absolute"
				,transformStyle: "preserve-3d"
			});
			callCallback.call(this, 'applyStep', $(this), callbackData);
			engine._transform( $(this), step );
		});

		callCallback.call(this, 'afterInit', $(this), {
			steps: steps
		});

		// START
		select.call(this,  callCallback.call(this, 'selectInitialStep', "init", { steps: steps }) );

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
		var key, pkey, css = {};
		for ( key in props ) {
			if ( props.hasOwnProperty(key) ) {
				pkey = pfx(key);
				if ( pkey != null ) {
					css[pkey] = props[key];
				}
			}
		}
		el.css(css);
		return el;
	}
	/**
	 * Return dataset for element
	 *
	 * @param Object element
	 * @return Object
	 */
	function dataset( el ) {
		if ( el.dataset ) {
			return el.dataset;
		}
		function toCamelcase( str ) {
			str = str.split( '-' );
			for( var i = 1; i < str.length; i++ ) {
				str[i] = str[i].substr(0, 1).toUpperCase() + str[i].substr(1);
			}
			return str.join( '' );
		}
		var dataset = {};
		var attrs = $(el)[0].attributes;
		$.each(attrs, function ( idx, attr ) {
			if ( attr.nodeName.substr(0, 5) == "data-" ) {
				dataset[ toCamelcase(attr.nodeName.substr(5)) ] = attr.nodeValue;
			}
		});
		return dataset;
	}


	/**
	 * PUBLIC STATIC METHODS LIST
	 */
	var methods = {
		init: init
		,css: css
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
			if( jmpressmethods && jmpressmethods[method] ) {
				if ( method.substr(0, 1) == '_' && jmpressmethods.settings().test === false) {
					$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
				} else {
					return jmpressmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
				}
			} else if ( methods[method] ) {
				if ( method.substr(0, 1) == '_' && defaults.test === false) {
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
				if ( method.substr(0, 1) == '_' && defaults.test === false) {
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

})(jQuery, document, window);

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
				if( $(element).is(selector) ) {
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
		}
	})();

	/* DEFAULT PLUGINS */
	// The plugins should be independent from above code
	// They may read settings from eventData.settings and
	// store state to eventData.current.
	// They can modify the defaults with $.jmpress( 'defaults' )
	// and register own callbacks with $.jmpress( 'register', '<callbackName>' )
	// own callbacks may be fired with $.jmpress( 'fire', step, eventData )

	(function() { // active class
		$.jmpress( 'defaults' ).activeClass = "active";
		$.jmpress( 'setInactive', function( step, eventData ) {
			$(step).removeClass( eventData.settings.activeClass );
		});
		$.jmpress( 'setActive', function( step, eventData ) {
			$(step).addClass( eventData.settings.activeClass );
		});
	})();

	(function() { // circular stepping
		function firstSlide( step, eventData ) {
			return eventData.steps[0];
		}
		$.jmpress( 'selectInitialStep', firstSlide);
		$.jmpress( 'selectHome', firstSlide);
		$.jmpress( 'selectEnd', function( step, eventData ) {
			return eventData.steps[eventData.steps.length - 1];
		});
		$.jmpress( 'selectPrev', function( step, eventData ) {
			if (!step) {
				return false;
			}
			var prev = $(step).prev( eventData.settings.stepSelector );
			if (prev.length < 1) {
				prev = eventData.steps.last( eventData.settings.stepSelector );
			}
			if (prev.length > 0) {
				return prev;
			}
		});
		$.jmpress( 'selectNext', function( step, eventData ) {
			if (!step) {
				return false;
			}
			var next = $(step).next( eventData.settings.stepSelector );
			if (next.length < 1) {
				next = eventData.steps.first( eventData.settings.stepSelector );
			}
			if (next.length > 0) {
				return next;
			}
		});
	})();

	(function() { // start on defined step
		$.jmpress( 'selectInitialStep', function( nil, eventData ) {
			return eventData.settings.start;
		});
	})();

	(function() { // ways
		// TODO allow call of route after init
		function routeFunc( route, type ) {
			for(var i = 0; i < route.length - 1; i++) {
				var from = route[i];
				var to = route[i+1];
				$(from, this).each(function(idx, element) {
					$(element).attr("data-"+type, to);
				});
			}
		}
		$.jmpress( 'register', 'route', function( route, unidirectional, reversedRoute ) {
			routeFunc.call(this, route, reversedRoute ? "prev" : "next");
			if(!unidirectional)
				routeFunc.call(this, route.reverse(), reversedRoute ? "next" : "prev");
		});
		$.jmpress( 'initStep', function( step, eventData ) {
			eventData.stepData.nextStep = eventData.data.next;
			eventData.stepData.prevStep = eventData.data.prev;
		});
		$.jmpress( 'selectNext', function( step, eventData ) {
			if(eventData.stepData.nextStep) {
				var near = $(step).near(eventData.stepData.nextStep);
				if(near && near.length) return near;
				near = $(eventData.stepData.nextStep, this);
				if(near && near.length) return near;
			}
		});
		$.jmpress( 'selectPrev', function( step, eventData ) {
			if(eventData.stepData.prevStep) {
				var near = $(step).near(eventData.stepData.prevStep, true);
				if(near && near.length) return near;
				near = $(eventData.stepData.prevStep, this).last();
				if(near && near.length) return near;
			}
		});
	})();

	(function() { // load steps from ajax
		$.jmpress('register', 'afterStepLoaded');
		$.jmpress('initStep', function( step, eventData ) {
			eventData.stepData.ajaxSource = $(step).attr('href') || eventData.data['src'] || false;
		});
		$.jmpress('loadStep', function( step, eventData ) {
			var href = eventData.stepData.ajaxSource;
			if ( href ) {
				$(step).load(href, function(response, status, xhr) {
					$.jmpress('fire', 'afterStepLoaded', step, $.extend({}, eventData, {
						response: response
						,status: status
						,xhr: xhr
					}));
				});
			}
		});
	})();

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
				var el = $( '#' + window.location.hash.replace(/^#\/?/,"") );
				return el.length > 0 ? el : undefined;
			}
			// HASH CHANGE EVENT
			if ( eventData.settings.hash.use && eventData.settings.hash.bindChange ) {
				var jmpress = this;
				$("a[href^=#]").live("click", function(event) {
					var href = $(this).attr("href");
					try {
						if($(href).is(eventData.settings.stepSelector)) {
							$(jmpress).jmpress("select", href);
							event.preventDefault();
						}
					} catch(e) {}
				});
			}
			if ( eventData.settings.hash.use ) {
				return getElementFromUrl();
			}
		});
		$.jmpress('setActive', function( step, eventData ) {
			// `#/step-id` is used instead of `#step-id` to prevent default browser
			// scrolling to element in hash
			if ( eventData.settings.hash.use && eventData.settings.hash.update ) {
				clearTimeout(eventData.current.hashtimeout);
				eventData.current.hashtimeout = setTimeout(function() {
					window.location.hash = "#/" + $(step).attr('id');
				}, 2000); // TODO: Use animation duration
			}
		});
	})();

	(function() { // keyboard
		$.jmpress('defaults').keyboard = {
			use: true
			,focusable: true
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
					,32 // space
					,37 // left
					,38 // up
					,39 // right
					,40 // down
				]
				,"TEXTAREA": [
					,32 // space
					,37 // left
					,38 // up
					,39 // right
					,40 // down
				]
				,"SELECT": [
					,38 // up
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

			// KEYDOWN EVENT
			$(document).keydown(function( event ) {
				if ( !eventData.settings.fullscreen && !$(event.target).closest(jmpress).length || !mysettings.use ) {
					return;
				}

				for( var nodeName in mysettings.ignore ) {
					if ( event.target.nodeName == nodeName && mysettings.ignore[nodeName].indexOf(event.which) != -1 ) {
						return;
					}
				}

				var reverseSelect = false;
				if (event.which == 9) {
					// tab
					var nextFocus;
					if ( !$(event.target).closest( $(jmpress).jmpress('active') ).length ) {
						if ( !event.shiftKey ) {
							nextFocus = $(jmpress).jmpress('active').find("a[href], :input").filter(":visible").first();
						} else {
							reverseSelect = true;
						}
					} else {
						nextFocus = $(event.target).near( mysettings.tabSelector, event.shiftKey );
						if( !$(nextFocus).closest( $(jmpress).jmpress('active') ).length )
							nextFocus = undefined;
					}
					if( nextFocus && nextFocus.length > 0 ) {
						nextFocus.focus();
						$(jmpress).jmpress("scrollFix");
						event.preventDefault();
						return;
					} else {
						if(event.shiftKey)
							reverseSelect = true;
					}
				}

				var action = mysettings.keys[ event.which ];
				if( typeof action == "string" ) {
					if(action.indexOf(":") != -1) {
						action = action.split(":");
						action = event.shiftKey ? action[1] : action[0];
					}
					$(jmpress).jmpress( action );
					event.preventDefault();
				} else if ( action ) {
					$(jmpress).jmpress.apply( $(this), action );
					event.preventDefault();
				}

				if(reverseSelect) {
					// tab
					nextFocus = $(jmpress).jmpress('active').find("a[href], :input").filter(":visible").last();
					nextFocus.focus();
					$(jmpress).jmpress("scrollFix");
				}
			});
		});
	})();

	(function() { // viewPort
		$.jmpress("defaults").viewPort = {
			width: false
			,height: false
			,maxScale: 0
			,minScale: 0
		};
		$.jmpress("afterInit", function( nil, eventData ) {
			var jmpress = this;
			$(window).resize(function (event) {
				$(jmpress).jmpress("select", $(jmpress).jmpress("active"), "resize");
			});
		});
		$.jmpress("setActive", function( step, eventData ) {
			var viewPort = eventData.settings.viewPort;
			// Correct the scale based on the window's size
			var windowScaleY = viewPort.height && $(eventData.container).innerHeight()/viewPort.height;
			var windowScaleX = viewPort.width && $(eventData.container).innerWidth()/viewPort.width;
			var windowScale = (windowScaleX || windowScaleY) && Math.min( windowScaleX || windowScaleY, windowScaleY || windowScaleX );

			if(windowScale) {
				if(viewPort.maxScale) windowScale = Math.min(windowScale, viewPort.maxScale);
				if(viewPort.minScale) windowScale = Math.max(windowScale, viewPort.minScale);
				eventData.target.scale.x *= windowScale;
				eventData.target.scale.y *= windowScale;
				eventData.target.scale.z *= windowScale;
			}
		});
	})();

	(function() { // clickable inactive steps
		$.jmpress("defaults").mouse = {
			clickSelects: true
		};
		$.jmpress("afterInit", function( nil, eventData ) {
			$(this).click(function(event) {
				if(!eventData.settings.mouse.clickSelects)
					return;
				// clicks on the active step do default
				if( $(event.target).closest($(this).jmpress("active")).length )
					return;

				// get clicked step
				var clickedStep = $(event.target).closest(eventData.settings.stepSelector);

				if(clickedStep.length) {
					// select the clicked step
					$(this).jmpress("select", clickedStep[0], "click");
					event.preventDefault();
				}
			});
		});
	})();

})(jQuery, document, window);
