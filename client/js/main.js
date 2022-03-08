Math.clamp = (value, min, max) => {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }
    return value;
};

function updatePage(href) {
    for (const page of document.getElementsByClassName('page')) {
        page.style = 'display:none';
    }
    for (const lesson of document.getElementsByClassName('lesson')) {
        lesson.style = 'display:none';
    }

    for (const link of document.querySelectorAll('.nav-link, .learn-link')) {
        link.classList.remove('nav-link-active', 'learn-link-active');
    };

    let path = href.split('/');
    const page = document.getElementById(path[1]);
    if (!page) {
        document.getElementById('landing').style = '';
        history.replaceState(null, '', href = '/');
        return;
    }
    page.style = '';
    if (path[1] == 'learn') {
        let lesson = document.getElementById(path[path.length - 1]);
        if (path.length < 3 || !lesson) {
            href = localStorage.lesson || '/learn/introduction';
            path = href.split('/');
            lesson = document.getElementById(path[path.length - 1]);
            history.replaceState(null, '', href);
        }
        lesson.style = '';
    }

    if (href != '/') {
        document.querySelector(`[href="/${path[1]}"]`)?.classList.add('nav-link-active');
    }
    if (path[1] == 'learn') {
        localStorage.lesson = href;

        const lesson = document.querySelector(`[href="${href}"]`);
        lesson.classList.add('learn-link-active');

        const left = lesson.previousElementSibling;
        const leftButton = document.getElementById('learn-left');
        if (left) {
            leftButton.style = '';
            leftButton.setAttribute('href', left.getAttribute('href'));
        } else {
            leftButton.style = 'pointer-events:none;opacity:0.5';
            leftButton.removeAttribute('href');
        }

        const right = lesson.nextElementSibling;
        const rightButton = document.getElementById('learn-right');
        if (right) {
            rightButton.style = '';
            rightButton.setAttribute('href', right.getAttribute('href'));
        } else {
            rightButton.style = 'pointer-events:none;opacity:0.5';
            rightButton.removeAttribute('href');
        }

        window.onkeydown = e => {
            if (left && e.keyCode == 37) {
                leftButton.click();
            } else if (right && e.keyCode == 39) {
                rightButton.click();
            }
        };
    } else {
        window.onkeydown = null;
    }

    if (path[1] == 'playground') {
        playgroundEditor.overlayUpdate();
        window.onresize = () => {
            playgroundEditor.overlayUpdate();
        };
    } else {
        window.onresize = null;
    }
}

function setDownload(index) {
    const systems = ['macOS', 'Windows', 'Linux'];
    const system = systems[index];
    const svg = ['<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>', '<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path></svg>', '<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"></path></svg>'];

    const button = document.getElementById('download-button-link');
    button.setAttribute('href', 'https://github.com/cup-lang/cup/raw/master/bin/cup.exe');
    button.setAttribute('title', `Download for ${system}`);
    button.innerHTML = `${svg[index]}<div class="top-button-info"><span>Download for ${system}</span><span id="file-size" class="top-button-sub-info"></span></div>`;

    function makeDownloadItem(index) {
        return `<a class="download-item" href="https://github.com/cup-lang/cup/raw/master/bin/cup.exe" download><div>${svg[index]}${systems[index]}</div>? kB</a>`;
    }
    document.getElementById('download-menu').innerHTML = makeDownloadItem((index + 1) % 3) + makeDownloadItem((index + 2) % 3);
}

function setGithubStars(stars) {
    stars = stars || localStorage.stars || '?';
    document.getElementById('star-count').innerHTML = `<svg viewBox="0 0 14 16" width="12" height="12" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>${stars}`;
    localStorage.stars = stars;
}

function setBinarySize(size) {
    size = size || localStorage.size || '?';
    document.getElementById('file-size').innerText = `v0.0.1 - ${size}kB`;
    localStorage.size = size;
}

