/*!
 * ways.js
 * Control the flow of the steps
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* FUNCTIONS */
	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}
	function routeFunc( jmpress, route, type ) {
		for(var i = 0; i < route.length - 1; i++) {
			var from = route[i];
			var to = route[i+1];
			if($(jmpress).jmpress("initialized")) {
				$(from, jmpress).data("stepData")[type] = to;
			} else {
				$(from, jmpress).attr('data-' + type, to);
			}
		}
	}
	function selectPrevOrNext( step, eventData, attr, prev ) {
		var stepData = eventData.stepData;
		if(stepData[attr]) {
			var near = $(step).near(stepData[attr], prev);
			if(near && near.length) {
				return near;
			}
			near = $(stepData[attr], this)[prev?"last":"first"]();
			if(near && near.length) {
				return near;
			}
		}
	}

	/* EXPORTED FUNCTIONS */
	$jmpress( 'register', 'route', function( route, unidirectional, reversedRoute ) {
		if( typeof route === "string" ) {
			route = [route, route];
		}
		routeFunc(this, route, reversedRoute ? "prev" : "next");
		if (!unidirectional) {
			routeFunc(this, route.reverse(), reversedRoute ? "next" : "prev");
		}
	});

	/* HOOKS */
	$jmpress( 'initStep', function( step, eventData ) {
		for(var attr in {next:1,prev:1}) {
			eventData.stepData[attr] = eventData.data[attr];
		}
	});
	$jmpress( 'selectNext', function( step, eventData ) {
		return selectPrevOrNext.call(this, step, eventData, "next");
	});
	$jmpress( 'selectPrev', function( step, eventData ) {
		return selectPrevOrNext.call(this, step, eventData, "prev", true);
	});

}(jQuery, document, window));