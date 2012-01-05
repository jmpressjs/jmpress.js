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

(function( $ ) {
	/**
	 * Default Settings
	 */
	var settings = {
		
	};

	/**
	 * Methods
	 */
	var methods = {
		
	};

	/**
	 * $.jmpress
	 */
	$.fn.jmpress = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
		return false;
	};
})(jQuery);