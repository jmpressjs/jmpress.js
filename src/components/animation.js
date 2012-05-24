/*!
 * animation.js
 * Apply custom animations to steps
 */
(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	function parseSubstepInfo(str) {
		var arr = str.split(" ");
		var className = arr[0];
		var config = { willClass: "will-"+className, doClass: "do-"+className, hasClass: "has-"+className };
		var state = "";
		for(var i = 1; i < arr.length; i++) {
			var s = arr[i];
			switch(state) {
			case "":
				if(s === "after") {
					state = "after";
				} else {
					$.warn("unknown keyword in '"+str+"'. '"+s+"' unknown.");
				}
				break;
			case "after":
				if(s.match(/^[1-9][0-9]*m?s?/)) {
					var value = parseFloat(s);
					if(s.indexOf("ms") !== -1) {
						value *= 1;
					} else if(s.indexOf("s") !== -1) {
						value *= 1000;
					} else if(s.indexOf("m") !== -1) {
						value *= 60000;
					}
					config.delay = value;
				} else {
					config.after = Array.prototype.slice.call(arr, i).join(" ");
				}
			}
		}
		return config;
	}
	function find(array, selector, start, end) {
		end = end || (array.length - 1);
		start = start || 0;
		for(var i = start; i < end + 1; i++) {
			if($(array[i].element).is(selector)) {
				return i;
			}
		}
	}
	function addOn(list, substep, delay) {
		$.each(substep._on, function(idx, child) {
			list.push({substep: child.substep, delay: child.delay + delay});
			addOn(list, child.substep, child.delay + delay);
		});
	}
	$.jmpress("defaults").customAnimationDataAttribute = "jmpress";
	$.jmpress("afterInit", function( nil, eventData ) {
		eventData.current.animationTimeouts = [];
		eventData.current.animationCleanupWaiting = [];
	});
	$.jmpress("applyStep", function( step, eventData ) {
		// read custom animation from elements
		var substepsData = {};
		var listOfSubsteps = [];
		$(step).find("[data-"+eventData.settings.customAnimationDataAttribute+"]")
				.each(function(idx, element) {
			if($(element).closest(eventData.settings.stepSelector).is(step)) {
				listOfSubsteps.push({element: element});
			}
		});
		if(listOfSubsteps.length === 0) {
			return;
		}
		$.each(listOfSubsteps, function(idx, substep) {
			substep.info = parseSubstepInfo(
				$(substep.element).data(eventData.settings.customAnimationDataAttribute));
			$(substep.element).addClass(substep.info.willClass);
			substep._on = [];
			substep._after = null;
		});
		var current = {_after: undefined, _on: [], info: {}}; // virtual zero step
		$.each(listOfSubsteps, function(idx, substep) {
			var other = substep.info.after;
			if(other) {
				if(other === "step") {
					other = current;
				} else if(other === "prev") {
					other = listOfSubsteps[idx-1];
				} else {
					var index = find(listOfSubsteps, other, 0, idx - 1);
					if(index === -1) {
						index = find(listOfSubsteps, other);
					}
					other = (index === -1 || index === idx) ? listOfSubsteps[idx-1] : listOfSubsteps[index];
				}
			} else {
				other = listOfSubsteps[idx-1];
			}
			if(other) {
				if(!substep.info.delay) {
					if(!other._after) {
						other._after = substep;
						return;
					}
					other = other._after;
				}
				other._on.push({substep: substep, delay: substep.info.delay || 0});
			}
		});
		if(current._after === undefined && current._on.length === 0) {
			var startStep = find(listOfSubsteps, eventData.stepData.startSubstep) || 0;
			current._after = listOfSubsteps[startStep];
		}
		var substepsInOrder = [];
		function findNextFunc(idx, item) {
			if(item.substep._after) {
				current = item.substep._after;
				return false;
			}
		}
		do {
			var substepList = [{substep: current, delay: 0}];
			addOn(substepList, current, 0);
			substepsInOrder.push(substepList);
			current = null;
			$.each(substepList, findNextFunc);
		} while(current);
		substepsData.list = substepsInOrder;
		$(step).data("substepsData", substepsData);
	});
	$.jmpress("unapplyStep", function( step, eventData ) {
		var substepsData = $(step).data("substepsData");
		if(substepsData) {
			$.each(substepsData.list, function(idx, activeSubsteps) {
				$.each(activeSubsteps, function(idx, substep) {
					if(substep.substep.info.willClass) {
						$(substep.substep.element).removeClass(substep.substep.info.willClass);
					}
					if(substep.substep.info.hasClass) {
						$(substep.substep.element).removeClass(substep.substep.info.hasClass);
					}
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
					}
				});
			});
		}
	});
	$.jmpress("setActive", function(step, eventData) {
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep === undefined) {
			eventData.substep =
				(eventData.reason === "prev" ?
					substepsData.list.length-1 :
					0
				);
		}
		var substep = eventData.substep;
		$.each(eventData.current.animationTimeouts, function(idx, timeout) {
			clearTimeout(timeout);
		});
		eventData.current.animationTimeouts = [];
		$.each(substepsData.list, function(idx, activeSubsteps) {
			var applyHas = idx < substep;
			var applyDo = idx <= substep;
			$.each(activeSubsteps, function(idx, substep) {
				if(substep.substep.info.hasClass) {
					$(substep.substep.element)[(applyHas?"add":"remove")+"Class"](substep.substep.info.hasClass);
				}
				function applyIt() {
					$(substep.substep.element).addClass(substep.substep.info.doClass);
				}
				if(applyDo && !applyHas && substep.delay && eventData.reason !== "prev") {
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
						eventData.current.animationTimeouts.push(setTimeout(applyIt, substep.delay));
					}
				} else {
					if(substep.substep.info.doClass) {
						$(substep.substep.element)[(applyDo?"add":"remove")+"Class"](substep.substep.info.doClass);
					}
				}
			});
		});
	});
	$.jmpress("setInactive", function(step, eventData) {
		if(eventData.nextStep === step) {
			return;
		}
		function cleanupAnimation( substepsData ) {
			$.each(substepsData.list, function(idx, activeSubsteps) {
				$.each(activeSubsteps, function(idx, substep) {
					if(substep.substep.info.hasClass) {
						$(substep.substep.element).removeClass(substep.substep.info.hasClass);
					}
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
					}
				});
			});
		}
		$.each(eventData.current.animationCleanupWaiting, function(idx, item) {
			cleanupAnimation(item);
		});
		eventData.current.animationCleanupWaiting = [];
		var substepsData = $(step).data("substepsData");
		if(substepsData) {
			eventData.current.animationCleanupWaiting.push( substepsData );
		}
	});
	$.jmpress("selectNext", function( step, eventData ) {
		if(eventData.substep === undefined) {
			return;
		}
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep < substepsData.list.length-1) {
			return {step: step, substep: eventData.substep+1};
		}
	});
	$.jmpress("selectPrev", function( step, eventData ) {
		if(eventData.substep === undefined) {
			return;
		}
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep > 0) {
			return {step: step, substep: eventData.substep-1};
		}
	});

}(jQuery, document, window));