const fs = require('fs');
const uws = require('uWebSockets.js');
embed('app.js');
embed('static.js');

const { spawn } = require('child_process');

app.ws('/', {
    message: (ws, data) => {
        data = Buffer.from(data).toString();
        const type = data.charCodeAt();
        data = data.substr(1);
        switch (type) {
            case 0:
                fs.writeFileSync('playground/prog/main.cp', data);
                const proc = spawn('docker', ['run', '--rm', '-t', 'main']);
                proc.stdout.on('data', function (data) {
                    console.log(data.toString().trim());
                });
                proc.stderr.on('data', function (data) {
                    console.log(data.toString().trim());
                });
                proc.stdin.write('FROM ubuntu\nWORKDIR /playground\nCOPY playground .\nRUN chmod +x cup\nCMD ./cup build -i prog');
                proc.stdin.end();
                // exec('docker build -t main . > /dev/null && echo && docker run -t main', (err, stdout, stderr) => {
                //     if (err && err.code > 1) {
                //         return;
                //     }

                //     ws.send('\u0000' + stdout);
                //     ws.send('\u0001' + stderr);
                // });
                break;
            default:
                ws.close();
                break;
        }
    }
});