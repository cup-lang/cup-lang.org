function updateLessonNavigation(lesson, left) {
	while (true) {
		lesson = left ? lesson.previousElementSibling : lesson.nextElementSibling;
		if (!lesson || lesson.hasAttribute('href')) {
			break;
		}
	}
	const button = document.getElementById(left ? 'learn-left' : 'learn-right');
	if (lesson) {
		button.removeAttribute('disabled');
		button.setAttribute('href', lesson.getAttribute('href'));
		return button;
	} else {
		button.setAttribute('disabled', true);
		button.removeAttribute('href');
		return null;
	}
}

function updateLearn (path) {
	localStorage.lesson = path;

	const lesson = document.querySelector(`[href="${path}"]`);
	lesson.classList.add('learn-link-active');

	const left = updateLessonNavigation(lesson, true);
	const right = updateLessonNavigation(lesson, false);

	window.onkeydown = e => {
		if (left && e.keyCode == 37) {
			left.click();
		} else if (right && e.keyCode == 39) {
			right.click();
		}
	};
}

function learnAutorun () {
	for (const header of document.getElementById('learn').querySelectorAll('h2, h3, h4, h5')) {
		const hash = document.createElement('a');
		hash.classList.add('hash-link');
		hash.href = `#${header.id}`;
		hash.innerText = '#';
		header.onmouseenter = () => { header.appendChild(hash); };
		header.onmouseleave = () => { header.removeChild(hash); };
	};

	const guessingGameStart = document.getElementById('guessing-game-start');
	guessingGameStart.onclick = () => {
		guessingGameStart.setAttribute('disabled', true);
		const guessingGameForm = document.getElementById('guessing-game-form');
		const guessingGameInput = document.getElementById('guessing-game-input');
		const guessingGameSubmit = document.getElementById('guessing-game-submit');
		guessingGameForm.style.display = 'none';
		document.getElementById('guessing-game-step3').removeAttribute('current');
		document.getElementById('guessing-game-step5').removeAttribute('current');
		document.getElementById('guessing-game-won').style.display = 'none';
		document.getElementById('guessing-game-step1').setAttribute('current', true);
		const guessingGameRoll = document.getElementById('guessing-game-roll');
		guessingGameRoll.style = '';
		const guessingGameTime = Date.now();
		function rollNumber () {
			const roll = Math.floor(Math.random() * 100) + 1;
			guessingGameRoll.innerText = roll;
			const delta = Date.now() - guessingGameTime;
			if (delta < 6000) {
				setTimeout(rollNumber, delta / 40);
			} else {
				guessingGameRoll.innerText = '???';
				setTimeout(() => {
					document.getElementById('guessing-game-step1').removeAttribute('current');
					document.getElementById('guessing-game-step2').setAttribute('current', true);
					setTimeout(() => {
						guessingGameForm.style = '';
						guessingGameForm.onsubmit = () => {
							guessingGameSubmit.setAttribute('disabled', true);
							const guessingGameHint = document.getElementById('guessing-game-hint');
							guessingGameHint.style.display = 'none';
							document.getElementById('guessing-game-step2').removeAttribute('current');
							document.getElementById('guessing-game-step3').setAttribute('current', true);
							setTimeout(() => {
								if (guessingGameInput.value == roll) {
									document.getElementById('guessing-game-step5').setAttribute('current', true);
									document.getElementById('guessing-game-won').style = '';
									guessingGameStart.removeAttribute('disabled');
								} else {
									document.getElementById('guessing-game-step4').setAttribute('current', true);
									setTimeout(() => {
										guessingGameHint.style = '';
										if (guessingGameInput.value < roll) {
											guessingGameHint.innerText = 'Too low!';
										} else {
											guessingGameHint.innerText = 'Too high!';
										}
										setTimeout(() => {
											document.getElementById('guessing-game-step3').removeAttribute('current');
											document.getElementById('guessing-game-step4').removeAttribute('current');
											document.getElementById('guessing-game-step2').setAttribute('current', true);
											guessingGameSubmit.removeAttribute('disabled');
										}, 2000);
									}, 2000);
								}
							}, 3000);
							return false;
						};
					}, 1000);
				}, 2000);
			}
		}
		rollNumber();
	};
}