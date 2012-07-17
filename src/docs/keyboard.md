# Keyboard

This component handles navigation with the keyboard. It also offers a binding mechanism for other components, plugins and the user.

Example:

``` javascript
$(selector).jmpress({
	keyboard: {
		keys: {
			189: ['select', '#overview']
		}
	}
});
```

In this example we are binding the '-' key (key code 189) to select a step we have named 'overview'.

### `property` keyboard.keys : `{33: "prev", 32: "next", ...}`

Bind a key to a jmpress command. Set it to null to remove an existing key binding.

Set it to a string to get the jmpress command invoked.

Set it to a string containing ":" (ex. "next:prev") to get the first command on default and the second on modified with the shift key.

Set it to a array to apply the array as arguments a jmpress command (ex. ["select", "#some-cool-step"]).

### `property` keyboard.ignore[TAGNAME] : `[32, 37, ...] as TAGNAME = "INPUT"`

Ignore some keys on a specific tag name.

### `property` keyboard.use : `true`

Whether the keyboard should be used to navigate in jmpress.
