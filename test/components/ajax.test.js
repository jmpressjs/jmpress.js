/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {

	'use strict';

	QUnit.testStart = function(test) {
		window.location.hash = '#';
	};

	module('ajax', {
		setup: function() {
			this.fixture = '#qunit-fixture #jmpress';
		}
	});

	asyncTest('step was loaded via ajax', 1, function() {
		$(this.fixture).find('.step').first().attr('data-src', 'fixtures/ajax.html');
		$(this.fixture).jmpress({
			'ajax:afterStepLoaded': function(el, e) {
				equal( $(el).html(), 'foobar' );
				start();
			}
		});
	});

	asyncTest('ajax:loadStep called', 1, function() {
		$(this.fixture).find('.step').first().attr('data-src', 'fixtures/ajax.html');
		$(this.fixture).jmpress({
			'ajax:loadStep': function(el, e) {
				ok( $(el).hasClass('loaded') );
				start();
			}
		});
	});

}(jQuery));