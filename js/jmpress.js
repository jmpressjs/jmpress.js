/**
 * jmpress.js
 *
 * jmpress.js is jQuery fork of https://github.com/bartaz/impress.js and a 
 * presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Copyright 2012 Kyle Robinson Young (@shama)
 */

(function( $, document, window ) {
	/**
	 * Default Settings
	 */
	var settings = {
		active: null
	};
	
	/**
	 * Vars used throughout plugin
	 */
	var vars = {
		impress: null
		,canvas: null
		,steps: null
		,current: null
		,active: null
	};

	/**
	 * Methods
	 */
	var methods = {
		/**
		 * Initialize jmpress
		 */
		init: function( args ) {
			methods.checkSupport( this );
			
			vars.impress = $(this);
			
			vars.canvas = $('<div />').addClass('canvas');
			vars.impress.children().each(function() {
				vars.canvas.append($(this));
			});
			vars.impress.append(vars.canvas);
			
			vars.steps = $('.step', vars.impress);
    
			// SETUP
			// set initial values and defaults

			document.documentElement.style.height = "100%";
			
			$('body').css({
				height: '100%'
				,overflow: 'hidden'
			});

			var props = {
				position: "absolute"
				,transformOrigin: "top left"
				,transition: "all 1s ease-in-out"
				,transformStyle: "preserve-3d"
			};
			methods.css(vars.impress, props);
			methods.css(vars.impress, {
				top: '50%'
				,left: '50%'
				,perspective: '1000px'
			});
			methods.css(vars.canvas, props);

			vars.current = {
				translate: { x: 0, y: 0, z: 0 }
				,rotate:    { x: 0, y: 0, z: 0 }
				,scale:     { x: 1, y: 1, z: 1 }
			};

			vars.steps.each(function( idx, el ) {
				var data = el.dataset;
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

				$.data($(el), 'stepData', step);

				if ( !$(el).attr('id') ) {
					$(el).attr('id', 'step-' + (idx + 1));
				}
				
				methods.css($(el), {
					position: "absolute"
					,transform: "translate(-50%,-50%)" +
							   methods.translate(step.translate) +
							   methods.rotate(step.rotate) +
							   methods.scale(step.scale)
					,transformStyle: "preserve-3d"
				});

			});
			
			// EVENTS
    
			$(document).keydown(function( event ) {
				if ( event.keyCode == 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
					switch( event.keyCode ) {
						case 33: ; // pg up
						case 37: ; // left
						case 38:   // up
							methods.prev();
						break;
						case 9:  ; // tab
						case 32: ; // space
						case 34: ; // pg down
						case 39: ; // right
						case 40:   // down
							methods.next();
						break; 
					}
					event.preventDefault();
				}
			});

			$(document).click(function( event ) {
				// event delegation with "bubbling"
				// check if event target (or any of its parents is a link or a step)
				var target = event.target;
				while ( (target.tagName != "A") &&
						(!target.stepData) &&
						(target != document.body) ) {
					target = target.parentNode;
				}

				if ( target.tagName == "A" ) {
					var href = target.getAttribute("href");

					// if it's a link to presentation step, target this step
					if ( href && href[0] == '#' ) {
						target = byId( href.slice(1) );
					}
				}

				if ( methods.select(target) ) {
					event.preventDefault();
				}
			});

			// TODO: Replace with jQuery way
			window.addEventListener("hashchange", function () {
				methods.select( methods.getElementFromUrl() );
			}, false);

			// START 
			// by selecting step defined in url or first step of the presentation
			methods.select( methods.getElementFromUrl() || $( vars.steps[0] ) );
			
		}
		/**
		 * Select a given step
		 */
		,select: function ( el ) {
			if ( !el || !$.hasData( el ) ) {
				// selected element is not defined as step
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

			var step = el.data('stepData');console.log(step);

			if ( vars.active ) {
				vars.active.removeClass('active');
			}
			$( el ).addClass('active');

			vars.impress.attr('class', 'step-' + el.attr('id'));

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

			var zoomin = target.scale.x >= vars.current.scale.x;

			methods.css(vars.impress, {
				// to keep the perspective look similar for different scales
				// we need to 'scale' the perspective, too
				perspective: step.scale.x * 1000 + "px",
				transform: methods.scale(target.scale),
				transitionDelay: (zoomin ? "500ms" : "0ms")
			});

			methods.css(vars.canvas, {
				transform: methods.rotate(target.rotate, true) + methods.translate(target.translate),
				transitionDelay: (zoomin ? "0ms" : "500ms")
			});

			vars.current = target;
			vars.active = el;

			return el;
		}
		/**
		 * Next Slide
		 */
		,next: function() {
			var next = vars.active;
			next = vars.steps.indexOf( vars.active ) + 1;
			next = next < vars.steps.length ? vars.steps[ next ] : vars.steps[ 0 ];
			methods.select(next);
		}
		/**
		 * Previous Slide
		 */
		,prev: function() {
			var next = vars.active;
			next = vars.steps.indexOf( vars.active ) - 1;
			next = next >= 0 ? vars.steps[ next ] : vars.steps[ vars.steps.length-1 ];
			methods.select(next);
		}
		/**
		 * getElementFromUrl
		 */
		,getElementFromUrl: function () {
			// get id from url # by removing `#` or `#/` from the beginning,
			// so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
			var el = $('#' + window.location.hash.replace(/^#\/?/,"") );
			return el.length > 0 ? el : false;
		}
		/**
		 * Prefix
		 */
		,pfx: function () {
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
		}
		/**
		 * Set CSS on element
		 */
		,css: function ( el, props ) {
			var key, pkey;
			elem = el.get(0);
			for ( key in props ) {
				if ( props.hasOwnProperty(key) ) {
					pkey = methods.pfx(key);
					if ( pkey != null ) {
						elem.style[pkey] = props[key];
					}
				}
			}
			return el;
		}
		/**
		 * Translate
		 */
		,translate: function ( t ) {
			return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
		}
		/**
		 * Scale
		 */
		,rotate: function ( r, revert ) {
			var rX = " rotateX(" + r.x + "deg) ",
				rY = " rotateY(" + r.y + "deg) ",
				rZ = " rotateZ(" + r.z + "deg) ";
			return revert ? rZ + rY + rX : rX + rY + rZ;
		}
		/**
		 * Scale
		 */
		,scale: function ( s ) {
			return " scaleX(" + s.x + ") scaleY(" + s.y + ") scaleZ(" + s.z + ") ";
		}
		/**
		 * Check for support
		 */
		,checkSupport: function( elem ) {
			var ua = navigator.userAgent.toLowerCase();
			var impressSupported = ( methods.pfx("perspective") != null ) &&
				( ua.search(/(iphone)|(ipod)|(ipad)|(android)/) == -1 );
			if (!impressSupported) {
				$(elem).addClass('impress-not-supported');
				return;
			}
		}
	};

	/**
	 * $.jmpress()
	 */
	$.fn.jmpress = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.jmpress' );
		}
		return false;
	};
})(jQuery, document, window);