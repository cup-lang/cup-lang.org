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
get('icon64.png', load('client/res/icon16.png'), 'image/png');
get('icon32.png', load('client/res/icon32.png'), 'image/png');
get('icon192.png', load('client/res/icon192.png'), 'image/png');
get('icon512.png', load('client/res/icon512.png'), 'image/png');
get('apple-touch-icon.png', load('client/res/apple-icon.png'), 'image/png');
get('site.webmanifest', load('client/res/manifest.json'), 'application/manifest+json');
get('robots.txt', load('client/res/robots.txt'), 'text/plain');``
get('sitemap.xml', load('client/res/sitemap.xml'), 'application/xml');