const fs = require('fs');
const uws = require('uWebSockets.js');
const { exec, spawn, execSync } = require('child_process');
embed('app.js');
embed('static.js');
embed('sha256.js');

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
        delete ws.open;
    },
});

function checkQueue() {
    if (running < MAX_RUNNING && queue.length > 0) {
        running += 1;
        const req = queue.shift();
        for (let i = 0; i < queue.length; ++i) {
            if (ws.open) {
                queue[i].ws.send(`\u0000${i}`);            
            }
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
        fs.writeFileSync(`playground/${hash}/main.cp`, req.files[0]);
        exec(`echo "FROM ubuntu\nRUN apt-get update && apt-get -y install gcc\nCOPY playground/cup .\nCOPY playground/${hash} prog/\nRUN chmod +x cup\nCMD ./cup build -i prog -o out.c && gcc out.c -o out && echo -n ${hash} && ./out" | docker build -q -f - .`, (err, stdout, stderr) => {
            console.log(stderr);
            if (err) {
                return endProg(req.ws);
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
    if (ws.open) {
        ws.send('\u0001');
    } else {
        return endProg();
    }
    const id = lastProgID++;
    // , '--name', `c${id}`
    const proc = spawn('docker', ['run', '-m=500m', '--cpus=.5', '-t', name]);
    // setTimeout(() => {
    //     execSync(`docker stop -t 1 c${id}`);
    // }, 4000);
    let out = '';
    proc.stderr.on('data', function (data) {
        console.log(data.toString().trim());
    });
    proc.stdout.on('data', function (data) {
        out += data.toString();
    });
    proc.on('exit', function (code) {
        if (ws.open) {
            ws.send(`\u0002${hash}\u0000${out}`);
        }
        endProg(ws);
    });
}

function endProg(ws) {
    ws.using = false;
    running -= 1;
    checkQueue();
}