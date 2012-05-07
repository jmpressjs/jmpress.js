# Ways Routing

This component handles the `data-next` and `data-prev` attributes and the route command. As it should override the natural flow of the steps, it should be included after the Circular Stepping component.

By default, jmpress.js will flow through each step linearly down the DOM. You have a couple of ways to modify the flow.

Inline Next / Prev

``` html
<div id="jmpress">
	<div class="step" id="a" data-next="c">A</div>
	<div class="step" id="b">B</div>
	<div class="step" id="c">C</div>
	<div class="step" id="d">D</div>
</div>
```

The flow will start with A, goto C, then D and back to A. Only when the user is on C and goes back will they be shown B.

Using route:

You can set the flow using the route method. You also don't have to define all the steps. The commando will preserve the natural flow and only modify the indicated steps.

``` javascript
$("#jmpress").jmpress("route", ["#a", "#c", "#b", "#d"]);
```

The flow will start with A, goto C, goto B, goto D and back to A. If the user goes backwards he will get the same flow D -> B -> C -> A -> D.

Unidirectional:

``` javascript
$("#jmpress").jmpress("route", ["#a", "#c"], true);
```

The flow will be as the flow above with data attributes. 
Forwards: A -> C -> D -> A. Backwards: D -> C -> B -> A -> D.

If you omit the 4th parameter, the function will set the forward flow. Set it to `true` to set the backward flow.
