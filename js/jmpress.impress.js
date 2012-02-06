/*!
 * jmpress.js v0.3.5
 * http://shama.github.com/jmpress.js
 *
 * A jQuery plugin to build a website on the infinite canvas.
 *
 * Copyright 2012 Kyle Robinson Young @shama & Tobias Koppers @sokra
 * Licensed MIT
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
		if(!name) {
			return;
		}
		var index = 1 + name.substr(1).search(/[A-Z]/);
		var prefix = name.substr(0, index).toLowerCase();
		var postfix = name.substr(index).toLowerCase();
		return "-" + prefix + "-" + postfix;
	}
	function addComma( attribute ) {
		if(!attribute) {
			return "";
		}
		return attribute + ",";
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
			,transitionProperty: addComma(mapProperty(pfx('transform'))) + addComma(mapProperty(pfx('perspective'))) + 'opacity'
			,transitionDuration: '1s'
			,transitionDelay: '500ms'
			,transitionTimingFunction: 'ease-in-out'
			,transformStyle: "preserve-3d"
		}
		,transitionDuration: 1500
		,maxNestedDepth: 10

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
			,activeSubstep = null
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
		 * Reselect the active step
		 *
		 * @param String type reason of reselecting step
		 */
		function reselect( type ) {
			return select( { step: active, substep: activeSubstep }, type);
		}
		/**
		 * Select a given step
		 *
		 * @param el element to select
		 * @param type reason of changing step
		 * @return Object element selected
		 */
		function select( el, type ) {
			var substep = null;
			if ( $.isPlainObject( el ) ) {
				substep = el.substep;
				el = el.step;
			}
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
					,nextSubstep: substep
					,nextStepData: step
				} );
			}
			var callbackData = {
				stepData: step
				,delegatedFrom: el
				,reason: type
				,target: target
				,substep: substep
				,prevStep: activeDelegated
				,prevSubstep: activeSubstep
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
			activeSubstep = callbackData.substep;
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
				,substep: activeSubstep
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
				,substep: activeSubstep
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
			,reselect: reselect
			,scrollFix: scrollFix
			,goTo: goTo
			,next: next
			,prev: prev
			,home: home
			,end: end
			,canvas: canvasMod
			,container: function() { return container; }
			,settings: function() { return settings; }
			,active: getActive
			,current: function() { return current; }
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

		current = {};

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

	// add near( selector, backwards = false) to jquery


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
}(jQuery, document, window));
(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	/**
	 * 3D and 2D engines
	 */
	var engines = {
		3: {
			transform: function( el, data ) {
				var transform = 'translate(-50%,-50%)';
				$.each(data, function(idx, item) {
					var coord = ["X", "Y", "Z"];
					var i;
					if(item[0] === "translate") { // ["translate", x, y, z]
						transform += " translate3d(" + (item[1] || 0) + "px," + (item[2] || 0) + "px," + (item[3] || 0) + "px)";
					} else if(item[0] === "rotate") {
						var order = item[4] ? [1, 2, 3] : [3, 2, 1];
						for(i = 0; i < 3; i++) {
							transform += " rotate" + coord[order[i]-1] + "(" + (item[order[i]] || 0) + "deg)";
						}
					} else if(item[0] === "scale") {
						for(i = 0; i < 3; i++) {
							transform += " scale" + coord[i] + "(" + (item[i+1] || 1) + ")";
						}
					}
				});
				$.jmpress("css", el, $.extend({}, { transform: transform }));
			}
		}
		,2: {
			transform: function( el, data ) {
				var transform = 'translate(-50%,-50%)';
				$.each(data, function(idx, item) {
					var coord = ["X", "Y"];
					if(item[0] === "translate") { // ["translate", x, y, z]
						transform += " translate(" + (item[1] || 0) + "px," + (item[2] || 0) + "px)";
					} else if(item[0] === "rotate") {
						transform += " rotate(" + (item[3] || 0) + "deg)";
					} else if(item[0] === "scale") {
						for(var i = 0; i < 2; i++) {
							transform += " scale" + coord[i] + "(" + (item[i+1] || 1) + ")";
						}
					}
				});
				$.jmpress("css", el, $.extend({}, { transform: transform }));
			}
		}
		,1: {
			// CHECK IF SUPPORT IS REALLY NEEDED?
			// this not even work without scaling...
			// it may better to display the normal view
			transform: function( el, data ) {
				var anitarget = { top: 0, left: 0 };
				$.each(data, function(idx, item) {
					var coord = ["X", "Y"];
					if(item[0] === "translate") { // ["translate", x, y, z]
						anitarget.left = (item[1] || 0) + "px";
						anitarget.top = (item[2] || 0) + "px";
					}
				});
				el.animate(anitarget, 1000); // TODO: Use animation duration
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
			// CHECK IF SUPPORT IS REALLY NEEDED?
			return engines[1];
		}
	}());

	$.jmpress("defaults").reasonableAnimation = {};
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
	$.jmpress("afterInit", function( nil, eventData ) {
		eventData.current.perspectiveScale = 1;
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
		var sd = eventData.stepData;
		var transform = [
			["translate",
				sd.x || (sd.r * Math.sin(sd.phi*Math.PI/180)),
				sd.y || (-sd.r * Math.cos(sd.phi*Math.PI/180)),
				sd.z],
			["rotate",
				sd.rotateX,
				sd.rotateY,
				sd.rotateZ || sd.rotate,
				true],
			["scale",
				sd.scaleX || sd.scale,
				sd.scaleY || sd.scale,
				sd.scaleZ || sd.scale]
		];
		engine.transform( step, transform );
	});
	$.jmpress("setActive", function( element, eventData ) {
		var target = eventData.target;
		var step = eventData.stepData;
		var tf = target.transform = [];
		target.perspectiveScale = 1;

		for(var i = eventData.settings.maxNestedDepth; i > (eventData.parents.length || 0); i--) {
			tf.push(["scale"], ["rotate"], ["translate"]);
		}

		tf.push(["scale",
			1 / (step.scaleX || step.scale),
			1 / (step.scaleY || step.scale),
			1 / (step.scaleZ)]);
		tf.push(["rotate",
			-step.rotateX,
			-step.rotateY,
			-(step.rotateZ || step.rotate)]);
		tf.push(["translate",
			-(step.x || (step.r * Math.sin(step.phi*Math.PI/180))),
			-(step.y || (-step.r * Math.cos(step.phi*Math.PI/180))),
			-step.z]);
		target.perspectiveScale *= (step.scaleX || step.scale);

		$.each(eventData.parents, function(idx, element) {
			var step = $(element).data("stepData");
			tf.push(["scale",
				1 / (step.scaleX || step.scale),
				1 / (step.scaleY || step.scale),
				1 / (step.scaleZ)]);
			tf.push(["rotate",
				-step.rotateX,
				-step.rotateY,
				-(step.rotateZ || step.rotate)]);
			tf.push(["translate",
				-(step.x || (step.r * Math.sin(step.phi*Math.PI/180))),
				-(step.y || (-step.r * Math.cos(step.phi*Math.PI/180))),
				-step.z]);
			target.perspectiveScale *= (step.scaleX || step.scale);
		});

		$.each(tf, function(idx, item) {
			if(item[0] !== "rotate") {
				return;
			}
			function lowRotate(name) {
				if(item[name] === undefined) {
					return;
				}
				if(eventData.current["rotate"+name+"-"+idx] === undefined) {
					eventData.current["rotate"+name+"-"+idx] = item[name];
				}
				var cur = eventData.current["rotate"+name+"-"+idx], tar = item[name],
					curmod = cur % 360, tarmod = tar % 360;
				if(curmod < 0) {
					curmod += 360;
				}
				if(tarmod < 0) {
					tarmod += 360;
				}
				var diff = tarmod - curmod;
				if(diff < -180) {
					diff += 360;
				} else if(diff > 180) {
					diff -= 360;
				}
				eventData.current["rotate"+name+"-"+idx] = item[name] = cur + diff;
			}
			lowRotate(1);
			lowRotate(2);
			lowRotate(3);
		});
	});
	$.jmpress("applyTarget", function( active, eventData ) {

		var target = eventData.target,
			props, step = eventData.stepData,
			settings = eventData.settings,
			zoomin = target.perspectiveScale * 1.3 < eventData.current.perspectiveScale,
			zoomout = target.perspectiveScale > eventData.current.perspectiveScale * 1.3;

		// extract first scale from transform
		var lastScale = -1;
		$.each(target.transform, function(idx, item) {
			if(item.length <= 1) {
				return;
			}
			if(item[0] === "scale") {
				lastScale = idx;
			} else {
				return false;
			}
		});

		if(lastScale !== eventData.current.oldLastScale) {
			zoomin = zoomout = false;
			eventData.current.oldLastScale = lastScale;
		}

		var extracted = [];
		if(lastScale !== -1) {
			while(lastScale >= 0) {
				if(target.transform[lastScale][0] === "scale") {
					extracted.push(target.transform[lastScale]);
					target.transform[lastScale] = ["scale"];
				}
				lastScale--;
			}
		}

		var animation = settings.animation;
		if(settings.reasonableAnimation[eventData.reason]) {
			animation = $.extend({},
				animation,
				settings.reasonableAnimation[eventData.reason]);
		}

		props = {
			// to keep the perspective look similar for different scales
			// we need to 'scale' the perspective, too
			perspective: Math.round(target.perspectiveScale * 1000) + "px"
		};
		props = $.extend({}, animation, props);
		if (!zoomin) {
			props.transitionDelay = '0';
		}
		if (!active) {
			props.transitionDuration = '0';
			props.transitionDelay = '0';
		}
		$.jmpress("css", eventData.area, props);
		engine.transform(eventData.area, extracted);

		props = $.extend({}, animation);
		if (!zoomout) {
			props.transitionDelay = '0';
		}
		if (!active) {
			props.transitionDuration = '0';
			props.transitionDelay = '0';
		}

		eventData.current.perspectiveScale = target.perspectiveScale;

		engine.transform(eventData.canvas, target.transform);
		$.jmpress("css", eventData.canvas, props);
	});

}(jQuery, document, window));
(function( $, document, window, undefined ) {

	'use strict';

	$.jmpress("defaults").nestedActiveClass = "nested-active";
	$.jmpress( 'defaults' ).activeClass = "active";
	$.jmpress( 'setInactive', function( step, eventData ) {
		if(eventData.settings.activeClass) {
			$(step).removeClass( eventData.settings.activeClass );
		}
		if(eventData.settings.nestedActiveClass) {
			$.each(eventData.parents, function(idx, element) {
				$(element).removeClass(eventData.settings.nestedActiveClass);
			});
		}
	});
	$.jmpress( 'setActive', function( step, eventData ) {
		if(eventData.settings.activeClass) {
			$(step).addClass( eventData.settings.activeClass );
		}
		if(eventData.settings.nestedActiveClass) {
			$.each(eventData.parents, function(idx, element) {
				$(element).addClass(eventData.settings.nestedActiveClass);
			});
		}
	});

}(jQuery, document, window));
(function( $, document, window, undefined ) {

	'use strict';

	$.jmpress( 'initStep', function( step, eventData ) {
		eventData.stepData.exclude = eventData.data.exclude && ["false", "no"].indexOf(eventData.data.exclude) === -1;
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
}(jQuery, document, window));
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
(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	$.jmpress("defaults").mouse = {
		clickSelects: true
	};
	$.jmpress("afterInit", function( nil, eventData ) {
		eventData.current.clickableStepsNamespace = ".jmpress-"+randomString();
		var jmpress = this;
		$(this).bind("click"+eventData.current.clickableStepsNamespace, function(event) {
			if (!eventData.settings.mouse.clickSelects || eventData.current.userZoom) {
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

}(jQuery, document, window));