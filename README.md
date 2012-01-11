# jmpress.js

A jQuery port of [impress.js](https://github.com/bartaz/impress.js) based on the
power of CSS3 transforms and transitions in modern browsers and inspired by the
idea behind prezi.com.

## DEMO

jmpress.js demo: [http://shama.github.com/jmpress.js]

## BROWSER SUPPORT

jmpress.js is made for the latest browsers. Old browsers get old styles. Here is
the support list for the latest version of each browser:

* Chrome/Chromium: YES
* Safari: YES
* Firefox: ALMOST
* IE: NO
* Opera: PARTIAL
* iOS: PARTIAL
* Android: ?

## USAGE

Take a look at the `index.html` and `css/style.css` for an example.
The only required files are jQuery and `js/jmpress.js` to use.

### Create a root element

    <div id="jmpress"></div>

### Fill it up with steps

    <div id="jmpress">
        <div class="step">Slide 1</div>
        <div class="step">Slide 2</div>
    </div>

### Configure each step properties

    <div id="jmpress">
        <div class="step" data-x="3500" data-y="-850" data-rotate="270" data-scale="6">Slide 1</div>
        <div class="step" data-x="2825" data-y="2325" data-z="-3000" data-rotate="300" data-scale="1">Slide 2</div>
    </div>

### Tell jQuery to run it

    <script type="text/javascript">
    $(function() {
        $('#jmpress').jmpress();
    });
    </script>

### Configure jmpress

Don't want to use `.step` as a selector? Okay:

    $('#jmpress').jmpress({
        stepSelector: 'li'
    });

### Customize the hash id of each slide

The id of the step will appear as the URI hash to recall the slide later. If you
don't give your steps ids then the id `step-N` will be used.

    <div id="name-of-slide" class="step" data-x="3500" data-y="-850" data-rotate="270" data-scale="6">Slide 1</div>

### Load slides dynamically

You can load a slide dynamically by setting the `data-src` or `href` attribute
on the slide. The slide will only be loaded when an adjacent slide or the slide
itself is selected.

    <div class="step" data-src="slides/slide-1.html" data-x="500" data-y="300">Loading...</div>

## API

### Steps

Each step element can have the following data properties set:

* data-x: X Position
* data-y: Y Position
* data-z: Z Position
* data-scale: Scale of element
* data-rotation: Degree of rotation
* data-rotation-x: Degree of rotation on x-axis
* data-rotation-y: Degree of rotation on y-axis
* data-rotation-z: Degree of rotation on z-axis
* data-src: Load content of slide dynamically

### jQuery.jmpress()

    $(selector).jmpress({
        // jQuery selector to select each step
        stepSelector: '.step'

        // Class name to give the canvas
        ,canvasClass: 'canvas'

        // Class name to trigger if jmpress is not supported
        ,notSupportedClass: 'not-supported'

        // Customize the animations (or CSS) used
        ,animation: {
            ,transitionDuration: '5s'
            ,transitionTimingFunction: 'linear'
        }
    });

#### METHODS

    // Next slide
    $(selector).jmpress('next');

    // Previous slide
    $(selector).jmpress('prev');

    // Goto a slide
    $(selector).jmpress('select', '#slide-id');
    $(selector).jmpress('select', $(selector));

    // Manipulate the canvas
    $(selector).jmpress('canvas', {
        transform: 'rotate(7deg)'
    });

    // Manipulate an element
    $(selector).jmpress('css', $('#step-1'), {
        transform: 'scale(0.5)'
    });

    // Set a beforeChange callback
    $(selector).jmpress('beforeChange', function( slide ) {
        // Called on the start of each slide change
    });

## LICENSE

Copyright 2012 Kyle Robinson Young. Released under a [MIT license](http://www.opensource.org/licenses/mit-license.php).