const fs = require('fs');
const htmlMinifier = require('html-minifier');

function load(path) { return fs.readFileSync(path).toString(); }

function embed(file) {
    for (let i = 0; i < file.length; ++i) {
        if (file.substr(i, 7) == 'embed(\'') {
            let filename = '';
            for (let ii = i + 7; ii < file.length; ++ii) {
                if (file.substr(ii, 3) == '\');') {
                    break;
                }
                filename += file[ii];
            }
            file = file.substr(0, i) + embed(load(filename)) + file.substr(i + 10 + filename.length);
        }
    }
    return file;
}

if (!fs.existsSync('build/out')) { fs.mkdirSync('build/out'); }

const DEBUG = process.argv[2] == '--debug';

// Build Client
let client = embed(load('client/html/index.html'));
if (!DEBUG) {
    // js = `(() => {${js}})();`;
    // js = require('@babel/core').transformSync(js, { presets: ['@babel/preset-env'] }).code;
    client = htmlMinifier.minify(client, { minifyCSS: true, minifyJS: true, removeComments: true, sortClassName: true, sortAttributes: true, collapseWhitespace: true });
}
fs.writeFileSync('build/out/client.html', client);

// Build Server
fs.writeFileSync('build/out/server.js', embed(load('server/index.js')));