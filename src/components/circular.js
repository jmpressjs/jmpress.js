(function( $, document, window, undefined ) {

	'use strict';

	$.jmpress( 'initStep', function( step, eventData ) {
		eventData.stepData.exclude = eventData.data.exclude && ["false", "no"].indexOf(eventData.data.exclude) === -1;
	});
	function firstSlide( step, eventData ) {
		return $(this).find(eventData.settings.stepSelector).first();
	}
	$.jmpress( 'selectInitialStep', firstSlide);
	$.jmpress( 'selectHome', firstSlide);
	$.jmpress( 'selectEnd', function( step, eventData ) {
		return $(this).find(eventData.settings.stepSelector).last();
	});
	$.jmpress( 'selectPrev', function( step, eventData ) {
		if (!step) {
			return false;
		}
		do {
			var prev = $(step).near( eventData.settings.stepSelector, true );
			if (prev.length === 0 || $(prev).closest(this).length === 0) {
				prev = $(this).find(eventData.settings.stepSelector).last();
			}
			if (!prev.length) {
				return false;
			}
			step = prev;
		} while( step.data("stepData").exclude );
		return step;
	});
	$.jmpress( 'selectNext', function( step, eventData ) {
		if (!step) {
			return false;
		}
		do {
			var next = $(step).near( eventData.settings.stepSelector );
			if (next.length === 0 || $(next).closest(this).length === 0) {
				next = $(this).find(eventData.settings.stepSelector).first();
			}
			if (!next.length) {
				return false;
			}
			step = next;
		} while( step.data("stepData").exclude );
		return step;
	});
}(jQuery, document, window));