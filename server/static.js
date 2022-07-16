function load(path) { return fs.readFileSync(path); }

function get(name, data, type) {
	app.get(`/${name}`, res => {
		res.onAborted(() => { });
		res.writeHeader('Cache-Control', 'max-age=86400');
		res.writeHeader('Content-Type', type);
		res.end(data);
	});
}

get('favicon.ico', load('client/res/favicon.ico'), 'image/vnd.microsoft.icon');
get('icon192.png', load('client/res/icon192.png'), 'image/png');
get('robots.txt', load('client/res/robots.txt'), 'text/plain');
get('sitemap.xml', load('client/res/sitemap.xml'), 'application/xml');