Math.clamp = (value, min, max) => {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
};

function updatePage(path) {
	for (const page of document.getElementsByClassName('page')) {
		page.style = 'display:none';
	}
	for (const lesson of document.getElementsByClassName('lesson')) {
		lesson.style = 'display:none';
	}

	for (const link of document.querySelectorAll('.nav-link, .learn-link')) {
		link.classList.remove('nav-link-active', 'learn-link-active');
	}

	let splitPath = path.split('/');
	let page = splitPath[1].length == 0 ? document.getElementById('landing') : document.getElementById(splitPath[1]);

	if (!page) {
		page = document.getElementById('not-found');
	}

	if (splitPath[1] == 'learn') {
		if (splitPath.length < 3) {
			path = localStorage.lesson || '/learn/introduction';
			splitPath = path.split('/');
		}
		let lesson = document.getElementById(splitPath[splitPath.length - 1]);
		if (!lesson) {
			path = '/learn/introduction';
			splitPath = path.split('/');
			lesson = document.getElementById(splitPath[splitPath.length - 1]);
			history.replaceState(null, '', path);
		}
		lesson.style = '';
	}

	if (path != '/') {
		document.querySelector(`.nav-link[href="/${splitPath[1]}"]`)?.classList.add('nav-link-active');
	}
	if (splitPath[1] == 'learn') {
		updateLearn(path);
	} else {
		window.onkeydown = null;
	}

	page.style = '';
	document.body.scrollTo({ top: 0, behavior: 'smooth' });
	setTimeout(() => {
		page.querySelectorAll('.editor').forEach(e => {
			if (e.init === false) {
				e.editor.overlayUpdate();
				e.init = true;
			}
		});

		if (splitPath[1] == 'playground') {
			playgroundEditor.overlayUpdate();
		}
	}, 0);

	return path;
}

function shake(input) {
	if (input.classList.contains('shake')) {
		clearTimeout(input.timeout);
		input.classList.remove('shake');
		setTimeout(() => { input.classList.add('shake'); }, 0);
	} else {
		input.classList.add('shake');
	}
	input.timeout = setTimeout(() => { input.classList.remove('shake'); }, 300);
}

let playgroundEditor;
function autorun() {
	document.querySelectorAll('.editor').forEach(e => {
		if (e.id === 'playground-editor') {
			playgroundEditor = new Editor(e, localStorage.code || 'print: "Hello, World!"');
		} else {
			e.init = false;
			e.editor = new Editor(e, e.getAttribute('value'));
		}
	});

	window.onpopstate = () => {
		updatePage(location.pathname);
	};

	for (const link of document.querySelectorAll('.nav-link, .link, .learn-link, #learn-left, #learn-right')) {
		link.onclick = () => {
			history.pushState(null, '', updatePage(link.getAttribute('href')));
			return false;
		}
	}

	updatePage(location.pathname);

	searchAutorun();
	downloadButtonAutorun();
	landingAutorun();
	learnAutorun();
	playgroundAutorun();
}

embed('client/js/search.js');
embed('client/js/downloadButton.js');
embed('client/js/editor.js');
embed('client/js/landing.js');
embed('client/js/learn.js');
embed('client/js/playground.js');

document.addEventListener('DOMContentLoaded', autorun, false);