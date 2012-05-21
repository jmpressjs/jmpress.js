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

We use the command line build tool: [grunt](https://github.com/cowboy/grunt). It requires Node.js. If you already have Node.js installed, navigate to your copy of jmpress.js and run the command: `npm install --dev` to install any development dependencies. It is recommended to install grunt globally with `npm install grunt -g`.

Then navigate to your copy of jmpress.js and run the command: `grunt` (windows: `grunt.cmd`) to build. You can also use the command `grunt watch` to continuously build jmpress.js as you edit.

The output files will be located in the `dist/` folder. Additionally `docs/asserts` and `docs/index.html` are output files for the documentation. Please do not edit any file in this folders as they are automatically generated. You can delete them and they will be regenerated.

Files in `docs/asserts` will have a hash of the content in their name (for better caching), so if you compile often there may be many different files in the folder. You can delete those as well.

### Testing

To run the tests, the grunt testing module `PhantomJS` must be installed. Unfortunately, this cannot be installed via npm or grunt itself, so the installation
must be done manually. Please look at the [PhantomJS documentation](https://github.com/cowboy/grunt/blob/master/docs/faq.md#why-does-grunt-complain-that-phantomjs-isnt-installed-%E2%9A%91) for ways to install on your system.

After you have installed PhantomJS, you can run the tests via `grunt qunit`.

## Pull Requests

Good news! We accept pull requests!

Please work and pull against the `dev` branch to make sure you are using the latest code. Thanks!

## Tests

jmpress.js uses [QUnit](http://docs.jquery.com/QUnit) for testing. Please run `/tests/` in your browser to run the tests or the command: `grunt qunit`.

*Currently the tests need a lot of catching up. Any help you can provide will be very much appreciated.*

## Docs

If you find an error or something missing please edit and submit a pull request.
There is an **Edit This Page** button in the top right corner.
