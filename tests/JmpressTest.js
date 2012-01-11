/**
 * jmpress.js test suite
 *
 * MIT Licensed.
 *
 * Copyright 2012 Kyle Robinson Young (@shama)
 */

describe('Jmpress', function() {
	
	// TODO: Use a proper fixture
	
	var jmpress
		,settings
		,defaults = {
			stepSelector: '.step'
			,canvasClass: 'canvas'
			,notSupportedClass: 'not-supported'
			,loadedClass: 'loaded'
			,animation: {
				transformOrigin: 'top left'
				,transitionProperty: 'all'
				,transitionDuration: '1s'
				,transitionTimingFunction: 'ease-in-out'
				,transformStyle: "preserve-3d"
			}
			,test: true
		};
	
	/**
	 * beforeEach
	 */
	beforeEach(function() {
		jmpress = $('<div />').attr('id', 'jmpress');
		jmpress.append( $('<div id="impressive" class="step" data-x="-900" data-y="-1500">Slide 1</div>') );
		jmpress.append( $('<div class="step" data-x="0" data-y="0">Slide 2</div>') );
		jmpress.jmpress(defaults);
		settings = jmpress.jmpress( 'settings' );
	});
	
	/**
	 * afterEach
	 */
	afterEach(function() {
		jmpress = null;
		settings = null;
	});
	
	/**
	 * test init
	 */
	it('should initialize', function() {
		var result;
		
		// HAVE CANVAS
		result = jmpress.find( '.' + settings.canvasClass );
		expect( result.length ).toEqual( 1 );
		
		// TODO: Check jmpress/canvas style values
		
		// SET INIT VALUES
		jmpress.jmpress({
			canvasClass: 'testcanvas'
			,stepSelector: 'li'
		});
		result = jmpress.jmpress( 'settings' );
		expect( result.canvasClass ).toEqual( 'testcanvas' );
		expect( result.stepSelector ).toEqual( 'li' );
	});
	
	/**
	 * test init slides
	 */
	it('should initialize each slide', function() {
		var slide,
			slides = jmpress.find( settings.stepSelector );
		
		slide = slides.first();
		expect( slide.hasClass('active') ).toBeTruthy();
		expect( slide.attr('style') ).toContain( 'position: absolute;' );
		expect( slide.attr('style') ).toContain( 'translate(-50%, -50%)' );
		expect( slide.attr('style') ).toContain( 'translate3d(-900px, -1500px, 0px)' );
		expect( slide.attr('style') ).toContain( 'scaleX(1) scaleY(1) scaleZ(1)' );
		expect( slide.attr('style') ).toContain( 'preserve-3d' );
		
		// TODO: More extensive tests
	});
	
	/**
	 * test select
	 */
	it('should select a slide', function() {
		var slide;
		
		slide = jmpress.jmpress('select', jmpress.find('#impressive'));
		expect( slide.hasClass('active') ).toBeTruthy();
		
		slide = jmpress.jmpress('select', '#impressive');
		expect( slide.hasClass('active') ).toBeTruthy();
	});
	
	/**
	 * test next
	 */
	it('should select the next slide', function() {
		var slide = jmpress.jmpress('next');
		expect( slide.text() ).toEqual( 'Slide 2' );
	});
	
	/**
	 * test prev
	 */
	it('should select the prev slide', function() {
		var slide = jmpress.jmpress('prev');
		expect( slide.text() ).toEqual( 'Slide 2' );
	});
	
	// TODO: Write test for loadSiblings
	
	/**
	 * test canvas
	 */
	it('should modify the canvas css', function() {
		var canvas = jmpress.jmpress('canvas', {
			transitionTimingFunction: 'linear'
		});
		expect( canvas.attr('style') ).toContain( 'transition-timing-function: linear;' );
	});
	
	/**
	 * test beforeChange
	 */
	it('should call a function before the slide has changed', function() {
		var callback = jasmine.createSpy('beforeChange');
		jmpress.jmpress('beforeChange', callback);
		expect(callback).not.toHaveBeenCalled();
		jmpress.jmpress('next');
		expect(callback).toHaveBeenCalled();
		
		// TODO: Test setting callbacks as param
	});
	
	// TODO: Test getElementFromUrl, pfx, css, checkSupport
	
	/**
	 * test _translate
	 */
	it('should build translate', function() {
		var result = jmpress.jmpress('_translate', {x: 500, y: -900, z: 2});
		expect( result ).toEqual( ' translate3d(500px,-900px,2px) ' );
	});
	
	/**
	 * test _rotate
	 */
	it('should build rotate', function() {
		var result;
		
		result = jmpress.jmpress('_rotate', {x: 90, y: 180, z: 20}, false);
		expect( result ).toEqual( ' rotateX(90deg)  rotateY(180deg)  rotateZ(20deg) ' );
		
		result = jmpress.jmpress('_rotate', {x: 90, y: 180, z: 20}, true);
		expect( result ).toEqual( ' rotateZ(20deg)  rotateY(180deg)  rotateX(90deg) ' );
	});
	
	/**
	 * test _scale
	 */
	it('should build scale', function() {
		var result = jmpress.jmpress('_scale', {x: 3, y: 2, z: 1});
		expect( result ).toEqual( ' scaleX(3) scaleY(2) scaleZ(1) ' );
	});
	
});