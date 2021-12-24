function load(path) { return fs.readFileSync(path); }

function get(name, data, type) {
    app.get(`/${name}`, res => {
        res.onAborted(() => { });
        res.writeHeader('Cache-Control', 'max-age=86400');
        res.writeHeader('Content-Type', type);
        res.end(data);
    });
}

get('favicon.ico', load('assets/favicon.ico'), 'image/vnd.microsoft.icon');
get('icon192.png', load('assets/icon192.png'), 'image/png');
get('robots.txt', load('assets/robots.txt'), 'text/plain');

const html = load('build/out/client.html');
app.get('/**', res => {
    res.onAborted(() => { });
    res.writeHeader('Content-Type', 'text/html');
    res.end(html);
});