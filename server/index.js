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
        const req = queue.pop();
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
                    runProg(cache[i].name);
                    return;
                }
            }
        }
        // make async
        fs.writeFileSync('playground/prog/main.cp', req.files[0]);
        exec('echo "FROM ubuntu\nCOPY playground/ .\nRUN chmod +x cup\nCMD ./cup build -i prog" | docker build -q -f - .', (err, stdout, stderr) => {
            if (err && err.code > 1) {
                return;
            }

            console.log(stderr);
            const name = stdout;
            console.log('name: ' + name);
            runProg(name);
        });
        // CLEANUP: clean if too many folders
        // INIT: create a folder, create all files user send to us
        // docker build
        // docker run
    }
}

function runProg(name) {
    const proc = spawn('docker', ['run', '-t', name]);
    proc.stdout.on('data', function (data) {
        console.log(data.toString().trim());
    });
    proc.stderr.on('data', function (data) {
        console.log(data.toString().trim());
    });
    // ws.send('\u0000' + stdout);
    // ws.send('\u0001' + stderr);
}