const fs = require('fs');
const fse = require('fs-extra'); // https://www.npmjs.com/package/fs-extra
const glob = require('glob');
const chokidar = require('chokidar'); // File watcher
const showdown = require('showdown'), // Markdown
    converter = new showdown.Converter();
const bladeCompiler = require('@bitfertig/blade-compiler.nodejs');

// Config
const duration = 2000; // Update only every 1 seconds
const path_source = './src';
const path_source_pages = path_source + '/pages';
const path_source_posts = path_source + '/posts';
const path_source_root = path_source + '/root';
const path_public = './public';
const path_public_pages = path_public + '/pages';
const path_public_posts = path_public + '/posts';
const path_public_root = path_public + '/';


// Changes
var changes = {
    exists: false,
    root: false,
    pages: false, // => recreate all public pages and posts
    posts: [], // => recreate only post and home
}


var watcher = chokidar.watch(path_source, {
    //ignoreInitial: true,
    //ignored: /^\./,
    persistent: true
});
watcher
    .on('all', function(type, path) {
        let path_consolidated = './'+path.replace(/\\/g, '/');
        if ( path_consolidated.startsWith(path_source_root) ) {
            changes.root = true;
            changes.exists = true;
        }
        if ( path_consolidated.startsWith(path_source_pages) ) {
            changes.pages = true;
            changes.exists = true;
        }
        if ( path_consolidated.startsWith(path_source_posts) ) {
            let path_post = path_consolidated.replace(new RegExp('('+path_source_posts+')(/.+)/.+', ''), '$1$2');
            if ( path_post != path_source_posts && !changes.posts.includes(path_post) ) {
                changes.posts.push(path_consolidated);
            }
            changes.exists = true;
        }
    })
    //.on('add', function(path) { console.log('File', path, 'has been added'); })
    //.on('change', function(path) { console.log('File', path, 'has been changed'); })
    //.on('unlink', function(path) { console.log('File', path, 'has been removed'); })
    //.on('error', function(error) { console.error('Error happened', error); })

console.log('\x1b[1m\x1b[7m'+'Watching ' + path_source , "\x1b[0m");


setInterval(update, duration);

function update() {
    fs.mkdirSync(path_public, { recursive: true });

    // Root
    if ( changes.root ) {
        fs.rmdirSync(path_public_root, { recursive: true });
        fse.copySync(path_source_root, path_public_root);
        changes.root = false;
        //console.log(path_source_root, path_public_root);
    }

    let posts = [];

    if ( changes.exists ) {
        console.log('Change incoming ...');

        if ( changes.pages || changes.posts ) { // now transform post.blade.html
            // TODO: Remove posts in public/posts/
            fs.rmdirSync(path_public + '/posts', { recursive: true });
            // TODO: foreach post to render html/markdown with json-data

            let dirs = glob.sync(path_source_posts + '/*'); // Post-dirs
            dirs = dirs.map((item) => { return item.match(new RegExp(path_source_posts+'/(.*)'))[1]; });
            //console.log(dirs);
            for (let i in dirs) {
                let dir = dirs[i];

                let post_dir_files = glob.sync(path_source_posts + '/' + dir + '/*'); // all files in post-dir
                //console.log(post_dir_files);
                if ( post_dir_files.includes(path_source_posts + '/' + dir + '/post.json') ) { // fs.existsSync(path_source_posts + '/' + dir + '/post.json')

                    let postjson = fs.readFileSync(path_source_posts + '/' + dir + '/post.json');
                    postjson = JSON.parse( postjson ) || {};

                    if ( postjson.status == 'published' ) { // published
                        fs.mkdirSync(path_public_posts + '/' + dir, { recursive: true });

                        let $content = '';
                        if ( fs.existsSync(path_source_posts + '/' + dir + '/' + postjson.main) ) {
                            $content = fs.readFileSync(path_source_posts + '/' + dir + '/' + postjson.main, 'utf8');
                            if ( postjson.main.endsWith('.md') ) {
                                $content = converter.makeHtml($content);
                            }
                        }

                        let filename = 'post';
                        let $ = { ...postjson, content:$content };
                        let content = renderBladeFile(filename, $);
                        fs.writeFileSync(path_public_posts + '/' + dir + '/index.html', content);

                        // Copy extra files
                        let post_dir_files_extra = post_dir_files.filter((item) => { return ![
                            path_source_posts + '/' + dir + '/post.json',
                            path_source_posts + '/' + dir + '/' + postjson.main
                        ].includes(item) });
                        post_dir_files_extra.forEach((item) => {
                            fse.copySync(item, path_public_posts + '/' + dir + '/' + item.substr((path_source_posts+'/'+dir+'/').length - 1));
                        })

                        posts.push({ slug:dir, json:postjson });
                    }
                }
            }

            changes.posts = [];
        }

        if ( changes.pages ) {
            let files = glob.sync(path_source_pages+'/*.blade.html');
            //console.log(files);
            // TODO: Read files in pages/*
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

                if ( filename != 'post' ) { // not post.blade.html, it is used for post-detailpages
                    let $ = { posts:posts /* description:'XOXO' */ };
                    let content = renderBladeFile(filename, $);
                    fs.writeFileSync('./public/' + filename + '.html', content);
                }
            }
            changes.pages = false;
        }

        //console.log(changes);
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