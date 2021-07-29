Math.clamp = function (value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }
    return value;
};

var logo = ['<svg ', 'id="logo" ', 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">', '<ellipse fill="#99AAB5" cx="18" cy="26" rx="18" ry="10"/><ellipse fill="#CCD6DD" cx="18" cy="24" rx="18" ry="10"/>', '<path fill="#F5F8FA" d="M18 31C3.042 31 1 16 1 12h34c0 2-1.958 19-17 19z"/><path fill="#CCD6DD" d="M34.385 9.644c2.442-10.123-9.781-7.706-12.204-5.799-1.34-.148-2.736-.234-4.181-.234-9.389 0-17 3.229-17 8.444C1 17.271 8.611 21.5 18 21.5s17-4.229 17-9.444c0-.863-.226-1.664-.615-2.412zm-2.503-2.692c-1.357-.938-3.102-1.694-5.121-2.25 1.875-.576 4.551-.309 5.121 2.25z"/><ellipse fill="#8A4B38" cx="18" cy="13" rx="15" ry="7"/><path fill="#D99E82" d="M20 17c-.256 0-.512-.098-.707-.293-2.337-2.337-2.376-4.885-.125-8.262.739-1.109.9-2.246.478-3.377-.461-1.236-1.438-1.996-1.731-2.077-.553 0-.958-.443-.958-.996 0-.552.491-.995 1.043-.995.997 0 2.395 1.153 3.183 2.625 1.034 1.933.91 4.039-.351 5.929-1.961 2.942-1.531 4.332-.125 5.738.391.391.391 1.023 0 1.414-.195.196-.451.294-.707.294zm-6-2c-.256 0-.512-.098-.707-.293-2.337-2.337-2.376-4.885-.125-8.262.727-1.091.893-2.083.494-2.947-.444-.961-1.431-1.469-1.684-1.499-.552 0-.989-.447-.989-1 0-.552.458-1 1.011-1 .997 0 2.585.974 3.36 2.423.481.899 1.052 2.761-.528 5.131-1.961 2.942-1.531 4.332-.125 5.738.391.391.391 1.023 0 1.414-.195.197-.451.295-.707.295z"/>', '</svg>'];
logo.split = function () {
    return logo[0] + logo[2] + logo[3] + logo[5] + logo[0] + 'id="cup-movable" ' + logo[2] + logo[4] + logo[5];
}

function updatePage(href) {
    var pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; ++i) {
        pages[i].style = 'display:none';
    }
    var lessons = document.getElementsByClassName('lesson');
    for (let i = 0; i < lessons.length; ++i) {
        lessons[i].style = 'display:none';
    }

    document.querySelectorAll('.nav-link, .learn-link').forEach(function (e) {
        e.classList.remove('nav-link-active', 'learn-link-active');
    });

    var path = href.split('/');
    var page = document.getElementById(path[1]);
    if (!page) {
        document.getElementById('landing').style = '';
        history.pushState(null, '', href = '/');
        return;
    }
    page.style = '';
    if (path[1] === 'learn') {
        var lesson = document.getElementById(path[path.length - 1]);
        if (path.length < 3 || !lesson) {
            lesson = document.getElementById('introduction');
            history.pushState(null, '', href = '/learn/introduction');
        }
        lesson.style = '';
    }

    if (href !== '/') {
        var page = document.querySelector('[href="/' + path[1] + '"]');
        page.classList.add('nav-link-active');
    }
    if (path[1] === 'learn') {
        var lesson = document.querySelector('[href="' + href + '"]');
        lesson.classList.add('learn-link-active');

        var left = lesson.previousSibling;
        var leftButton = document.getElementById('learn-left');
        if (left) {
            leftButton.style = '';
            leftButton.setAttribute('href', left.getAttribute('href'));
        } else {
            leftButton.style = 'pointer-events:none;opacity: 0.5';
            leftButton.removeAttribute('href');
        }

        var right = lesson.nextSibling;
        var rightButton = document.getElementById('learn-right');
        if (right) {
            rightButton.style = '';
            rightButton.setAttribute('href', right.getAttribute('href'));
        } else {
            rightButton.style = 'pointer-events:none;opacity: 0.5';
            rightButton.removeAttribute('href');
        }
    }
}

function setDownload(index) {
    var systems = ['macOS', 'Windows', 'Linux'];
    var system = systems[index];
    var svg = ['<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>', '<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path></svg>', '<svg class="download-item-svg" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"></path></svg>'];

    var button = document.getElementById('download-button-link');
    button.setAttribute('href', 'https://github.com/cup-lang/cup/raw/master/bin/cup.exe');
    button.setAttribute('title', 'Download for ' + system);
    button.innerHTML = svg[index] + '<div class="top-button-info"><span>Download for ' + system + '</span><span id="file-size" class="top-button-sub-info"></span></div>';

    function makeDownloadItem(index) {
        index %= 3;
        return '<a class="download-item" href="https://github.com/cup-lang/cup/raw/master/bin/cup.exe" download><div>' + svg[index] + systems[index] + '</div>? kB</a>';
    }
    document.getElementById('download-menu').innerHTML = makeDownloadItem(++index) + makeDownloadItem(++index);
}

