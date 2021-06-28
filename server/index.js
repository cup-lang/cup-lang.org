const fs = require('fs');
const uws = require('uWebSockets.js');
embed('app.js');
embed('static.js');

const { exec } = require('child_process');

app.ws('/', {
    message: (ws, data) => {
        exec('docker', (err, stdout, stderr) => {
            if (err) {
              // node couldn't execute the command
              return;
            }
          
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }
});