# Ajax

This component enables you to load step via ajax. It handles the `data-src` and
`href` attribute and offers the `afterStepLoaded` event.

**Load slides dynamically**
You can load a slide dynamically by setting the *data-src* or *href* attribute
on the slide. The slide will only be loaded when an adjacent slide or the slide
itself is selected.

``` html
<div class="step" data-src="slides/slide-1.html" data-x="500" data-y="300">
	Loading...
</div>
```

### `property` ajaxLoadedClass : `'loaded'`

Class name to set on each step that has started loading.

### `callback` ajax:loadStep : `function( element, eventData )`

When a step has began loading via AJAX.

### `callback` ajax:afterStepLoaded : `function( element, eventData )`

Called after the AJAX step has finished loading.