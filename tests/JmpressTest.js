describe('Jmpress', function() {
	
	it('prefix', function() {
		var res = jQuery.fn.jmpress('pfx', 'transform');
		console.log(res('transform'));
	});
	
	it('adds style to an element', function() {
		var el = $('<div />');
		el.css('WebkitTransform', 'translate(-50%,-50%)');
		//var e = el.get(0);
		//e.style['webkit-transform'] = 'translate(-50%,-50%)';
		console.log(el);
		/*jQuery.fn.jmpress('css', el, {
			position: 'absolute'
		});
		expect(el.style['position']).toEqual('absolute');*/
	});
	
});