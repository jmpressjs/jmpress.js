# Core

## `property` stepSelector : `'.step'`

The jQuery selector to specify each step.

## `property` notSupportedClass : `'not-supported'`

Class name to remove on root element if jmpress.js is supported.

## `property` fullscreen : `true`

Whether jmpress.js should run in full screen mode or in a container.

## `property` containerClass

A class name to set on the container. The overall container of the camera. It has no transformation applied so you can set some background on it.

## `property` canvasClass

A class name to set on the canvas. The canvas is the element, which contains the steps.

## `property` areaClass

A class name to set on the area. The area is some middle element, which is needed to build this camera.

## `property` animation

Set the CSS animation values for transitions between slides.

``` javascript
$('#jmpress').jmpress({
	animation: {
		transformOrigin: 'center center', // Point on which to transform
		transitionDuration: '5s',         // Length of animation
		transitionDelay: '500ms',         // Delay before animating
		transitionTimingFunction: 'ease'  // Animation effect
	}
});
```

See [Mozilla CSS docs](https://developer.mozilla.org/en/CSS/transform) for more info.

## `method` init( [step] )

Initializes jmpress with the default config (like impress.js). Can also initialize a single step; useful when dynamically adding steps:

``` javascript
var newStep = $('<div class="step" />').html('This is a new step');
$('#container').append(newStep);
$('#jmpress').jmpress('init', newStep);
```

## `method` init( config )

Initializes jmpress with a custom config object.

## `method` initialized()

Returns true if jmpress is initialized.

## `method` deinit( [step] )

Deinits jmpress, returning to it's original state. If already deinited it does
nothing. This is useful for enabling a print mode or when dynamically removing
steps:

``` javascript
var removeStep = $('.step').first();
$('#jmpress').jmpress('deinit', removeStep);
removeStep.remove();
```

## `method` settings()

Returns the settings object which you can modify.

## `method` select( selector )

Move to the first step matching the given selector.

## `method` goTo( selector )

Same as `select( selector )`.

## `method` next()

Select the next step in flow.

## `method` prev()

Select the previous step in flow.

## `method` home()

Select the first step in DOM.

## `method` end()

Select the last step in DOM.

## `method` fire( callbackName, element, eventData )

Fire a event.

## `method` canvas()

Returns the canvas element as jQuery object

## `method` canvas( css )

Sets styles on the canvas element and returns it.

## `method` css( element, cssAsObject )

Applies css with the correct browser prefix.

## `method` reapply( step )

Reapplies styles on step, should be called after modifying stepData.

## `method` defaults()

Return or modify the default settings used in jmpress.js.

## `method` register( name, callback )

Register a new callback.

## `method` dataset( element )

Returns the dataset of an element.

## `callback` afterInit : `function( element, eventData )`

After all the steps are initialized.

## `callback` afterDeinit : `function( element, eventData )`

After all the steps are de-initialized.

## `callback` beforeChange : `function( element, eventData )`

Before each step change. `eventData.cancel()` cancels the select.

## `callback` beforeDeinit : `function( element, eventData )`

Before all the steps are de-initialized.

## `callback` beforeInit : `function( element, eventData )`

Before all the steps are initialized.

## `callback` beforeInitStep : `function( element, eventData )`

On each step as it is initialized.

## `callback` initStep : `function( element, eventData )`

On each step as it is initialized.

## `callback` applyStep : `function( element, eventData )`

Called last on each step after it is initialized.

## `callback` unapplyStep : `function( element, eventData )`

Called last on each step after is is de-initialized.

## `callback` selectEnd : `function( element, eventData )`

Callback should return the last step.

## `callback` selectHome : `function( element, eventData )`

Callback should return the first step.

## `callback` selectInitialStep : `function( element, eventData )`

Callback should return the initial step.

## `callback` selectNext : `function( element, eventData )`

Callback should return the next step.

## `callback` selectPrev : `function( element, eventData )`

Callback should return the prev step. selected.