# Options

Options and callbacks can be set when you initialize jmpress as such:

```
$(selector).jmpress({
	stepSelector: '.step',
	start: '#home',
	setActive: function( slide, eventData ) { }
});
```

## Core

#### stepSelector

*Default: '.step'*
The jQuery selector to specify each step.

#### start

*Default: undefined*
Selector of step to start from. (ex. `#home`)

#### notSupportedClass

*Default: 'not-supported'*
Class name to remove on root element if jmpress.js is supported.

#### fullscreen

*Default: true*
Whether jmpress.js should run in full screen mode or in a container.

## Integrated Functionality

#### activeClass

*Default: 'active'*
A class name to set on the current step.

#### nestedActiveClass

*Default: 'nested-active'*
A class name to set on all parents of the current step.

#### hash.use

*Default: true*
Whether the url hash should be used with jmpress.

#### hash.update

*Default: true*
Whether the url hash should be updated on step change.

#### hash.bindChange

*Default: true*
Whether changes of the url hash and clicks on link should be converted into step selects.

#### viewPort.width, viewPort.height

Let camera zoom to contain at least width and/or height.

#### viewPort.maxScale, viewPort.minScale

Minimum and maximum zoom factor of camera.

#### mouse.clickSelects

Whether a mouse click on another step select it.


## Keyboard Controls

jmpress.js has a great keyboard mapping system. Mapping a key to an event is simple:

```
$(selector).jmpress({
	keyboard: {
		keys: {
			189: ['select', '#overview']
		}
	}
});
```

In this example we are binding the '-' key (key code 189) to select a step we have named 'overview'.

#### keyboard.keys

*Default: {33: "prev", 32: "next", ...}*
Bind a key to a jmpress command. Set it to null to remove an existing key binding. Set it to a string to get the jmpress command invoked. Set it to a string containing ":" (ex. "next:prev") to get the first command on default and the second on modified with the shift key. Set it to a array to apply the array as arguments a jmpress command (ex. ["select", "#some-cool-step"]).

#### keyboard.ignore[TAGNAME]

*Default: [32, 37, ...] as TAGNAME = "INPUT"*
Ignore some keys on a specific tag name.

#### keyboard.use

*Default: true*
Whether the keyboard should be used to navigate in jmpress.

# Advanced Options

#### containerClass

A class name to set on the container.
The overall container of the camera. It has no transformation applied so you can set some background on it.


#### canvasClass

A class name to set on the canvas. The canvas is the element, which contains the steps.

#### areaClass

A class name to set on the area. The area is some middle element, which is needed to build this camera.

#### animation

Set the CSS animation values for transitions between slides.

#### loadedClass

*Default: 'loaded'*
Class name to set on each step that has been started loading.

# Inline Options

You may set a series of data attributes on your steps. This method of building your steps will be familiar if you're coming from impress.js.

```
<div id="jmpress">
	<div class="step" data-x="100" data-y="2000" data-rotate="90">...</div>
	<div class="step" data-rotate="120">...</div>
</div>
```

Each step element can have the following data attributes set:

* *data-x*: cartesian coordinates: X Position
* *data-y*: cartesian coordinates: Y Position
* *data-z*: cartesian coordinates: Z Position
* *data-r*: polar coordinates: radius
* *data-phi*: polar coordinates: angle (starting at top, counterclockwise)
* *data-scale*: Scale of element (also scale-x, scale-y, scale-z)
* *data-rotation*: Degree of rotation
* *data-rotation-x*: Degree of rotation on x-axis
* *data-rotation-y*: Degree of rotation on y-axis
* *data-rotation-z*: Degree of rotation on z-axis
* *data-delegate*: delegate the activeness to another step chosen by selector
* *data-src*: Load content of slide dynamically
* *data-exclude*: do not use step in natural flow, but it can be selected with the route command
* *data-next*: selector of the next step
* *data-prev*: selector of the prev step
* *data-template*: apply a template, which must be defined before init jmpress
* *data-jmpress*: apply a custom animation
