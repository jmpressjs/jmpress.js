# Inline Attributes

You can configure jmpress.js inline by setting the following attributes to the
tag of each step. This method of building your steps will be familiar if you're
coming from impress.js:

``` html
<div id="jmpress">
	<div class="step" data-x="100" data-y="2000" data-rotate="90">...</div>
	<div class="step" data-rotate="120">...</div>
</div>
```

## `data-x`

Cartesian coordinates: X Position.

## `data-y`

Cartesian coordinates: Y Position.

## `data-z`

Cartesian coordinates: Z Position.

## `data-r`

Polar coordinates: radius.

## `data-phi`

Polar coordinates: angle (starting at top, counterclockwise).

## `data-scale`

Scale of element (also scale-x, scale-y, scale-z).

## `data-rotate`

Degree of rotation.

## `data-rotate-x`

Degree of rotation on x-axis.

## `data-rotate-y`

Degree of rotation on y-axis.

## `data-rotate-z`

Degree of rotation on z-axis.

## `data-delegate`

Delegate the activeness to another step chosen by selector.

## `data-src`

Load content of slide dynamically.

## `data-exclude`

Do not use step in natural flow, but it can be selected with the route command.

## `data-next`

Selector of the next step.

## `data-prev`

Selector of the prev step.

## `data-template`

Apply a template, which must be defined before init jmpress.

## `data-jmpress`

Apply a custom animation.
