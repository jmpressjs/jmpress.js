# jmpress.js

It's a jQuery port of https://github.com/bartaz/impress.js and a presentation 
framework based on the power of CSS3 transforms and transitions in modern 
browsers and inspired by the idea behind prezi.com.

*WARNING*

jmpress.js may not help you if you have nothing interesting to say ;)

## DEMO

jmpress.js demo: [http://shama.github.com/jmpress.js]

## BROWSER SUPPORT

Currently jmpress.js works fine in latest Chrome/Chromium browser, Safari 5.1 and Firefox 10
(to be released in January 2012). IE10 support is currently unknown, so let's assume it doesn't
work there. It also doesn't work in Opera.

As it was not developed with mobile browsers in mind, it currently doesn't work on 
any mobile devices, including tablets.

Additionally for the animations to run smoothly it's required to have hardware
acceleration support in your browser. This depends on the browser, your operating
system and even kind of graphic hardware you have in your machine.

For browsers not supporting CSS3 3D transforms jmpress.js adds a not supported 
class to your element, so fallback styles can be applied to make all the content 
accessible.

## USAGE

Take a look at the `index.html` and `css/style.css` for an example presentation. 
The only required file to use this is `js/jmpress.js`.

### Create a root presentation element

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

### Tell jQuery to build your presentation

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

### jQuery.jmpress()

    $(selector).jmpress({
        // jQuery selector to select each step
        stepSelector: '.step'

        // Class name to give the canvas
		,canvasClass: 'canvas'

        // Class name to trigger if jmpress is not supported
		,notSupportedClass: 'jmpress-not-supported'

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

## CONTRIBUTING

I accept pull requests! ;)

### WISHLIST

* Support mobile/tablet devices
* Fallback to canvas or SVG for older browsers
* jQuery UI theme support

## LICENSE

Copyright 2012 Kyle Robinson Young. Released under a [MIT license](http://www.opensource.org/licenses/mit-license.php).