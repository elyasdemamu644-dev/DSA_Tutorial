/**
 * Enhanced Code Editor for C++ DSA Academy
 * 
 * Features:
 * - Line numbers
 * - Syntax highlighting for C++
 * - Bracket matching
 * - Auto-indentation
 * - Basic autocomplete for STL types
 * - Error markers (from compiler)
 * - Tab/Shift+Tab handling
 * - Keyboard shortcuts
 */

class CodeEditor {
    constructor(textarea, options = {}) {
        this.textarea = textarea;
        this.options = {
            lineNumbers: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            autoIndent: true,
            autocomplete: true,
            theme: 'dark',
            ...options
        };
        
        // Editor state
        this.lines = [];
        this.cursorPosition = { line: 0, column: 0 };
        this.selection = null;
        this.bracketPairs = { '(': ')', '[': ']', '{': '}', '<': '>' };
        this.bracketPairsReverse = { ')': '(', ']': '[', '}': '{', '>': '<' };
        
        // C++ keywords and types for autocomplete
        this.cppKeywords = [
            'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
            'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t',
            'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'const_cast',
            'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default',
            'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
            'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
            'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
            'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
            'public', 'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return',
            'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast',
            'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local',
            'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union',
            'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while',
            'xor', 'xor_eq', 'override', 'final', 'import', 'module'
        ];
        
        this.cppTypes = [
            'vector', 'map', 'set', 'unordered_map', 'unordered_set', 'string',
            'array', 'deque', 'list', 'forward_list', 'queue', 'priority_queue',
            'stack', 'pair', 'tuple', 'optional', 'variant', 'any', 'string_view',
            'unique_ptr', 'shared_ptr', 'weak_ptr', 'make_unique', 'make_shared',
            'function', 'bind', 'ref', 'cref', 'thread', 'mutex', 'lock_guard',
            'unique_lock', 'condition_variable', 'future', 'promise', 'packaged_task',
            'chrono', 'duration', 'time_point', 'system_clock', 'steady_clock',
            'filesystem', 'path', 'directory_iterator', 'regex', 'smatch', 'sregex_iterator',
            'iostream', 'fstream', 'sstream', 'iomanip', 'algorithm', 'numeric',
            'iterator', 'memory', 'utility', 'functional', 'limits', 'random',
            'cmath', 'cstdlib', 'cstring', 'cassert', 'cstdint', 'cstdio',
            'initializer_list', 'type_traits', 'tuple', 'atomic', 'bitset'
        ];
        
        this.stlMethods = {
            'vector': ['push_back', 'pop_back', 'size', 'empty', 'clear', 'reserve', 'capacity', 'shrink_to_fit', 'at', 'front', 'back', 'data', 'begin', 'end', 'rbegin', 'rend', 'insert', 'erase', 'emplace_back', 'resize', 'swap'],
            'map': ['insert', 'erase', 'find', 'count', 'size', 'empty', 'clear', 'begin', 'end', 'operator[]', 'at', 'lower_bound', 'upper_bound', 'equal_range'],
            'set': ['insert', 'erase', 'find', 'count', 'size', 'empty', 'clear', 'begin', 'end', 'lower_bound', 'upper_bound', 'equal_range'],
            'string': ['size', 'length', 'empty', 'clear', 'push_back', 'pop_back', 'operator+=', 'append', 'substr', 'find', 'rfind', 'find_first_of', 'find_last_of', 'c_str', 'data', 'begin', 'end'],
            'queue': ['push', 'pop', 'front', 'back', 'size', 'empty'],
            'stack': ['push', 'pop', 'top', 'size', 'empty'],
            'priority_queue': ['push', 'pop', 'top', 'size', 'empty'],
            'unique_ptr': ['get', 'release', 'reset', 'operator*', 'operator->', 'operator bool'],
            'shared_ptr': ['get', 'reset', 'use_count', 'unique', 'operator*', 'operator->', 'operator bool'],
            'optional': ['has_value', 'value', 'value_or', 'reset', 'emplace', 'operator*', 'operator->', 'operator bool'],
            'variant': ['index', 'valueless_by_exception', 'emplace', 'operator='],
            'array': ['size', 'empty', 'at', 'front', 'back', 'data', 'begin', 'end', 'fill', 'swap'],
            'deque': ['push_front', 'push_back', 'pop_front', 'pop_back', 'size', 'empty', 'clear', 'at', 'front', 'back', 'begin', 'end'],
            'list': ['push_front', 'push_back', 'pop_front', 'pop_back', 'size', 'empty', 'clear', 'front', 'back', 'begin', 'end', 'insert', 'erase', 'splice', 'remove', 'remove_if', 'unique', 'merge', 'sort', 'reverse']
        };
        
        // Error markers from compiler
        this.errorMarkers = [];
        this.warningMarkers = [];
        
        // Autocomplete state
        this.autocompleteVisible = false;
        this.autocompleteIndex = 0;
        this.autocompleteItems = [];
        this.autocompletePrefix = '';
        
        // Initialize
        this.init();
    }
    
