# Plugin: Toggle

Bind a key to toggle the de/initialization of jmpress.js. Example:

``` javascript
$("#jmpress").jmpress("toggle", 27, {
	// jmpress options
}); // Bind escape key
```

There is a optional 3rd boolean parameter which indicate the initial status of jmpress.js.
Set it to `true` to automatically initialize jmpress.js.
