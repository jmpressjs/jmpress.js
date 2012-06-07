# Getting started

The only required files are [jQuery](http://jquery.com) and [jmpress.js](#builder) to use.

For a quick and simple example look at the [examples/simple/index.html](https://github.com/shama/jmpress.js/blob/beta/examples/simple/index.html) and [examples/simple/simple.css](https://github.com/shama/jmpress.js/blob/beta/examples/simple/simple.css).

It's good to look at [all examples](#docs-examples) to get a overview what's possible before starting a complex solution.
If you are not sure, you may ask.

## Migrating from impress.js

Currently jmpress.js includes all of the impress.js features and a lot more.

To migrate simply add jQuery, change impress.js to jmpress.js and call `$(selector).jmpress();` to initialize. Take a look at the [impress.js running on jmpress.js](http://shama.github.com/jmpress.js/examples/impress/) example.

If you use the impress.js api and you want to migrate:

[@attrs class="table table-bordered"]
| **impress.js**
 | **jmpress.js**
| event       `impress:stepenter`
 | event      `enterStep`
| event       `impress:stepleave`
 | event      `leaveStep`
| event       `impress:init`
 | callback   `$(x).afterInit(...)`
| api         `impress().init()`
 | api        `$(x).jmpress()`
| api         `impress().goto()`
 | api        `$(x).jmpress("goTo", ...)`
| attribute   `data-width`, `data-height`
 | attribute  `data-view-port-width`, `...-height`
| attribute   `data-max-scale`, `data-min-scale`
 | setting    `data-view-port-max-scale`, `...-min-scale`
| class       `impress-on-ID` on body
 | class      `step-ID` on container

