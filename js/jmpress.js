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
		,canvasClass: 'canvas'
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

	/**
	 * Vars used throughout plugin
	 */
	var jmpress = null
		,settings = null
		,canvas = null
		,steps = null
		,current = null
		,active = false
		,callbacks = {
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
					transform += data.rotate ? methods._engine._rotate(data.rotate) : '';
					transform += data.translate ? methods._engine._translate(data.translate) : '';
				} else {
					transform += data.translate ? methods._engine._translate(data.translate) : '';
					transform += data.rotate ? methods._engine._rotate(data.rotate) : '';
				}
				transform += data.scale ? methods._engine._scale(data.scale) : '';
				methods.css(el, $.extend({}, { transform: transform }, data.css));
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
					transform += data.rotate ? methods._engine._rotate(data.rotate) : '';
					transform += data.translate ? methods._engine._translate(data.translate) : '';
				} else {
					transform += data.translate ? methods._engine._translate(data.translate) : '';
					transform += data.rotate ? methods._engine._rotate(data.rotate) : '';
				}
				transform += data.scale ? methods._engine._scale(data.scale) : '';
				methods.css(el, $.extend({}, { transform: transform }, data.css));
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
	 * Methods
	 */
	var methods = {
		/**
		 * Initialize jmpress
		 */
		init: function( args ) {
			// MERGE SETTINGS
			settings = $.extend({}, defaults, args);

			// accept functions and arrays of functions as callbacks
			for (var callbackName in callbacks) {
				if ( settings[callbackName] == null ) {
					settings[callbackName] = [];
				} else if ( $.isFunction( settings[callbackName] ) ) {
					settings[callbackName] = [ settings[callbackName] ];
				}
				// merge new callbacks with defaults
				// this is required if callbacks are set in defaults
				if ( defaults[callbackName] !== settings[callbackName] ) {
					settings[callbackName] = $.merge(defaults[callbackName], settings[callbackName]);
				}
			}

			// BEGIN INIT
			jmpress = $( this );

			// CHECK FOR SUPPORT
			if (methods._checkSupport() === false) {
				return;
			}

			canvas = $('<div />').addClass( settings.canvasClass );
			jmpress.children().each(function() {
				canvas.append( $( this ) );
			});
			jmpress.append( canvas );
			
			steps = $(settings.stepSelector, jmpress);

			document.documentElement.style.height = "100%";

			$('body').css({
				height: '100%'
				,overflow: 'hidden'
			});

			var props = {
				position: "absolute"
				,transitionDuration: '0s'
			};
			props = $.extend({}, settings.animation, props);
			methods.css(jmpress, props);
			methods.css(jmpress, {
				top: '50%'
				,left: '50%'
				,perspective: '1000px'
			});
			methods.css(canvas, props);

			current = {
				scalex: 1
			};

			// INITIALIZE EACH STEP
			steps.each(function( idx ) {
				var data = methods._dataset( this );
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
				methods._callCallback('initStep', $(this), callbackData);

				$(this).data('stepData', step);

				if ( !$(this).attr('id') ) {
					$(this).attr('id', 'step-' + (idx + 1));
				}

				methods.css($(this), {
					position: "absolute"
					,transformStyle: "preserve-3d"
				});
				methods._callCallback('applyStep', $(this), callbackData);
				methods._engine._transform( $(this), step );
			});

			methods._callCallback('afterInit', $(this), {
				steps: steps
			});

			// START 
			methods.select( methods._callCallback('selectInitialStep', "init", { steps: steps }) );

		}
		/**
		 * Select a given step
		 *
		 * @param Object|String el element to select
		 * @param String type reason of changing step
		 * @return Object element selected
		 */
		,select: function ( el, type ) {
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
			if(settings.fullscreen)
				window.scrollTo(0, 0);

			var step = $(el).data('stepData');

			var cancelSelect = false;
			methods._callCallback("beforeChange", el, {
				stepData: step
				,reason: type
				,cancel: function() {
					cancelSelect = true;
				}
			});
			if(cancelSelect) {
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
				methods._callCallback( 'setInactive', active, {
					stepData: $(active).data('stepData')
					,reason: type
					,target: target
					,nextStep: el
					,nextStepData: step
				} );
			}
			methods._callCallback('setActive', el, {
				stepData: step
				,reason: type
				,target: target
			});
			jmpress.attr('class', 'step-' + $(el).attr('id'));

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
			methods.css(jmpress, props);
			methods._engine._transform(jmpress, {
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
			//methods.css(canvas, props);
			methods._engine._transform(canvas, {
				translate: target.translate
				,rotate: target.rotate
				,css: props
			});

			$( settings.stepSelector ).css('z-index', 9);
			$(el).css('z-index', 10);

			current.scalex = target.scale.x;
			active = el;

			methods._loadSiblings();

			return el;
		}
		/**
		 * Alias for select
		 */
		,goTo: function( el ) {
			return methods.select( el, "jump" );
		}
		/**
		 * Goto Next Slide
		 *
		 * @return Object newly active slide
		 */
		,next: function() {
			return methods.select( methods._callCallback('selectNext', active, {
				stepData: $(active).data('stepData')
				,steps: steps
			}), "next" );
		}
		/**
		 * Goto Previous Slide
		 *
		 * @return Object newly active slide
		 */
		,prev: function() {
			return methods.select( methods._callCallback('selectPrev', active, {
				stepData: $(active).data('stepData')
				,steps: steps
			}), "prev" );
		}
		/**
		 * Goto First Slide
		 *
		 * @return Object newly active slide
		 */
		,home: function() {
			return methods.select(  methods._callCallback('selectHome', active, {
				stepData: $(active).data('stepData')
				,steps: steps
			}), "home" );
		}
		/**
		 * Goto Last Slide
		 *
		 * @return Object newly active slide
		 */
		,end: function() {
			return methods.select(  methods._callCallback('selectEnd', active, {
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
		,canvas: function( props ) {
			methods.css(canvas, props);
			return canvas;
		}
		/**
		 * Set CSS on element w/ prefixes
		 *
		 * @return Object element which properties were set
		 * 
		 * TODO: Consider bypassing pfx and blindly set as jQuery 
		 * already checks for support
		 */
		,css: function ( el, props ) {
			var key, pkey, css = {};
			for ( key in props ) {
				if ( props.hasOwnProperty(key) ) {
					pkey = methods._pfx(key);
					if ( pkey != null ) {
						css[pkey] = props[key];
					}
				}
			}
			el.css(css);
			return el;
		}
		/**
		 * Return default settings
		 *
		 * @return Object
		 */
		,defaults: function() {
			return defaults;
		}
		/**
		 * Return current settings
		 * 
		 * @return Object
		 */
		,settings: function() {
			return settings;
		}
		/**
		 * Return current step
		 *
		 * @return Object
		 */
		,active: function() {
			return active && $(active);
		}
		/**
		 * Call a callback
		 *
		 * @param callbackName String callback which should be called
		 * @param arguments some arguments to the callback
		 */
		,_callCallback: function( callbackName, element, eventData ) {
			eventData.settings = settings;
			eventData.current = current;
			var result = {};
			$.each( settings[callbackName], function(idx, callback) {
				result.value = callback.call( jmpress, element, eventData ) || result.value;
			});
			return result.value;
		}
		/**
		 *
		 */
		,fire: function( callbackName, element, eventData ) {
			if( !callbacks[callbackName] ) {
				$.error( "callback " + callbackName + " is not registered." );
			} else {
				methods._callCallback(callbackName, element, eventData);
			}
		}
		/**
		 * Load Siblings
		 * If a slide has data-src or href set load that slide dynamically
		 *
		 * @access protected
		 * @return void
		 */
		,_loadSiblings: function() {
			if (!active) {
				return false;
			}
			var siblings = $(active).siblings( settings.stepSelector );
			siblings.push( active );
			siblings.each(function() {
				if ($(this).hasClass( settings.loadedClass )) {
					return;
				}
				methods._callCallback('loadStep', this, {
					stepData: $(this).data('stepData')
				});
				$(this).addClass( settings.loadedClass );
			});
		}
		/**
		 * Register a callback
		 *
		 * @access public
		 * @param callbackName String the name of the callback
		 */
		,register: function (callbackName) {
			if( callbacks[callbackName] ) {
				$.error( "callback " + callbackName + " is already registered." );
			} else {
				callbacks[callbackName] = 1;
				defaults[callbackName] = [];
			}
		}
		/**
		 * Set supported prefixes
		 *
		 * @access protected
		 * @return Function to get prefixed property
		 */
		,_pfx: (function () {
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
		})()
		/**
		 * Return dataset for element
		 * 
		 * @param Object element
		 * @return Object
		 */
		,_dataset: function( el ) {
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
		 * Check for support
		 *
		 * @access protected
		 * @return void
		 */
		,_checkSupport: function() {
			var ua = navigator.userAgent.toLowerCase();
			var supported = ( ua.search(/(iphone)|(ipod)|(android)/) == -1 );
			if (!supported) {
				jmpress.addClass( settings.notSupportedClass );
			}
			return supported;
		}
		/**
		 * Return supported Engine
		 *
		 * @access protected
		 * @return an transformator
		 */
		,_getSupportedEngine: function() {
			if (methods._pfx("perspective")) {
				return engines[3];
			} else if (methods._pfx("transform")) {
				return engines[2];
			} else {
			    return engines[1];
			}
		}
		/**
		 * Engine to power cross-browser translate, scale and rotate.
		 */
		,_engine: {}
	};

	methods._engine = methods._getSupportedEngine();

	/**
	 * $.jmpress()
	 */
	$.fn.jmpress = function( method ) {
		if ( methods[method] ) {
			if ( method.substr(0, 1) == '_' && settings.test === false) {
				$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
			} else {
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			}
		} else if ( callbacks[method] ) {
			var func = Array.prototype.slice.call( arguments, 1 )[0];
			if ($.isFunction( func )) {
				settings[method] = settings[method] || [];
				settings[method].push(func);
			}
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jmpress' );
		}
		// to allow chaining
		return this;
	};
	$.extend({
		jmpress: function( method ) {
			if ( methods[method] ) {
				if ( method.substr(0, 1) == '_' && settings.test === false) {
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
				var el = $( '#' + window.location.hash.replace(/^#\/?/,"") );
				return el.length > 0 ? el : undefined;
			}
			// HASH CHANGE EVENT
			if ( eventData.settings.hash.use ) {
				var jmpress = this;
				$(window).bind('hashchange', function() {
					var id = getElementFromUrl();
					if(id != $(jmpress).jmpress("active").attr("id")) {
						$.jmpress('select', id);
					}
				});
				return getElementFromUrl();
			}
		});
		$.jmpress('setActive', function( step, eventData ) {
			// `#/step-id` is used instead of `#step-id` to prevent default browser
			// scrolling to element in hash
			if ( eventData.settings.hash.use ) {
				clearTimeout(eventData.current.hashtimeout);
				eventData.current.hashtimeout = setTimeout(function() {
					window.location.hash = "#/" + $(step).attr('id');
				}, 1500); // TODO: Use animation duration
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

			function checkAndGo( elements, func ) {
				var next;
				elements.each(function(idx, element) {
					if(event.shiftKey) {
						next = func(element);
						if (next) {
							return false;
						}
					}
					if( $(element).is(mysettings.tabSelector) ) {
						next = $(element);
						return false;
					}
					if(!event.shiftKey) {
						next = func(element);
						if (next) {
							return false;
						}
					}
				});
				return next;
			}
			function findNextInChildren(item) {
				var children = $(item).children();
				if(event.shiftKey) {
					children = $(children.get().reverse());
				}
				return checkAndGo( children, findNextInChildren );
			}
			function findNextInSiblings(item) {
				return checkAndGo(
					$(item)[event.shiftKey ? "prevAll" : "nextAll"](),
					findNextInChildren );
			}
			function findNextInParents(item) {
				var next;
				var parents = $(item)
					.parentsUntil($(jmpress).jmpress('active'));
				$.each(parents.get(), function(idx, element) {
					if( $(element).is(mysettings.tabSelector) ) {
						next = $(element);
						return false;
					}
					next = findNextInSiblings(element);
					if(next) {
						return false;
					}
				});
				return next;
			}

			// tabindex make it focusable so that it can recieve key events
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
						nextFocus = (event.shiftKey ?
										false :
										findNextInChildren( event.target )) ||
									findNextInSiblings( event.target ) ||
									findNextInParents( event.target );
					}
					if( nextFocus && nextFocus.length > 0 ) {
						nextFocus.focus();
						if(eventData.settings.fullscreen)
							window.scrollTo(0, 0);
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
					if(eventData.settings.fullscreen)
						window.scrollTo(0, 0);
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
			var windowScaleY = viewPort.height && $(window).innerHeight()/viewPort.height;
			var windowScaleX = viewPort.width && $(window).innerWidth()/viewPort.width;
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
