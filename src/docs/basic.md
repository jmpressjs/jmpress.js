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
