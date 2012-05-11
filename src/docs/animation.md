# Animation

Apply custom animations to steps. Handles the attribute data-jmpress (the 
attribute name depends on a config option). Take a look at this 
[animation example](http://shama.github.com/jmpress.js/examples/animation/) for more information.

### `data-jmpress`

Apply a custom animation.

The following strings are supported:

* `(name)`
* `(name) after (time)` = `(name) after (time) prev`
* `(name) after (time) step`
* `(name) after (time) (selector)`
* `(name) after step`
* `(name) after (selector)`


`(name)` is a animation name. It is the basis for the classes that will be added the the element:

| `will-(name)`  | Class ever set.                                   |
| `do-(name)`    | Class is only set while the animation is running. |
| `has-(name)`   | Class is only set after the animation was ran.    |

`(time)` is `**m`, `**s` or `**ms` (minutes, seconds, milli seconds) in example: `300ms` or `1.4s`.

`(selector)` is a jQuery Selector after which the substep follows.

If you set a `(time)` the substep automatically advance. If you do not set a `(time)` substep advance 
after the "next" key is pressed.

`prev` means the previous substep in DOM. `step` means the slide.

If you have cool animations created, you can contribute them to `jmpress.js/src/css/animations/`.