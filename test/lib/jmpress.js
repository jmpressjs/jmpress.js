/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {

	'use strict';

	QUnit.testStart = function(test) {
		window.location.hash = '#';
	};

	QUnit.done = function() {
		$('body').css('overflow', 'auto');
	};

	module('core#init', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
		}
	});

	test('init', 2, function() {
		$(this.fixture).jmpress();
		ok( $(this.fixture).hasClass('step-about'), 'first step class is set' );
		ok( $(this.fixture).jmpress('initialized') );
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

	test('deinit', 1, function() {
		$(this.fixture).jmpress();
		$(this.fixture).jmpress('deinit');
		ok( !$(this.fixture).jmpress('initialized') );
	});


	module('core#select', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
			$(this.fixture).jmpress();
		}
	});

	test('should select a step', 4, function() {
		var step;

		step = $(this.fixture).jmpress('select', $(this.fixture).find('#docs'));
		ok( step.hasClass('active') );
		step = null;

		step = $(this.fixture).jmpress('select', '#download');
		ok( step.hasClass('active') );
		step = null;

		step = $(this.fixture).jmpress('reselect', '#download');
		ok( step.hasClass('active') );
		step = null;

		step = $(this.fixture).jmpress('goTo', '#docs');
		ok( step.hasClass('active') );
		step = null;
	});

	// TODO: scrollFix method

	test('should select the next step', 1, function() {
		var step = $(this.fixture).jmpress('next');
		equal( step.attr('id'), 'download' );
	});

	test('should select the prev step', 1, function() {
		var step = $(this.fixture).jmpress('prev');
		equal( step.attr('id'), 'docs' );
	});

	test('should select the home step', 1, function() {
		$(this.fixture).jmpress('next');
		var step = $(this.fixture).jmpress('home');
		equal( step.attr('id'), 'about' );
	});

	test('should select the end step', 1, function() {
		var step = $(this.fixture).jmpress('end');
		equal( step.attr('id'), 'docs' );
	});

	// TODO: current method


	module('core#data', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
			$(this.fixture).jmpress();
		}
	});

	test('should return settings', 1, function() {
		var settings = $(this.fixture).jmpress('settings');
		ok( $.isPlainObject(settings) );
	});

	test('should return deffaults', 3, function() {
		var defaults = $(this.fixture).jmpress('defaults');
		ok( $.isPlainObject(defaults) );
		equal( defaults.activeClass, 'active' );
		equal( defaults.stepSelector, '.step' );
	});

	test('should return active step', 1, function() {
		var active = $(this.fixture).jmpress('active');
		equal( active.attr('id'), 'about' );
	});

	test('should set data on canvas', 1, function() {
		$(this.fixture).jmpress('canvas', {
			'transitionDuration': '5s'
		});
		ok( $(this.fixture).attr('style').indexOf('transition-duration') !== -1 );
	});

	// TODO: fire method
	// TODO: container method
	// TODO: reapply method

	module('callbacks', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
		}
	});

	test('should fire beforeChange event', 2, function() {
		$(this.fixture).jmpress();
		$(this.fixture).jmpress('beforeChange', function(element, eventData) {
			equal( $(element).attr('id'), 'download' );
			equal( eventData.reason, 'next' );
		});
		$(this.fixture).jmpress('next');
	});

	test('should fire beforeInit and afterInit events', 2, function() {
		$(this.fixture).jmpress({
			'beforeInit': function(element, eventData) {
				ok( true );
			},
			'afterInit': function(element, eventData) {
				ok( true );
			}
		});
	});

	test('should fire selectNext and selectPrev events', function() {
		expect(2);
		$(this.fixture).jmpress();
		$(this.fixture).jmpress('selectNext', function(element, eventData) {
			ok( true );
		});
		$(this.fixture).jmpress('next');
		
		$(this.fixture).jmpress('selectPrev', function(element, eventData) {
			ok( true );
		});
		$(this.fixture).jmpress('prev');
	});

}(jQuery));