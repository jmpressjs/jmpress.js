/*
 * ways.js
 * Control the flow of the steps
 */
(function( $, document, window, undefined ) {

	"use strict";

	var $jmpress = $.jmpress;

	/* FUNCTIONS */
	function routeFunc( jmpress, route, type ) {
		var from, to,
			i = 0;
		for ( ; i < route.length - 1; i++ ) {
			from = route[ i ];
			to = route[ i + 1 ];
			if ( $( jmpress ).jmpress( "initialized" ) ) {
				$( from, jmpress ).data( "stepData" )[ type ] = to;
			} else {
				$( from, jmpress ).attr( "data-" + type, to );
			}
		}
	}
	function selectPrevOrNext( step, eventData, attr, prev ) {
		var near,
			stepData = eventData.stepData;
		if ( stepData[ attr ] ) {
			near = $( step ).near( stepData[ attr ], prev );
			if ( near && near.length ) {
				return near;
			}
			near = $( stepData[ attr ], this )[ prev ? "last" : "first" ]();
			if ( near && near.length ) {
				return near;
			}
		}
	}

	/* EXPORTED FUNCTIONS */
	$jmpress( "register", "route", function( route, unidirectional, reversedRoute ) {
		if ( typeof route === "string" ) {
			route = [ route, route ];
		}
		routeFunc( this, route, reversedRoute ? "prev" : "next" );
		if ( !unidirectional ) {
			routeFunc( this, route.reverse(), reversedRoute ? "next" : "prev" );
		}
	});

	/* HOOKS */
	$jmpress( "initStep", function( step, eventData ) {
		var attr;
		for ( attr in {
			next:1,
			prev:1
		}) {
			eventData.stepData[ attr ] = eventData.data[ attr ];
		}
	});
	$jmpress( "selectNext", function( step, eventData ) {
		return selectPrevOrNext.call( this, step, eventData, "next" );
	});
	$jmpress( "selectPrev", function( step, eventData ) {
		return selectPrevOrNext.call( this, step, eventData, "prev", true );
	});

}( jQuery, document, window ));
