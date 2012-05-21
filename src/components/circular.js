/*!
 * circular.js
 * Repeat from start after end
 */
(function( $, document, window, undefined ) {

	'use strict';
	var $jmpress = $.jmpress;

	/* FUNCTIONS */
	function firstSlide( step, eventData ) {
		return $(this).find(eventData.settings.stepSelector).first();
	}
	function prevOrNext( jmpress, step, eventData, prev) {
		if (!step) {
			return false;
		}
		var stepSelector = eventData.settings.stepSelector;
		step = $(step);
		do {
			var item = step.near( stepSelector, prev );
			if (item.length === 0 || item.closest(jmpress).length === 0) {
				item = $(jmpress).find(stepSelector)[prev?"last":"first"]();
			}
			if (!item.length) {
				return false;
			}
			step = item;
		} while( step.data("stepData").exclude );
		return step;
	}

	/* HOOKS */
	$jmpress( 'initStep', function( step, eventData ) {
		eventData.stepData.exclude = eventData.data.exclude && ["false", "no"].indexOf(eventData.data.exclude) === -1;
	});
	$jmpress( 'selectInitialStep', firstSlide);
	$jmpress( 'selectHome', firstSlide);
	$jmpress( 'selectEnd', function( step, eventData ) {
		return $(this).find(eventData.settings.stepSelector).last();
	});
	$jmpress( 'selectPrev', function( step, eventData ) {
		return prevOrNext(this, step, eventData, true);
	});
	$jmpress( 'selectNext', function( step, eventData ) {
		return prevOrNext(this, step, eventData);
	});
}(jQuery, document, window));