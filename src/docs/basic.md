# Basic Usage

**Create a root element:**

``` html
<div id="jmpress"></div>
```

**Fill it up with steps:**

``` html
<div id="jmpress">
	<div class="step">Slide 1</div>
	<div class="step">Slide 2</div>
</div>
```

**Tell jQuery to run it:**

``` javascript
$(function() {
	$('#jmpress').jmpress();
});
```

**Configure jmpress**

``` javascript
$('#jmpress').jmpress({
	stepSelector: 'li'
});
```

**Customize the hash id of each slide**
The id of the step will appear as the URI hash to recall the slide later. If you don't give your steps ids then the id `step-N` will be used.

``` html
<div id="name-of-slide" class="step" 
		data-x="3500" data-y="-850" 
		data-rotate="270" data-scale="6">
	Slide 1
</div>
```

## Structure of the remaining docs

The stuff in the remaining docs has three categories:

* `property`
* `method`
* `callback`

### `property`

A `property` can be set while initializing jmpress or modified on runtime.

**While initializing**
Just pass a object to the jmpress init function containing the `property`

``` javascript
$('#jmpress').jmpress({
	setting: value
});
```

**On runtime**
You can run the `method` "settings" to the the current settings object, which contains all `properties`.
Not every `property` can be modified after initializing.
Many `properties` apply only after the next selection process, which is triggered i. e. on step changes.
You may need to trigger it manually with `$('#jmpress').jmpress('reselect')`.

``` javascript
$('#jmpress').jmpress('settings').setting = newValue;
```

### `method`

A `method` is a public function available on a jmpress instance or statically.

A `method` with the signature `methodName(param1, param2)` can be called like this:

``` javascript
// on the jmpress instance
$('#jmpress').jmpress('methodName', param1, param2);
// statically
$.jmpress('methodName', param1, param2)
```

### `callback`

You can set a `callback` for a jmpress event, which is called when the event occurs.

``` javascript
// add an event handler
$('#jmpress').jmpress('callbackName', function(step, eventData) {...});
```

A `callback` handler should have the following parameters:

* `step` the step
* `eventData` a object containing more info about the event. At least the following properties:
 * `settings` the current settings object. The same as `$(x).jmpress('settings')` returns.
 * `current` the current state object. Plugins can store their state here.
 * `container` the jmpress container
 * `parents` all parents of the step, or null
 * `jmpress` the jmpress element
 * and more properties specific for the events.