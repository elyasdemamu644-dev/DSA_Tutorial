// Main JavaScript for C++ DSA Academy
// Modular architecture with curriculum integration

// ============================================================
// APPLICATION STATE MANAGEMENT
// ============================================================
const AppState = {
    currentTopic: null,
    currentModule: null,
    currentLesson: null,
    progress: {},
    notes: {},
    bookmarks: {},
    
    init() {
        this.loadProgress();
        this.loadNotes();
        this.loadBookmarks();
    },
    
    loadProgress() {
        const saved = localStorage.getItem('dsa_progress');
        if (saved) {
            this.progress = JSON.parse(saved);
        }
    },
    
    saveProgress() {
        localStorage.setItem('dsa_progress', JSON.stringify(this.progress));
    },
    
    markLessonComplete(topicId, moduleId, lessonId) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        this.progress[key] = {
            completed: true,
            completedAt: new Date().toISOString(),
            topicId, moduleId, lessonId
        };
        this.saveProgress();
    },
    
    isLessonComplete(topicId, moduleId, lessonId) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        return this.progress[key]?.completed === true;
    },
    
    getTopicProgress(topicId) {
        const topic = CURRICULUM[topicId];
        if (!topic) return { completed: 0, total: 0 };
        
        let completed = 0, total = 0;
        topic.modules.forEach(module => {
            module.lessons.forEach(lesson => {
                total++;
                if (this.isLessonComplete(topicId, module.id, lesson.id)) completed++;
            });
        });
        return { completed, total, percentage: total > 0 ? Math.round(completed/total*100) : 0 };
    },
    
    loadNotes() {
        const saved = localStorage.getItem('dsa_notes');
        if (saved) this.notes = JSON.parse(saved);
    },
    
    saveNote(topicId, moduleId, lessonId, content) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        this.notes[key] = content;
        localStorage.setItem('dsa_notes', JSON.stringify(this.notes));
    },
    
    getNote(topicId, moduleId, lessonId) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        return this.notes[key] || '';
    },
    
    loadBookmarks() {
        const saved = localStorage.getItem('dsa_bookmarks');
        if (saved) this.bookmarks = JSON.parse(saved);
    },
    
    toggleBookmark(topicId, moduleId, lessonId) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        if (this.bookmarks[key]) {
            delete this.bookmarks[key];
        } else {
            this.bookmarks[key] = {
                topicId, moduleId, lessonId,
                timestamp: new Date().toISOString()
            };
        }
        localStorage.setItem('dsa_bookmarks', JSON.stringify(this.bookmarks));
    },
    
    isBookmarked(topicId, moduleId, lessonId) {
        const key = `${topicId}:${moduleId}:${lessonId}`;
        return !!this.bookmarks[key];
    }
};

