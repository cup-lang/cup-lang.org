const fs = require('fs');
const uws = require('uWebSockets.js');
embed('app.js');
embed('static.js');

const { exec } = require('child_process');

app.ws('/', {
    message: (ws, data) => {
        data = Buffer.from(data).toString();
        const type = data.charCodeAt();
        data = data.substr(1);
        switch (type) {
            case 0:
                fs.writeFileSync('playground/main.cp', data);
                fs.writeFileSync('Dockerfile', 'FROM ubuntu\nWORKDIR /playground\nCOPY playground .\nCMD ./cup build -i prog');
                exec('docker build -t main . && docker run -it main', (err, stdout, stderr) => {
                    if (err) {
                        return;
                    }

                    ws.send('\u0000' + stdout);
                    ws.send('\u0001' + stderr);
                });
                break;
        }
    }
});