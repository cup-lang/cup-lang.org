Math.clamp = (value, min, max) => {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
};

const autoruns = {
	'landing': { func: landingAutorun },
	'learn': { func: learnAutorun },
	'playground': { func: playgroundAutorun },
};

function triggerAutorun(name) {
	const autorun = autoruns[name];
	if (autorun && !autorun.triggered) {
		autorun.triggered = true;
		autorun.func();
	}
}

function updatePage(path) {
	for (const page of document.getElementsByClassName('page')) {
		page.style = 'display:none';
		page.removeAttribute('visible');
	}
	for (const lesson of document.getElementsByClassName('lesson')) {
		lesson.style = 'display:none';
		lesson.removeAttribute('visible');
	}

	for (const link of document.querySelectorAll('.nav-link, .learn-link')) {
		link.classList.remove('nav-link-active', 'learn-link-active');
	}

	let splitPath = path.split('/');
	let page;
	if (splitPath[1].length == 0) {
		page = document.getElementById('landing');
		triggerAutorun('landing');
	} else if (splitPath[1] !== 'landing') {
		page = document.getElementById(splitPath[1]);
		triggerAutorun(splitPath[1]);
	}

	if (!page) {
		page = document.getElementById('not-found');
	}

	if (splitPath[1] == 'learn') {
		// No particual lesson selected
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
}

embed('client/search/search.js');
embed('client/downloadButton/downloadButton.js');
embed('client/editor/editor.js');
embed('client/landing/landing.js');
embed('client/learn/learn.js');
embed('client/playground/playground.js');

document.addEventListener('DOMContentLoaded', autorun, false);