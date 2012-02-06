(function( $, document, window, undefined ) {

	'use strict';

	function randomString() {
		return "" + Math.round(Math.random() * 100000, 0);
	}

	// TODO allow call of route after init
	function routeFunc( route, type ) {
		for(var i = 0; i < route.length - 1; i++) {
			var from = route[i];
			var to = route[i+1];
			$(from, this).attr('data-' + type, to);
		}
	}
	$.jmpress( 'register', 'route', function( route, unidirectional, reversedRoute ) {
		routeFunc.call(this, route, reversedRoute ? "prev" : "next");
		if (!unidirectional) {
			routeFunc.call(this, route.reverse(), reversedRoute ? "next" : "prev");
		}
	});
	$.jmpress( 'initStep', function( step, eventData ) {
		eventData.stepData.next = eventData.data.next;
		eventData.stepData.prev = eventData.data.prev;
	});
	$.jmpress( 'selectNext', function( step, eventData ) {
		if(eventData.stepData.next) {
			var near = $(step).near(eventData.stepData.next);
			if(near && near.length) {
				return near;
			}
			near = $(eventData.stepData.next, this).first();
			if(near && near.length) {
				return near;
			}
		}
	});
	$.jmpress( 'selectPrev', function( step, eventData ) {
		if(eventData.stepData.prev) {
			var near = $(step).near(eventData.stepData.prev, true);
			if(near && near.length) {
				return near;
			}
			near = $(eventData.stepData.prev, this).last();
			if(near && near.length) {
				return near;
			}
		}
	});

}(jQuery, document, window));