class Editor {
	constructor(parent, value) {
		parent.innerHTML = '';
		this.parent = parent;

		this.textarea = document.createElement('textarea');
		this.textarea.classList.add('editor-textarea');
		this.textarea.spellcheck = false;
		this.textarea.addEventListener('input', e => {
			this.updateHeight();
			this.overlayUpdate();
		});
		this.textarea.onscroll = () => {
			this.overlayUpdate();
		};
		this.textarea.onkeyup =
		this.textarea.onmousedown =
		this.textarea.onmousemove =
		this.textarea.onmouseup =
		this.textarea.ontouchstart =
		this.textarea.ontouchmove =
		this.textarea.ontouchend =
		this.textarea.onblur =
		this.textarea.onselect = () => {
			this.cursorUpdate();
		};
		this.textarea.onkeydown = e => {
			if (e.key == 'Tab') {
				e.preventDefault();
				document.execCommand('insertText', false, '\t');
			}
			this.cursorUpdate();
		};
		this.textarea.value = value;
		this.updateHeight();
		this.parent.appendChild(this.textarea);

		this.overlay = document.createElement('code');
		this.overlay.classList.add('editor-overlay');
		this.overlay.ariaHidden = true;
		this.parent.appendChild(this.overlay);

		this.lines = document.createElement('code');
		this.lines.classList.add('editor-lines');
		this.parent.appendChild(this.lines);

		this.currentLine = document.createElement('div');
		this.currentLine.classList.add('editor-current-line');
		this.parent.appendChild(this.currentLine);
	}

	selectLine(line, single) {
		const lines = this.lines.childNodes;
		for (let i = 1; i < lines.length; ++i) {
			lines[i].style = '';
		}
		if (line != null) {
			line -= this.startLine;
			if (line >= 0 && line + 1 < lines.length) {
				lines[line + 1].style = 'color:var(--color4);font-weight:bold';
			}
		}

		if (line != null && single) {
			this.currentLine.style.display = '';
			this.currentLine.style.top = `${(line + this.startLine) * 18 - this.textarea.scrollTop + 3}px`;
		} else {
			this.currentLine.style.display = 'none';
		}
	}

	cursorUpdate() {
		if (this.textarea != document.activeElement) {
			this.selectLine();
		} else {
			let start = this.textarea.selectionStart;
			let end = this.textarea.selectionEnd;
			let caret = start;

			if (this.textarea.selectionDirection == 'backward') {
				caret = start;
			}

			const code = this.textarea.value;
			let line = 0;
			for (let i = 0; i < caret; ++i) {
				if (code[i] == '\n') {
					++line;
				}
			}
			this.selectLine(line, start == end);
		}
	}

	addOverlayElement(code, color) {
		const element = document.createElement('span');
		element.innerText = code;
		element.style.color = `var(--${color})`;
		this.overlay.appendChild(element);
	}

	evalBuffer() {
		if (this.buf.length == 0) {
			return;
		}
		let trim = this.buf.trim();
		if (trim.charCodeAt() >= 48 && trim.charCodeAt() <= 57) {
			let float = false;
			for (let i = 1; i < trim.length; ++i) {
				if (trim[i] == '.') {
					if (float) {
						this.overlay.appendChild(document.createTextNode(this.buf));
						this.buf = '';
						return;
					}
					float = true;
				} else if (trim.charCodeAt(i) < 48 || trim.charCodeAt(i) > 57) {
					this.overlay.appendChild(document.createTextNode(this.buf));
					this.buf = '';
					return;
				}
			}
			this.addOverlayElement(this.buf, 'number');
		} else if (trim.charCodeAt() >= 65 && trim.charCodeAt() <= 90) {
			this.addOverlayElement(this.buf, 'type');
		} else if (trim.charCodeAt() >= 97 && trim.charCodeAt() <= 122) {
			this.addOverlayElement(this.buf, 'object');
		} else {
			this.overlay.appendChild(document.createTextNode(this.buf));
		}
		this.buf = '';
	}

	optionalEqualChar() {
		this.evalBuffer();
		if (this.code[this.index + 1] == '=') {
			this.addOverlayElement(this.code.substring(this.index, ++this.index + 1), 'symbol');
		} else {
			this.addOverlayElement(this.code.substring(this.index, this.index + 1), 'symbol');
		}
	}

	skipUntil(until) {
		while (this.index < this.code.length) {
			if (this.code[this.index] == until) {
				if (until == '\n') {
					++this.line;
				}
				return;
			}
			++this.index;
		}
	}