// ============================================================
// CURRICULUM NAVIGATION RENDERER
// ============================================================
const CurriculumRenderer = {
    renderTopicList() {
        const levels = {
            1: { title: 'Level 1: Foundations', topics: [] },
            2: { title: 'Level 2: Intermediate', topics: [] },
            3: { title: 'Level 3: Advanced', topics: [] }
        };
        
        Object.values(CURRICULUM).forEach(topic => {
            if (levels[topic.level]) {
                levels[topic.level].topics.push(topic);
            }
        });
        
        // Sort topics by order within each level
        Object.values(levels).forEach(level => {
            level.topics.sort((a, b) => a.order - b.order);
        });
        
        let html = '';
        Object.values(levels).forEach(level => {
            if (level.topics.length === 0) return;
            html += `<li class="nav-section"><strong>${level.title}</strong></li>`;
            level.topics.forEach(topic => {
                const progress = AppState.getTopicProgress(topic.id);
                const progressBar = progress.total > 0 
                    ? `<span class="progress-indicator" style="width:${progress.percentage}%"></span>`
                    : '';
                html += `
                    <li>
                        <a href="#topic/${topic.id}" data-topic="${topic.id}">
                            ${topic.title}
                            ${progressBar}
                        </a>
                    </li>`;
            });
        });
        return html;
    },
    
    renderTopicContent(topicId) {
        const topic = CURRICULUM[topicId];
        if (!topic) {
            return `<div class="error">Topic "${topicId}" not found</div>`;
        }
        
        AppState.currentTopic = topicId;
        
        let html = `
            <header class="topic-header">
                <h2>${topic.title}</h2>
                <p class="topic-description">${topic.description}</p>
                <div class="topic-meta">
                    <span>⏱ ${topic.estimatedHours}h estimated</span>
                    <span>Level ${topic.level}</span>
                </div>
            </header>
            <div class="modules-list">`;
        
        topic.modules.forEach(module => {
            const moduleProgress = this.getModuleProgress(topicId, module.id);
            html += `
                <section class="module" data-module="${module.id}">
                    <header class="module-header">
                        <h3>${module.title}</h3>
                        <span class="module-progress">${moduleProgress.completed}/${moduleProgress.total} lessons</span>
                    </header>
                    <ul class="lessons-list">`;
            
            module.lessons.forEach(lesson => {
                const isComplete = AppState.isLessonComplete(topicId, module.id, lesson.id);
                const isBookmarked = AppState.isBookmarked(topicId, module.id, lesson.id);
                html += `
                    <li class="lesson-item ${isComplete ? 'completed' : ''}" 
                        data-lesson="${lesson.id}"
                        data-module="${module.id}">
                        <span class="lesson-status">
                            ${isComplete ? '✓' : '○'}
                        </span>
                        <a href="#" class="lesson-link" 
                           data-topic="${topicId}"
                           data-module="${module.id}"
                           data-lesson="${lesson.id}">
                            ${lesson.title}
                        </a>
                        <button class="bookmark-btn ${isBookmarked ? 'active' : ''}"
                                data-topic="${topicId}"
                                data-module="${module.id}"
                                data-lesson="${lesson.id}"
                                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}">
                            ★
                        </button>
                    </li>`;
            });
            
            html += `
                    </ul>
                </section>`;
        });
        
        html += `</div>`;
        return html;
    },
    
    getModuleProgress(topicId, moduleId) {
        const topic = CURRICULUM[topicId];
        if (!topic) return { completed: 0, total: 0 };
        
        const module = topic.modules.find(m => m.id === moduleId);
        if (!module) return { completed: 0, total: 0 };
        
        let completed = 0;
        module.lessons.forEach(lesson => {
            if (AppState.isLessonComplete(topicId, moduleId, lesson.id)) completed++;
        });
        return { completed, total: module.lessons.length };
    },
    
    renderLesson(topicId, moduleId, lessonId) {
        const topic = CURRICULUM[topicId];
        if (!topic) return '<div class="error">Topic not found</div>';
        
        const module = topic.modules.find(m => m.id === moduleId);
        if (!module) return '<div class="error">Module not found</div>';
        
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (!lesson) return '<div class="error">Lesson not found</div>';
        
        AppState.currentModule = moduleId;
        AppState.currentLesson = lessonId;
        
        const isComplete = AppState.isLessonComplete(topicId, moduleId, lessonId);
        const note = AppState.getNote(topicId, moduleId, lessonId);
        
        let html = `
            <header class="lesson-header">
                <nav class="lesson-breadcrumb">
                    <a href="#${topicId}">${topic.title}</a>
                    <span>›</span>
                    <a href="#${topicId}:${moduleId}">${module.title}</a>
                    <span>›</span>
                    <span>${lesson.title}</span>
                </nav>
                <div class="lesson-actions">
                    <button class="btn ${isComplete ? 'completed' : ''}" 
                            id="complete-btn"
                            data-topic="${topicId}"
                            data-module="${moduleId}"
                            data-lesson="${lessonId}">
                        ${isComplete ? '✓ Completed' : 'Mark Complete'}
                    </button>
                    <button class="btn" id="notes-btn" title="Notes">📝</button>
                </div>
            </header>
            
            <article class="lesson-content">`;
        
        // Learning Objectives
        if (lesson.objectives && lesson.objectives.length > 0) {
            html += `
                <section class="objectives">
                    <h3>🎯 Learning Objectives</h3>
                    <ul>`;
            lesson.objectives.forEach(obj => {
                html += `<li>${obj}</li>`;
            });
            html += `</ul></section>`;
        }
        
        // Main Content
        html += `<section class="content">${lesson.content}</section>`;
        
        // Code Examples
        if (lesson.codeExamples && lesson.codeExamples.length > 0) {
            html += `<section class="code-examples">`;
            lesson.codeExamples.forEach((ex, idx) => {
                html += `
                    <div class="code-block">
                        <div class="code-header">
                            <span>${ex.title || 'Code Example'}</span>
                            <span class="language">${ex.language}</span>
                            <button class="copy-btn" data-code="${idx}">Copy</button>
                        </div>
                        <pre><code class="language-${ex.language}">${this.escapeHtml(ex.code)}</code></pre>
                    </div>`;
            });
            html += `</section>`;
        }
        
        // Exercises
        if (lesson.exercises && lesson.exercises.length > 0) {
            html += `<section class="exercises">`;
            lesson.exercises.forEach((ex, idx) => {
                html += this.renderExercise(ex, idx, lessonId);
            });
            html += `</section>`;
        }
        
        // Quiz Questions
        if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
            html += `<section class="quiz-section">
                <h3>🧠 Quick Check</h3>
                <form class="quiz-form" id="quiz-form">`;
            lesson.quizQuestions.forEach((q, idx) => {
                html += this.renderQuizQuestion(q, idx);
            });
            html += `
                    <button type="submit" class="btn primary">Submit Answers</button>
                </form>
                <div class="quiz-results" id="quiz-results" style="display:none;"></div>
            </section>`;
        }
        
        // Navigation
        html += this.renderLessonNavigation(topicId, moduleId, lessonId);
        
        // Notes Section
        html += `
            <section class="notes-section" id="notes-section" style="display:none;">
                <h3>📝 Your Notes</h3>
                <textarea id="notes-textarea" placeholder="Write your notes here...">${this.escapeHtml(note)}</textarea>
                <button class="btn" id="save-notes-btn"
                        data-topic="${topicId}"
                        data-module="${moduleId}"
                        data-lesson="${lessonId}">Save Notes</button>
            </section>`;
        
        html += `</article>`;
        return html;
    },
    
    renderExercise(ex, idx, lessonId) {
        const lessonKey = `${lessonId}:${idx}`;
        const solution = (typeof EXERCISE_SOLUTIONS !== 'undefined' && EXERCISE_SOLUTIONS[lessonKey]) || null;
        if (ex.type === 'mcq') {
            let html = `
                <div class="exercise mcq" data-idx="${idx}">
                    <h4>Exercise ${idx + 1}: ${ex.question}</h4>
                    <ul class="options">`;
            ex.options.forEach((opt, i) => {
                html += `<li>
                    <label>
                        <input type="radio" name="ex-${idx}" value="${i}">
                        ${opt}
                    </label>
                </li>`;
            });
            html += `</ul>
                    <button class="check-btn" data-idx="${idx}" data-correct="${ex.correct}">Check Answer</button>
                    <div class="explanation" style="display:none;">${ex.explanation || ''}</div>
                </div>`;
            return html;
        } else if (ex.type === 'code-trace') {
            return `
                <div class="exercise code-trace" data-idx="${idx}">
                    <h4>Exercise ${idx + 1}: Code Trace</h4>
                    <p>${ex.question || ''}</p>
                    <pre><code>${this.escapeHtml(ex.code || '')}</code></pre>
                    <textarea placeholder="Trace the output..."></textarea>
                    ${solution
                        ? `<button class="reveal-btn" data-idx="${idx}">Reveal worked answer</button>
                           <div class="explanation exercise-solution" style="display:none;">${this.escapeHtml(solution)}</div>`
                        : '<p class="exercise-note">Work out the trace by hand. A worked answer will appear here once one is added.</p>'}
                </div>`;
        } else if (ex.type === 'code-complete') {
            return `
                <div class="exercise code-complete" data-idx="${idx}">
                    <h4>Exercise ${idx + 1}: Code Complete</h4>
                    <p>${ex.question || ''}</p>
                    <pre><code class="language-cpp">${this.escapeHtml(ex.code || '')}</code></pre>
                    <textarea spellcheck="false" placeholder="Complete the implementation..."></textarea>
                    ${solution
                        ? `<button class="reveal-btn" data-idx="${idx}">Reveal worked solution</button>
                           <div class="explanation exercise-solution" style="display:none;"><pre><code class="language-cpp">${this.escapeHtml(solution)}</code></pre></div>`
                        : '<p class="exercise-note">Complete the function. A worked solution will appear here once one is added.</p>'}
                </div>`;
        }
        return '';
    },
    
    renderQuizQuestion(q, idx) {
        if (q.type === 'mcq') {
            let html = `<div class="quiz-question mcq" data-id="${q.id}" data-correct="${q.correct}">
                <p><strong>Q${idx + 1}.</strong> ${q.question}</p>
                <ul class="options">`;
            q.options.forEach((opt, i) => {
                html += `<li>
                    <label>
                        <input type="radio" name="quiz-${q.id}" value="${i}">
                        ${opt}
                    </label>
                </li>`;
            });
            return html + `</ul></div>`;
        } else if (q.type === 'true-false') {
            return `<div class="quiz-question true-false" data-id="${q.id}" data-correct="${q.correct}">
                <p><strong>Q${idx + 1}.</strong> ${q.question}</p>
                <label><input type="radio" name="quiz-${q.id}" value="true"> True</label>
                <label><input type="radio" name="quiz-${q.id}" value="false"> False</label>
            </div>`;
        }
        return '';
    },
    
    renderLessonNavigation(topicId, moduleId, lessonId) {
        const topic = CURRICULUM[topicId];
        let prevLesson = null, nextLesson = null;
        let found = false;
        
        topic.modules.forEach(module => {
            module.lessons.forEach(lesson => {
                if (found && !nextLesson) {
                    nextLesson = { moduleId: module.id, lessonId: lesson.id };
                }
                if (module.id === moduleId && lesson.id === lessonId) {
                    found = true;
                } else if (!found) {
                    prevLesson = { moduleId: module.id, lessonId: lesson.id };
                }
            });
        });
        
        return `
            <nav class="lesson-nav">
                ${prevLesson ? `
                    <a href="#${topicId}:${prevLesson.moduleId}:${prevLesson.lessonId}" class="btn prev">
                        ← Previous: ${this.getLessonTitle(topicId, prevLesson.moduleId, prevLesson.lessonId)}
                    </a>` : '<span class="btn disabled">← Previous</span>'}
                ${nextLesson ? `
                    <a href="#${topicId}:${nextLesson.moduleId}:${nextLesson.lessonId}" class="btn next">
                        Next: ${this.getLessonTitle(topicId, nextLesson.moduleId, nextLesson.lessonId)} →
                    </a>` : '<span class="btn disabled">Next →</span>'}
            </nav>`;
    },
    
    getLessonTitle(topicId, moduleId, lessonId) {
        const topic = CURRICULUM[topicId];
        if (!topic) return '';
        const module = topic.modules.find(m => m.id === moduleId);
        if (!module) return '';
        const lesson = module.lessons.find(l => l.id === lessonId);
        return lesson ? lesson.title : '';
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ============================================================
// ROUTER
// ============================================================
const Router = {
    routes: {
        '': 'home',
        'topic/:topicId': 'topic',
        'topic/:topicId/module/:moduleId': 'topic-module',
        'topic/:topicId/module/:moduleId/lesson/:lessonId': 'lesson',
        'dashboard': 'dashboard',
        'visualizers': 'visualizers',
        'visualizers/sorting': 'sortingVisualizer',
        'visualizers/tree-graph': 'treeGraphVisualizer',
        'code-lab': 'codeLab',
        'notes': 'notes',
        'bookmarks': 'bookmarks',
        'assessments': 'assessments',
        'chapters': 'chapters',
        'chapters/:chapterId': 'chapter',
        'chapters/:chapterId/:sectionId': 'chapter-section',
        'settings': 'settings'
    },
    
    parseHash() {
        const hash = window.location.hash.slice(1) || '';
        const parts = hash.split('/');
        const routeKey = parts.map(p => p.startsWith(':') ? p : p).join('/');
        return { hash, parts, routeKey };
    },
    
    navigate() {
        const { hash, parts } = this.parseHash();
        
        if (!hash || hash === 'dashboard') {
            this.showDashboard();
        } else if (parts[0] === 'topic' && parts.length === 2) {
            this.showTopic(parts[1]);
        } else if (parts[0] === 'topic' && parts.length === 4) {
            this.showTopicModule(parts[1], parts[3]);
        } else if (parts[0] === 'topic' && parts.length === 6) {
            this.showLesson(parts[1], parts[3], parts[5]);
        } else if (hash === 'visualizers') {
            this.showVisualizers();
        } else if (hash === 'visualizers/sorting') {
            this.showSortingVisualizer();
        } else if (hash === 'visualizers/tree-graph') {
            this.showTreeGraphVisualizer();
        } else if (hash === 'code-lab') {
            this.showCodeLab();
        } else if (hash === 'notes') {
            this.showNotes();
        } else if (hash === 'bookmarks') {
            this.showBookmarks();
        } else if (hash === 'assessments') {
            this.showAssessments();
        } else if (parts[0] === 'chapters') {
            this.showChapters(parts);
        } else if (hash === 'settings') {
            this.showSettings();
        } else {
            this.showDashboard();
        }
        
        this.updateActiveNav(hash);
    },
    
    showDashboard() {
        document.getElementById('content-area').innerHTML = DashboardRenderer.render();
        this.initDashboardCharts();
    },
    
    showTopic(topicId) {
        document.getElementById('content-area').innerHTML = CurriculumRenderer.renderTopicContent(topicId);
        this.bindTopicEvents();
    },
    
    showTopicModule(topicId, moduleId) {
        // Redirect to first lesson of module
        const topic = CURRICULUM[topicId];
        const module = topic?.modules.find(m => m.id === moduleId);
        if (module && module.lessons.length > 0) {
            window.location.hash = `topic/${topicId}/module/${moduleId}/lesson/${module.lessons[0].id}`;
        }
    },
    
    showLesson(topicId, moduleId, lessonId) {
        document.getElementById('content-area').innerHTML = CurriculumRenderer.renderLesson(topicId, moduleId, lessonId);
        this.bindLessonEvents();
        this.initCodeHighlighting();
    },
    
    showVisualizers() {
        document.getElementById('content-area').innerHTML = VisualizerRenderer.render();
        VisualizerRenderer.init();
    },
    
    showSortingVisualizer() {
        document.getElementById('content-area').innerHTML = SortingVisualizerRenderer.render();
        SortingVisualizerRenderer.init();
    },
    
    showTreeGraphVisualizer() {
        document.getElementById('content-area').innerHTML = TreeGraphRenderer.render();
        TreeGraphRenderer.init();
    },
    
    showCodeLab() {
        document.getElementById('content-area').innerHTML = CodeLabRenderer.render();
        CodeLabRenderer.init();
    },
    
    showNotes() {
        document.getElementById('content-area').innerHTML = NotesRenderer.render();
    },
    
    showBookmarks() {
        document.getElementById('content-area').innerHTML = BookmarksRenderer.render();
    },
    
    showAssessments() {
        document.getElementById('content-area').innerHTML = AssessmentsRenderer.render();
    },
    
    showChapters(parts = []) {
        const area = document.getElementById('content-area');
        if (!window.CourseChapters) {
            area.innerHTML = `
                <header class="page-header">
                    <h2>📖 Course Chapters</h2>
                    <p>The chapter module did not load. Refresh the page to try again.</p>
                </header>`;
            return;
        }
        const chapterId = parts[1] || null;
        const sectionId = parts[2] || null;
        area.innerHTML = CourseChapters.renderRoute(chapterId, sectionId);
        CourseChapters.init(sectionId);
    },
    
    showSettings() {
        document.getElementById('content-area').innerHTML = SettingsRenderer.render();
        SettingsRenderer.init();
    },
    
    updateActiveNav(currentHash) {
        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            const href = a.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = href.slice(1);
            const isActive = target === currentHash
                || (target === 'chapters' && currentHash.startsWith('chapters/'));
            if (isActive) {
                a.classList.add('active');
            }
        });
    },
    
    bindTopicEvents() {
        document.querySelectorAll('.lesson-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const topicId = link.dataset.topic;
                const moduleId = link.dataset.module;
                const lessonId = link.dataset.lesson;
                window.location.hash = `topic/${topicId}/module/${moduleId}/lesson/${lessonId}`;
            });
        });
        
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const topicId = btn.dataset.topic;
                const moduleId = btn.dataset.module;
                const lessonId = btn.dataset.lesson;
                AppState.toggleBookmark(topicId, moduleId, lessonId);
                btn.classList.toggle('active');
            });
        });
    },
    
    bindLessonEvents() {
        // Complete button
        document.getElementById('complete-btn')?.addEventListener('click', (e) => {
            const topicId = e.target.dataset.topic;
            const moduleId = e.target.dataset.module;
            const lessonId = e.target.dataset.lesson;
            AppState.markLessonComplete(topicId, moduleId, lessonId);
            e.target.textContent = '✓ Completed';
            e.target.classList.add('completed');
            // Update navigation
            Router.navigate();
        });
        
        // Notes button
        document.getElementById('notes-btn')?.addEventListener('click', () => {
            document.getElementById('notes-section').style.display = 'block';
        });
        
        // Save notes
        document.getElementById('save-notes-btn')?.addEventListener('click', (e) => {
            const topicId = e.target.dataset.topic;
            const moduleId = e.target.dataset.module;
            const lessonId = e.target.dataset.lesson;
            const content = document.getElementById('notes-textarea').value;
            AppState.saveNote(topicId, moduleId, lessonId, content);
            alert('Notes saved!');
        });
        
        // Exercise reveal buttons
        document.querySelectorAll('.reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.exercise')?.querySelector('.exercise-solution');
                if (!box) return;
                const showing = box.style.display !== 'none';
                box.style.display = showing ? 'none' : 'block';
                btn.textContent = showing ? 'Reveal worked answer' : 'Hide worked answer';
            });
        });
        
        // Quiz form
        document.getElementById('quiz-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.gradeQuiz(e.target);
        });
        
        // Exercise check buttons
        document.querySelectorAll('.check-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.idx;
                const correct = parseInt(btn.dataset.correct);
                const selected = document.querySelector(`input[name="ex-${idx}"]:checked`);
                const explanation = btn.closest('.exercise').querySelector('.explanation');
                
                if (selected) {
                    const isCorrect = parseInt(selected.value) === correct;
                    btn.textContent = isCorrect ? '✓ Correct!' : '✗ Try again';
                    btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                    if (explanation) {
                        explanation.style.display = 'block';
                    }
                }
            });
        });
    },
    
    gradeQuiz(form) {
        const questions = form.querySelectorAll('.quiz-question');
        let correct = 0;
        let total = questions.length;

        questions.forEach(q => {
            const qId = q.dataset.id;
            const selected = form.querySelector(`input[name="quiz-${qId}"]:checked`);
            if (!selected) return;
            let isCorrect = false;
            if (q.classList.contains('true-false')) {
                isCorrect = selected.value === q.dataset.correct;
            } else if (q.classList.contains('mcq')) {
                isCorrect = parseInt(selected.value, 10) === parseInt(q.dataset.correct, 10);
            }
            if (isCorrect) correct++;
            q.classList.add(isCorrect ? 'correct' : 'incorrect');
        });
        
        const results = document.getElementById('quiz-results');
        results.style.display = 'block';
        results.innerHTML = `<h4>Score: ${correct}/${total} (${Math.round(correct/total*100)}%)</h4>
            ${correct === total ? '<p class="success">Perfect! 🎉</p>' : '<p>Review the explanations and try again.</p>'}`;
    },
    
    initCodeHighlighting() {
        // Simple syntax highlighting for code blocks
        document.querySelectorAll('pre code').forEach(block => {
            block.innerHTML = this.highlightCode(block.textContent);
        });
    },
    
    highlightCode(code) {
        const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const KEYWORDS = new Set(['const','let','var','function','return','if','else','for','while','do','class','new','this','struct','template','typename','namespace','using','public','private','protected','virtual','override','static','constexpr','enum','switch','case','break','continue','try','catch','throw','nullptr','true','false','auto','sizeof','namespace','delete']);
        const TYPES = new Set(['int','long','short','unsigned','signed','char','bool','void','float','double','size_t','string','vector','map','set','unordered_map','unordered_set','pair','array','deque','queue','stack','list','optional','variant','uint64_t','int64_t','int32_t','uint32_t']);
        const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b([A-Za-z_]\w*)\b|(\d+(?:\.\d+)?)/g;
        let out = '';
        let last = 0;
        let m;
        const push = (s) => { out += escapeHtml(s); };
        while ((m = TOKEN.exec(code))) {
            push(code.slice(last, m.index));
            if (m[1] !== undefined) {
                out += `<span class="comment">${escapeHtml(m[1])}</span>`;
            } else if (m[2] !== undefined) {
                out += `<span class="string">${escapeHtml(m[2])}</span>`;
            } else if (m[3] !== undefined) {
                const w = m[3];
                if (KEYWORDS.has(w)) out += `<span class="keyword">${w}</span>`;
                else if (TYPES.has(w)) out += `<span class="type">${w}</span>`;
                else push(w);
            } else if (m[4] !== undefined) {
                out += `<span class="number">${escapeHtml(m[4])}</span>`;
            }
            last = TOKEN.lastIndex;
        }
        push(code.slice(last));
        return out;
    },
    
    initDashboardCharts() {
        // Initialize any charts if needed
    }
};

