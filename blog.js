const WATCH_DIR_PATH = './src';
const chokidar = require('chokidar');

/* var changes = {
    template: false, // => recreate all public posts
    posts: [], // => recreate only post and home
}

var watcher = chokidar.watch(WATCH_DIR_PATH, {
    //ignoreInitial: true,
    //ignored: /^\./,
    persistent: true
});
watcher
    //.on('all', function(path) {console.log('File', path, ' (all)');})
    .on('add', function(path) {
        console.log('File', path, 'has been added');
        changes.push(path);
        createPublic();
    })
    .on('change', function(path) {console.log('File', path, 'has been changed');})
    //.on('unlink', function(path) {console.log('File', path, 'has been removed');})
    //.on('error', function(error) {console.error('Error happened', error);})

console.log('Started watching '+WATCH_DIR_PATH);

function createPublic() {
    if ( !changes ) return;
    console.log('changes done');
} */



var laravelBladeCompiler = require('laravel-blade-compiler');

var compiledHTML = laravelBladeCompiler({
    extension: 'html',
    folder: './src/pages',
    path: './src/pages/index.blade.html'
});

var post = { description:'xxx' };
var regex = /\{\{(.*)\}\}/gi;
compiledHTML = compiledHTML.replace(regex, function(match, bracket, char_position, content){
    //console.log(arguments);
    //changing to ${a};
    /*
    '0': '{{ post.language }}',
    '1': ' post.language ',
    '2': 29,
    '3': '<!DOCTYPE html>\r\n<html lang="{{ post.language }}">\r\n'
    */
    return '${'+ bracket +'}';
});

compiledHTML = eval('`'+compiledHTML+'`');

console.log(compiledHTML);