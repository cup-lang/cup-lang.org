function setDownload(index) {
	const buttons = Array.from(document.getElementsByClassName('download-button'));
	for (const button of buttons) {
		const svgElements = Array.from(button.getElementsByClassName('download-item-svg'));
		const svgs = svgElements.map(e => e.innerHTML);
		const osElements = Array.from(button.getElementsByClassName('download-item-os'));
		const oses = ['Windows', 'macOS', 'Linux'];
		const titleElements = Array.from(button.querySelectorAll('#download-button-link, .download-item'));
		const titles = titleElements.map(e => e.title);
		for (let i = 0; i < 3; ++i) {
			const newIndex = (index + i) % 3;
			svgElements[i].innerHTML = svgs[newIndex];
			osElements[i].innerText = oses[newIndex];
			titleElements[i].title = titles[newIndex];
		}
	}
}

function downloadButtonAutorun() {
	const platform = window.navigator.userAgentData?.platform || window.navigator.userAgent || window.navigator.platform;
	if (platform.indexOf('Macintosh') != -1 || platform.indexOf('MacIntel') != -1 || platform.indexOf('MacPPC') != -1 || platform.indexOf('Mac68K') != -1 || platform.indexOf('iPhone') != -1 || platform.indexOf('iPad') != -1 || platform.indexOf('iPod') != -1) {
		setDownload(1);
	} else if (platform.indexOf('Linux') != -1 || platform.indexOf('X11') != -1) {
		setDownload(2);
	}

	window.addEventListener('mousedown', e => {
		if (!e.target.classList.contains('download-arrow')) {
			document.getElementById('download-trigger1').checked = false;
			document.getElementById('download-trigger2').checked = false;
		}
	});
}