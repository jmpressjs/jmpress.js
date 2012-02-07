(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	function parseSubstepInfo(str) {
		// TODO allow complex syntax
		return { willClass: "will-"+str, doClass: str, hasClass: "has-"+str };
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
			addOn(list, child, child.delay + delay);
		});
	}
	$.jmpress("defaults").customAnimationDataAttribute = "jmpress";
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
		var current = find(listOfSubsteps, eventData.stepData.startSubstep) || 0;
		$.each(listOfSubsteps, function(idx, substep) {
			var other = substep.on || substep.after;
			if(other) {
				if(other === "step") {
					other = listOfSubsteps[current];
				} else if(other === "prev") {
					other = listOfSubsteps[idx-1];
				} else {
					other = find(listOfSubsteps, other, idx + 1) || find(listOfSubsteps, other) || null;
				}
			}
			if(!other) {
				other = listOfSubsteps[idx-1];
			}
			if(other) {
				if(!substep.on) {
					if(!other._after) {
						other._after = substep;
						return;
					}
					other = other._after;
				}
				other._on.push({substep: substep, delay: 0});
			}
		});
		var substepsInOrder = [];
		current = listOfSubsteps[current];
		do {
			var substepList = [{substep: current, delay: 0}];
			addOn(substepList, current, 0);
			substepsInOrder.push(substepList);
			current = current._after;
		} while(current);
		substepsData.list = substepsInOrder;
		$(step).data("substepsData", substepsData);
	});
	$.jmpress("setActive", function(step, eventData) {
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep === undefined) {
			eventData.substep =
				(eventData.reason === "prev" ?
					substepsData.list.length /* or 0 (TODO: decide!) */ :
					0
				);
		}
		var substep = eventData.substep;
		$.each(substepsData.list, function(idx, activeSubsteps) {
			var applyHas = idx+1 < substep;
			var applyDo = idx+1 <= substep;
			$.each(activeSubsteps, function(idx, substep) {
				if(substep.substep.info.hasClass) {
					$(substep.substep.element)[(applyHas?"add":"remove")+"Class"](substep.substep.info.hasClass);
				}
				if(substep.substep.info.doClass) {
					$(substep.substep.element)[(applyDo?"add":"remove")+"Class"](substep.substep.info.doClass);
				}
			});
		});
	});
	$.jmpress("selectNext", function( step, eventData ) {
		if(eventData.substep === undefined) {
			return;
		}
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep < substepsData.list.length) {
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