// ============================================================
// DASHBOARD RENDERER
// ============================================================
const DashboardRenderer = {
    render() {
        const stats = this.getOverallStats();
        const recentLessons = this.getRecentLessons();
        const topicProgress = this.getAllTopicProgress();
        
        return `
            <header class="dashboard-header">
                <h2>📊 Learning Dashboard</h2>
                <p>Track your progress and continue learning</p>
            </header>
            
            <section class="stats-grid">
                <div class="stat-card">
                    <span class="stat-value">${stats.totalLessonsCompleted}</span>
                    <span class="stat-label">Lessons Completed</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.totalTopicsStarted}</span>
                    <span class="stat-label">Topics Started</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.overallProgress}%</span>
                    <span class="stat-label">Overall Progress</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${stats.streakDays}</span>
                    <span class="stat-label">Day Streak</span>
                </div>
            </section>
            
            <section class="dashboard-sections">
                <div class="dashboard-column">
                    <h3>📚 Continue Learning</h3>
                    <div class="continue-list">
                        ${recentLessons.length > 0 
                            ? recentLessons.map(l => `
                                <a href="#topic/${l.topicId}/module/${l.moduleId}/lesson/${l.lessonId}" class="continue-item">
                                    <span class="continue-title">${l.title}</span>
                                    <span class="continue-topic">${l.topicTitle}</span>
                                </a>`).join('')
                            : '<p class="empty">Start your first lesson!</p>'}
                    </div>
                    
                    <h3>📝 Recent Notes</h3>
                    <div class="notes-list">
                        ${this.getRecentNotes().length > 0
                            ? this.getRecentNotes().map(n => `
                                <a href="#topic/${n.topicId}/module/${n.moduleId}/lesson/${n.lessonId}" class="note-item">
                                    ${n.preview}
                                </a>`).join('')
                            : '<p class="empty">No notes yet</p>'}
                    </div>
                </div>
                
                <div class="dashboard-column">
                    <h3>📈 Topic Progress</h3>
                    <div class="topic-progress-list">
                        ${topicProgress.map(t => `
                            <div class="topic-progress-item">
                                <div class="topic-progress-info">
                                    <span class="topic-name">${t.title}</span>
                                    <span class="topic-percent">${t.percentage}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${t.percentage}%"></div>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>
            </section>
            
            <section class="quick-actions">
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    <a href="#topic/cpp-foundations" class="btn primary">Start Learning</a>
                    <a href="#visualizers" class="btn">Visualization Lab</a>
                    <a href="#code-lab" class="btn">C++ Code Lab</a>
                    <a href="#assessments" class="btn">Practice Quiz</a>
                </div>
            </section>
        `;
    },
    
    getOverallStats() {
        let totalLessons = 0, completedLessons = 0;
        let topicsStarted = 0;
        
        Object.values(CURRICULUM).forEach(topic => {
            topic.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    totalLessons++;
                    if (AppState.isLessonComplete(topic.id, module.id, lesson.id)) {
                        completedLessons++;
                    }
                });
            });
            
            const progress = AppState.getTopicProgress(topic.id);
            if (progress.completed > 0) topicsStarted++;
        });
        
        return {
            totalLessonsCompleted: completedLessons,
            totalTopicsStarted: topicsStarted,
            overallProgress: totalLessons > 0 ? Math.round(completedLessons/totalLessons*100) : 0,
            streakDays: this.calculateStreak()
        };
    },
    
    getRecentLessons(limit = 5) {
        const completed = [];
        Object.entries(AppState.progress).forEach(([key, value]) => {
            if (value.completed) {
                const [topicId, moduleId, lessonId] = key.split(':');
                const topic = CURRICULUM[topicId];
                const module = topic?.modules.find(m => m.id === moduleId);
                const lesson = module?.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    completed.push({
                        topicId, moduleId, lessonId,
                        title: lesson.title,
                        topicTitle: topic.title,
                        completedAt: value.completedAt
                    });
                }
            }
        });
        
        return completed
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, limit);
    },
    
    getRecentNotes(limit = 3) {
        const notes = [];
        Object.entries(AppState.notes).forEach(([key, content]) => {
            if (content.trim()) {
                const [topicId, moduleId, lessonId] = key.split(':');
                const topic = CURRICULUM[topicId];
                const module = topic?.modules.find(m => m.id === moduleId);
                const lesson = module?.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    notes.push({
                        topicId, moduleId, lessonId,
                        preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
                    });
                }
            }
        });
        return notes.slice(0, limit);
    },
    
    getAllTopicProgress() {
        return Object.values(CURRICULUM)
            .sort((a, b) => a.level - b.level || a.order - b.order)
            .map(topic => {
                const progress = AppState.getTopicProgress(topic.id);
                return { ...progress, title: topic.title };
            });
    },
    
    calculateStreak() {
        // Simplified - would need actual daily tracking
        const dates = new Set();
        Object.values(AppState.progress).forEach(p => {
            if (p.completedAt) {
                dates.add(p.completedAt.split('T')[0]);
            }
        });
        return dates.size;
    }
};

// ============================================================
// VISUALIZATION RENDERER
// ============================================================
const VisualizerRenderer = {
    visualizers: [
        { id: 'array', title: 'Array Memory Layout', description: 'Visualize contiguous memory allocation' },
        { id: 'linked-list', title: 'Linked List Operations', description: 'Insert, delete, traverse nodes' },
        { id: 'stack', title: 'Stack Visualization', description: 'LIFO operations with animation' },
        { id: 'queue', title: 'Queue Visualization', description: 'FIFO operations with animation' },
        { id: 'tree', title: 'Binary Tree Traversal', description: 'Pre-order, in-order, post-order, level-order' },
        { id: 'graph', title: 'Graph Traversal', description: 'BFS and DFS with step-by-step' },
        { id: 'sorting', title: 'Sorting Algorithms', description: 'Bubble, Selection, Insertion, Merge, Quick, Heap sort with step-by-step animation', fullScreen: true },
        { id: 'tree-graph', title: 'Tree & Graph Algorithms', description: 'BST operations, tree traversals, graph BFS/DFS with node/edge highlighting', fullScreen: true },
        { id: 'searching', title: 'Searching Algorithms', description: 'Linear and binary search' }
    ],
    
    render() {
        return `
            <header class="page-header">
                <h2>🔬 Visualization Laboratory</h2>
                <p>Interactive algorithm and data structure visualizations</p>
            </header>
            
            <div class="visualizers-grid">
                ${this.visualizers.map(v => `
                    <div class="visualizer-card" data-id="${v.id}">
                        <h3>${v.title}</h3>
                        <p>${v.description}</p>
                        <button class="btn" data-visualizer="${v.id}">${v.fullScreen ? 'Open Visualizer' : 'Launch'}</button>
                        <canvas class="visualizer-canvas" width="600" height="400"></canvas>
                        <div class="visualizer-controls">
                            <button class="control-btn" data-action="play">▶ Play</button>
                            <button class="control-btn" data-action="pause">⏸ Pause</button>
                            <button class="control-btn" data-action="step">⏭ Step</button>
                            <button class="control-btn" data-action="reset">↺ Reset</button>
                            <input type="range" class="speed-control" min="1" max="10" value="5">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    init() {
        // Initialize visualizers
        document.querySelectorAll('.visualizer-card').forEach(card => {
            const id = card.dataset.id;
            const canvas = card.querySelector('.visualizer-canvas');
            const ctx = canvas.getContext('2d');
            
            card.querySelector('[data-visualizer]').addEventListener('click', () => {
                if (id === 'sorting') {
                    // Navigate to full-screen sorting visualizer
                    window.location.hash = 'visualizers/sorting';
                } else {
                    this.launchVisualizer(id, ctx, canvas);
                }
            });
            
            card.querySelectorAll('.control-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.controlVisualizer(id, btn.dataset.action);
                });
            });
        });
    },
    
    launchVisualizer(id, ctx, canvas) {
        // Clear and draw initial state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw placeholder
        ctx.fillStyle = '#3498db';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${id} Visualizer`, canvas.width/2, canvas.height/2);
        ctx.font = '14px Arial';
        ctx.fillText('Click Play to start animation', canvas.width/2, canvas.height/2 + 30);
    },
    
    controlVisualizer(id, action) {
        console.log(`${id}: ${action}`);
        // Would connect to actual visualizer implementations
    }
};

// ============================================================
// CODE LAB RENDERER
// ============================================================
const CodeLabRenderer = {
    templates: {
        'hello': {
            title: 'Hello World',
            code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, DSA Academy!" << endl;
    return 0;
}`
        },
        'vector': {
            title: 'Vector Basics',
            code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};
    
    // Access
    cout << v[0] << endl;  // 1
    cout << v.at(2) << endl;  // 3 (bounds checked)
    
    // Modification
    v.push_back(6);
    v.pop_back();
    
    // Iteration
    for (int x : v) cout << x << " ";
    cout << endl;
    
    return 0;
}`
        },
        'linked-list': {
            title: 'Linked List',
            code: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    
    // Traverse
    for (Node* curr = head; curr; curr = curr->next) {
        cout << curr->data << " ";
    }
    cout << endl;
    
    // Cleanup
    while (head) {
        Node* tmp = head;
        head = head->next;
        delete tmp;
    }
    
    return 0;
}`
        },
        'bst': {
            title: 'Binary Search Tree',
            code: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    Node(int k) : key(k), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    if (key < root->key) root->left = insert(root->left, key);
    else root->right = insert(root->right, key);
    return root;
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->key << " ";
    inorder(root->right);
}

int main() {
    Node* root = nullptr;
    for (int x : {5, 3, 7, 1, 4, 6, 8}) {
        root = insert(root, x);
    }
    inorder(root);  // 1 3 4 5 6 7 8
    cout << endl;
    return 0;
}`
        }
    },
    
    render() {
        return `
            <header class="page-header">
                <h2>💻 C++ Code Laboratory</h2>
                <p>Write C++ code and experiment — until the WASM Clang backend lands, execution here is a development simulation, not a real compiler.</p>
            </header>
            
            <div class="code-lab-layout">
                <aside class="code-lab-sidebar">
                    <h3>Templates</h3>
                    <ul class="template-list">
                        ${Object.entries(this.templates).map(([id, t]) => `
                            <li><button class="template-btn" data-template="${id}">${t.title}</button></li>
                        `).join('')}
                    </ul>
                    
                    <h3>Saved Files</h3>
                    <ul class="saved-files" id="saved-files"></ul>
                    
                    <h3>Editor Options</h3>
                    <div class="editor-options">
                        <label class="option-toggle">
                            <input type="checkbox" id="opt-line-numbers" checked>
                            <span>Line Numbers</span>
                        </label>
                        <label class="option-toggle">
                            <input type="checkbox" id="opt-syntax-highlight" checked>
                            <span>Syntax Highlighting</span>
                        </label>
                        <label class="option-toggle">
                            <input type="checkbox" id="opt-bracket-match" checked>
                            <span>Bracket Matching</span>
                        </label>
                        <label class="option-toggle">
                            <input type="checkbox" id="opt-auto-indent" checked>
                            <span>Auto Indent</span>
                        </label>
                        <label class="option-toggle">
                            <input type="checkbox" id="opt-autocomplete" checked>
                            <span>Autocomplete</span>
                        </label>
                    </div>
                </aside>
                
                <main class="code-lab-main">
                    <div class="editor-toolbar">
                        <select id="language-select">
                            <option value="cpp">C++</option>
                        </select>
                        <div class="toolbar-spacer"></div>
                        <button class="btn" id="format-btn" title="Format Code (Shift+Alt+F)">📐 Format</button>
                        <button class="btn" id="comment-btn" title="Toggle Comment (Ctrl+/)">💬 Comment</button>
                        <button class="btn primary" id="run-btn">▶ Run</button>
                        <button class="btn" id="save-btn">💾 Save</button>
                        <button class="btn" id="clear-btn">🗑 Clear</button>
                    </div>
                    
                    <div class="editor-wrapper" id="editor-wrapper">
                        <textarea id="code-editor" spellcheck="false">
${this.templates.hello.code}
                        </textarea>
                    </div>
                    
                    <div class="output-panel">
                        <div class="output-header">
                            <span>Output</span>
                            <button class="clear-output" id="clear-output">Clear</button>
                        </div>
                        <pre id="code-output" class="output-content"></pre>
                    </div>
                </main>
            </div>
        `;
    },
    
    init() {
        const output = document.getElementById('code-output');
        const editorWrapper = document.getElementById('editor-wrapper');
        const textarea = document.getElementById('code-editor');
        
        // Load editor options from localStorage
        const editorOptions = {
            lineNumbers: localStorage.getItem('opt-line-numbers') !== 'false',
            syntaxHighlighting: localStorage.getItem('opt-syntax-highlight') !== 'false',
            bracketMatching: localStorage.getItem('opt-bracket-match') !== 'false',
            autoIndent: localStorage.getItem('opt-auto-indent') !== 'false',
            autocomplete: localStorage.getItem('opt-autocomplete') !== 'false'
        };
        
        // Initialize enhanced code editor
        this.codeEditor = new CodeEditor(textarea, editorOptions);
        
        // Set up option toggles
        document.querySelectorAll('.option-toggle input').forEach(input => {
            const optionName = input.id.replace('opt-', '');
            input.checked = editorOptions[optionName];
            input.addEventListener('change', () => {
                editorOptions[optionName] = input.checked;
                localStorage.setItem(`opt-${optionName}`, input.checked);
                this.codeEditor.options[optionName] = input.checked;
                this.codeEditor.render();
                this.codeEditor.updateLineNumbers();
            });
        });
        
        document.getElementById('run-btn')?.addEventListener('click', () => {
            this.runCode(this.codeEditor.getValue(), output);
        });
        
        document.getElementById('format-btn')?.addEventListener('click', () => {
            this.formatCode();
        });
        
        document.getElementById('comment-btn')?.addEventListener('click', () => {
            this.codeEditor.toggleComment();
        });
        
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = this.templates[btn.dataset.template];
                if (template) this.codeEditor.setValue(template.code);
            });
        });
        
        document.getElementById('save-btn')?.addEventListener('click', () => {
            const name = prompt('Save as:');
            if (name) {
                const files = JSON.parse(localStorage.getItem('dsa_code_files') || '{}');
                files[name] = this.codeEditor.getValue();
                localStorage.setItem('dsa_code_files', JSON.stringify(files));
                this.refreshSavedFiles();
            }
        });
        
        document.getElementById('clear-btn')?.addEventListener('click', () => {
            this.codeEditor.setValue('');
        });
        
        document.getElementById('clear-output')?.addEventListener('click', () => {
            output.textContent = '';
        });
        
        this.refreshSavedFiles();
    },
    
    refreshSavedFiles() {
        const list = document.getElementById('saved-files');
        const files = JSON.parse(localStorage.getItem('dsa_code_files') || '{}');
        list.innerHTML = Object.keys(files).map(name => `
            <li>
                <button class="load-file" data-name="${name}">${name}</button>
                <button class="delete-file" data-name="${name}">×</button>
            </li>
        `).join('');
        
        list.querySelectorAll('.load-file').forEach(btn => {
            btn.addEventListener('click', () => {
                const files = JSON.parse(localStorage.getItem('dsa_code_files') || '{}');
                editor.value = files[btn.dataset.name];
            });
        });
    },
    
    compilerService: null,
    
    async initializeCompiler() {
        if (this.compilerService) return this.compilerService;
        
        // Dynamically import compiler service
        if (typeof CppCompilerService !== 'undefined') {
            this.compilerService = new CppCompilerService();
        } else {
            // Load compiler service script
            await this.loadCompilerService();
            this.compilerService = new CppCompilerService();
        }
        
        await this.compilerService.initialize();
        return this.compilerService;
    },
    
    loadCompilerService() {
        return new Promise((resolve, reject) => {
            if (document.getElementById('compiler-service-script')) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.id = 'compiler-service-script';
            script.src = 'scripts/compiler-service.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load compiler service'));
            document.head.appendChild(script);
        });
    },
    
    async runCode(code, outputEl) {
        const runBtn = document.getElementById('run-btn');
        const originalBtnText = runBtn ? runBtn.textContent : '';
        
        if (runBtn) {
            runBtn.textContent = '⏳ Compiling...';
            runBtn.disabled = true;
        }
        
        outputEl.textContent = 'Initializing compiler...';
        
        try {
            // Initialize compiler service
            const compiler = await this.initializeCompiler();
            
            // Set up progress callback
            compiler.setProgressCallback((progress) => {
                outputEl.textContent = `[${Math.round(progress.percent)}%] ${progress.message}`;
                if (runBtn) {
                    runBtn.textContent = `⏳ ${progress.message}`;
                }
            });
            
            // Compile and run
            const result = await compiler.compile(code, {
                standard: 'c++17',
                optimization: '-O2',
                run: true
            });
            
            if (result.success) {
                // Display compilation success
                let outputText = '✅ Compilation successful!\n\n';
                
                if (result.warnings && result.warnings.length > 0) {
                    outputText += '⚠️ Warnings:\n';
                    result.warnings.forEach(w => {
                        outputText += `  ${w.message || w}\n`;
                    });
                    outputText += '\n';
                }
                
                // Display execution output
                if (result.execution) {
                    outputText += '📤 Program Output:\n';
                    outputText += '─'.repeat(40) + '\n';
                    
                    if (result.execution.stdout) {
                        outputText += result.execution.stdout;
                    } else {
                        outputText += '(no output)';
                    }
                    
                    if (result.execution.stderr) {
                        outputText += '\n\n⚠️ Stderr:\n';
                        outputText += result.execution.stderr;
                    }
                    
                    outputText += `\n─`.repeat(40) + '\n';
                    outputText += `Exit code: ${result.execution.exitCode}`;
                    outputText += ` | Time: ${result.execution.executionTime}ms`;
                }
                
                outputEl.textContent = outputText;
                outputEl.className = 'output-content success';
            } else {
                // Display compilation errors
                let outputText = '❌ Compilation failed!\n\n';
                
                if (result.errors && result.errors.length > 0) {
                    outputText += 'Errors:\n';
                    result.errors.forEach(err => {
                        const line = err.line ? `Line ${err.line}: ` : '';
                        const col = err.column ? `Col ${err.column}: ` : '';
                        outputText += `  ${line}${col}${err.message}\n`;
                    });
                } else {
                    outputText += 'Unknown compilation error';
                }
                
                if (result.warnings && result.warnings.length > 0) {
                    outputText += '\nWarnings:\n';
                    result.warnings.forEach(w => {
                        outputText += `  ${w.message || w}\n`;
                    });
                }
                
                outputEl.textContent = outputText;
                outputEl.className = 'output-content error';
                
                // Set error markers in editor
                if (this.codeEditor && result.errors) {
                    this.codeEditor.setErrorMarkers(result.errors, result.warnings);
                }
            }
            
        } catch (error) {
            outputEl.textContent = `❌ Error: ${error.message}`;
            outputEl.className = 'output-content error';
            console.error('Compilation error:', error);
        } finally {
            if (runBtn) {
                runBtn.textContent = originalBtnText || '▶ Run';
                runBtn.disabled = false;
            }
        }
    },
    
    formatCode() {
        // Basic code formatting - indent properly
        const code = this.codeEditor.getValue();
        const lines = code.split('\n');
        let indentLevel = 0;
        const formattedLines = [];
        
        for (let line of lines) {
            const trimmed = line.trim();
            
            // Decrease indent for closing braces
            if (trimmed.startsWith('}') || trimmed.startsWith('else') || trimmed.startsWith('catch')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Add line with current indent
            if (trimmed) {
                formattedLines.push('    '.repeat(indentLevel) + trimmed);
            } else {
                formattedLines.push('');
            }
            
            // Increase indent for opening braces
            if (trimmed.endsWith('{') && !trimmed.endsWith('{}')) {
                indentLevel++;
            }
            
            // Handle single-line blocks
            if (trimmed.startsWith('}') && trimmed.includes('{')) {
                // } else { or } catch {
                indentLevel++;
            }
        }
        
        this.codeEditor.setValue(formattedLines.join('\n'));
    }
};

