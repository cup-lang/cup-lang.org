const uws = require('uWebSockets.js');

const DEBUG = process.argv[2] == '--debug';
const PORT = DEBUG ? 3001 : 80;

const app = uws.App();

app.get('/vscode', res => {
	res.onAborted(() => { });
	res.writeStatus('301');
	res.writeHeader('location', 'https://marketplace.visualstudio.com/items?itemName=cup-lang.cup');
	res.end();
});

app.listen('0.0.0.0', PORT, token => {
	if (token) {
		console.log(`Listening on port ${PORT}...`);
	}
});