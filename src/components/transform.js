/*!
 * transform.js
 * The engine that powers the transforms or falls back to other methods
 */
(function( $, document, window, undefined ) {

	'use strict';

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}
	function toCssNumber(number) {
		return (Math.round(10000*number)/10000)+"";
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
						transform += " translate3d(" + toCssNumber(item[1] || 0) + "px," + toCssNumber(item[2] || 0) + "px," + toCssNumber(item[3] || 0) + "px)";
					} else if(item[0] === "rotate") {
						var order = item[4] ? [1, 2, 3] : [3, 2, 1];
						for(i = 0; i < 3; i++) {
							transform += " rotate" + coord[order[i]-1] + "(" + toCssNumber(item[order[i]] || 0) + "deg)";
						}
					} else if(item[0] === "scale") {
						for(i = 0; i < 3; i++) {
							transform += " scale" + coord[i] + "(" + toCssNumber(item[i+1] || 1) + ")";
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
						transform += " translate(" + toCssNumber(item[1] || 0) + "px," + toCssNumber(item[2] || 0) + "px)";
					} else if(item[0] === "rotate") {
						transform += " rotate(" + toCssNumber(item[3] || 0) + "deg)";
					} else if(item[0] === "scale") {
						for(var i = 0; i < 2; i++) {
							transform += " scale" + coord[i] + "(" + toCssNumber(item[i+1] || 1) + ")";
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
						anitarget.left = Math.round(item[1] || 0) + "px";
						anitarget.top = Math.round(item[2] || 0) + "px";
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
		var pf = parseFloat;
		$.extend(stepData, {
			x: pf(data.x) || 0
			,y: pf(data.y) || 0
			,z: pf(data.z) || 0
			,r: pf(data.r) || 0
			,phi: pf(data.phi) || 0
			,rotate: pf(data.rotate) || 0
			,rotateX: pf(data.rotateX) || 0
			,rotateY: pf(data.rotateY) || 0
			,rotateZ: pf(data.rotateZ) || 0
			,revertRotate: false
			,scale: pf(data.scale) || 1
			,scaleX: pf(data.scaleX) || false
			,scaleY: pf(data.scaleY) || false
			,scaleZ: pf(data.scaleZ) || 1
		});
	});
	$.jmpress("afterInit", function( nil, eventData ) {
		var stepSelector = eventData.settings.stepSelector,
			current = eventData.current;
		current.perspectiveScale = 1;
		current.maxNestedDepth = 0;
		var nestedSteps = $(eventData.jmpress).find(stepSelector).children(stepSelector);
		while(nestedSteps.length) {
			current.maxNestedDepth++;
			nestedSteps = nestedSteps.children(stepSelector);
		}
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

		for(var i = eventData.current.maxNestedDepth; i > (eventData.parents.length || 0); i--) {
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
				if(eventData.current["rotate"+name+"-"+idx] === undefined) {
					eventData.current["rotate"+name+"-"+idx] = item[name] || 0;
				}
				var cur = eventData.current["rotate"+name+"-"+idx], tar = item[name] || 0,
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
			if(item[0] === "rotate" &&
				item[1] % 360 === 0  &&
				item[2] % 360 === 0  &&
				item[3] % 360 === 0) {
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
			props.transitionDelay = '0s';
		}
		if (!eventData.beforeActive) {
			props.transitionDuration = '0s';
			props.transitionDelay = '0s';
		}
		$.jmpress("css", eventData.area, props);
		engine.transform(eventData.area, extracted);

		props = $.extend({}, animation);
		if (!zoomout) {
			props.transitionDelay = '0s';
		}
		if (!eventData.beforeActive) {
			props.transitionDuration = '0s';
			props.transitionDelay = '0s';
		}

		eventData.current.perspectiveScale = target.perspectiveScale;

		$.jmpress("css", eventData.canvas, props);
		engine.transform(eventData.canvas, target.transform);
	});

}(jQuery, document, window));