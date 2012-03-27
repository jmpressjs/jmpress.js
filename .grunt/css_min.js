/* Stolen from https://github.com/cowboy/grunt/issues/17 
 * Thanks to @sindresorhus :)
 */
task.registerBasicTask( 'css_min', 'Minify CSS files with Sqwish.', function( data, name ) {
    var files = file.expand( data );
    var max = task.helper( 'concat', files );
    var min = require('sqwish').minify( max, config('sqwish').strict ); 
    file.write( name, min );
    if ( task.hadErrors() ) {
        return false;
    }
    log.writeln( 'File "' + name + '" created.' );
    task.helper( 'min_max_info', min, max );
});
