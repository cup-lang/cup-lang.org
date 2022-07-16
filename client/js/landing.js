function setDownload(index) {
	const svgElements = Array.from(document.getElementsByClassName('download-item-svg'));
	const svgs = svgElements.map(e => e.innerHTML);
	const osElements = Array.from(document.getElementsByClassName('download-item-os'));
	const oses = osElements.map(e => e.innerText);
	const titleElements = Array.from(document.querySelectorAll('#download-button-link, .download-item'));
	const titles = titleElements.map(e => e.title);
	for (let i = 0; i < 3; ++i) {
		const newIndex = (index + i) % 3;
		svgElements[i].innerHTML = svgs[newIndex];
		osElements[i].innerText = oses[newIndex];
		titleElements[i].title = titles[newIndex];
	}
}

function landingAutorun () {
	const headerLang = document.getElementById('header-lang');
	const headerLangs = ['C++', 'Python', 'C#', 'Java', 'C', 'JavaScript', 'Rust', 'PHP'];
	const headerLangsEmojis = ['🥱', '😔', '🙄', '🫤', '😵', '🥴', '😬', '😒'];
	let headerLangTime = Date.now() + 10000;
	let headerLangIndex = 1;
	setInterval(() => {
		const lang = `${headerLangs[headerLangIndex]}?`;
		const animDuration = (lang.length + 1) * 100;
		const time = Date.now() - headerLangTime;
		if (time >= 0) {
			headerLang.innerText = lang.substring(0, time / animDuration * (lang.length + 1));
			document.getElementById('header-lang-emoji').innerText = headerLangsEmojis[headerLangIndex];
		}
		if (time >= animDuration) {
			headerLangIndex = (headerLangIndex + 1) % headerLangs.length;
			headerLangTime = Date.now() + 6000;
		}
	}, 0);

	const platform = window.navigator.userAgentData?.platform || window.navigator.userAgent || window.navigator.platform;
	if (
		platform.indexOf('Macintosh') != -1 ||
		platform.indexOf('MacIntel') != -1 ||
		platform.indexOf('MacPPC') != -1 ||
		platform.indexOf('Mac68K') != -1 ||
		platform.indexOf('iPhone') != -1 ||
		platform.indexOf('iPad') != -1 ||
		platform.indexOf('iPod') != -1
	) {
		setDownload(1);
	} else if (
		platform.indexOf('Linux') != -1 ||
		platform.indexOf('X11') != -1
	) {
		setDownload(2);
	}

	window.addEventListener('mousedown', e => {
		if (e.target.id !== 'download-arrow') {
			document.getElementById('download-trigger1').checked = false;
			document.getElementById('download-trigger2').checked = false;
		}
	});

	const cupHandle = document.getElementById('cup-handle');
	cupHandle.style = '';
	cupHandle.onmousedown = e => {
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
}