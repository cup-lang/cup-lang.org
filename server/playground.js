const { exec, spawn } = require('child_process');
const crypto = require('crypto');

const MAX_RUNNING = 4;
let queue = [];
let running = 0;
let lastProgID = 0;
const MAX_CACHE = 1024;
let cache = [];

const progs = fs.readdirSync('playground/', { withFileTypes: true }).filter(dirent => dirent.isDirectory());
for (let i = 0; i < progs.length; ++i) {
	fs.rmSync(`playground/${progs[i].name}`, { recursive: true, force: true });
}

app.ws('/', {
	open: ws => {
		ws.open = true;
	},
	message: (ws, data) => {
		data = Buffer.from(data).toString();
		const type = data.charCodeAt();
		data = data.substr(1);
		switch (type) {
			case 0:
				if (ws.using) {
					ws.close();
					return;
				}
				ws.using = true;
				queue.push({ ws: ws, files: [data] });
				ws.send(`\u0000${queue.length - 1}`);
				checkQueue();
				break;
			default:
				ws.close();
				break;
		}
	},
	close: ws => {
		ws.open = false;
	},
});

function trySend(ws, message) {
	if (ws.open) {
		ws.send(message);
	}
}

function checkQueue() {
	if (running < MAX_RUNNING && queue.length > 0) {
		running += 1;
		const req = queue.shift();
		for (let i = 0; i < queue.length; ++i) {
			trySend(queue[i].ws, `\u0000${i}`);
		}
		let length = 0;
		for (let i = 0; i < req.files.length; ++i) {
			length += req.files[i].length;
		}
		let hash = null;
		for (let i = 0; i < cache.length; ++i) {
			if (cache[i].length == length) {
				if (hash == null) {
					hash = hashFiles(req.files);
				}
				if (cache[i].hash == hash) {
					if (cache[i].name == null) {
						queue.push(req);
						return trySend(req.ws, `\u0000${queue.length - 1}`);
					}
					return runProg(req.ws, hash, cache[i].name);
				}
			}
		}
		if (hash == null) {
			hash = hashFiles(req.files);
		}
		while (cache.length >= MAX_CACHE) {
			fs.rmSync(`playground/${cache.shift().hash}`, { recursive: true, force: true });
		}
		fs.mkdirSync(`playground/${hash}`);
		fs.writeFileSync(`playground/${hash}/main.cup`, req.files[0]);
		let prog = { length: length, hash: hash };
		cache.push(prog);
		exec(`echo "FROM ubuntu\nRUN apt-get update && apt-get -y install gcc\nCOPY playground/cup .\nCOPY playground/${hash} prog/\nRUN chmod +x cup\nCMD ./cup build -i prog -o out.c && gcc out.c -o out && echo -n ${hash} && ./out" | docker build -q -f - .`, (err, stdout) => {
			if (err) {
				return endProg(req.ws);
			}
			prog.name = stdout.trim();
			runProg(req.ws, hash, prog.name);
		});
	}
}

function hashFiles(files) {
	const hash = crypto.createHash('sha256');
	for (let i = 0; i < files.length; ++i) {
		hash.write(files[i]);
	}
	return hash.digest('hex');
}

function runProg(ws, hash, name) {
	if (ws.open) {
		ws.send('\u0001');
	} else {
		return endProg(ws);
	}
	const id = lastProgID++;
	const proc = spawn('docker', ['run', '-m=500m', '--cpus=.5', '--name', `c${id}`, name]);
	let capped = false;
	setTimeout(() => {
		if (capped) {
			return;
		}
		exec(`docker stop -t 2 c${id}`);
	}, 8000);
	let out = '';
	proc.stdout.on('data', data => {
		if (capped) {
			return;
		}
		if (out.length < 65536) {
			out += data.toString();
		} else {
			capped = true;
			out += hash;
			exec(`docker stop -t 2 c${id}`);
		}
	});
	proc.on('exit', () => {
		trySend(ws, `\u0002${hash}\u0000${out}`);
		endProg(ws);
	});
}

function endProg(ws) {
	ws.using = false;
	running -= 1;
	checkQueue();
}