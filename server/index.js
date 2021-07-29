const fs = require('fs');
const uws = require('uWebSockets.js');
const { exec, spawn } = require('child_process');
embed('app.js');
embed('static.js');
embed('sha256.js');

const MAX_RUNNING = 8;
let queue = [];
let running = 0;
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
                checkQueue();
                break;
            default:
                ws.close();
                break;
        }
    },
    close: ws => {
        delete ws.open;
    },
});

function checkQueue() {
    if (running < MAX_RUNNING && queue.length > 0) {
        running += 1;
        const req = queue.shift();
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
                    runProg(req.ws, hash, cache[i].name);
                    return;
                }
            }
        }
        if (hash == null) {
            hash = hashFiles(req.files);
        }
        // CLEANUP: clean cache if too big
        fs.mkdirSync(`playground/${hash}`);
        fs.writeFileSync(`playground/${hash}/main.cp`, req.files[0]);
        exec(`echo "FROM ubuntu\nRUN apt-get update && apt-get -y install gcc\nCOPY playground/cup .\nCOPY playground/${hash} prog/\nRUN chmod +x cup\nCMD ./cup build -i prog -o out.c && ($? == 0) && gcc out.c -o out &> /dev/null && echo -n ${hash} && ./out" | docker build -q -f - .`, (err, stdout) => {
            if (err) {
                ws.using = false;
                return;
            }
            const name = stdout.trim();
            cache.push({ length: length, hash: hash, name: name });
            runProg(req.ws, hash, name);
        });
    }
}

function hashFiles(files) {
    let sum = '';
    for (let i = 0; i < files.length; ++i) {
        sum += files[i];
    }
    return sha256(sum);
}

function runProg(ws, hash, name) {
    const proc = spawn('docker', ['run', '-t', name]);
    let out = '';
    proc.stdout.on('data', function (data) {
        out += data.toString();
    });
    proc.stdout.on('end', function () {
        if (ws.open) {
            ws.send(`\u0000${hash}\u0000${out}`);
        }
        ws.using = false;
        running -= 1;
        checkQueue();
    });
}