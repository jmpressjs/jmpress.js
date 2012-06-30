# Plugin: Secondary

The secondary plugin applies an alternative step config, on a choosen condition.

*Alternative step configuration is only useable via template.*

### Conditions

The condition can only be set by template `{ secondary: <string> }`.

* `self`: If the step is active.
* `siblings`: If a sibling is active. (Including self)
* `siblings self`: If a sibling is active. (Excluding self)
* `grandchildren`: If a child or grand child is active.
* `grandchildren self`: If the step, a child or grand child is active.

### Alternative config

The alternative config is described by prefixing the attribute by `secondary` (But stay in camel case).

Alternative `{ x: ..., rotateZ: ... }` is `{ secondaryX: ..., secondaryRotateZ: ... }`.

Because objects in templates are automatically expanded it can be simplified:

``` javascript
{
	x: ...,
	rotateZ: ...,
	secondary: {
		"": "siblings",
		x: ...,
		rotateZ: ...,
	}
}
```

### Examples

* [vacation](http://shama.github.com/jmpress.js/examples/vacation/)
* [tab control](http://shama.github.com/jmpress.js/examples/tab-control/)

