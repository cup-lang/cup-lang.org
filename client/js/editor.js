class Editor {
    constructor(parent) {
        const value = parent.innerText;

        this.textarea = document.createElement('textarea');
        this.textarea.classList.add('editor-textarea');
        this.textarea.spellcheck = false;
        this.textarea.addEventListener('input', () => {
            this.update();
        });
        this.textarea.onscroll = () => {
            this.update();
        };
        this.textarea.onkeydown = e => {
            if (e.key == 'Tab') {
                e.preventDefault();
                document.execCommand("insertText", false, '    ');
            }
        };
        parent.appendChild(this.textarea);
        
        this.overlay = document.createElement('code');
        this.overlay.classList.add('editor-overlay');
        this.overlay.ariaHidden = true;
        parent.appendChild(this.overlay);
        
        this.lines = document.createElement('code');
        this.lines.classList.add('editor-lines');
        parent.appendChild(this.lines);

        this.setValue(value);
    }

    setValue(value) {
        this.textarea.value = value;
        this.update();
    }

    addOverlayElement(code, color) {
        const element = document.createElement('span');
        element.innerText = code;
        element.style.color = `#${color}`;
        this.overlay.appendChild(element);
    }

    evalBuffer() {
        if (this.buf.length == 0) {
            return;
        }
        let trim = this.buf.trim();
        if (
            trim == 'if' || trim == 'elif' || trim == 'else' || trim == 'loop' ||
            trim == 'ret' || trim == 'jump' || trim == 'try' || trim == 'def'
        ) {
            this.addOverlayElement(this.buf, Editor.theme.control);
        } else if (trim == 'gen' || trim == 'arg' || trim == 'use' || trim == 'as') {
            this.addOverlayElement(this.buf, Editor.theme.keyword);
        } else if (trim.charCodeAt() >= 48 && trim.charCodeAt() <= 57) {
            let float = false;
            for (let i = 1; i < trim.length; ++i) {
                if (trim[i] == '.') {
                    if (float) {
                        this.overlay.appendChild(document.createTextNode(buf));
                        this.buf = '';
                        return;
                    }
                    float = true;
                } else if (trim.charCodeAt(i) < 48 || trim.charCodeAt(i) > 57) {
                    this.overlay.appendChild(document.createTextNode(buf));
                    this.buf = '';
                    return;
                }
            }
            this.addOverlayElement(this.buf, Editor.theme.number);
        } else if (trim.charCodeAt() >= 65 && trim.charCodeAt() <= 90) {
            this.addOverlayElement(this.buf, Editor.theme.type);
        } else if (trim.charCodeAt() >= 97 && trim.charCodeAt() <= 122) {
            this.addOverlayElement(this.buf, Editor.theme.variable);
        } else {
            this.overlay.appendChild(document.createTextNode(this.buf));
        }
        this.buf = '';
    }

    optionalEqualChar() {
        this.evalBuffer();
        if (this.code[this.index + 1] == '=') {
            this.addOverlayElement(this.code.substring(this.index, ++this.index + 1), Editor.theme.operator);
        } else {
            this.addOverlayElement(this.code.substring(this.index, this.index + 1), Editor.theme.operator);
        }
    }

    highlight(until) {
        function skipUntil(until) {
            while (this.index < this.code.length) {
                if (this.code[this.index] == until) {
                    return;
                }
                ++this.index;
            }
        }

        while (this.index < this.code.length) {
            const char = this.code[this.index];
            if (char == until) {
                break;
            } else if (char == '#') {
                this.evalBuffer();
                let start = this.index++;
                skipUntil('\n');
                ++this.line;
                this.addOverlayElement(this.code.substring(start, this.index + 1), Editor.theme.comment, false);
            } else if (char == '\'') {
                this.evalBuffer();
                let start = this.index++;
                skipUntil('\'');
                this.addOverlayElement(this.code.substring(start, this.index + 1), Editor.theme.string);
            } else if (char == '"') {
                this.evalBuffer();
                let start = this.index++;
                while (this.index < this.code.length) {
                    if (this.code[this.index] == '{') {
                        this.addOverlayElement(this.code.substring(start, this.index), Editor.theme.string);
                        this.addOverlayElement(this.code.substring(this.index, ++this.index), Editor.theme.operator);
                        this.highlight('}');
                        this.addOverlayElement(this.code.substring(this.index, ++this.index), Editor.theme.operator);
                        start = this.index;
                    }
                    if (this.code[this.index] == '"') {
                        break;
                    }
                    ++this.index;
                }
                this.addOverlayElement(this.code.substring(start, this.index + 1), Editor.theme.string);
            } else if (char == '(') {
                this.evalBuffer();
                this.addOverlayElement(this.code.substring(this.index, ++this.index), Editor.theme.operator);
                this.highlight(')');
                this.addOverlayElement(this.code.substring(this.index, this.index + 1), Editor.theme.operator);
            } else if (char == '[') {
                this.evalBuffer();
                this.addOverlayElement(this.code.substring(this.index, ++this.index), Editor.theme.operator);
                this.highlight(']');
                this.addOverlayElement(this.code.substring(this.index, this.index + 1), Editor.theme.operator);
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
                this.addOverlayElement(this.code.substring(this.index, this.index + 1), Editor.theme.operator);
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

    update() {
        this.code = this.textarea.value + ' ';
        
        this.overlay.innerHTML = '';
        this.lines.innerHTML = '';
    
        this.index = 0;
        this.line = 0;
        this.startLine = Math.floor(this.textarea.scrollTop / 18);
        this.endLine = this.startLine + Math.floor(this.textarea.getBoundingClientRect().height / 18);
    
        if (this.startLine != 0) {
            let topLines = 0;
            while (this.index < this.code.length) {
                if (this.code[this.index++] == '\n') {
                    ++topLines;
                    if (++this.line == this.startLine) {
                        break;
                    }
                }
            }
            const offsetTop = document.createElement('div');
            offsetTop.style.height = `${18 * topLines}px`;
            this.overlay.appendChild(offsetTop);
            this.lines.appendChild(offsetTop.cloneNode());
        }
        
        for (let i = 0; i < this.endLine - this.startLine + 10; ++i) {
            const line = document.createElement('div');
            line.innerText = this.startLine + i;
            this.lines.appendChild(line);
        }

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

        this.lines.scrollTop = this.overlay.scrollTop = this.textarea.scrollTop;
        this.overlay.scrollLeft = this.textarea.scrollLeft;

        delete this.code;
    }
}

Editor.theme = {
    comment: '6a9955',
    number: 'b5cea8',
    string: 'ce9178',
    operator: "d4d4d4",
    control: 'c586c0',
    keyword: '569cd6',
    type: '4ec9b0',
    variable: '9cdcfe',
};