// ============================================================
// NOTES RENDERER
// ============================================================
const NotesRenderer = {
    render() {
        const notes = this.getAllNotes();
        
        return `
            <header class="page-header">
                <h2>📝 My Notes</h2>
                <p>Review and manage your learning notes</p>
            </header>
            
            <div class="notes-grid">
                ${notes.length > 0 ? notes.map(note => `
                    <article class="note-card">
                        <header>
                            <h3>${note.lessonTitle}</h3>
                            <span class="note-topic">${note.topicTitle} › ${note.moduleTitle}</span>
                        </header>
                        <div class="note-content">${note.content}</div>
                        <footer>
                            <a href="#topic/${note.topicId}/module/${note.moduleId}/lesson/${note.lessonId}" class="btn">View Lesson</a>
                            <button class="btn delete-note" data-key="${note.key}">Delete</button>
                        </footer>
                    </article>
                `).join('') : '<p class="empty">No notes yet. Start learning and take notes!</p>'}
            </div>
        `;
    },
    
    getAllNotes() {
        const notes = [];
        Object.entries(AppState.notes).forEach(([key, content]) => {
            if (content.trim()) {
                const [topicId, moduleId, lessonId] = key.split(':');
                const topic = CURRICULUM[topicId];
                const module = topic?.modules.find(m => m.id === moduleId);
                const lesson = module?.lessons.find(l => l.id === lessonId);
                if (lesson) {
                    notes.push({ key, topicId, moduleId, lessonId, content,
                        topicTitle: topic.title, moduleTitle: module.title, lessonTitle: lesson.title });
                }
            }
        });
        return notes.sort((a, b) => a.topicTitle.localeCompare(b.topicTitle));
    }
};

