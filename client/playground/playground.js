function playgroundAutorun () {
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

	const playgroundAction = document.getElementById('playground-action');
	playgroundAction.onclick = () => {
		playgroundAction.setAttribute('disabled', true);
		ws.send(`\0${playgroundEditor.textarea.value}`);
	};

	playgroundEditor.textarea.addEventListener('input', () => {
		localStorage.code = playgroundEditor.textarea.value;
	});
}