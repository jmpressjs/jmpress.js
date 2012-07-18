# Templates

This component handles templates. It handles the `data-template` attribute and registers the template.

For more complex builds consider using templates rather then setting attributes on each step.

First create and register your template with jmpress:

``` javascript
$.jmpress("template", "mytemplate", {
  x: 1000, y: -2000, scale: 10,
  rotateY: 60,
  rotate: { x: 60 } // is automatically converted to camel case
});
```

Then use your template in your HTML:

``` html
<div id="jmpress">
  <div class="step" data-template="mytemplate">...</div>
  ...
</div>
```

Templates can also be applied to nested steps:

``` html
<div id="jmpress">
  <div class="step" data-template="mytemplate">
    <div class="step">...</div>
    <div class="step">...</div>
    <div class="step">...</div>
  </div>
</div>
```

``` javascript
$.jmpress("template", "mytemplate", {
  x: 1000, y: -2000, scale: 10,
  children: [
    { x: -300, y: -100, scale: 0.2 },
    { x: -100, y: -100, scale: 0.2 },
    { x: 100, y: -100, scale: 0.2 }
  ]
});
```

Rather then setting the values manually you can provide a method to setup each step programmatically:

``` html
<div id="jmpress" data-template="mytemplate">
	<div class="step">
		<div class="step">...</div>
		<div class="step">...</div>
		<div class="step">...</div>
	</div>
	<div class="step">
		<div class="step">...</div>
	</div>
</div>
```

``` javascript
$.jmpress("template", "mytemplate", {
	children: function( idx, current_child, children ) {
		return {
			y: 400
			,x: -300 + idx * 300
			,template: "mytemplate"
			,scale: 0.3
		}
	}
});
```

### `method` template( templateName, templateData )

Adds or modify a template. If it's already defined then the old template is
extended with the new properties.

### `method` apply( selector, templateName )

Applies the template to all selected steps.

### `method` apply( selector, templateData )

Applies the template directly by template data object.

### `method` apply( selector, arrayOfTemplateDatas )

Applies template data to an array of selected items.