// ============================================================
// BOOKMARKS RENDERER
// ============================================================
const BookmarksRenderer = {
    render() {
        const bookmarks = this.getAllBookmarks();
        
        return `
            <header class="page-header">
                <h2>★ Bookmarks</h2>
                <p>Quick access to important lessons</p>
            </header>
            
            <div class="bookmarks-list">
                ${bookmarks.length > 0 ? bookmarks.map(b => `
                    <div class="bookmark-item">
                        <a href="#topic/${b.topicId}/module/${b.moduleId}/lesson/${b.lessonId}">
                            <strong>${b.lessonTitle}</strong>
                            <span>${b.topicTitle} › ${b.moduleTitle}</span>
                        </a>
                        <button class="remove-bookmark" data-key="${b.key}">Remove</button>
                    </div>
                `).join('') : '<p class="empty">No bookmarks yet</p>'}
            </div>
        `;
    },
    
    getAllBookmarks() {
        const bookmarks = [];
        Object.entries(AppState.bookmarks).forEach(([key, value]) => {
            const topic = CURRICULUM[value.topicId];
            const module = topic?.modules.find(m => m.id === value.moduleId);
            const lesson = module?.lessons.find(l => l.id === value.lessonId);
            if (lesson) {
                bookmarks.push({ 
                    key, 
                    ...value,
                    topicTitle: topic.title,
                    moduleTitle: module.title,
                    lessonTitle: lesson.title
                });
            }
        });
        return bookmarks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
};

// ============================================================
// ASSESSMENTS RENDERER
// ============================================================
const AssessmentsRenderer = {
    render() {
        const topics = Object.values(CURRICULUM);
        let totalQuestions = 0;
        const cards = topics.map(topic => {
            let quizCount = 0;
            let first = null;
            topic.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    const count = (lesson.quizQuestions || []).length;
                    quizCount += count;
                    if (count > 0 && !first) {
                        first = { moduleId: module.id, lessonId: lesson.id, lessonTitle: lesson.title };
                    }
                });
            });
            totalQuestions += quizCount;
            const href = first ? `#topic/${topic.id}/module/${first.moduleId}/lesson/${first.lessonId}` : `#topic/${topic.id}`;
            const disabled = !first;
            return `
                <div class="assessment-card">
                    <h3>${this.escapeHtml(topic.title)}</h3>
                    <p>${quizCount} quiz question${quizCount === 1 ? '' : 's'}${first ? ` · first in “${this.escapeHtml(first.lessonTitle)}”` : ' · no quiz content yet'}</p>
                    ${disabled
                        ? `<button class="btn" disabled>No quiz yet</button>`
                        : `<a class="btn primary" href="${href}">Start Quiz →</a>`}
                </div>`;
        }).join('');
        
        return `
            <header class="page-header">
                <h2>🧪 Practice & Assessments</h2>
                <p>${totalQuestions} questions across ${topics.length} topics. Quizzes are graded inline inside each lesson — your score is recorded locally.</p>
            </header>
            <div class="assessments-grid">
                ${cards}
            </div>
        `;
    },
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
// SETTINGS RENDERER
// ============================================================
const SettingsRenderer = {
    render() {
        const theme = localStorage.getItem('dsa_theme') || 'system';
        const compilerBackend = localStorage.getItem('dsa_compiler_backend') || 'wasm';
        
        return `
            <header class="page-header">
                <h2>⚙️ Settings</h2>
                <p>Customize your learning experience</p>
            </header>
            
            <section class="settings-section">
                <h3>Appearance</h3>
                <div class="setting-item">
                    <label>Theme</label>
                    <select id="theme-select">
                        <option value="light" ${theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="system" ${theme === 'system' ? 'selected' : ''}>System</option>
                    </select>
                </div>
            </section>
            
            <section class="settings-section">
                <h3>Data Management</h3>
                <div class="setting-item">
                    <button class="btn" id="export-backup">Export Backup (JSON)</button>
                    <button class="btn" id="export-notes">Export Notes (Markdown)</button>
                    <button class="btn" id="import-data">Import Backup (JSON)</button>
                    <button class="btn danger" id="clear-all-data">Clear All Data</button>
                </div>
            </section>
            
            <section class="settings-section">
                <h3>Compiler Settings</h3>
                <div class="setting-item">
                    <label>Compiler Backend</label>
                    <select id="compiler-backend">
                        <option value="wasm" ${compilerBackend === 'wasm' ? 'selected' : ''}>WebAssembly Clang (prototype coming soon)</option>
                        <option value="local" ${compilerBackend === 'local' ? 'selected' : ''}>Local Companion App (Named Pipe)</option>
                        <option value="none" ${compilerBackend === 'none' ? 'selected' : ''}>None (Simulation Mode)</option>
                    </select>
                    <p class="setting-help">A genuine WASM Clang backend is being built. Until it lands, code execution here is simulated and does not run your C++.</p>
                </div>
                
                <div class="setting-item" id="compiler-status">
                    <label>Compiler Status</label>
                    <div id="compiler-status-display">
                        <span class="status-indicator" id="compiler-status-indicator">Checking...</span>
                        <span id="compiler-version"></span>
                    </div>
                    <button class="btn" id="test-compiler">Test Compiler</button>
                </div>
                
                <div class="setting-item">
                    <label>C++ Standard</label>
                    <select id="cpp-standard">
                        <option value="c++17" selected>C++17</option>
                        <option value="c++20">C++20</option>
                        <option value="c++14">C++14</option>
                    </select>
                </div>
                
                <div class="setting-item">
                    <label>Optimization Level</label>
                    <select id="optimization-level">
                        <option value="-O0">-O0 (No Optimization)</option>
                        <option value="-O1" selected>-O1</option>
                        <option value="-O2" selected>-O2 (Default)</option>
                        <option value="-O3">-O3 (Aggressive)</option>
                        <option value="-Os">-Os (Size Optimized)</option>
                    </select>
                </div>
            </section>
            
            <section class="settings-section">
                <h3>About</h3>
                <p>C++ DSA Academy v1.0</p>
                <p>A comprehensive learning platform for Data Structures and Algorithms</p>
                <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                    Compiler: <span id="about-compiler-version">Loading...</span>
                </p>
            </section>
        `;
    },
    
    init() {
        // Theme select handler
        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
        
        // Compiler backend select handler
        document.getElementById('compiler-backend')?.addEventListener('change', (e) => {
            localStorage.setItem('dsa_compiler_backend', e.target.value);
            this.updateCompilerStatus();
        });
        
        // C++ standard handler
        document.getElementById('cpp-standard')?.addEventListener('change', (e) => {
            localStorage.setItem('dsa_cpp_standard', e.target.value);
        });
        
        // Optimization level handler
        document.getElementById('optimization-level')?.addEventListener('change', (e) => {
            localStorage.setItem('dsa_optimization_level', e.target.value);
        });
        
        // Test compiler button
        document.getElementById('test-compiler')?.addEventListener('click', () => {
            this.testCompiler();
        });
        
        // Data management buttons
        document.getElementById('export-backup')?.addEventListener('click', () => {
            this.exportBackup();
        });
        
        document.getElementById('export-notes')?.addEventListener('click', () => {
            this.exportNotes();
        });
        
        document.getElementById('import-data')?.addEventListener('click', () => {
            this.importData();
        });
        
        document.getElementById('clear-all-data')?.addEventListener('click', () => {
            this.clearAllData();
        });
        
        // Update compiler status on init
        this.updateCompilerStatus();
    },
    
    async updateCompilerStatus() {
        const indicator = document.getElementById('compiler-status-indicator');
        const versionEl = document.getElementById('compiler-version');
        const aboutVersionEl = document.getElementById('about-compiler-version');
        const backend = localStorage.getItem('dsa_compiler_backend') || 'wasm';
        
        if (indicator) indicator.textContent = 'Initializing...';
        
        try {
            // Try to initialize compiler service
            if (typeof CppCompilerService !== 'undefined') {
                const compiler = new CppCompilerService();
                await compiler.initialize();
                const version = compiler.getVersion();
                
                if (indicator) {
                    const simulated = String(version).indexOf('SIMULATION') !== -1;
                    indicator.textContent = simulated ? '⚠ Simulation (dev)' : '✅ Ready';
                    indicator.className = simulated ? 'status-indicator warning' : 'status-indicator success';
                }
                if (versionEl) versionEl.textContent = version;
                if (aboutVersionEl) aboutVersionEl.textContent = version;
            } else {
                // Load compiler service first
                const script = document.createElement('script');
                script.src = 'scripts/compiler-service.js';
                script.onload = async () => {
                    const compiler = new CppCompilerService();
                    await compiler.initialize();
                    const version = compiler.getVersion();
                    
                    if (indicator) {
                        const _sim2 = String(version).indexOf('SIMULATION') !== -1; indicator.textContent = _sim2 ? '⚠ Simulation (dev)' : '✅ Ready';
                        indicator.className = _sim2 ? 'status-indicator warning' : 'status-indicator success';
                    }
                    if (versionEl) versionEl.textContent = version;
                    if (aboutVersionEl) aboutVersionEl.textContent = version;
                };
                script.onerror = () => {
                    if (indicator) {
                        indicator.textContent = '❌ Failed to load';
                        indicator.className = 'status-indicator error';
                    }
                    if (versionEl) versionEl.textContent = 'Error loading compiler';
                    if (aboutVersionEl) aboutVersionEl.textContent = 'Error loading compiler';
                };
                document.head.appendChild(script);
            }
        } catch (error) {
            if (indicator) {
                indicator.textContent = '❌ Error';
                indicator.className = 'status-indicator error';
            }
            if (versionEl) versionEl.textContent = error.message;
            if (aboutVersionEl) aboutVersionEl.textContent = error.message;
        }
    },
    
    async testCompiler() {
        const btn = document.getElementById('test-compiler');
        const output = document.getElementById('compiler-status-display');
        
        if (btn) {
            btn.textContent = 'Testing...';
            btn.disabled = true;
        }
        
        const testCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello from C++ Compiler Test!" << endl;
    
    // Test STL
    vector<int> v = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int x : v) sum += x;
    cout << "Vector sum: " << sum << endl;
    
    // Test algorithms
    sort(v.begin(), v.end(), greater<int>());
    cout << "Sorted descending: ";
    for (int x : v) cout << x << " ";
    cout << endl;
    
    // Test smart pointers
    auto ptr = make_unique<int>(42);
    cout << "Smart pointer value: " << *ptr << endl;
    
    return 0;
}`;
        
        try {
            if (typeof CppCompilerService !== 'undefined') {
                const compiler = new CppCompilerService();
                await compiler.initialize();
                
                const result = await compiler.compile(testCode, { run: true });
                
                if (result.success) {
                    output.innerHTML = `
                        <div class="compiler-test-result success">
                            <h4>✅ Compiler Test Passed</h4>
                            <pre>${result.execution?.stdout || 'No output'}</pre>
                            <p>Exit code: ${result.execution?.exitCode} | Time: ${result.execution?.executionTime}ms</p>
                        </div>
                    `;
                } else {
                    output.innerHTML = `
                        <div class="compiler-test-result error">
                            <h4>❌ Compiler Test Failed</h4>
                            <pre>${result.errors?.map(e => e.message).join('\n') || 'Unknown error'}</pre>
                        </div>
                    `;
                }
            } else {
                output.innerHTML = `
                    <div class="compiler-test-result error">
                        <h4>❌ Compiler Service Not Loaded</h4>
                        <p>Please refresh the page and try again.</p>
                    </div>
                `;
            }
        } catch (error) {
            output.innerHTML = `
                <div class="compiler-test-result error">
                    <h4>❌ Test Error</h4>
                    <pre>${error.message}</pre>
                </div>
            `;
        } finally {
            if (btn) {
                btn.textContent = 'Test Compiler';
                btn.disabled = false;
            }
        }
    },
    
    exportBackup() {
        const read = (key, fallback) => {
            try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
        };
        const backup = {
            type: 'dsa-academy-backup',
            version: 2,
            exportedAt: new Date().toISOString(),
            progress: read('dsa_progress', {}),
            notes: read('dsa_notes', {}),
            bookmarks: read('dsa_bookmarks', {}),
            codeFiles: read('dsa_code_files', []),
            chapters: read('dsa_chapters_v1', null)
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dsa-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    },
    exportNotes() {
        const notes = localStorage.getItem('dsa_notes') || '{}';
        const notesObj = JSON.parse(notes);
        
        let markdown = '# DSA Academy Notes\n\n';
        Object.entries(notesObj).forEach(([key, content]) => {
            if (content.trim()) {
                const [topicId, moduleId, lessonId] = key.split(':');
                markdown += `## ${lessonId} (${moduleId} / ${topicId})\n\n${content}\n\n---\n\n`;
            }
        });
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dsa-notes.md';
        a.click();
        URL.revokeObjectURL(url);
    },
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const raw = ev.target.result;
                    const data = JSON.parse(raw);
                    
                    // Accept both the current backup format and legacy bare exports.
                    // Legacy: a bare dsa_progress object, or { progress, notes, bookmarks }.
                    // Current: { type:'dsa-academy-backup', version:1|2, progress, notes, bookmarks, codeFiles, chapters }
                    const looksLikeBareProgress = !data.type && !data.progress && !data.notes && !data.bookmarks
                        && typeof data === 'object' && data !== null
                        && Object.values(data).some(v => v && typeof v === 'object' && ('completed' in v || 'total' in v));
                    
                    const normalize = () => {
                        if (looksLikeBareProgress) return { progress: data, notes: null, bookmarks: null, codeFiles: null, chapters: null };
                        return {
                            progress: data.progress ?? null,
                            notes: data.notes ?? null,
                            bookmarks: data.bookmarks ?? null,
                            codeFiles: data.codeFiles ?? null,
                            chapters: data.chapters ?? null
                        };
                    };
                    
                    const restored = normalize();
                    const applied = [];
                    if (restored.progress) { localStorage.setItem('dsa_progress', JSON.stringify(restored.progress)); applied.push('progress'); }
                    if (restored.notes) { localStorage.setItem('dsa_notes', JSON.stringify(restored.notes)); applied.push('notes'); }
                    if (restored.bookmarks) { localStorage.setItem('dsa_bookmarks', JSON.stringify(restored.bookmarks)); applied.push('bookmarks'); }
                    if (restored.codeFiles) { localStorage.setItem('dsa_code_files', JSON.stringify(restored.codeFiles)); applied.push('code files'); }
                    if (restored.chapters) { localStorage.setItem('dsa_chapters_v1', JSON.stringify(restored.chapters)); applied.push('chapter progress'); }
                    
                    if (applied.length === 0) {
                        alert('No recognized backup data found in this file. Expected an exported dsa-backup.json from C++ DSA Academy.');
                        return;
                    }
                    alert(`Backup imported (${applied.join(', ')}). Please refresh the page.`);
                } catch (err) {
                    alert('Invalid file format: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    clearAllData() {
        if (confirm('This will delete ALL your progress, notes, bookmarks, and saved code. Are you sure?')) {
            if (confirm('This action cannot be undone. Really delete everything?')) {
                localStorage.removeItem('dsa_progress');
                localStorage.removeItem('dsa_notes');
                localStorage.removeItem('dsa_bookmarks');
                localStorage.removeItem('dsa_code_files');
                localStorage.removeItem('dsa_chapters_v1');
                alert('All data cleared. Please refresh the page.');
            }
        }
    }
};

