const load = path => { return fs.readFileSync(path); }

const get = (name, data, type) => {
	app.get(`/${name}`, res => {
		res.onAborted(() => { });
		res.writeHeader('Cache-Control', 'max-age=86400');
		res.writeHeader('Content-Type', type);
		res.end(data);
	});
}

get('favicon.ico', load('resources/icons/favicon.ico'), 'image/vnd.microsoft.icon');
get('icon64.png', load('resources/icons/icon16.png'), 'image/png');
get('icon32.png', load('resources/icons/icon32.png'), 'image/png');
get('icon192.png', load('resources/icons/icon192.png'), 'image/png');
get('icon512.png', load('resources/icons/icon512.png'), 'image/png');
get('apple-touch-icon.png', load('resources/icons/iconApple.png'), 'image/png');
get('site.webmanifest', load('resources/manifest.json'), 'application/manifest+json');
get('robots.txt', load('resources/robots.txt'), 'text/plain');
get('sitemap.xml', load('resources/sitemap.xml'), 'application/xml');