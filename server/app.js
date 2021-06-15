let useSSL;
const app = (() => {
    if (useSSL = fs.existsSync('cert.pem')) {
        uws.App().get('/**', (res, req) => {
            res.writeStatus('301');
            res.writeHeader('location', 'https://cup-lang.org' + req.getUrl());
            res.end();
        }).listen('0.0.0.0', 80, () => { });

        return uws.SSLApp({
            cert_file_name: 'cert.pem',
            key_file_name: 'key.pem',
        });
    } else {
        return uws.App();
    }
})();

app.listen('0.0.0.0', useSSL ? 443 : 3001, token => {
    if (token) {
        console.log(`Listening...`);
    }
});