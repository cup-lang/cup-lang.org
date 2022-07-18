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
	let page = splitPath[1].length == 0 ? null : document.getElementById(splitPath[1]);
	
	if (!page) {
		history.replaceState(null, '', path = '/');
		page = document.getElementById('landing');
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
		document.querySelector(`[href="/${splitPath[1]}"]`)?.classList.add('nav-link-active');
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

let playgroundEditor;

function autorun() {
	document.querySelectorAll('.editor').forEach(e => {
		if (e.id === 'playground-editor') {
			playgroundEditor = new Editor(e, localStorage.code || 'print "Hello, World!"');
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

	landingAutorun();
	learnAutorun();
	playgroundAutorun();
}

embed('client/js/editor.js');
embed('client/js/landing.js');
embed('client/js/learn.js');
embed('client/js/playground.js');

document.addEventListener('DOMContentLoaded', autorun, false);