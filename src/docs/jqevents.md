# jQuery Events

This component fires the jQuery events `enterStep` and `leaveStep`.

These events can be added to specific steps to be triggered as the step is entered and left:

``` javascript
$('#a-specific-step')
	.on('enterStep', function(event) {
		// Called when entering only this step
	})
	.on('leaveStep', function(event) {
		// Called when leaving only this step
	});
```
