const DEBUG = process.argv[2] === '--debug';
const PORT = DEBUG ? 3001 : 443; 

const app = (() => {
    if (DEBUG) {
        return uws.App();
    } else {
        // Redirect all HTTP to HTTPS
        uws.App().get('/**', (res, req) => {
            res.onAborted(() => {});
            res.writeStatus('301');
            res.writeHeader('location', `https://cup-lang.org${req.getUrl()}`);
            res.end();
        }).listen('0.0.0.0', 80, () => { });

        return uws.SSLApp({
            cert_file_name: 'cert.pem',
            key_file_name: 'key.pem',
        });
    }
})();

app.get('/vscode', res => {
    res.onAborted(() => {});
    res.writeStatus('301');
    res.writeHeader('location', 'https://marketplace.visualstudio.com/items?itemName=cup-lang.cup');
    res.end();
});

app.listen('0.0.0.0', PORT, token => {
    if (token) {
        console.log(`Listening on port ${PORT}...`);
    }
});