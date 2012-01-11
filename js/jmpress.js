/*!
 * jmpress.js
 *
 * a jQuery port of https://github.com/bartaz/impress.js based on the power of
 * CSS3 transforms and transitions in modern browsers and inspired by the idea
 * behind prezi.com.
 *
 * Copyright 2012, Kyle Robinson Young @shama
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Based on the foundation laid by Bartek Szopka @bartaz
 */

(function( $, document, window ) {
	/**
	 * Default Settings
	 */
	var defaults = {
		stepSelector: '.step'
		,canvasClass: 'canvas'
		,notSupportedClass: 'not-supported'
		,loadedClass: 'loaded'
		,animation: {
			transformOrigin: 'top left'
			,transitionProperty: 'all'
			,transitionDuration: '1s'
			,transitionTimingFunction: 'ease-in-out'
			,transformStyle: "preserve-3d"
		}
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
		};

	/**
	 * Methods
	 */
	var methods = {
		/**
		 * Initialize jmpress
		 */
		init: function( args ) {
			// SET CALLBACKS
			$.each(callbacks, function(callback) {
				if ($.isFunction( args[callback] )) {
					methods[callback] = args[callback];
				}
			});
			
			// MERGE SETTINGS
			settings = $.extend(defaults, {}, args);

			// BEGIN INIT
			jmpress = $( this );

			// CHECK FOR SUPPORT
			if (methods._checkSupport() == false) {
				return;
			}

			canvas = $('<div />').addClass( settings.canvasClass );
			jmpress.children().each(function() {
				canvas.append( $( this ) );
			});
			jmpress.append( canvas );
			
			steps = $('.step', jmpress);

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
				translate: {x: 0, y: 0, z: 0}
				,rotate:   {x: 0, y: 0, z: 0}
				,scale:    {x: 1, y: 1, z: 1}
			};

			// INITIALIZE EACH STEP
			steps.each(function( idx ) {
				var data = this.dataset;
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
				};

				$(this).data('stepData', step);

				if ( !$(this).attr('id') ) {
					$(this).attr('id', 'step-' + (idx + 1));
				}

				methods.css($(this), {
					position: "absolute"
					,transform: "translate(-50%,-50%)" +
						methods._translate(step.translate) +
						methods._rotate(step.rotate) +
						methods._scale(step.scale)
					,transformStyle: "preserve-3d"
				});
			});

			// KEYDOWN EVENT
			$(document).keydown(function( event ) {
				if ( event.keyCode == 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
					switch( event.keyCode ) {
						case 33:; // pg up
						case 37:; // left
						case 38:   // up
							methods.prev();
						break;
						case 9:; // tab
						case 32:; // space
						case 34:; // pg down
						case 39:; // right
						case 40:   // down
							methods.next();
						break; 
					}
					event.preventDefault();
				}
			});

			// HASH CHANGE EVENT
			window.addEventListener("hashchange", function () {
				methods.select( methods._getElementFromUrl() );
			}, false);

			// START 
			// by selecting step defined in url or first step
			methods.select( methods._getElementFromUrl() || $( steps[0] ) );

		}
		/**
		 * Select a given step
		 *
		 * @param Object|String el element to select
		 * @return Object element selected
		 */
		,select: function ( el ) {
			if ( typeof el == 'string') {
				el = jmpress.find( el ).first();
			}
			if ( !el || !el.data('stepData') ) {
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
			window.scrollTo(0, 0);

			var step = el.data('stepData');

			methods.beforeChange.call( jmpress, el );

			if ( active ) {
				active.removeClass('active');
			}
			el.addClass('active');

			jmpress.attr('class', 'step-' + el.attr('id'));

			// `#/step-id` is used instead of `#step-id` to prevent default browser
			// scrolling to element in hash
			window.location.hash = "#/" + el.attr('id');

			var target = {
				rotate: {
					x: -parseInt(step.rotate.x, 10),
					y: -parseInt(step.rotate.y, 10),
					z: -parseInt(step.rotate.z, 10)
				},
				scale: {
					x: 1 / parseFloat(step.scale.x),
					y: 1 / parseFloat(step.scale.y),
					z: 1 / parseFloat(step.scale.z)
				},
				translate: {
					x: -step.translate.x,
					y: -step.translate.y,
					z: -step.translate.z
				}
			};

			var props,
				zoomin = target.scale.x >= current.scale.x;

			props = {
				// to keep the perspective look similar for different scales
				// we need to 'scale' the perspective, too
				perspective: step.scale.x * 1000 + "px"
				,transform: methods._scale(target.scale)
				,transitionDelay: (zoomin ? "500ms" : "0ms")
			};
			props = $.extend({}, settings.animation, props);
			if (!active) {
				props.transitionDuration = '0';
			}
			methods.css(jmpress, props);

			props = {
				transform: methods._rotate(target.rotate, true) + methods._translate(target.translate)
				,transitionDelay: (zoomin ? "0ms" : "500ms")
			};
			props = $.extend({}, settings.animation, props);
			if (!active) {
				props.transitionDuration = '0';
			}
			methods.css(canvas, props);

			current = target;
			active = el;

			methods._loadSiblings();

			return el;
		}
		/**
		 * Alias for select
		 */
		,goTo: function( el ) {
			return methods.select( el );
		}
		/**
		 * Goto Next Slide
		 *
		 * @return Object newly active slide
		 */
		,next: function() {
			return methods.select( methods.getNext() );
		}
		/**
		 * Goto Previous Slide
		 *
		 * @return Object newly active slide
		 */
		,prev: function() {
			return methods.select( methods.getPrev() );
		}
		/**
		 * Get Next Slide
		 * 
		 * @return Object
		 */
		,getNext: function() {
			var next = active.next( settings.stepSelector );
			if (next.length < 1) {
				next = steps.first( settings.stepSelector );
			}
			return next;
		}
		/**
		 * Get Previous Slide
		 * 
		 * @return Object
		 */
		,getPrev: function() {
			var prev = active.prev( settings.stepSelector );
			if (prev.length < 1) {
				prev = steps.last( settings.stepSelector );
			}
			return prev;
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
		 * Return current settings
		 * 
		 * @return Object
		 */
		,settings: function() {
			return settings;
		}
		/**
		 * Call before slide has changed
		 */
		,beforeChange: function( el ) {
			return true;
		}
		/**
		 * Load Siblings
		 * If a slide has data-src or href set load that slide dynamically
		 *
		 * @access protected
		 * @return void
		 */
		,_loadSiblings: function() {
			var siblings = active.siblings( settings.stepSelector );
			siblings.push( active );
			siblings.each(function() {
				if ($(this).hasClass( settings.loadedClass )) {
					return;
				}
				var href = $(this).attr('href') || $(this).attr('data-src') || false;
				if ( href ) {
					$(this).load( href, function() {
						$(this).addClass( settings.loadedClass );
					});
				}
			});
		}
		/**
		 * getElementFromUrl
		 *
		 * @access protected
		 * @return String or false
		 */
		,_getElementFromUrl: function () {
			// get id from url # by removing `#` or `#/` from the beginning,
			// so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
			var el = $('#' + window.location.hash.replace(/^#\/?/,"") );
			return el.length > 0 ? el : false;
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
		 * Translate
		 *
		 * @access protected
		 * @return String CSS for translate3d
		 */
		,_translate: function ( t ) {
			return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
		}
		/**
		 * Scale
		 *
		 * @access protected
		 * @return String CSS for rotate
		 */
		,_rotate: function ( r, revert ) {
			var rX = " rotateX(" + r.x + "deg) ",
				rY = " rotateY(" + r.y + "deg) ",
				rZ = " rotateZ(" + r.z + "deg) ";
			return revert ? rZ + rY + rX : rX + rY + rZ;
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
		/**
		 * Check for support
		 *
		 * @access protected
		 * @return void
		 */
		,_checkSupport: function() {
			var ua = navigator.userAgent.toLowerCase();
			var supported = ( methods._pfx("perspective") !== null ) &&
				( ua.search(/(iphone)|(ipod)|(ipad)|(android)/) == -1 );
			if (!supported) {
				jmpress.addClass( settings.notSupportedClass );
			}
			return supported;
		}
	};

	/**
	 * $.jmpress()
	 */
	$.fn.jmpress = function( method ) {
		if ( methods[method] ) {
			if ( method.substr(0, 1) == '_' && settings.test === false) {
				$.error( 'Method ' +  method + ' is protected and should only be used internally.' );
			} else {
				if ( callbacks[method] ) {
					var func = Array.prototype.slice.call( arguments, 1 )[0];
					if ($.isFunction( func )) {
						methods[method] = func;
					}
				} else {
					return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
				}
			}
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jmpress' );
		}
		return false;
	};
})(jQuery, document, window);