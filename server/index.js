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
                    let sum = '';
                    for (let ii = 0; ii < req.files.length; ++ii) {
                        sum += req.files[ii];                        
                    }
                    hash = sha256(sum);
                }
                if (cache[i].hash == hash) {
                    runProg(req.ws, hash);
                    return;
                }
            }
        }
        // CLEANUP: clean if too many folders
        fs.writeFileSync(`playground/${hash}/main.cp`, req.files[0]);
        exec(`echo "FROM ubuntu\nCOPY playground/cup .\nCOPY playground/${hash} prog\nRUN chmod +x cup\nCMD ./cup build -i prog" | docker build -t ${hash} -f - .`, err => {
            if (err) {
                return;
            }
            runProg(req.ws, hash);
        });
    }
}

function runProg(ws, name) {
    const proc = spawn('docker', ['run', '-t', name]);
    let out = '';
    proc.stdout.on('data', function (data) {
        out += data.toString();
    });
    proc.stdout.on('end', function () {
        ws.send(`\u0000${out}`);
    });
}