function setStars(stars) {
    document.getElementById('star-count').innerHTML = '<svg viewBox="0 0 14 16" width="12" height="12" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>';
    if (stars === undefined) {
        stars = localStorage.stars;
        if (stars === undefined) {
            stars = '?';
        }
    }
    document.getElementById('star-count').innerHTML += '&nbsp;' + stars;
    localStorage.stars = stars;
}

function setSize(size) {
    document.getElementById('file-size').innerText = 'v0.0.1';
    if (size === undefined) {
        size = localStorage.size;
        if (size === undefined) {
            return;
        }
    }
    document.getElementById('file-size').innerText += ' - ' + size + 'kB';
    localStorage.size = size;
}

function autorun() {
    document.querySelector('[href="/"]').innerHTML = logo.join('') + 'Cup';

    document.querySelectorAll('.nav-link, .learn-link, #learn-left, #learn-right').forEach(function (e) {
        e.onclick = function () {
            history.pushState(null, '', e.href);
            updatePage(e.getAttribute('href'));
            return false;
        }
    });

    updatePage(location.pathname);

    var platform = window.navigator.platform;
    var macos = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    var ios = ['iPhone', 'iPad', 'iPod'];
    var windows = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (macos.indexOf(platform) !== -1 || ios.indexOf(platform) !== -1) {
        setDownload(0);
    } else if (windows.indexOf(platform) !== -1 || /Android/.test(window.navigator.userAgent)) {
        setDownload(1);
    } else {
        setDownload(2);
    }

    setStars();
    setSize();

    var open;
    var arrow = document.getElementById('download-arrow');
    var menu = document.getElementById('download-menu');
    arrow.onmousedown = menu.onmousedown = function (e) { e.stopPropagation(); }
    arrow.onclick = function () {
        var hide = function () {
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

    fetch('https://api.github.com/repos/cup-lang/cup')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            setStars(data.stargazers_count);
        });

    fetch('https://api.github.com/repos/cup-lang/cup/contents/bin')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            setSize(Math.floor(data[0].size / 1000));
        });

    document.getElementById('cup').innerHTML = logo.split() + '<div id="cup-handle"></div>';
    document.getElementById('cup-handle').onmousedown = function (e) {
        e.stopPropagation();
        var movable = document.getElementById('cup-movable');
        var stopHolding = function () {
            holding = false;
            window.removeEventListener('mouseup', stopHolding);
            document.body.style = '';
            window.onmousemove = null;
        }
        window.addEventListener('mouseup', stopHolding);
        e.target.style = 'display:none';
        var rot = 0;
        var x = e.pageX;
        var y = e.pageY;
        var holding = true;
        document.body.style = 'cursor:grabbing';
        window.onmousemove = function (e) {
            var newX = e.pageX;
            rot = Math.clamp(rot + Math.clamp(newX - x, -10, 10), -140, 60);
            x = newX;
            y = e.pageY;
        };
        var time = Date.now();
        var appended;
        var interval = setInterval(function () {
            if (!appended) {
                document.body.append(movable);
                appended = true;
            }
            var newTime = Date.now();
            var delta = (newTime - time) / 2;

            if (holding === false) {
                y += delta * 2;

                if (y > document.body.clientHeight + 150) {
                    y = -200;
                    holding = null;
                    document.getElementById('cup').append(movable);
                }
            }

            if (holding === null) {
                y += delta * 2;

                if (y >= 0) {
                    e.target.style = movable.style = '';
                    clearInterval(interval);
                    return;
                }

                movable.style = 'top:' + y + 'px';
            } else {
                var t = -25 - rot;
                var d = Math.clamp(t - Math.floor(t / 360) * 360, 0, 360);
                if (d > 180) {
                    d -= 360;
                }
                rot = rot + d * Math.clamp(delta / 50, 0, 1);

                movable.style = 'left:' + (x - 120) + 'px;top:' + (y - 22.5) + 'px;transform:rotate(' + rot + 'deg)';
            }

            time = newTime;
        }, 0);
        return false;
    };

    var ws = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.host);
    ws.onmessage = function (data) {
        data = data.data;
        var type = data.charCodeAt();
        data = data.substr(1).split('\u0000');
        switch (type) {
            case 0:
                data[1] = data[1].replaceAll('\033[0m', '</span>');
                data[1] = data[1].replaceAll('\033[35m', '<span style="color:magenta">');
                data[1] = data[1].replaceAll('\033[32m', '<span style="color:green">');
                data[1] = data[1].replaceAll('\033[0;31m', '<span style="color:red">');
                data = data[1].split(data[0]);
                document.getElementById('playground-output').innerHTML = 
                    '<div class="output-divider">Compilation output</div>' + data[0] +
                    '<div class="output-divider">Program output</div>' + data[1];
                break;
        }
    };

    document.getElementById('playground-action').onclick = function () {
        ws.send('\u0000' + playgroundCode.value);
    };

    var playgroundCode = document.getElementById('playground-code');
    if (localStorage.code) {
        playgroundCode.value = localStorage.code;
    }
    playgroundCode.oninput = function (e) {
        localStorage.code = e.target.value;
    };
}

function onload() { }