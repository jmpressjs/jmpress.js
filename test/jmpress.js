/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {
	
	module('core', {
		setup: function() {
			
		},
		teardown: function() {
			
		}
	});
	
	test('init', 1, function() {
		$('#qunit-fixture #jmpress').jmpress();
		ok(true);
	});
	
}(jQuery));