function setDiscordUsers(count) {
    count = count || localStorage.discord || '?';
    document.getElementById('discord-count').innerText = count;
    localStorage.discord = count;
}

function setRedditUsers(count) {
    count = count || localStorage.reddit || '?';
    document.getElementById('reddit-count').innerText = count;
    localStorage.reddit = count;
}

function getJSON(res) {
    if (!res.ok) {
        throw Error(res.statusText);
    }
    return res.json();
}

let playgroundEditor;

function autorun() {
    playgroundEditor = new Editor(
        document.getElementById('playground-editor'),
        localStorage.code || 'print|"Hello, World!"'
    );

    window.onpopstate = () => {
        updatePage(location.pathname);
    };

    for (const link of document.querySelectorAll('.nav-link, .learn-link, #learn-left, #learn-right')) {
        link.onclick = () => {
            history.pushState(null, '', link.href);
            updatePage(link.getAttribute('href'));
            return false;
        }
    }

    updatePage(location.pathname);

    const platform = window.navigator.platform;
    const macos = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const ios = ['iPhone', 'iPad', 'iPod'];
    const windows = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (macos.indexOf(platform) != -1 || ios.indexOf(platform) != -1) {
        setDownload(0);
    } else if (windows.indexOf(platform) != -1 || /Android/.test(window.navigator.userAgent)) {
        setDownload(1);
    } else {
        setDownload(2);
    }

    setGithubStars();
    setBinarySize();

    let open;
    const arrow = document.getElementById('download-arrow');
    const menu = document.getElementById('download-menu');
    arrow.onmousedown = menu.onmousedown = e => { e.stopPropagation(); }
    arrow.onclick = () => {
        function hide() {
            open = false;
            arrow.classList.remove('download-arrow-active');
            menu.style.display = 'none';
            window.removeEventListener('mousedown', hide);
        }
        if (open) {
            hide();
        } else {
            open = true;
            arrow.classList.add('download-arrow-active');
            window.addEventListener('mousedown', hide);
            menu.style.display = '';
        }
        return false;
    };

    fetch('https://api.github.com/repos/cup-lang/cup').then(getJSON).then(data => {
        setGithubStars(data.stargazers_count);
    }).catch(() => { });
    fetch('https://api.github.com/repos/cup-lang/cup/contents/bin').then(getJSON).then(data => {
        setBinarySize(Math.floor(data[0].size / 1024));
    }).catch(() => { });

    document.getElementById('cup-handle').onmousedown = e => {
        e.stopPropagation();
        const movable = document.getElementById('cup-movable');
        let holding = true;
        let rot = 0;
        let x = e.pageX;
        let y = e.pageY;
        function drop() {
            holding = false;
            window.removeEventListener('mouseup', drop);
            document.body.style = '';
            window.onmousemove = null;
        }
        e.target.style = 'display:none';
        document.body.style = 'cursor:grabbing';
        window.addEventListener('mouseup', drop);
        window.onmousemove = e => {
            const newX = e.pageX;
            rot = Math.clamp(rot + Math.clamp(newX - x, -10, 10), -140, 60);
            x = newX;
            y = e.pageY;
        };
        let time = Date.now();
        let appended;
        const interval = setInterval(() => {
            if (!appended) {
                document.body.append(movable);
                appended = true;
            }
            const newTime = Date.now();
            const delta = (newTime - time) / 2;

            if (holding == false) {
                y += delta * 2;

                if (y > Math.max(document.body.clientHeight, window.innerHeight) + 150) {
                    y = -200;
                    holding = null;
                    document.getElementById('cup').append(movable);
                }
            }

            if (holding == null) {
                y += delta * 2;

                if (y >= 0) {
                    e.target.style = movable.style = '';
                    clearInterval(interval);
                    return;
                }

                movable.style = `top:${y}px`;
            } else {
                const t = -25 - rot;
                let d = Math.clamp(t - Math.floor(t / 360) * 360, 0, 360);
                if (d > 180) {
                    d -= 360;
                }
                rot += d * Math.clamp(delta / 50, 0, 1);

                movable.style = `left:${x - 120}px;top:${y - 22.5}px;transform:rotate(${rot}deg)`;
            }

            time = newTime;
        }, 0);
        return false;
    };

    setDiscordUsers();
    setRedditUsers();

    fetch('https://discord.com/api/guilds/842863266585903144/widget.json').then(getJSON).then(data => {
        setDiscordUsers(data.presence_count);
    }).catch(() => { });
    fetch('https://www.reddit.com/r/cup_lang/about.json').then(getJSON).then(data => {
        setRedditUsers(data.data.active_user_count);
    }).catch(() => { });

    for (const header of document.getElementById('learn').querySelectorAll('h1, h2, h3, h4, h5')) {
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = '§';
        link.style = 'margin-left:6px';
        header.onmouseenter = () => { header.appendChild(link); };
        header.onmouseleave = () => { header.removeChild(link); };
    };

    let ws;
    function connect() {
        ws = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}`);
        ws.onopen = () => { playgroundAction.removeAttribute('disabled'); };
        const playgroundOutput = document.getElementById('playground-output');
        ws.onmessage = data => {
            data = data.data;
            const type = data.charCodeAt();
            data = data.substr(1).split('\0');
            switch (type) {
                case 0: // Queue position update
                    const pos = parseInt(data[0]) + 1;
                    playgroundOutput.innerHTML = `<div class="output-divider">Queue position: ${pos}</div>`;
                    break;
                case 1: // Compilation start
                    playgroundOutput.innerHTML = '<div class="output-divider">Compiling...</div><div id="playground-timer"></div>';
                    const startTime = Date.now();
                    const interval = setInterval(() => {
                        const delta = (Date.now() - startTime) / 1000;
                        const timer = document.getElementById('playground-timer');
                        if (!timer) {
                            return clearInterval(interval);
                        }
                        if (delta >= 10) {
                            playgroundOutput.innerHTML = '<div class="output-divider">Loading output...</div>';
                            return clearInterval(interval);
                        }
                        document.getElementById('playground-timer').style = `width:${(1 - delta / 10) * 100}%`;
                    }, 0);
                    break;
                case 2: // Compilation result
                    playgroundAction.removeAttribute('disabled');
                    data[1] = data[1].replaceAll('\x1B[0m', '</span>');
                    data[1] = data[1].replaceAll('\x1B[35m', '<span style="color:magenta">');
                    data[1] = data[1].replaceAll('\x1B[32m', '<span style="color:green">');
                    data[1] = data[1].replaceAll('\x1B[0;31m', '<span style="color:red">');
                    data = data[1].split(data[0]);
                    playgroundOutput.innerHTML = `<div class="output-divider">Compilation output</div>${data[0]}`;
                    if (data.length > 1) {
                        playgroundOutput.innerHTML += `<div class="output-divider">Program output</div>${data[1]}`;
                    }
                    if (data.length > 2) {
                        playgroundOutput.innerHTML += '<div class="output-divider">Max output length exceeded</div>';
                    }
                    break;
            }
        };
        ws.onclose = () => {
            playgroundAction.setAttribute('disabled', true);
            setTimeout(connect, 1000);
        };
    }
    connect();

    document.querySelectorAll('.lesson .editor').forEach(editor => {
        new Editor(editor).overlayUpdate();
    });

    const playgroundAction = document.getElementById('playground-action');
    playgroundAction.onclick = () => {
        playgroundAction.setAttribute('disabled', true);
        ws.send(`\0${playgroundEditor.textarea.value}`);
    };

    playgroundEditor.textarea.addEventListener('input', () => {
        localStorage.code = playgroundEditor.textarea.value;
    });
}

function onload() { }

embed('client/js/editor.js');

if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', autorun, false);
    window.addEventListener('load', onload, false);
} else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', autorun);
    window.attachEvent('onload', onload);
} else {
    window.onload = () => {
        autorun();
        onload();
    };
}