// ============================================================
// SEARCH FUNCTIONALITY
// ============================================================
const Search = {
    index: null,
    
    buildIndex() {
        this.index = [];
        Object.values(CURRICULUM).forEach(topic => {
            topic.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    this.index.push({
                        topicId: topic.id,
                        topicTitle: topic.title,
                        moduleId: module.id,
                        moduleTitle: module.title,
                        lessonId: lesson.id,
                        lessonTitle: lesson.title,
                        content: lesson.content || '',
                        objectives: lesson.objectives?.join(' ') || ''
                    });
                });
            });
        });
        
        // Course Chapters are indexed as an additive area. They use the same
        // scoring fields so search behaves identically, plus an explicit href.
        if (window.CourseChapters && typeof CourseChapters.searchEntries === 'function') {
            CourseChapters.searchEntries().forEach(entry => {
                this.index.push({
                    href: entry.href,
                    topicId: 'course-chapters',
                    topicTitle: 'Course Chapters',
                    moduleId: entry.href,
                    moduleTitle: entry.chapterTitle,
                    lessonId: entry.href,
                    lessonTitle: entry.title,
                    content: entry.content || '',
                    objectives: entry.keywords || ''
                });
            });
        }
    },
    
    search(query) {
        if (!this.index) this.buildIndex();
        const terms = query.toLowerCase().split(' ').filter(t => t.length > 1);
        
        return this.index
            .map(item => {
                let score = 0;
                const searchText = `${item.topicTitle} ${item.moduleTitle} ${item.lessonTitle} ${item.content} ${item.objectives}`.toLowerCase();
                
                terms.forEach(term => {
                    if (item.lessonTitle.toLowerCase().includes(term)) score += 10;
                    if (item.moduleTitle.toLowerCase().includes(term)) score += 5;
                    if (item.topicTitle.toLowerCase().includes(term)) score += 3;
                    if (item.content.toLowerCase().includes(term)) score += 1;
                    if (item.objectives.toLowerCase().includes(term)) score += 2;
                });
                
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
    },
    
    renderResults(results, query) {
        if (results.length === 0) {
            return `<div class="search-results" role="listbox" aria-label="Search results"><p class="search-result" role="option">No results for "${query}"</p></div>`;
        }
        
        return `
            <div class="search-results" role="listbox" aria-label="Search results">
                <h3>Search Results for "${query}" (${results.length})</h3>
                ${results.map(r => `
                    <a href="${r.href || `#topic/${r.topicId}/module/${r.moduleId}/lesson/${r.lessonId}`}" class="search-result" role="option">
                        <strong>${r.lessonTitle}</strong>
                        <span>${r.topicTitle} › ${r.moduleTitle}</span>
                    </a>
                `).join('')}
            </div>`;
    },
    
    showResults(results, inputElement) {
        // Remove existing results
        document.querySelectorAll('.search-results').forEach(s => s.remove());
        
        const container = inputElement.parentElement;
        container.style.position = 'relative';
        
        const resultsHtml = this.renderResults(results, inputElement.value);
        container.insertAdjacentHTML('beforeend', resultsHtml);
        
        const resultsContainer = container.querySelector('.search-results');
        if (resultsContainer) {
            // Focus first result
            const firstResult = resultsContainer.querySelector('.search-result[role="option"]');
            if (firstResult) {
                firstResult.setAttribute('tabindex', '0');
            }
        }
    }
};

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
const Toast = {
    container: null,
    toasts: [],
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Notifications');
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
    },
    
    show(message, options = {}) {
        if (!this.container) this.init();
        
        const {
            type = 'info',
            title = '',
            duration = 5000,
            onClose = null
        } = options;
        
        const id = Date.now() + Math.random();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.dataset.toastId = id;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${icons[type]}</span>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
                <div class="toast-message">${this.escapeHtml(message)}</div>
            </div>
            <button class="toast-close" aria-label="Dismiss notification">✕</button>
            <div class="toast-progress"><div class="toast-progress-bar"></div></div>
        `;
        
        // Add close handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(id);
            if (onClose) onClose();
        });
        
        // Add to container
        this.container.appendChild(toast);
        this.toasts.push({ id, toast, timeout: null });
        
        // Auto-remove after duration
        if (duration > 0) {
            const timeout = setTimeout(() => this.remove(id), duration);
            const toastData = this.toasts.find(t => t.id === id);
            if (toastData) toastData.timeout = timeout;
        }
        
        return id;
    },
    
    remove(id) {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index === -1) return;
        
        const { toast, timeout } = this.toasts[index];
        if (timeout) clearTimeout(timeout);
        
        toast.style.animation = 'toast-slide-in 0.3s ease-out reverse';
        setTimeout(() => {
            toast.remove();
            this.toasts.splice(index, 1);
        }, 300);
    },
    
    success(message, options = {}) {
        return this.show(message, { ...options, type: 'success' });
    },
    
    error(message, options = {}) {
        return this.show(message, { ...options, type: 'error' });
    },
    
    warning(message, options = {}) {
        return this.show(message, { ...options, type: 'warning' });
    },
    
    info(message, options = {}) {
        return this.show(message, { ...options, type: 'info' });
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ============================================================
// LOADING STATE MANAGEMENT
// ============================================================
const Loading = {
    overlay: null,
    
    show(message = 'Loading...') {
        if (this.overlay) return;
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.setAttribute('role', 'status');
        this.overlay.setAttribute('aria-live', 'polite');
        this.overlay.innerHTML = `
            <div class="loading-overlay-content">
                <div class="spinner spinner-lg" aria-hidden="true"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(this.overlay);
    },
    
    hide() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
};

