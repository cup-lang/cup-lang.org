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
    message: (ws, data) => {
        data = Buffer.from(data).toString();
        const type = data.charCodeAt();
        data = data.substr(1);
        switch (type) {
            case 0:
                queue.push({ ws: ws, files: [data] });
                checkQueue();
                break;
            default:
                ws.close();
                break;
        }
    }
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
                    runProg(req.ws, cache[i].name);
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
        exec(`echo "FROM ubuntu\nCOPY playground/cup .\nCOPY playground/${hash} prog/\nRUN chmod +x cup\nCMD ./cup build -i prog -o out.c && gcc out.c -o out && ./out" | docker build -q -f - .`, (err, stdout) => {
            if (err) {
                return;
            }
            const name = stdout.trim();
            cache.push({ length: length, hash: hash, name: name });
            runProg(req.ws, name);
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

function runProg(ws, name) {
    const proc = spawn('docker', ['run', '-t', name]);
    let out = '';
    proc.stdout.on('data', function (data) {
        out += data.toString();
    });
    proc.stderr.on('data', function (data) {
        console.log(data.toString().trim());
    });
    proc.stdout.on('end', function () {
        ws.send(`\u0000${out}`);
    });
}