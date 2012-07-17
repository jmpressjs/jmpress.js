/*!
 * viewport.js
 * Scale to fit a given viewport
 */
(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	var defaults = $.jmpress("defaults");
	defaults.viewPort = {
		width: false
		,height: false
		,maxScale: 0
		,minScale: 0
		,zoomable: 0
		,zoomBindMove: true
		,zoomBindWheel: true
	};
	var keys = defaults.keyboard.keys;
	keys[$.browser.mozilla?107:187] = "zoomIn";  // +
	keys[$.browser.mozilla?109:189] = "zoomOut"; // -
	defaults.reasonableAnimation.resize = {
		transitionDuration: '0s'
		,transitionDelay: '0ms'
	};
	defaults.reasonableAnimation.zoom = {
		transitionDuration: '0s'
		,transitionDelay: '0ms'
	};
	$.jmpress("initStep", function( step, eventData ) {
		for(var variable in {"viewPortHeight":1, "viewPortWidth":1, "viewPortMinScale":1, "viewPortMaxScale":1, "viewPortZoomable":1}) {
			eventData.stepData[variable] = eventData.data[variable] && parseFloat(eventData.data[variable]);
		}
	});
	$.jmpress("afterInit", function( nil, eventData ) {
		var jmpress = this;
		eventData.current.viewPortNamespace = ".jmpress-"+randomString();
		$(window).bind("resize"+eventData.current.viewPortNamespace, function (event) {
			$(jmpress).jmpress("reselect", "resize");
		});
		eventData.current.userZoom = 0;
		eventData.current.userTranslateX = 0;
		eventData.current.userTranslateY = 0;
		if(eventData.settings.viewPort.zoomBindWheel) {
			$(eventData.settings.fullscreen ? document : this)
				.bind("mousewheel"+eventData.current.viewPortNamespace+" DOMMouseScroll"+eventData.current.viewPortNamespace, function( event, delta ) {
				delta = delta || event.originalEvent.wheelDelta || -event.originalEvent.detail /* mozilla */;
				var direction = (delta / Math.abs(delta));
				if(direction < 0) {
					$(eventData.jmpress).jmpress("zoomOut", event.originalEvent.x, event.originalEvent.y);
				} else if(direction > 0) {
					$(eventData.jmpress).jmpress("zoomIn", event.originalEvent.x, event.originalEvent.y);
				}
				return false;
			});
		}
		if(eventData.settings.viewPort.zoomBindMove) {
			$(eventData.settings.fullscreen ? document : this).bind("mousedown"+eventData.current.viewPortNamespace, function (event) {
				if(eventData.current.userZoom) {
					eventData.current.userTranslating = { x: event.clientX, y: event.clientY };
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			}).bind("mousemove"+eventData.current.viewPortNamespace, function (event) {
				var userTranslating = eventData.current.userTranslating;
				if(userTranslating) {
					$(jmpress).jmpress("zoomTranslate", event.clientX - userTranslating.x, event.clientY - userTranslating.y);
					userTranslating.x = event.clientX;
					userTranslating.y = event.clientY;
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			}).bind("mouseup"+eventData.current.viewPortNamespace, function (event) {
				if(eventData.current.userTranslating) {
					eventData.current.userTranslating = undefined;
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});
		}
	});
	function maxAbs(value, range) {
		return Math.max(Math.min(value, range), -range);
	}
	function zoom(x, y, direction) {
		var current = $(this).jmpress("current"),
			settings = $(this).jmpress("settings"),
			stepData = $(this).jmpress("active").data("stepData"),
			container = $(this).jmpress("container");
		if(current.userZoom === 0 && direction < 0) {
			return;
		}
		var zoomableSteps = stepData.viewPortZoomable || settings.viewPort.zoomable;
		if(current.userZoom === zoomableSteps && direction > 0) {
			return;
		}
		current.userZoom += direction;

		var halfWidth = $(container).innerWidth()/2,
			halfHeight = $(container).innerHeight()/2;

		x = x ? x - halfWidth : x;
		y = y ? y - halfHeight : y;

		// TODO this is not perfect... too much math... :(
		current.userTranslateX =
			maxAbs(current.userTranslateX - direction * x / current.zoomOriginWindowScale / zoomableSteps,
			halfWidth * current.userZoom * current.userZoom / zoomableSteps);
		current.userTranslateY =
			maxAbs(current.userTranslateY - direction * y / current.zoomOriginWindowScale / zoomableSteps,
			halfHeight * current.userZoom * current.userZoom / zoomableSteps);

		$(this).jmpress("reselect", "zoom");
	}
	$.jmpress("register", "zoomIn", function(x, y) {
		zoom.call(this, x||0, y||0, 1);
	});
	$.jmpress("register", "zoomOut", function(x, y) {
		zoom.call(this, x||0, y||0, -1);
	});
	$.jmpress("register", "zoomTranslate", function(x, y) {
		var current = $(this).jmpress("current"),
			settings = $(this).jmpress("settings"),
			stepData = $(this).jmpress("active").data("stepData"),
			container = $(this).jmpress("container");
		var zoomableSteps = stepData.viewPortZoomable || settings.viewPort.zoomable;
		var halfWidth = $(container).innerWidth(),
			halfHeight = $(container).innerHeight();
		current.userTranslateX =
			maxAbs(current.userTranslateX + x / current.zoomOriginWindowScale,
			halfWidth * current.userZoom * current.userZoom / zoomableSteps);
		current.userTranslateY =
			maxAbs(current.userTranslateY + y / current.zoomOriginWindowScale,
			halfHeight * current.userZoom * current.userZoom / zoomableSteps);
		$(this).jmpress("reselect", "zoom");
	});
	$.jmpress('afterDeinit', function( nil, eventData ) {
		$(window).unbind(eventData.current.viewPortNamespace);
	});
	$.jmpress("setActive", function( step, eventData ) {
		var viewPort = eventData.settings.viewPort;
		var viewPortHeight = eventData.stepData.viewPortHeight || viewPort.height;
		var viewPortWidth = eventData.stepData.viewPortWidth || viewPort.width;
		var viewPortMaxScale = eventData.stepData.viewPortMaxScale || viewPort.maxScale;
		var viewPortMinScale = eventData.stepData.viewPortMinScale || viewPort.minScale;
		// Correct the scale based on the window's size
		var windowScaleY = viewPortHeight && $(eventData.container).innerHeight()/viewPortHeight;
		var windowScaleX = viewPortWidth && $(eventData.container).innerWidth()/viewPortWidth;
		var windowScale = (windowScaleX || windowScaleY) && Math.min( windowScaleX || windowScaleY, windowScaleY || windowScaleX );

		if(windowScale) {
			windowScale = windowScale || 1;
			if(viewPortMaxScale) {
				windowScale = Math.min(windowScale, viewPortMaxScale);
			}
			if(viewPortMinScale) {
				windowScale = Math.max(windowScale, viewPortMinScale);
			}

			var zoomableSteps = eventData.stepData.viewPortZoomable || eventData.settings.viewPort.zoomable;
			if(zoomableSteps) {
				var diff = (1/windowScale) - (1/viewPortMaxScale);
				diff /= zoomableSteps;
				windowScale = 1/((1/windowScale) - diff * eventData.current.userZoom);
			}

			eventData.target.transform.reverse();
			if(eventData.current.userTranslateX && eventData.current.userTranslateY) {
				eventData.target.transform.push(["translate", eventData.current.userTranslateX, eventData.current.userTranslateY, 0]);
			} else {
				eventData.target.transform.push(["translate"]);
			}
			eventData.target.transform.push(["scale",
				windowScale,
				windowScale,
				1]);
			eventData.target.transform.reverse();
			eventData.target.perspectiveScale /= windowScale;
		}
		eventData.current.zoomOriginWindowScale = windowScale;
	});
	$.jmpress("setInactive", function( step, eventData ) {
		if(!eventData.nextStep || !step || $(eventData.nextStep).attr("id") !== $(step).attr("id")) {
			eventData.current.userZoom = 0;
			eventData.current.userTranslateX = 0;
			eventData.current.userTranslateY = 0;
		}
	});

}(jQuery, document, window));