const fs = require('fs');
const glob = require('glob');
const chokidar = require('chokidar');
const bladeCompiler = require('@bitfertig/blade-compiler.nodejs');

// Config
const WATCH_DIR_PATH = './src';
const path_pages = WATCH_DIR_PATH + '/pages';
const path_posts = WATCH_DIR_PATH + '/posts';
const duration = 2000; // Update only every 1 seconds


/**
 * What it does:
 * 1. Watch /src/pages => render to /public
 * 2. Watch /src/posts => render to /public/posts
 */

var changes = {
    exists: false,
    pages: false, // => recreate all public pages and posts
    posts: [], // => recreate only post and home
}


var watcher = chokidar.watch(WATCH_DIR_PATH, {
    //ignoreInitial: true,
    //ignored: /^\./,
    persistent: true
});
watcher
    .on('all', function(type, path) {
        let path_consolidated = './'+path.replace(/\\/g, '/');
        if ( path_consolidated.startsWith(path_pages) ) {
            changes.pages = true;
            changes.exists = true;
        }
        if ( path_consolidated.startsWith(path_posts) ) {
            let path_post = path_consolidated.replace(new RegExp('('+path_posts+')(/.+)/.+', ''), '$1$2');
            if ( path_post != path_posts && !changes.posts.includes(path_post) ) {
                changes.posts.push(path_consolidated);
            }
            changes.exists = true;
        }
    })
    /* .on('add', function(path) {
        console.log('File', path, 'has been added');
        changes.push(path);
        changes.exists = true;
        //createPublic();
    })
    .on('change', function(path) {console.log('File', path, 'has been changed');}) */
    //.on('unlink', function(path) {console.log('File', path, 'has been removed');})
    //.on('error', function(error) {console.error('Error happened', error);})

console.log('\x1b[1m\x1b[7m'+'Watching ' + WATCH_DIR_PATH , "\x1b[0m");


setInterval(update, duration);

function update() {
    if ( changes.exists ) {
        console.log('exists');
        if ( changes.pages ) {
            // TODO: Read files in pages/*
            let files = glob.sync(path_pages+'/*.blade.html');
            //console.log(files);
            // TODO: Remove pages in public/
            // TODO: Render files to public/*
            for (let i in files) {
                let file = files[i];
                let matches = file.match(/.*\/(.*)\.blade\.html/);
                let filename = matches[1];
                //console.log(matches);
                try {
                    fs.unlinkSync('./public/' + filename + '.html');
                } catch(err) {
                    //console.log(err);
                }

                let $ = { /* description:'XOXO' */ };
                let content = renderBladeFile(filename, $);
                fs.writeFileSync('./public/' + filename + '.html', content);
            }
            changes.pages = false;
        }
        if ( changes.posts ) {
            // TODO: Remove posts in public/posts/
            // TODO: foreach post to render html/markdown with json-data
            changes.posts = [];
        }
        console.log(changes);
        changes.exists = false;
    }
}


function renderBladeFile(filename, $) {
    var compiledHTML = bladeCompiler({ folder: './src/pages', file: '/'+filename });
    try {
        compiledHTML = eval('`'+compiledHTML+'`');
    } catch(err) {
        console.log(filename+':', err);
    }
    //console.log(compiledHTML);
    return compiledHTML;
}