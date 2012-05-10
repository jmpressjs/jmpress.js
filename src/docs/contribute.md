# Contribute

We are always looking for more contributors and there are many ways you can help!

* Open an [issue](https://github.com/shama/jmpress.js/issues) for a bug or a feature request
* Send us a message if you're using jmpress.js
* Add/update the test cases
* Fix a bug or write a feature then submit a pull request

Thank you for using and contributing to jmpress.js!

## Edit & Build

All the source files are located in the `src/` folder. They are broken up into components and plugins to allow users to build their own [customized version](#builder) of jmpress.js.

### Grunt

We use the command line build tool: [grunt](https://github.com/cowboy/grunt). It requires Node.js. If you already have Node.js installed, navigate to your copy of jmpress.js and run the command: `npm link` to install any development dependencies. Then use the command `grunt` to build jmpress.js. You can also use the command `grunt watch` to continuously build jmpress.js as you
edit.

The output files will be located in the `dist/` folder. Please do not edit any files in the `dist/` folder as they are automatically generated.

## Pull Requests

Good news! We accept pull requests!

Please work and pull against the `dev` branch to make sure you are using the latest code. Thanks!

## Tests

jmpress.js uses [QUnit](http://docs.jquery.com/QUnit) for testing. Please run `/tests/` in your browser to run the tests or the command: `grunt qunit`.

*Currently the tests need a lot of catching up. Any help you can provide will be very much appreciated.*

## Docs

If you find an error or something missing please edit and submit a pull request.

## Wishlist

* Browser Support (hard but important)
* Better fallback support for older browsers
* Community for plugins