// ============================================================
// KEYBOARD NAVIGATION & FOCUS MANAGEMENT
// ============================================================
const KeyboardNavigation = {
    init() {
        // Add skip link to page
        this.addSkipLink();
        
        // Handle Tab key for focus visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
        
        // Escape key to close modals, dropdowns, etc.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });
        
        // Arrow key navigation for menus
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                this.handleArrowKeys(e);
            }
        });
    },
    
    addSkipLink() {
        if (document.querySelector('.skip-link')) return;
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    },
    
    handleEscape() {
        // Close modals
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.querySelector('.modal-close')?.click();
            return;
        }
        
        // Close dropdowns
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        
        // Close search results
        document.querySelectorAll('.search-results').forEach(s => s.remove());
        
        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar.open');
        if (sidebar) sidebar.classList.remove('open');
    },
    
    handleArrowKeys(e) {
        const activeElement = document.activeElement;
        
        // Navigation menu arrow keys
        if (activeElement.closest('.navigation a')) {
            const navLinks = Array.from(document.querySelectorAll('.navigation a:not(.nav-section)'));
            const currentIndex = navLinks.indexOf(activeElement);
            if (currentIndex === -1) return;
            
            let nextIndex;
            if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % navLinks.length;
            else if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            else if (e.key === 'Home') nextIndex = 0;
            else if (e.key === 'End') nextIndex = navLinks.length - 1;
            else return;
            
            e.preventDefault();
            navLinks[nextIndex].focus();
        }
        
        // Tab navigation
        if (activeElement.closest('.tab-btn')) {
            const tabs = Array.from(document.querySelectorAll('.tab-btn'));
            const currentIndex = tabs.indexOf(activeElement);
            if (currentIndex === -1) return;
            
            let nextIndex;
            if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
            else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            else if (e.key === 'Home') nextIndex = 0;
            else if (e.key === 'End') nextIndex = tabs.length - 1;
            else return;
            
            e.preventDefault();
            tabs[nextIndex].click();
            tabs[nextIndex].focus();
        }
        
        // Dropdown menu
        if (activeElement.closest('.dropdown-menu')) {
            const items = Array.from(activeElement.closest('.dropdown-menu').querySelectorAll('.dropdown-item'));
            const currentIndex = items.indexOf(activeElement);
            if (currentIndex === -1) return;
            
            let nextIndex;
            if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
            else if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
            else if (e.key === 'Home') nextIndex = 0;
            else if (e.key === 'End') nextIndex = items.length - 1;
            else if (e.key === 'Escape' || e.key === 'Tab') {
                activeElement.closest('.dropdown').classList.remove('open');
                return;
            } else return;
            
            e.preventDefault();
            items[nextIndex].focus();
        }
    },
    
    // Trap focus within an element (for modals)
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function trap(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
        
        // Focus first element
        firstElement?.focus();
        
        return () => {
            element.removeEventListener('keydown', trap);
        };
    }
};

