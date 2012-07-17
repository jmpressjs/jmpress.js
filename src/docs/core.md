# Core

## Properties

### `property` stepSelector : `'.step'`

The jQuery selector to specify each step.

``` javascript
$('#jmpress').jmpress({
	stepSelector: 'section' // use <section> tags as steps
});
```

### `property` notSupportedClass : `'not-supported'`

Class name to remove on root element if jmpress.js is supported.

``` javascript
$('#jmpress').jmpress({
	notSupportedClass: 'no-jmpress'
});
```

### `property` fullscreen : `true`

Whether jmpress.js should run in full screen mode or in a container.

``` javascript
$('#jmpress').jmpress({
	fullscreen: false
});
```

### `property` containerClass

A class name to set on the container. The overall container of the camera. It has no transformation applied so you can set some background on it.

``` javascript
$('#jmpress').jmpress({
	containerClass: 'jmpress-container'
});
```

### `property` canvasClass

A class name to set on the canvas. The canvas is the element, which contains the steps.

``` javascript
$('#jmpress').jmpress({
	canvasClass: 'jmpress-canvas'
});
```

### `property` areaClass

A class name to set on the area. The area is some middle element, which is needed to build this camera.

``` javascript
$('#jmpress').jmpress({
	areaClass: 'jmpress-area'
});
```

### `property` animation

Set the CSS animation values for transitions between slides.

``` javascript
$('#jmpress').jmpress({
	animation: {
		transformOrigin: 'center center', // Point on which to transform
		transitionDuration: '5s',         // Length of animation
		transitionDelay: '500ms',         // Delay before animating
		transitionTimingFunction: 'ease'  // Animation effect
	},
	transitionDuration: 5000 // Set this according to animation.transitionDuration
	                         // It is used for setting the timeout for the transition
});
```

See [Mozilla CSS docs](https://developer.mozilla.org/en/CSS/transform) for more info.

## Methods

### `method` init( ) - shortcut .jmpress( )

Initializes jmpress with the default config (like impress.js).

``` javascript
$('#jmpress').jmpress();
```

### `method` init( config ) - shortcut .jmpress( config )

Initializes jmpress with a custom config object.

``` javascript
$('#jmpress').jmpress({
	// config object literal here
});
```

### `method` init( [step] )

Can also initialize a single step.
This is required when dynamically adding steps:

``` javascript
var newStep = $('<div class="step" />').html('This is a new step');
$('#jmpress').jmpress('canvas').append(newStep);
$('#jmpress').jmpress('init', newStep);
```

See the dynamic form [example](#docs-examples)

### `method` initialized()

Returns true if jmpress is initialized.

``` javascript
var isInit = $('#jmpress').jmpress('initialized');
```

### `method` deinit( [step] )

Deinits jmpress, returning to it's original state. If already deinited it does
nothing. This is useful for enabling a print mode or when dynamically removing
steps:

``` javascript
var removeStep = $('.step').first();
$('#jmpress').jmpress('deinit', removeStep);
removeStep.remove();
```

### `method` settings()

Returns the settings object which you can modify.

``` javascript
var settings = $('#jmpress').jmpress('settings');
settings.animation.transitionDuration = '10s';
```

### `method` select( selector, reason )

Move to the first step matching the given selector.
`reason` can be a string which passed to the callbacks in `eventData.reason`.

``` javascript
$('#jmpress').jmpress('select', '#step-5', 'i said so');
```

### `method` goTo( selector )

Same as `select( selector, 'jump' )`.

### `method` next()

Select the next step in flow.

``` javascript
$('#jmpress').jmpress('next');
```

### `method` prev()

Select the previous step in flow.

``` javascript
$('#jmpress').jmpress('prev');
```

### `method` home()

Select the first step in DOM.

``` javascript
$('#jmpress').jmpress('home');
```

### `method` end()

Select the last step in DOM.

``` javascript
$('#jmpress').jmpress('end');
```

### `method` fire( callbackName, element, eventData )

Fire a event. `callbackName` must be registered as callback before.

``` javascript
$('#jmpress').jmpress('fire', 'selectNext', step, {
	// Additional data for event here
});
```

### `method` canvas()

Returns the canvas element as jQuery object.

``` javascript
var canvas = $('#jmpress').jmpress('canvas');
```

### `method` canvas( css )

Sets styles on the canvas element and returns it.

**deprecated**: Use `canvasClass` and CSS.

### `method` css( element, cssAsObject )

Applies css with the correct browser prefix.

``` javascript
var el = $('#step-2').get(0);
$('#jmpress').jmpress('css', el, {
	transform: 'rotate(90deg)' // Will be -webkit-transform if a Webkit browser
});
```

### `method` reapply( step )

Reapplies styles on step. Should be called after modifying
`step.data("stepData")`, which is allowed.

### `method` defaults()

Return or modify the default settings used in jmpress.js.
Should only be used in plugins. Use `settings` instead.

``` javascript
var defaults = $('#jmpress').jmpress('defaults');
```

### `method` register( callbackName )

Register a new callback. After that it can be `fire`ed and listened.

### `method` register( name, fn )

Register a new jmpress function.

### `method` active()

Returns the active step as jQuery object.

``` javascript
var activeStep = $('#jmpress').jmpress('active');
```

### `method` current()

Returns the a state for the jmpress instance.
Should be only used by plugins for saving some state.

### `method` dataset( element )

Returns the dataset of an element. *private*

## Callbacks

### `callback` afterInit : `function( element, eventData )`

After all the steps are initialized.

### `callback` afterDeinit : `function( element, eventData )`

After all the steps are de-initialized.

### `callback` beforeChange : `function( element, eventData )`

Before each step change. `eventData.cancel()` cancels the select.

### `callback` beforeDeinit : `function( element, eventData )`

Before all the steps are de-initialized.

### `callback` beforeInit : `function( element, eventData )`

Before all the steps are initialized.

### `callback` beforeInitStep : `function( element, eventData )`

On each step as it is initialized.

### `callback` initStep : `function( element, eventData )`

On each step as it is initialized.
A listener should read values from `eventData.data` and store them after
string-to-xxx conversion into `eventData.stepData`

### `callback` applyStep : `function( element, eventData )`

Called last on each step after it is initialized to apply css.
A listener should read `eventData.stepData` and apply css the the `element`

### `callback` unapplyStep : `function( element, eventData )`

Called last on each step after is is de-initialized to remove css.

### `callback` selectEnd : `function( element, eventData )`

Listener should return the last step.
A listener should return `undefined` if it do not want to modify the selection
of the previous listener. If it returns a value it overrides the old selection.

### `callback` selectHome : `function( element, eventData )`

Listener should return the first step.

### `callback` selectInitialStep : `function( element, eventData )`

Listener should return the initial step.

### `callback` selectNext : `function( element, eventData )`

Listener should return the next step.

### `callback` selectPrev : `function( element, eventData )`

Listener should return the previous step.

### `callback` idle : `function( element, eventData )`

Called after jmpress finished transition and there is nothing pending.

### `callback` applyTarget : `function( element, eventData )`

Listener should apply CSS for the camera to `eventData.canvas` and
`eventData.area`.
