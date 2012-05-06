/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {

	'use strict';

	QUnit.testStart = function(test) {
		window.location.hash = '#';
	};

	module('templates', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
			$(this.fixture)
				.empty()
				.attr('data-template', 'test-template')
				.append($('<section />').text('One'))
				.append($('<section />').text('Two'))
				.append($('<section />').text('Three'))
				.append($('<section />').text('Four'));
		}
	});

	test('basic', 8, function() {
		$.jmpress('template', 'test-template', {
			children: function (idx, child, children) {
				return {
					x: idx * 1000,
					y: idx * 1000,
					rotate: idx * 45
				};
			}
		});
		$(this.fixture).jmpress({stepSelector: 'section'});
		var result = $(this.fixture + ' #step-1').attr('style');
		ok( result.indexOf('translate3d(0px, 0px, 0px)') !== -1 );
		ok( result.indexOf('rotateX(0deg)') !== -1 );
		ok( result.indexOf('rotateY(0deg)') !== -1 );
		ok( result.indexOf('rotateZ(0deg)') !== -1 );
		result = $(this.fixture + ' #step-3').attr('style');
		ok( result.indexOf('translate3d(2000px, 2000px, 0px)') !== -1 );
		ok( result.indexOf('rotateX(0deg)') !== -1 );
		ok( result.indexOf('rotateY(0deg)') !== -1 );
		ok( result.indexOf('rotateZ(90deg)') !== -1 );
	});

}(jQuery));