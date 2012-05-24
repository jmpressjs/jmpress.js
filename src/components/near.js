/*!
 * near.js
 * Find steps near each other
 */
(function( $, document, window, undefined ) {

	'use strict';

	// add near( selector, backwards = false) to jquery


	function checkAndGo( elements, func, selector, backwards ) {
		var next;
		elements.each(function(idx, element) {
			if(backwards) {
				next = func(element, selector, backwards);
				if (next) {
					return false;
				}
			}
			if( $(element).is(selector) ) {
				next = element;
				return false;
			}
			if(!backwards) {
				next = func(element, selector, backwards);
				if (next) {
					return false;
				}
			}
		});
		return next;
	}
	function findNextInChildren(item, selector, backwards) {
		var children = $(item).children();
		if(backwards) {
			children = $(children.get().reverse());
		}
		return checkAndGo( children, findNextInChildren, selector, backwards );
	}
	function findNextInSiblings(item, selector, backwards) {
		return checkAndGo(
			$(item)[backwards ? "prevAll" : "nextAll"](),
			findNextInChildren, selector, backwards );
	}
	function findNextInParents(item, selector, backwards) {
		var next;
		var parents = $(item).parents();
		parents = $(parents.get());
		$.each(parents.get(), function(idx, element) {
			if( backwards && $(element).is(selector) ) {
				next = element;
				return false;
			}
			next = findNextInSiblings(element, selector, backwards);
			if(next) {
				return false;
			}
		});
		return next;
	}

	$.fn.near = function( selector, backwards ) {
		var array = [];
		$(this).each(function(idx, element) {
			var near = (backwards ?
					false :
					findNextInChildren( element, selector, backwards )) ||
				findNextInSiblings( element, selector, backwards ) ||
				findNextInParents( element, selector, backwards );
			if( near ) {
				array.push(near);
			}
		});
		return $(array);
	};
}(jQuery, document, window));