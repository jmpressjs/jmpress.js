/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {
	
	QUnit.testStart = function(test) {
		window.location.hash = '#';
	};
	
	module('core', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
		}
	});
	
	test('init', 1, function() {
		$(this.fixture).jmpress();
		ok( $(this.fixture).hasClass('step-about'), 'first step class is set' );
	});
	
	test('init with settings', 2, function() {
		$(this.fixture).jmpress({
			canvasClass: 'testcanvas'
			,stepSelector: 'li'
		});
		var result = $(this.fixture).jmpress( 'settings' );
		equal( result.canvasClass, 'testcanvas', 'canvasClass has been set' );
		equal( result.stepSelector, 'li', 'stepSelector has been set' );
	});
	
	test('settings on first step', 5, function() {
		$(this.fixture).jmpress();
		var step = $(this.fixture).find('.step:first');
		ok( step.hasClass('active'), 'first step has active class' );
		equal( step.css('position'), 'absolute', 'position is absolute' );
		ok( step.attr('style').indexOf('translate(-50%, -50%)'), 'css translate should be set' );
		ok( step.attr('style').indexOf('translate3d(-900px, -1500px, 0px)'), 'css translate3d should be set' );
		ok( step.attr('style').indexOf('preserve-3d'), 'css preserve-3d should be set' );
	});
	
}(jQuery));