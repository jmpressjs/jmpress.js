# jmpress.js 0.3

A jQuery port of [impress.js](https://github.com/bartaz/impress.js) based on the
power of CSS3 transforms and transitions in modern browsers and inspired by the
idea behind prezi.com.

## DEMO

jmpress.js demo: [http://shama.github.com/jmpress.js]

jmpress.js beta demo: [http://sokra.github.com/jmpress.js] [beta branch](https://github.com/shama/jmpress.js/tree/beta)

## BROWSER SUPPORT

jmpress.js currently uses CSS3 transform and transition as its engine. As of
this writing only the latest Chrome, Safari and Firefox 10 supports this engine.
I think we should support all browsers. Which is the main reason I ported this
to jQuery.

The next step is to build a fallback engine for older browsers (this might mean
Modernizr). So until then older browsers just get older styles. Eventually I
would like to put a giant YES on each of the browser/devices below:

* Chrome/Chromium: YES
* Safari: YES
* Firefox: YES
* IE: PARTIAL
* Opera: YES
* iPad: YES (but could be better)
* iPhone/iPod: PARTIAL
* Android: NO

## USAGE

See DOCS on presentation for infos.

## CONTRIBUTING

Good news! We accept pull requests ;) Please work and pull against the `dev`
branch. Thanks!

### TESTS

jmpress.js uses the [jasmine bdd](http://pivotal.github.com/jasmine/) library
for testing. Please load `test.html` in your browser to run the tests.

## LICENSE

Copyright 2012 Kyle Robinson Young & Tobias Koppers. Released under a
[MIT license](http://www.opensource.org/licenses/mit-license.php).