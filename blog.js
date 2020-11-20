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



var post = { description:'XOXO' };

var bladeCompiler = require('@bitfertig/blade-compiler.nodejs');
var compiledHTML = bladeCompiler({ folder: './src/pages', file: '/index' });
compiledHTML = eval('`'+compiledHTML+'`');

console.log(compiledHTML);