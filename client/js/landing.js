function landingAutorun() {
	const headerLang = document.getElementById('header-lang');
	const headerLangs = [
		'Tired of C++',
		'Unhappy with Python',
		'Bored by Java',
		'Irritated by Go',
		'Done with C',
		'Mad at JavaScript',
		'Angry at Rust',
		'Annoyed with PHP'
	];
	const headerLangsEmojis = [
		'<path fill="#FFCC4D" d="M35 17c0 9.389-7.611 17-17 17-9.388 0-17-7.611-17-17C1 7.612 8.612 0 18 0c9.389 0 17 7.612 17 17"/><ellipse fill="#664500" cx="18" cy="19.5" rx="7" ry="7.5"/><path fill="#F4900C" d="M22.468 27.371s.997-.721.165-1.614c-.832-.893-1.621.052-1.621.052l-4.148 3.866c-.069-.205-.459-.743-.55-.947l5.755-5.366s.998-.721.164-1.615c-.832-.892-1.622.051-1.622.051l-5.413 5.046c-.125-.158-.461-.54-.594-.698l6.276-5.85s.997-.722.164-1.614c-.832-.893-1.621.051-1.621.051l-6.278 5.848c-.15-.145-.612-.609-.764-.746l5.866-5.468s.996-.722.164-1.614c-.833-.893-1.621.051-1.621.051l-6.203 5.781-.497.464-.22.207s-.538.744-1.087.179l1.842-4.158s.58-1.074-.493-1.655c-1.075-.581-1.655.493-1.655.493l-1.668 2.758c-.663 1.093-1.349 2.178-2.159 3.167-2.284 2.793-2.211 6.914.318 9.629 2.759 2.959 7.396 3.122 10.355.364l.447-.418 6.698-6.244z"/><path fill="#664500" d="M11.016 6.08c-2.255.604-3.48 1.965-3.555 2.05-.364.415-.323 1.047.091 1.412.415.365 1.046.325 1.411-.091.079-.087 2.09-2.253 5.81-1.492.542.111 1.07-.239 1.18-.779.111-.541-.238-1.07-.779-1.18-1.635-.336-3.026-.223-4.158.08zm13.968.001c-1.132-.303-2.523-.416-4.159-.082-.541.111-.89.639-.779 1.18.112.541.639.89 1.18.779 3.724-.762 5.731 1.405 5.814 1.497.367.407 1 .444 1.41.078.41-.366.451-.991.088-1.404-.075-.084-1.3-1.444-3.554-2.048z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"/><path fill="#664500" d="M17.312 17.612c-.176-.143-.427-.147-.61-.014-.012.009-1.26.902-3.702.902-2.441 0-3.69-.893-3.7-.9-.183-.137-.435-.133-.611.009-.178.142-.238.386-.146.594.06.135 1.5 3.297 4.457 3.297 2.958 0 4.397-3.162 4.457-3.297.092-.207.032-.449-.145-.591zm10 0c-.176-.143-.426-.148-.61-.014-.012.009-1.261.902-3.702.902-2.44 0-3.69-.893-3.7-.9-.183-.137-.434-.133-.611.009-.178.142-.238.386-.146.594.06.135 1.5 3.297 4.457 3.297 2.958 0 4.397-3.162 4.457-3.297.092-.207.032-.449-.145-.591zM22 28h-8c-.552 0-1-.447-1-1s.448-1 1-1h8c.553 0 1 .447 1 1s-.447 1-1 1zM6 14c-.552 0-1-.448-1-1 0-.551.445-.998.996-1 .156-.002 3.569-.086 6.205-3.6.331-.44.957-.532 1.4-.2.442.331.531.958.2 1.4C10.538 13.95 6.184 14 6 14zm24 0c-.184 0-4.537-.05-7.8-4.4-.332-.442-.242-1.069.2-1.4.441-.333 1.067-.242 1.399.2 2.641 3.521 6.061 3.599 6.206 3.6.55.006.994.456.991 1.005-.002.551-.446.995-.996.995z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18"/><ellipse fill="#65471B" cx="11.5" cy="15.5" rx="2.5" ry="3.5"/><ellipse fill="#65471B" cx="24.5" cy="15.5" rx="2.5" ry="3.5"/><path fill="#65471B" d="m11.209 27.978 14-3a1.001 1.001 0 0 0-.419-1.957l-14 3a1.001 1.001 0 0 0 .419 1.957z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"/><ellipse fill="#664500" cx="12" cy="13.5" rx="2.5" ry="3.5"/><ellipse fill="#664500" cx="24" cy="13.5" rx="2.5" ry="3.5"/><path fill="#FFF" d="M25 21c2.209 0 4 1.791 4 4s-1.791 4-4 4H11c-2.209 0-4-1.791-4-4s1.791-4 4-4h14z"/><path fill="#664500" d="M25 20H11c-2.757 0-5 2.243-5 5s2.243 5 5 5h14c2.757 0 5-2.243 5-5s-2.243-5-5-5zm0 2c1.483 0 2.71 1.084 2.949 2.5H24.5V22h.5zm-1.5 0v2.5h-3V22h3zm-4 0v2.5h-3V22h3zm-4 0v2.5h-3V22h3zM11 22h.5v2.5H8.051C8.29 23.084 9.517 22 11 22zm0 6c-1.483 0-2.71-1.084-2.949-2.5H11.5V28H11zm1.5 0v-2.5h3V28h-3zm4 0v-2.5h3V28h-3zm4 0v-2.5h3V28h-3zm4.5 0h-.5v-2.5h3.449C27.71 26.916 26.483 28 25 28z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"/><ellipse fill="#664500" cx="18" cy="27" rx="5" ry="6"/><path fill="#664500" d="M5.999 11c-.208 0-.419-.065-.599-.2-.442-.331-.531-.958-.2-1.4C8.462 5.05 12.816 5 13 5c.552 0 1 .448 1 1 0 .551-.445.998-.996 1-.155.002-3.568.086-6.204 3.6-.196.262-.497.4-.801.4zm24.002 0c-.305 0-.604-.138-.801-.4-2.64-3.521-6.061-3.598-6.206-3.6-.55-.006-.994-.456-.991-1.005C22.006 5.444 22.45 5 23 5c.184 0 4.537.05 7.8 4.4.332.442.242 1.069-.2 1.4-.18.135-.39.2-.599.2zm-16.087 4.5l1.793-1.793c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0L12.5 14.086l-1.793-1.793c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.793 1.793-1.793 1.793c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293s.512-.098.707-.293l1.793-1.793 1.793 1.793c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L13.914 15.5zm11 0l1.793-1.793c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0L23.5 14.086l-1.793-1.793c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.793 1.793-1.793 1.793c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293s.512-.098.707-.293l1.793-1.793 1.793 1.793c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L24.914 15.5z"/>',
		'<circle fill="#FFCC4D" cx="18" cy="18" r="18"/><path fill="#65471B" d="M6.001 11c-.552 0-1-.448-1-1 0-.551.445-.998.996-1 .156-.002 3.569-.086 6.205-3.6.331-.44.957-.532 1.4-.2.442.331.531.958.2 1.4-3.263 4.35-7.617 4.4-7.801 4.4zm24.986 2.393c.128.537-.204 1.077-.741 1.205-.536.128-1.074-.202-1.204-.737-.038-.151-.911-3.452-4.941-5.201-.505-.22-.739-.808-.519-1.315.22-.507.809-.739 1.315-.519 4.989 2.165 6.047 6.388 6.09 6.567z"/><path fill="#664500" d="M23.186 29.526c-.993 0-1.952-.455-2.788-1.339-2.816-2.985-3.569-2.333-4.817-1.251-.781.679-1.754 1.523-3.205 1.523-2.351 0-3.969-2.302-4.036-2.4-.314-.454-.2-1.077.254-1.391.451-.312 1.074-.2 1.39.251.301.429 1.317 1.54 2.393 1.54.704 0 1.256-.479 1.895-1.033 1.816-1.578 3.764-2.655 7.583 1.388.823.873 1.452.774 1.908.592 1.659-.665 3.205-3.698 3.197-5.15-.003-.552.442-1.002.994-1.005h.006c.55 0 .997.444 1 .995.012 2.103-1.854 5.976-4.454 7.017-.443.175-.885.262-1.32.263z"/><path fill="#65471B" d="M14.815 15.375c-.584 2.114-1.642 3.083-3.152 2.666-1.509-.417-2.343-1.909-1.76-4.023.583-2.112 2.175-3.363 3.684-2.946 1.511.417 1.812 2.19 1.228 4.303zm11.416-.755c.473 2.141-.675 4.838-2.204 5.176s-3.28-1.719-3.753-3.86c-.473-2.14.419-3.971 1.948-4.309s3.536.853 4.009 2.993z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"/><path fill="#664500" d="M25.485 29.879C25.44 29.7 24.317 25.5 18 25.5c-6.318 0-7.44 4.2-7.485 4.379-.055.217.043.442.237.554.195.109.439.079.6-.077.019-.019 1.954-1.856 6.648-1.856s6.63 1.837 6.648 1.855c.096.095.224.145.352.145.084 0 .169-.021.246-.064.196-.112.294-.339.239-.557zm-9.778-12.586C12.452 14.038 7.221 14 7 14c-.552 0-.999.447-.999.998-.001.552.446 1 .998 1.002.029 0 1.925.022 3.983.737-.593.64-.982 1.634-.982 2.763 0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-.174-.019-.34-.037-.507.013 0 .025.007.037.007.256 0 .512-.098.707-.293.391-.391.391-1.023 0-1.414zM29 14c-.221 0-5.451.038-8.707 3.293-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293.013 0 .024-.007.036-.007-.016.167-.036.333-.036.507 0 1.934 1.119 3.5 2.5 3.5s2.5-1.566 2.5-3.5c0-1.129-.389-2.123-.982-2.763 2.058-.715 3.954-.737 3.984-.737.551-.002.998-.45.997-1.002-.001-.551-.447-.998-.999-.998z"/>',
		'<path fill="#FFCC4D" d="M36 18c0 9.941-8.059 18-18 18-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18"/><path fill="#664500" d="M25.485 27.879C25.44 27.7 24.317 23.5 18 23.5c-6.318 0-7.44 4.2-7.485 4.379-.055.217.043.442.237.554.195.111.439.078.6-.077.019-.019 1.954-1.856 6.648-1.856s6.63 1.837 6.648 1.855c.096.095.224.145.352.145.084 0 .169-.021.246-.064.196-.112.294-.339.239-.557zM29.001 14c-.305 0-.604-.138-.801-.4-2.432-3.244-6.514-.846-6.686-.743-.475.285-1.089.13-1.372-.343-.284-.474-.131-1.088.343-1.372 1.998-1.199 6.514-2.477 9.314 1.257.332.442.242 1.069-.2 1.4-.179.136-.389.201-.598.201zM6.999 14c-.208 0-.419-.065-.599-.2-.442-.331-.531-.958-.2-1.4 2.801-3.734 7.317-2.456 9.314-1.257.474.284.627.898.343 1.372-.284.473-.896.628-1.37.344-.179-.106-4.274-2.475-6.688.742-.195.261-.496.399-.8.399zM29 16c0-.552-.447-1-1-1h-7c-.553 0-1 .448-1 1s.447 1 1 1h5.092c.207.581.756 1 1.408 1 .828 0 1.5-.671 1.5-1.5 0-.11-.014-.217-.036-.321.012-.06.036-.116.036-.179zm-13 0c0-.552-.448-1-1-1H8c-.552 0-1 .448-1 1s.448 1 1 1h5.092c.207.581.756 1 1.408 1 .828 0 1.5-.671 1.5-1.5 0-.11-.014-.217-.036-.321.011-.06.036-.116.036-.179z"/>'
	];
	let headerLangTime = Date.now() + 10000;
	let headerLangIndex = 1;
	setInterval(() => {
		const lang = `${headerLangs[headerLangIndex]}?`;
		const animDuration = (lang.length + 1) * 80;
		const time = Date.now() - headerLangTime;
		if (time >= 0) {
			headerLang.innerText = lang.substring(0, time / animDuration * (lang.length + 1));
			document.getElementById('header-lang-emoji').innerHTML = headerLangsEmojis[headerLangIndex];
		}
		if (time >= animDuration) {
			headerLangIndex = (headerLangIndex + 1) % headerLangs.length;
			headerLangTime = Date.now() + 6000;
		}
	}, 0);

	const cups = [];
	const bigCup = document.getElementById('landing-first-cup');
	function spawnCup() {
		const cup = document.createElement('img');
		cup.src = '/icon32.png';
		cup.setAttribute('viewBox', '0 0 36 36');
		cup.classList.add('landing-falling-cup');
		cup.style.left = `${Math.random() * 100}%`;
		cup.style.top = '-100%';
		cup.style.transform = `rotate(${Math.random() * 360}deg)`;
		cup.style.width = cup.style.height = `${Math.random() * 32 + 32}px`;
		cup.time = Date.now() + 200;
		cup.innerHTML = bigCup.innerHTML;
		document.body.appendChild(cup);
		cups.push(cup);
	}
	bigCup.onclick = () => {
		for (let i = 0; i < 10; i++) {
			setTimeout(() => { spawnCup(); }, i * 100);
		}
	};
	setInterval(() => {
		const time = Date.now();
		for (let i = 0; i < cups.length; ++i) {
			const cup = cups[i];
			const cupTime = (time - cup.time) * 4;
			if (cupTime >= 2000) {
				cup.remove();
				cups.splice(i, 1);
				continue;
			}
			cup.style.top = `${cupTime / 20}%`;
		}
	}, 0);

	const scrollDown = document.getElementById('landing-scroll-down');
	const scrollTimeout = setTimeout(() => {
		scrollDown.style = '';
	}, 10000);
	scrollDown.onclick = () => {
		document.body.scrollTo({
			top: document.querySelector('.section').clientHeight * 0.9,
			behavior: 'smooth'
		}); 
	};
	document.body.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollDown.style.opacity = '0';
		setTimeout(() => {
			scrollDown.remove();
		}, 200);
	});
}