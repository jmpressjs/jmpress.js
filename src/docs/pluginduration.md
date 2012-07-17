# Plugin: Duration

For automatically changing steps after a given duration. Makes the attributes `data-duration` and `data-duration-action` available:

``` html
<div id="jmpress">
	<div class="step" data-duration="3000">
		Auto advanced after 3 second
	</div>
	<div class="step" data-duration="5000" data-duration-action="prev">
		Then advanced after 5 seconds and go back to the previous step
	</div>
</div>
```

You can also display a progress bar indicating how long until the change will occur:

``` html
<div id="jmpress">
	<div class="step">Step 1</div>
	<div class="step">Step 2</div>
	<div class="ui-progressbar ui-widget ui-widget-content ui-corner-all">
		<div id="my-progress-bar" class="ui-progressbar-value ui-widget-header ui-corner-left" style="width:0"></div>
	</div>
</div>
```

Specify the progress bar using the duration.barSelector option:

``` javascript
$(selector).jmpress({
	duration: {
		barSelector: '#my-progress-bar'
	}
});
```

### `property` duration.defaultValue

The duration that should be taken if no data-duration is defined.

### `property` duration.defaultAction : `'next'`

The action that should be executed if no data-duration-action is defined.

### `property` duration.barSelector

A jQuery selector to the bar element on which a property should be changed.

### `property` duration.barProperty : `'width'`

Set to property and property values which should be changed. A transition for the property are automatically applied on the element.

### `property` duration.barPropertyStart : `0`

### `property` duration.barPropertyEnd : `'100%'`