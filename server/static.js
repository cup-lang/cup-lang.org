const favicon = fs.readFileSync("assets/favicon.ico");
const icon192 = fs.readFileSync("assets/icon192.png");
const robots = fs.readFileSync("assets/robots.txt");

const html = fs.readFileSync('build/out/client.html');

app.get('/favicon.ico', res => {
    res.onAborted(() => {});
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'image/vnd.microsoft.icon');
    res.end(favicon);
}).get('/icon192.png', res => {
    res.onAborted(() => {});
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'image/png');
    res.end(icon192);
}).get('/robots.txt', res => {
    res.onAborted(() => {});
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'text/plain');
    res.end(robots);
}).get('/**', res => {
    res.onAborted(() => {});
    res.writeHeader('Content-Type', 'text/html');
    res.end(html);
});