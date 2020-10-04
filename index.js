function autorun() {
    fetch("https://api.github.com/repos/cup-lang/cup").then(res => res.json()).then(data => {
        document.getElementById("star-count").innerHTML = '<svg viewBox="0 0 14 16" width="12" height="12" aria-hidden="true"><path fill-rule="evenodd"d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>' + data.stargazers_count;
    });

    var platform = window.navigator.platform;
    var macos = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    var ios = ["iPhone", "iPad", "iPod"];
    var windows = ["Win32", "Win64", "Windows", "WinCE"];

    if (macos.indexOf(platform) !== -1 || ios.indexOf(platform) !== -1) {
    } else if (windows.indexOf(platform) !== -1 || /Android/.test(window.navigator.userAgent)) {
    } else if (/Linux/.test(platform)) {
    }
}
if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
else window.onload = autorun;