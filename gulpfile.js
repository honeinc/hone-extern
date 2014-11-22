'use strict';

var gulp = require( 'gulp' ); 
// don't have gulp globally no problem
// KEY=/home/you/.ssh/cloud npm run publish
var minimist = require( 'minimist' );
var rsync = require( 'rsyncwrapper' ).rsync;

var defaults = {
    sshkey: null,
    user: 'root',
    host: 'files-02.gohone.com',
    target: '/home/node/files/extern/'
};

var options = minimist( process.argv.slice( 2 ), {
    default: defaults
} );


gulp.task( 'publish', function( next ) {

    if ( !options.sshkey ) {
        throw new Error( 'You must specify an ssh key for publishing.' );
    }
          
    rsync( {
        src: './',
        dest: options.user + '@' + options.host + ':' + options.target,
        ssh: true,
        recursive: true,
        privateKey: options.sshkey,
        onStdout: process.stdout.write.bind( process.stdout ),
        onStderr: process.stderr.write.bind( process.stderr ),
        exclude: [ '.gitignore', '.git', 'node_modules', 'npm-debug.log', 'gruntfile.js', 'package.json' ],
        args: [ '--progress' ]
    }, function( error ) {
        var log = error ? process.stdout.write.bind( process.stdout ) : process.stderr.write.bind( process.stderr );
        log( 'Done\n' );                                      
    } );

} );

gulp.task( 'default', [ 'publish' ] );