	highlight(until) {
		while (this.index < this.code.length) {
			const char = this.code[this.index];
			if (char == until) {
				break;
			} else if (char == '>') {
				this.evalBuffer();
				let start = this.index++;
				this.skipUntil('\n');
				this.addOverlayElement(this.code.substring(start, this.index + 1), 'comment', false);
			} else if (char == '\'') {
				this.evalBuffer();
				let start = this.index++;
				this.skipUntil('\'');
				this.addOverlayElement(this.code.substring(start, this.index + 1), 'text');
			} else if (char == '"') {
				this.evalBuffer();
				let start = this.index++;
				while (this.index < this.code.length) {
					if (this.code[this.index] == '{') {
						this.addOverlayElement(this.code.substring(start, this.index), 'text');
						this.addOverlayElement(this.code.substring(this.index, ++this.index), 'symbol');
						this.highlight('}');
						this.addOverlayElement(this.code.substring(this.index, ++this.index), 'symbol');
						start = this.index;
					}
					if (this.code[this.index] == '"') {
						break;
					}
					++this.index;
				}
				this.addOverlayElement(this.code.substring(start, this.index + 1), 'text');
			} else if (char == '(') {
				this.evalBuffer();
				this.addOverlayElement(this.code.substring(this.index, ++this.index), 'symbol');
				this.highlight(')');
				this.addOverlayElement(this.code.substring(this.index, this.index + 1), 'symbol');
			} else if (char == '[') {
				this.evalBuffer();
				this.addOverlayElement(this.code.substring(this.index, ++this.index), 'symbol');
				this.highlight(']');
				this.addOverlayElement(this.code.substring(this.index, this.index + 1), 'symbol');
			} else if (
				char == '=' || char == '!' || char == '<' || char == '>' ||
				char == '%' || char == '+' || char == '-' || char == '*' ||
				char == '/'
			) {
				this.optionalEqualChar();
			} else if (
				char == '^' || char == '&' || char == ',' || char == ';' ||
				char == ':' || char == '$' || char == '`' || char == '@' ||
				char == '_' || char == '|' || char == '~'
			) {
				this.evalBuffer();
				this.addOverlayElement(this.code.substring(this.index, this.index + 1), 'symbol');
			} else {
				if (char == '\n') {
					++this.line;
					this.evalBuffer();
				} else if (char == ' ') {
					this.evalBuffer();
				}
				this.buf += char;
			}

			if (this.line > this.endLine) {
				break;
			}

			++this.index;
		}

		this.evalBuffer();
	}

	updateHeight() {
		let height = 1;
		for (let i = 0; i < this.textarea.value.length; ++i) {
			if (this.textarea.value[i] === '\n') {
				++height;
			}
		}
		this.parent.style.height = `${6 + 18 * height}px`;
	}

	overlayUpdate() {
		this.code = `${this.textarea.value} `;

		this.overlay.innerHTML = '';
		this.lines.innerHTML = '';

		this.index = 0;
		this.line = 0;
		this.startLine = Math.floor(this.textarea.scrollTop / 18);
		this.endLine = this.startLine + Math.floor(this.textarea.getBoundingClientRect().height / 18);

		let topLines = 0;
		if (this.startLine != 0) {
			while (this.index < this.code.length) {
				if (this.code[this.index++] == '\n') {
					++topLines;
					if (++this.line == this.startLine) {
						break;
					}
				}
			}
		}
		const offsetTop = document.createElement('div');
		offsetTop.style.height = `${18 * topLines}px`;
		this.overlay.appendChild(offsetTop);
		this.lines.appendChild(offsetTop.cloneNode());

		this.buf = '';
		this.highlight();

		let bottomLines = 0;
		while (this.index < this.code.length) {
			if (this.code[this.index++] == '\n') {
				++bottomLines;
			}
		}
		const offsetBottom = document.createElement('div');
		offsetBottom.style.height = `${18 * bottomLines}px`;
		this.overlay.appendChild(offsetBottom);

		for (let i = 0; i < this.line - this.startLine + 1; ++i) {
			const line = document.createElement('div');
			line.innerText = this.startLine + i + 1;
			this.lines.appendChild(line);
		}

		this.lines.scrollTop = this.overlay.scrollTop = this.textarea.scrollTop;
		this.overlay.scrollLeft = this.textarea.scrollLeft;

		this.cursorUpdate();

		delete this.code;
	}
}