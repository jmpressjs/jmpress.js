# Writing a Plugin

To extend jmpress.js, simply create a new js file and then add the script to your website or presentation HTML. It is wise to wrap your plugin within a closure:

``` javascript
(function( $, document, window, undefined ) {
	// Plugin Code Will Go Here
}(jQuery, document, window));
```

Now we can add a new option to jmpress by using the defaults method:

``` javascript
(function( $, document, window, undefined ) {
	$.jmpress("defaults").withMeat = 'Yum! Meat!';
})(jQuery, document, window);
```

Now the config option 'withMeat' will be settable when initiating jmpress and will default to 'Yum! Meat!'. Let's go further and add some more meat to our plugin:

``` javascript
(function( $, document, window, undefined ) {
	$.jmpress("defaults").withMeat = 'Yum! Meat!';
	function meat( step, what ) {
		$(step).html( what );
	}
	$.jmpress('initStep', function( step, eventData ) {
		meat( step, eventData.settings.withMeat );
	});
}(jQuery, document, window));
```

We have created a 'meat' method available only within our plugin. Then we are calling this method as each step is initialized to replace the HTML in every step to 'Yum! Meat!'.

You can add your own events to jmpress using the 'register' method and then call it upon an event:

``` javascript
(function( $, document, window, undefined ) {
	$.jmpress("defaults").withMeat = 'Yum! Meat!';
	$.extend(true, $.jmpress('defaults').keyboard.keys, {
		77: 'meat' // 'm' key for meat
	});
	$.jmpress("register", "meat", function() {
		var step = $(this).jmpress('active')
		step.html( $(this).jmpress("settings").withMeat );
	});
}(jQuery, document, window));
```

With this plugin, any time the 'm' key is pressed the active slide HTML will be replace with 'Yum! Meat!'.

Take a look at the core plugins in jmpress.js or the extra plugins in the `/plugins` folder for more examples.

If you have written a plugin for jmpress.js please let us know!
