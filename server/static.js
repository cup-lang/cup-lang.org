const favicon = fs.readFileSync("assets/favicon.ico");
const icon192 = fs.readFileSync("assets/icon192.png");
const logo = fs.readFileSync("assets/logo.svg");
const robots = fs.readFileSync("assets/robots.txt");

const html = fs.readFileSync('build/out/client.html');

app.get('/favicon.ico', res => {
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'image/x-icon');
    res.end(favicon);
}).get('/icon192.png', res => {
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'image/png');
    res.end(icon192);
}).get('/logo.svg', res => {
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'image/svg+xml');
    res.end(logo);
}).get('/robots.txt', res => {
    res.writeHeader('Cache-Control', 'max-age=86400');
    res.writeHeader('Content-Type', 'text/plain');
    res.end(robots);
}).get('/**', res => {
    res.end(html);
});