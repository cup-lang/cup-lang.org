const fs = require('fs');
const htmlMinifier = require('html-minifier');
const DEBUG = process.argv[2] == '--debug';

function load(path) { return fs.readFileSync(path).toString(); }

async function embed(file) {
    for (let i = 0; i < file.length; ++i) {
        if (file.substr(i, 7) == 'embed(\'') {
            let filename = '';
            for (let ii = i + 7; ii < file.length; ++ii) {
                if (file.substr(ii, 3) == '\');') {
                    break;
                }
                filename += file[ii];
            }
            let embeded = await embed(load(filename));
            if (!DEBUG) {
                if (filename.endsWith('main.js')) {
                    embeded = `(() => {${embeded}})();`;
                    embeded = require('@babel/core').transformSync(embeded, { presets: ['@babel/preset-env'] }).code;
                } else if (filename.endsWith('main.css')) {
                    embeded = await require('postcss')([require('autoprefixer')]).process(embeded).css;
                }
            }

            file = file.substr(0, i) + embeded + file.substr(i + 10 + filename.length);
        }
    }
    return file;
}

(async function () {
    if (!fs.existsSync('build/out')) { fs.mkdirSync('build/out'); }

    // Build Client
    let client = await embed(load('client/html/main.html'));
    if (!DEBUG) {
        client = htmlMinifier.minify(client, { minifyCSS: true, minifyJS: true, removeComments: true, sortClassName: true, sortAttributes: true, collapseWhitespace: true });
    }
    fs.writeFileSync('build/out/client.html', client);

    // Build Server
    fs.writeFileSync('build/out/server.js', await embed(load('server/main.js')));
})();