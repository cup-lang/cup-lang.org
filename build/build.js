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
            let embeded = embed(load(filename));
            if (!DEBUG && filename.endsWith('main.js')) {
                embeded = `(() => {${embeded}})();`;
                embeded = require('@babel/core').transformSync(embeded, { presets: ['@babel/preset-env'] }).code;
            }
            file = file.substr(0, i) + embeded + file.substr(i + 10 + filename.length);
        }
    }
    return file;
}

if (!fs.existsSync('build/out')) { fs.mkdirSync('build/out'); }

const DEBUG = process.argv[2] == '--debug';

// Build Client
let client = embed(load('client/html/main.html'));
if (!DEBUG) {
    client = htmlMinifier.minify(client, { minifyCSS: true, minifyJS: true, removeComments: true, sortClassName: true, sortAttributes: true, collapseWhitespace: true });
}
fs.writeFileSync('build/out/client.html', client);

// Build Server
fs.writeFileSync('build/out/server.js', embed(load('server/main.js')));