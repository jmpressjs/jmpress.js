# jmpress.js (Version 0.4.1)

A jQuery plugin to build a website on the infinite canvas.

Started as a jQuery port of [impress.js](https://github.com/bartaz/impress.js)
and utilizes the power of CSS3 transforms and transitions in modern browsers.

## DEMO

jmpress.js demo: [http://shama.github.com/jmpress.js/]

jmpress.js beta demo: [http://sokra.github.com/jmpress.js/] [dev branch](https://github.com/shama/jmpress.js/tree/dev)

## BROWSER SUPPORT

jmpress.js attempts to use CSS3 transform and transition as its engine.
Here is the current browser support list:

* Chrome/Chromium: YES
* Safari: YES
* Firefox: YES
* IE: MOSTLY
* Opera: YES
* iPad: YES
* iPhone/iPod: NO
* Android: NO
* Chrome for Android: YES in desktop mode

## BUILDING

All the source files are located in the src/ folder. They are broken up into components and plugins to allow users to build their own customized version of jmpress.js.

To build the documentation and the libraries, you need to use `grunt`. It requires `nodejs`. If you already have `nodejs` installed run the command
```
npm install -g grunt
```
to install `grunt`.
Afterwards, you will need to install four additional modules:
```
npm install grunt-css grunt-webpack YamYam git://github.com/twitter/bootstrap.git
```

Then navigate to your copy of jmpress.js and run the command: `grunt` to build. You can also use the command `grunt watch` to continuously build jmpress.js as you edit.

The output files will be located in the `dist/` folder. Please do not edit any file in the `dist/` folder as they are automatically generated.


## USAGE

See the [DOCS](http://shama.github.com/jmpress.js/docs/).

## CONTRIBUTING

Good news! We accept pull requests and are looking for more contributors! ;)
Take a look at the
[contribute section](http://shama.github.com/jmpress.js/docs/#docs-contribute)
of the docs for more information on how you can contribute. Thanks!

## LICENSE

Copyright 2012 Kyle Robinson Young & Tobias Koppers. Released under a
[MIT license](http://www.opensource.org/licenses/mit-license.php).