// ============================================================
// ARIA HELPERS
// ============================================================
const AriaHelpers = {
    // Announce to screen readers
    announce(message, priority = 'polite') {
        const announcer = document.getElementById('aria-announcer') || this.createAnnouncer();
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    },
    
    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(announcer);
        return announcer;
    },
    
    // Set loading state on button
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner spinner-sm" aria-hidden="true"></span> Loading...';
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
        } else {
            button.innerHTML = button.dataset.originalText || button.innerHTML;
            button.disabled = false;
            button.removeAttribute('aria-busy');
        }
    },
    
    // Add live region for dynamic content
    addLiveRegion(id, priority = 'polite') {
        if (document.getElementById(id)) return document.getElementById(id);
        
        const region = document.createElement('div');
        region.id = id;
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', priority);
        region.setAttribute('aria-atomic', 'true');
        region.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(region);
        return region;
    }
};

// Initialize keyboard navigation on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    KeyboardNavigation.init();
});

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    AppState.init();
    
    // Initialize toast system
    Toast.init();
    
    // Build search index
    Search.buildIndex();
    
    // Setup navigation
    const nav = document.querySelector('.navigation ul');
    if (nav) {
        nav.innerHTML = CurriculumRenderer.renderTopicList();
        
        // Add main navigation items
        const mainNav = `
            <li class="nav-section"><strong>Main</strong></li>
            <li><a href="#dashboard" role="menuitem">📊 Dashboard</a></li>
            <li><a href="#chapters" role="menuitem">📖 Course Chapters</a></li>
            <li><a href="#visualizers" role="menuitem">🔬 Visualization Lab</a></li>
            <li><a href="#code-lab" role="menuitem">💻 C++ Code Lab</a></li>
            <li><a href="#notes" role="menuitem">📝 My Notes</a></li>
            <li><a href="#bookmarks" role="menuitem">★ Bookmarks</a></li>
            <li><a href="#assessments" role="menuitem">🧪 Assessments</a></li>
            <li><a href="#settings" role="menuitem">⚙️ Settings</a></li>
        `;
        nav.innerHTML = mainNav + nav.innerHTML;
        
        // Add ARIA attributes to navigation
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
        nav.querySelectorAll('a[href^="#"]').forEach(link => {
            link.setAttribute('role', 'menuitem');
        });
    }
    
    // Search input
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.setAttribute('role', 'searchbox');
        searchInput.setAttribute('aria-autocomplete', 'list');
        searchInput.setAttribute('aria-controls', 'search-results');
        
        searchInput.addEventListener('input', debounce(() => {
            const value = searchInput.value.trim();
            if (value.length >= 2) {
                const results = Search.search(value);
                Search.showResults(results, searchInput);
            } else {
                document.querySelectorAll('.search-results').forEach(s => s.remove());
            }
        }, 200));

        // Close results on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.search-results').forEach(s => s.remove());
            }
        });
        
        searchInput.addEventListener('focus', () => {
            const value = searchInput.value.trim();
            if (value.length >= 2) {
                const results = Search.search(value);
                Search.showResults(results, searchInput);
            }
        });
        
        // Close search results on blur (with delay for click)
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                document.querySelectorAll('.search-results').forEach(s => s.remove());
            }, 200);
        });
    }
    
    // Theme handling
    const theme = localStorage.getItem('dsa_theme') || 'system';
    applyTheme(theme);
    
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('dsa_theme') || 'system';
            const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            const newTheme = isDark ? 'light' : 'dark';
            applyTheme(newTheme);
            themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
            AriaHelpers.announce(`Theme changed to ${newTheme} mode`);
        });
        
        // Set initial aria-pressed state
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        themeToggle.setAttribute('aria-pressed', isDark);
    }
    
    // Handle hash changes
    window.addEventListener('hashchange', () => Router.navigate());
    Router.navigate();
    
    // Global event delegation
    document.addEventListener('click', (e) => {
        // Handle navigation links
        if (e.target.matches('nav a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href').slice(1);
            window.location.hash = href;
            
            // Announce navigation to screen readers
            const title = e.target.textContent.trim();
            AriaHelpers.announce(`Navigated to ${title}`);
        }
        
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        }
    });
});

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
    }
    localStorage.setItem('dsa_theme', theme);
}

// Handle theme select changes
document.addEventListener('change', (e) => {
    if (e.target.id === 'theme-select') {
        applyTheme(e.target.value);
    }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, CURRICULUM, CurriculumRenderer, Router, Search };
}