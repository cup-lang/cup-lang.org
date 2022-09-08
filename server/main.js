const fs = require('fs');
const https = require('https');

embed('server/app.js');
embed('server/static.js');
embed('server/playground.js');

const stats = (() => {
	if (fs.existsSync('stats.json')) {
		return JSON.parse(fs.readFileSync('stats.json').toString());
	}
	return {};
})();

const templateHTM = load('build/client.htm').toString();
let pages = {
	'landing': null,
	'not-found': null,
	'learn': null,
	'playground': null,
	'packages': null,
	'donate': null,
	'downloads': null,
};
function updateHtml () {
	const htm = templateHTM
	.replaceAll('%STARS%', stats.stars || '?')
	.replaceAll('%DISCORD%', stats.discord || '?')
	.replaceAll('%REDDIT%', stats.reddit || '?');

	for (const page in pages) {
		pages[page] = htm.replace(`id="${page}"`, `id="${page}" visible`);
	}
}
updateHtml();

function updateStat (url, then) {
	https.get(url, {
		headers: { 'User-Agent': 'cup-lang.org' }
	}, res => {
		let data = '';
		res.on('data', chunk => { data += chunk; });
		res.on('end', () => {
			try {
				then(JSON.parse(data));
				updateHtml();
				fs.writeFileSync('stats.json', JSON.stringify(stats));
			} catch (e) {
				console.error(`Error updating stat: ${e}, got ${data}`);
			}
		});
	});
}

setInterval(() => {
	updateStat('https://api.github.com/repos/cup-lang/cup', data => {
		stats.stars = data.stargazers_count;
	});
	updateStat('https://discord.com/api/guilds/842863266585903144/widget.json', data => {
		stats.discord = data.presence_count;
	});
	updateStat('https://www.reddit.com/r/cup_lang/about.json', data => {
		stats.reddit = data.data.active_user_count;
	});
}, 1000 * 60 * 60);

for (const page in pages) {
	if (page !== 'not-found' && page !== 'landing') {
		get(page, pages[page], 'text/html');
	}
}
get('', pages['landing'], 'text/html');
get('**', pages['not-found'], 'text/html');