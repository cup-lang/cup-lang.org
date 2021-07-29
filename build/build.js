const fs = require('fs');
const htmlMinifier = require('html-minifier');

function load(path) { return fs.readFileSync(path).toString(); }

function cutout(file, name) {
    let content = '';
    const start = file.indexOf(name);
    if (start !== -1) {
        let braceCount = 1;
        for (let ii = start + name.length + 2; ii < file.length; ++ii) {
            const char = file[ii];
            if (char === '{') {
                ++braceCount;
            } else if (char === '}') {
                --braceCount;
            }
            if (braceCount === 0) {
                break;
            }
            content += char;
        }
    }
    return [content, start];
}

function combineCSS(sheets) {
    let css = '';
    let root = '';
    let mobile = '';
    for (let i = 0; i < sheets.length; ++i) {
        const sheet = sheets[i];
        const rootStart = sheet.indexOf(':root');
        let rootEnd = -1;
        if (rootStart !== -1) {
            rootEnd = sheet.substr(rootStart).indexOf('}');
            root += sheet.substring(rootStart + 7, rootEnd);
        }
        const mobileCutout = cutout(sheet, '@mobile');
        mobile += mobileCutout[0];
        css += sheet.substring(rootEnd + 1, mobileCutout[1] === -1 ? sheet.length : mobileCutout[1]);
    }
    return `:root{${root}}${css}@media only screen and (max-width: 700px), screen and (max-height: 700px){${mobile}}`;
}

function combineJS(scripts) {
    let js = '';
    let autorun = '';
    let onload = '';
    for (let i = 0; i < scripts.length; ++i) {
        const script = scripts[i];
        const autorunCutout = cutout(script, 'function autorun()');
        js += script.substr(0, autorunCutout[1] === -1 ? script.length : autorunCutout[1]);
        autorun += autorunCutout[0];
        onload += cutout(script, 'function onload()')[0];
    }
    return `${js}function autorun(){${autorun}}function onload(){${onload}}`;
}

// Build Client
let client = load('client/html/index.html');
let css = combineCSS([
    load('client/css/reset.css'),
    load('client/css/index.css'),
    load('client/css/landing.css'),
    load('client/css/learn.css'),
    load('client/css/playground.css'),
]);
let js = combineJS([
    load('client/js/index.js'),
]);

if (!fs.existsSync('build/out')) {
    fs.mkdirSync('build/out');
}

js += `if(document.addEventListener){document.addEventListener('DOMContentLoaded',autorun,false);window.addEventListener('load',onload,false)}else if(document.attachEvent){document.attachEvent('onreadystatechange',autorun);window.attachEvent('onload',onload)}else{window.onload=function(){autorun();onload()}}`;
client = client.replace('</head>', `<style type="text/css">${css}</style><script type="text/javascript">${js}</script></head>`);
client = htmlMinifier.minify(client, { minifyCSS: true, minifyJS: true, removeComments: true, sortClassName: true, sortAttributes: true, collapseWhitespace: true });
fs.writeFileSync('build/out/client.html', client);

// Build Server
let server = load('server/index.js');
server = server.replace(`embed('app.js');`, load('server/app.js'));
server = server.replace(`embed('static.js');`, load('server/static.js'));
server = server.replace(`embed('sha256.js');`, load('server/sha256.js'));
fs.writeFileSync('build/out/server.js', server);