    init() {
        // Store original textarea
        this.originalTextarea = this.textarea;
        this.container = this.textarea.parentElement;
        
        // Create editor wrapper
        this.createEditorStructure();
        
        // Bind events
        this.bindEvents();
        
        // Initial render
        this.updateContent(this.textarea.value);
        this.render();
        
        // Hide original textarea
        this.textarea.style.display = 'none';
    }
    
    createEditorStructure() {
        // Create editor wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'code-editor-wrapper';
        this.wrapper.style.cssText = `
            position: relative;
            display: flex;
            flex: 1;
            background: var(--code-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            overflow: hidden;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        `;
        
        // Create line numbers gutter
        if (this.options.lineNumbers) {
            this.lineNumbers = document.createElement('div');
            this.lineNumbers.className = 'editor-line-numbers';
            this.lineNumbers.style.cssText = `
                padding: 1rem 0.75rem;
                background: rgba(0, 0, 0, 0.2);
                border-right: 1px solid var(--border-color);
                text-align: right;
                user-select: none;
                min-width: 50px;
                color: var(--text-muted);
                font-size: inherit;
                line-height: inherit;
            `;
            this.wrapper.appendChild(this.lineNumbers);
        }
        
        // Create editor content area
        this.editorContent = document.createElement('div');
        this.editorContent.className = 'editor-content';
        this.editorContent.style.cssText = `
            flex: 1;
            position: relative;
            overflow: auto;
            padding: 1rem;
            white-space: pre;
            word-break: break-word;
        `;
        
        // Create hidden textarea for input
        this.inputTextarea = document.createElement('textarea');
        this.inputTextarea.className = 'editor-input';
        this.inputTextarea.spellcheck = false;
        this.inputTextarea.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 1rem;
            border: none;
            background: transparent;
            color: transparent;
            caret-color: var(--code-text);
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            resize: none;
            outline: none;
            z-index: 10;
        `;
        
        // Create highlighted content layer
        this.highlightedContent = document.createElement('pre');
        this.highlightedContent.className = 'editor-highlighted';
        this.highlightedContent.style.cssText = `
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            word-break: break-word;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            color: var(--code-text);
            z-index: 1;
        `;
        
        this.editorContent.appendChild(this.highlightedContent);
        this.editorContent.appendChild(this.inputTextarea);
        this.wrapper.appendChild(this.editorContent);
        
        // Create autocomplete dropdown
        this.autocompleteDropdown = document.createElement('div');
        this.autocompleteDropdown.className = 'editor-autocomplete';
        this.autocompleteDropdown.style.cssText = `
            position: absolute;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            box-shadow: var(--shadow-lg);
            max-height: 200px;
            overflow-y: auto;
            min-width: 200px;
            z-index: 100;
            display: none;
            font-size: 0.85rem;
        `;
        document.body.appendChild(this.autocompleteDropdown);
        
        // Create error tooltip
        this.errorTooltip = document.createElement('div');
        this.errorTooltip.className = 'editor-error-tooltip';
        this.errorTooltip.style.cssText = `
            position: absolute;
            background: var(--accent-color);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            max-width: 300px;
            z-index: 101;
            display: none;
            box-shadow: var(--shadow-md);
        `;
        document.body.appendChild(this.errorTooltip);
        
        // Replace textarea with wrapper
        this.container.insertBefore(this.wrapper, this.textarea);
    }
    
    bindEvents() {
        // Input events
        this.inputTextarea.addEventListener('input', (e) => this.onInput(e));
        this.inputTextarea.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.inputTextarea.addEventListener('keyup', (e) => this.onKeyUp(e));
        this.inputTextarea.addEventListener('click', () => this.updateCursorPosition());
        this.inputTextarea.addEventListener('scroll', () => this.syncScroll());
        
        // Sync scroll between input and highlighted content
        this.inputTextarea.addEventListener('scroll', () => {
            this.highlightedContent.scrollTop = this.inputTextarea.scrollTop;
            this.highlightedContent.scrollLeft = this.inputTextarea.scrollLeft;
            if (this.lineNumbers) {
                this.lineNumbers.scrollTop = this.inputTextarea.scrollTop;
            }
        });
        
        // Autocomplete selection
        this.autocompleteDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                this.selectAutocompleteItem(parseInt(item.dataset.index));
            }
        });
        
        // Mouse events for bracket matching
        this.editorContent.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.editorContent.addEventListener('mouseleave', () => this.clearBracketHighlight());
        
        // Window events for autocomplete positioning
        window.addEventListener('resize', () => this.positionAutocomplete());
        window.addEventListener('scroll', () => this.positionAutocomplete());
        
        // Focus management
        this.inputTextarea.addEventListener('focus', () => {
            this.wrapper.classList.add('focused');
        });
        this.inputTextarea.addEventListener('blur', () => {
            this.wrapper.classList.remove('focused');
            this.hideAutocomplete();
        });
    }
    
    onInput(e) {
        const oldValue = this.getValue();
        const newValue = this.inputTextarea.value;
        
        if (oldValue !== newValue) {
            this.updateContent(newValue);
            this.render();
            this.updateLineNumbers();
            
            // Trigger autocomplete
            if (this.options.autocomplete) {
                this.checkAutocomplete();
            }
            
            // Update original textarea for form submission
            this.textarea.value = newValue;
            
            // Auto-indent on new line
            if (this.options.autoIndent && newValue.length > oldValue.length) {
                const lastChar = newValue[newValue.length - 1];
                if (lastChar === '\n') {
                    this.handleAutoIndent();
                }
            }
        }
    }
    
    onKeyDown(e) {
        // Handle autocomplete navigation
        if (this.autocompleteVisible) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.autocompleteIndex = Math.min(this.autocompleteIndex + 1, this.autocompleteItems.length - 1);
                this.renderAutocomplete();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.autocompleteIndex = Math.max(this.autocompleteIndex - 1, 0);
                this.renderAutocomplete();
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                this.selectAutocompleteItem(this.autocompleteIndex);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.hideAutocomplete();
                return;
            }
        }
        
        // Handle tab indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                this.handleUnindent();
            } else {
                this.handleTab();
            }
            return;
        }
        
        // Handle bracket completion
        if (this.options.bracketMatching && this.bracketPairs[e.key]) {
            e.preventDefault();
            this.handleBracketInsert(e.key);
            return;
        }
        
        // Handle closing bracket overtype
        if (this.options.bracketMatching && this.bracketPairsReverse[e.key]) {
            const cursor = this.getCursorPosition();
            const text = this.getValue();
            const charAfter = text[cursor.position];
            if (charAfter === e.key) {
                e.preventDefault();
                this.moveCursorRight();
                return;
            }
        }
        
        // Handle Enter for auto-indent
        if (e.key === 'Enter' && this.options.autoIndent) {
            this.handleNewLine();
            return;
        }
        
        // Handle Backspace for bracket pair deletion
        if (e.key === 'Backspace' && this.options.bracketMatching) {
            this.handleBackspace();
            return;
        }
        
        // Handle Ctrl+Space for manual autocomplete
        if (e.ctrlKey && e.key === ' ') {
            e.preventDefault();
            this.showAutocomplete();
            return;
        }
        
        // Handle Ctrl+/ for comment toggle
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            this.toggleComment();
            return;
        }
    }
    
    onKeyUp(e) {
        this.updateCursorPosition();
    }
    
    onMouseMove(e) {
        // Could add hover tooltips for errors here
    }
    
    updateContent(value) {
        this.lines = value.split('\n');
    }
    
    getValue() {
        return this.inputTextarea.value;
    }
    
    setValue(value) {
        this.inputTextarea.value = value;
        this.updateContent(value);
        this.render();
        this.updateLineNumbers();
    }
    
    getCursorPosition() {
        const textarea = this.inputTextarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        let line = 0;
        let column = 0;
        let pos = 0;
        
        for (let i = 0; i < value.length && pos < start; i++) {
            if (value[i] === '\n') {
                line++;
                column = 0;
            } else {
                column++;
            }
            pos++;
        }
        
        return {
            start,
            end,
            line,
            column,
            position: start
        };
    }
    
    setCursorPosition(start, end = null) {
        this.inputTextarea.setSelectionRange(start, end !== null ? end : start);
        this.updateCursorPosition();
    }
    
    moveCursorRight() {
        const cursor = this.getCursorPosition();
        this.setCursorPosition(cursor.start + 1);
    }
    
    moveCursorLeft() {
        const cursor = this.getCursorPosition();
        this.setCursorPosition(Math.max(0, cursor.start - 1));
    }
    
    updateCursorPosition() {
        const cursor = this.getCursorPosition();
        this.cursorPosition = { line: cursor.line, column: cursor.column };
        
        // Update bracket matching highlight
        if (this.options.bracketMatching) {
            this.updateBracketHighlight();
        }
        
        // Position autocomplete
        if (this.autocompleteVisible) {
            this.positionAutocomplete();
        }
    }
    
    syncScroll() {
        this.highlightedContent.scrollTop = this.inputTextarea.scrollTop;
        this.highlightedContent.scrollLeft = this.inputTextarea.scrollLeft;
        if (this.lineNumbers) {
            this.lineNumbers.scrollTop = this.inputTextarea.scrollTop;
        }
    }
    
    render() {
        if (!this.options.syntaxHighlighting) {
            this.highlightedContent.textContent = this.getValue();
            return;
        }
        
        const highlighted = this.syntaxHighlight(this.getValue());
        this.highlightedContent.innerHTML = highlighted;
        
        // Render error markers
        this.renderErrorMarkers();
    }
    
    syntaxHighlight(code) {
        // Escape HTML
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        let html = escapeHtml(code);
        
        // Syntax highlighting patterns (order matters)
        const patterns = [
            // Comments (must be first to avoid highlighting inside comments)
            { pattern: /(\/\/.*$)/gm, class: 'cm-comment' },
            { pattern: /(\/\*[\s\S]*?\*\/)/gm, class: 'cm-comment' },
            
            // Strings
            { pattern: /("([^"\\]|\\.)*")/g, class: 'cm-string' },
            { pattern: /('([^'\\]|\\.)*')/g, class: 'cm-string' },
            // Raw string literals handled separately in tokenizeAndHighlight
            
            // Preprocessor directives
            { pattern: /(^\s*#\s*\w.*$)/gm, class: 'cm-preprocessor' },
            
            // Keywords
            { pattern: new RegExp(`\\b(${this.cppKeywords.join('|')})\\b`, 'g'), class: 'cm-keyword' },
            
            // Types (STL containers, etc.)
            { pattern: new RegExp(`\\b(${this.cppTypes.join('|')})\\b`, 'g'), class: 'cm-type' },
            
            // Numbers
            { pattern: /\b(\d+\.?\d*([eE][+-]?\d+)?[fulFL]*)\b/g, class: 'cm-number' },
            
            // Operators
            { pattern: /([+\-*/%=<>!&|^~?:.,;{}()\[\]])/g, class: 'cm-operator' },
            
            // Function calls
            { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/g, class: 'cm-function' },
            
            // Class/namespace names (capitalized)
            { pattern: /\b([A-Z][a-zA-Z0-9_]*)\b/g, class: 'cm-class' },
        ];
        
        // Apply highlighting using a more sophisticated approach
        // We'll do a single pass tokenization
        return this.tokenizeAndHighlight(code);
    }
    
    tokenizeAndHighlight(code) {
        const tokens = this.tokenize(code);
        let html = '';
        
        for (const token of tokens) {
            const escaped = this.escapeHtml(token.value);
            if (token.type) {
                html += `<span class="cm-${token.type}">${escaped}</span>`;
            } else {
                html += escaped;
            }
        }
        
        return html;
    }
    
    tokenize(code) {
        const tokens = [];
        let i = 0;
        
        while (i < code.length) {
            const char = code[i];
            
            // Whitespace
            if (/\s/.test(char)) {
                let j = i;
                while (j < code.length && /\s/.test(code[j])) j++;
                tokens.push({ type: null, value: code.slice(i, j) });
                i = j;
                continue;
            }
            
            // Comments
            if (char === '/' && i + 1 < code.length) {
                if (code[i + 1] === '/') {
                    let j = i;
                    while (j < code.length && code[j] !== '\n') j++;
                    tokens.push({ type: 'comment', value: code.slice(i, j) });
                    i = j;
                    continue;
                }
                if (code[i + 1] === '*') {
                    let j = i + 2;
                    while (j < code.length - 1 && !(code[j] === '*' && code[j + 1] === '/')) j++;
                    j += 2;
                    tokens.push({ type: 'comment', value: code.slice(i, j) });
                    i = j;
                    continue;
                }
            }
            
            // Strings
            if (char === '"' || char === "'") {
                const quote = char;
                let j = i + 1;
                while (j < code.length) {
                    if (code[j] === '\\' && j + 1 < code.length) {
                        j += 2;
                    } else if (code[j] === quote) {
                        j++;
                        break;
                    } else {
                        j++;
                    }
                }
                tokens.push({ type: 'string', value: code.slice(i, j) });
                i = j;
                continue;
            }
            
            // Raw string literals
            if (char === 'R' && i + 1 < code.length && code[i + 1] === '"') {
                let j = i + 2;
                let delimiter = '';
                while (j < code.length && code[j] !== '(') {
                    delimiter += code[j];
                    j++;
                }
                if (j < code.length) j++; // skip (
                const endPattern = `)${delimiter}"`;
                while (j < code.length - endPattern.length + 1) {
                    if (code.slice(j, j + endPattern.length) === endPattern) {
                        j += endPattern.length;
                        break;
                    }
                    j++;
                }
                tokens.push({ type: 'string', value: code.slice(i, j) });
                i = j;
                continue;
            }
            
            // Preprocessor
            if (char === '#' && (i === 0 || code[i - 1] === '\n')) {
                let j = i;
                while (j < code.length && code[j] !== '\n') j++;
                tokens.push({ type: 'preprocessor', value: code.slice(i, j) });
                i = j;
                continue;
            }
            
            // Numbers
            if (/\d/.test(char)) {
                let j = i;
                while (j < code.length && /[\d.eE+-]/.test(code[j])) j++;
                // Handle suffixes
                while (j < code.length && /[fulFL]/.test(code[j])) j++;
                tokens.push({ type: 'number', value: code.slice(i, j) });
                i = j;
                continue;
            }
            
            // Operators and punctuation
            if (/[+\-*/%=<>!&|^~?:.,;{}()\[\]]/.test(char)) {
                // Check for multi-char operators
                const twoChar = code.slice(i, i + 2);
                const operators = ['++', '--', '->', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='];
                if (operators.includes(twoChar)) {
                    tokens.push({ type: 'operator', value: twoChar });
                    i += 2;
                } else {
                    tokens.push({ type: 'operator', value: char });
                    i++;
                }
                continue;
            }
            
            // Identifiers and keywords
            if (/[a-zA-Z_]/.test(char)) {
                let j = i;
                while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
                const word = code.slice(i, j);
                
                // Determine type
                let type = null;
                if (this.cppKeywords.includes(word)) {
                    type = 'keyword';
                } else if (this.cppTypes.includes(word)) {
                    type = 'type';
                } else if (/^[A-Z]/.test(word)) {
                    type = 'class';
                } else if (j < code.length && code[j] === '(') {
                    type = 'function';
                }
                
                tokens.push({ type, value: word });
                i = j;
                continue;
            }
            
            // Unknown character
            tokens.push({ type: null, value: char });
            i++;
        }
        
        return tokens;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateLineNumbers() {
        if (!this.lineNumbers) return;
        
        const lineCount = this.lines.length;
        let html = '';
        for (let i = 1; i <= lineCount; i++) {
            const isCurrent = i === this.cursorPosition.line + 1;
            html += `<div class="line-number${isCurrent ? ' current' : ''}" style="line-height: 1.6;">${i}</div>`;
        }
        this.lineNumbers.innerHTML = html;
    }
    
    // Bracket matching
    updateBracketHighlight() {
        this.clearBracketHighlight();
        
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const pos = cursor.position;
        
        // Check character before cursor
        if (pos > 0) {
            const charBefore = text[pos - 1];
            if (this.bracketPairs[charBefore] || this.bracketPairsReverse[charBefore]) {
                this.highlightMatchingBracket(pos - 1, charBefore);
                return;
            }
        }
        
        // Check character at cursor
        if (pos < text.length) {
            const charAt = text[pos];
            if (this.bracketPairs[charAt] || this.bracketPairsReverse[charAt]) {
                this.highlightMatchingBracket(pos, charAt);
                return;
            }
        }
    }
    
    highlightMatchingBracket(pos, char) {
        const text = this.getValue();
        const matchingChar = this.bracketPairs[char] || this.bracketPairsReverse[char];
        const isOpening = this.bracketPairs[char] !== undefined;
        
        let matchPos = -1;
        let depth = 1;
        
        if (isOpening) {
            // Search forward
            for (let i = pos + 1; i < text.length; i++) {
                if (text[i] === char) depth++;
                else if (text[i] === matchingChar) depth--;
                if (depth === 0) {
                    matchPos = i;
                    break;
                }
            }
        } else {
            // Search backward
            for (let i = pos - 1; i >= 0; i--) {
                if (text[i] === matchingChar) depth++;
                else if (text[i] === char) depth--;
                if (depth === 0) {
                    matchPos = i;
                    break;
                }
            }
        }
        
        if (matchPos !== -1) {
            // Add highlight class to both brackets in highlighted content
            this.addBracketHighlight(pos, matchPos);
        }
    }
    
    addBracketHighlight(pos1, pos2) {
        // This would require modifying the highlighted content
        // For now, we'll use a simpler approach with CSS
        const highlightStyle = document.createElement('style');
        highlightStyle.textContent = `
            .cm-bracket-match {
                background: rgba(52, 152, 219, 0.3) !important;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(highlightStyle);
        
        // We'll need to re-render with special markers
        // For simplicity, just store the positions
        this.matchedBrackets = [pos1, pos2];
    }
    
    clearBracketHighlight() {
        this.matchedBrackets = null;
    }
    
    handleBracketInsert(openingChar) {
        const closingChar = this.bracketPairs[openingChar];
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        // Insert both brackets
        const newText = text.slice(0, cursor.start) + openingChar + closingChar + text.slice(cursor.end);
        this.setValue(newText);
        
        // Position cursor between brackets
        this.setCursorPosition(cursor.start + 1);
    }
    
    handleBackspace() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        // Check if we're between matching brackets
        if (cursor.start > 0 && cursor.start < text.length) {
            const charBefore = text[cursor.start - 1];
            const charAfter = text[cursor.start];
            
            if (this.bracketPairs[charBefore] === charAfter) {
                // Delete both brackets
                const newText = text.slice(0, cursor.start - 1) + text.slice(cursor.start + 1);
                this.setValue(newText);
                this.setCursorPosition(cursor.start - 1);
                return;
            }
        }
        
        // Normal backspace
        if (cursor.start > 0) {
            const newText = text.slice(0, cursor.start - 1) + text.slice(cursor.end);
            this.setValue(newText);
            this.setCursorPosition(cursor.start - 1);
        }
    }
    
    handleNewLine() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const lineStart = text.lastIndexOf('\n', cursor.start - 1) + 1;
        const currentLine = text.slice(lineStart, cursor.start);
        
        // Calculate indent
        let indent = '';
        for (const char of currentLine) {
            if (char === ' ' || char === '\t') indent += char;
            else break;
        }
        
        // Add extra indent if line ends with {
        if (currentLine.trim().endsWith('{')) {
            indent += '    ';
        }
        
        const newText = text.slice(0, cursor.start) + '\n' + indent + text.slice(cursor.end);
        this.setValue(newText);
        this.setCursorPosition(cursor.start + 1 + indent.length);
    }
    
    handleAutoIndent() {
        // Called after newline is inserted
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const lineStart = text.lastIndexOf('\n', cursor.start - 2) + 1;
        const prevLine = text.slice(lineStart, text.indexOf('\n', lineStart));
        
        let indent = '';
        for (const char of prevLine) {
            if (char === ' ' || char === '\t') indent += char;
            else break;
        }
        
        if (indent) {
            const newText = text.slice(0, cursor.start) + indent + text.slice(cursor.start);
            this.setValue(newText);
            this.setCursorPosition(cursor.start + indent.length);
        }
    }
    
    handleTab() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        if (cursor.start === cursor.end) {
            // No selection - insert tab/indent
            const newText = text.slice(0, cursor.start) + '    ' + text.slice(cursor.end);
            this.setValue(newText);
            this.setCursorPosition(cursor.start + 4);
        } else {
            // Selection - indent selected lines
            this.indentSelection();
        }
    }
    
    handleUnindent() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        if (cursor.start === cursor.end) {
            // No selection - unindent current line
            const lineStart = text.lastIndexOf('\n', cursor.start - 1) + 1;
            const lineEnd = text.indexOf('\n', cursor.start);
            const currentLine = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
            
            // Remove 4 spaces or 1 tab
            let newLine = currentLine;
            if (currentLine.startsWith('    ')) {
                newLine = currentLine.slice(4);
            } else if (currentLine.startsWith('\t')) {
                newLine = currentLine.slice(1);
            }
            
            if (newLine !== currentLine) {
                const newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd === -1 ? text.length : lineEnd);
                this.setValue(newText);
                this.setCursorPosition(lineStart);
            }
        } else {
            // Selection - unindent selected lines
            this.unindentSelection();
        }
    }
    
    indentSelection() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const start = cursor.start;
        const end = cursor.end;
        
        const startLine = text.lastIndexOf('\n', start - 1) + 1;
        const endLine = end === text.length ? text.length : text.lastIndexOf('\n', end - 1) + 1;
        
        let newText = text.slice(0, startLine);
        const selectedText = text.slice(startLine, endLine);
        const lines = selectedText.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) newText += '\n';
            newText += '    ' + lines[i];
        }
        
        newText += text.slice(endLine);
        this.setValue(newText);
        
        // Restore selection
        this.setCursorPosition(startLine, startLine + newText.length - (text.length - endLine) - endLine + startLine);
    }
    
    unindentSelection() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const start = cursor.start;
        const end = cursor.end;
        
        const startLine = text.lastIndexOf('\n', start - 1) + 1;
        const endLine = end === text.length ? text.length : text.lastIndexOf('\n', end - 1) + 1;
        
        let newText = text.slice(0, startLine);
        const selectedText = text.slice(startLine, endLine);
        const lines = selectedText.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) newText += '\n';
            let line = lines[i];
            if (line.startsWith('    ')) {
                line = line.slice(4);
            } else if (line.startsWith('\t')) {
                line = line.slice(1);
            }
            newText += line;
        }
        
        newText += text.slice(endLine);
        this.setValue(newText);
        
        this.setCursorPosition(startLine, startLine + newText.length - (text.length - endLine) - endLine + startLine);
    }
    
    toggleComment() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        const start = cursor.start;
        const end = cursor.end;
        
        const startLine = text.lastIndexOf('\n', start - 1) + 1;
        const endLine = end === text.length ? text.length : text.lastIndexOf('\n', end - 1) + 1;
        
        let newText = text.slice(0, startLine);
        const selectedText = text.slice(startLine, endLine);
        const lines = selectedText.split('\n');
        
        // Check if all lines are already commented
        const allCommented = lines.every(line => line.trim().startsWith('//'));
        
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) newText += '\n';
            let line = lines[i];
            if (allCommented) {
                // Uncomment
                line = line.replace(/^(\s*)\/\//, '$1');
            } else {
                // Comment
                line = line.replace(/^(\s*)/, '$1// ');
            }
            newText += line;
        }
        
        newText += text.slice(endLine);
        this.setValue(newText);
    }
    
    // Autocomplete
    checkAutocomplete() {
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        // Get word before cursor
        let wordStart = cursor.start;
        while (wordStart > 0 && /[a-zA-Z0-9_]/.test(text[wordStart - 1])) {
            wordStart--;
        }
        
        const prefix = text.slice(wordStart, cursor.start);
        
        if (prefix.length >= 1) {
            this.autocompletePrefix = prefix;
            this.findAutocompleteItems(prefix, cursor.line);
            if (this.autocompleteItems.length > 0) {
                this.showAutocomplete();
            } else {
                this.hideAutocomplete();
            }
        } else {
            this.hideAutocomplete();
        }
    }
    
    findAutocompleteItems(prefix, lineNumber) {
        const items = [];
        const lowerPrefix = prefix.toLowerCase();
        
        // Add keywords
        for (const kw of this.cppKeywords) {
            if (kw.toLowerCase().startsWith(lowerPrefix)) {
                items.push({ text: kw, type: 'keyword', description: 'Keyword' });
            }
        }
        
        // Add types
        for (const type of this.cppTypes) {
            if (type.toLowerCase().startsWith(lowerPrefix)) {
                items.push({ text: type, type: 'type', description: 'Type' });
            }
        }
        
        // Add context-aware suggestions (methods for known types)
        const lineText = this.lines[lineNumber] || '';
        const typeMatch = lineText.match(/\b(vector|map|set|string|queue|stack|priority_queue|unique_ptr|shared_ptr|optional|variant|array|deque|list)\s*<\s*(\w+)\s*>\s*(\w+)/);
        if (typeMatch) {
            const containerType = typeMatch[1];
            const varName = typeMatch[3];
            const methods = this.stlMethods[containerType] || [];
            for (const method of methods) {
                if (method.toLowerCase().startsWith(lowerPrefix)) {
                    items.push({ text: method, type: 'method', description: `${containerType} method` });
                }
            }
        }
        
        // Sort by relevance
        items.sort((a, b) => {
            const aExact = a.text.toLowerCase() === lowerPrefix;
            const bExact = b.text.toLowerCase() === lowerPrefix;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return a.text.localeCompare(b.text);
        });
        
        this.autocompleteItems = items.slice(0, 20); // Limit to 20 items
        this.autocompleteIndex = 0;
    }
    
    showAutocomplete() {
        if (this.autocompleteItems.length === 0) return;
        
        this.autocompleteVisible = true;
        this.renderAutocomplete();
        this.positionAutocomplete();
        this.autocompleteDropdown.style.display = 'block';
    }
    
    hideAutocomplete() {
        this.autocompleteVisible = false;
        this.autocompleteDropdown.style.display = 'none';
    }
    
    renderAutocomplete() {
        const items = this.autocompleteItems.map((item, index) => {
            const isSelected = index === this.autocompleteIndex;
            const typeIcons = {
                keyword: '🔑',
                type: '📦',
                method: '⚙️',
                function: '🔧',
                variable: '📝'
            };
            return `
                <div class="autocomplete-item${isSelected ? ' selected' : ''}" data-index="${index}" style="
                    padding: 0.4rem 0.75rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    ${isSelected ? 'background: var(--secondary-color); color: white;' : ''}
                ">
                    <span>${typeIcons[item.type] || '•'}</span>
                    <span>${this.escapeHtml(item.text)}</span>
                    <span style="margin-left: auto; font-size: 0.75rem; opacity: 0.7;">${item.description}</span>
                </div>
            `;
        }).join('');
        
        this.autocompleteDropdown.innerHTML = items;
    }
    
    positionAutocomplete() {
        if (!this.autocompleteVisible) return;
        
        const cursor = this.getCursorPosition();
        const textareaRect = this.inputTextarea.getBoundingClientRect();
        const wrapperRect = this.wrapper.getBoundingClientRect();
        
        // Calculate position relative to viewport
        const lineHeight = 22; // approximate line height in pixels
        const charWidth = 9; // approximate character width
        
        const top = textareaRect.top + (cursor.line * lineHeight) + lineHeight + 4;
        const left = textareaRect.left + cursor.column * charWidth;
        
        this.autocompleteDropdown.style.top = `${top}px`;
        this.autocompleteDropdown.style.left = `${left}px`;
    }
    
    selectAutocompleteItem(index) {
        if (index < 0 || index >= this.autocompleteItems.length) return;
        
        const item = this.autocompleteItems[index];
        const cursor = this.getCursorPosition();
        const text = this.getValue();
        
        // Replace prefix with completion
        const start = cursor.start - this.autocompletePrefix.length;
        const newText = text.slice(0, start) + item.text + text.slice(cursor.end);
        
        this.setValue(newText);
        this.setCursorPosition(start + item.text.length);
        this.hideAutocomplete();
        
        // Focus back to editor
        this.inputTextarea.focus();
    }
    
    // Error markers
    setErrorMarkers(errors, warnings = []) {
        this.errorMarkers = errors || [];
        this.warningMarkers = warnings || [];
        this.renderErrorMarkers();
    }
    
    renderErrorMarkers() {
        // Add error markers to line numbers
        if (!this.lineNumbers) return;
        
        const lineElements = this.lineNumbers.querySelectorAll('.line-number');
        lineElements.forEach((el, index) => {
            const lineNum = index + 1;
            el.classList.remove('error', 'warning');
            el.title = '';
            
            const errors = this.errorMarkers.filter(e => e.line === lineNum);
            const warnings = this.warningMarkers.filter(w => w.line === lineNum);
            
            if (errors.length > 0) {
                el.classList.add('error');
                el.title = errors.map(e => e.message).join('\n');
            } else if (warnings.length > 0) {
                el.classList.add('warning');
                el.title = warnings.map(w => w.message).join('\n');
            }
        });
        
        // Add inline error markers in highlighted content
        // This would require more complex DOM manipulation
    }
    
    showErrorTooltip(line, message) {
        this.errorTooltip.textContent = message;
        this.errorTooltip.style.display = 'block';
        // Position near the line number
    }
    
    hideErrorTooltip() {
        this.errorTooltip.style.display = 'none';
    }
    
    // Public API
    focus() {
        this.inputTextarea.focus();
    }
    
    getValue() {
        return this.inputTextarea.value;
    }
    
    setTheme(theme) {
        this.options.theme = theme;
        this.wrapper.className = `code-editor-wrapper theme-${theme}`;
    }
    
    destroy() {
        // Clean up
        this.autocompleteDropdown.remove();
        this.errorTooltip.remove();
        this.wrapper.remove();
        this.textarea.style.display = '';
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CodeEditor };
}