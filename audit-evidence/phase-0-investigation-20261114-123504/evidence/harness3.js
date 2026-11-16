// Phase 0 runtime verification harness #3 (navigation and UI interactions)
(async () => {
    const out = { ranAt: new Date().toISOString() };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const text = sel => (document.querySelector(sel) || {}).textContent || '';
    const norm = s => s.replace(/\s+/g, ' ').trim();
    try {
        // wait for app initialization (DOMContentLoaded)
        await wait(600);
        // 1. Sidebar topic link click
        const navLink = document.querySelector('#nav-list a[data-topic="arrays"]');
        out.navTopicLink = navLink ? navLink.getAttribute('href') : null;
        navLink.click();
        await wait(200);
        out.afterSidebarTopicClick = {
            hash: location.hash,
            h2: norm(text('#content-area h2')).slice(0, 80),
            hasDashboardHeader: !!document.querySelector('.dashboard-header'),
            hasTopicPage: !!document.querySelector('.topic-header, .topic-hero')
        };

        // 2. Direct topic route then lesson link click
        location.hash = 'topic/arrays';
        await wait(200);
        const firstLesson = document.querySelector('#content-area .lesson-link');
        out.topicPage = { h2: norm(text('#content-area h2')).slice(0, 80), lessonLinks: document.querySelectorAll('#content-area .lesson-link').length };
        if (firstLesson) { firstLesson.click(); await wait(200); }
        out.afterLessonClick = { hash: location.hash, h1: norm(text('#content-area h1, #content-area h2')).slice(0, 80), hasCompleteBtn: !!document.getElementById('complete-btn'), codeBlocks: document.querySelectorAll('#content-area pre code').length, quizQuestions: document.querySelectorAll('#content-area .quiz-question').length };

        // 3. Complete button
        const completeBtn = document.getElementById('complete-btn');
        if (completeBtn) {
            completeBtn.click();
            await wait(100);
            out.completion = { label: norm(completeBtn.textContent), stored: !!localStorage.getItem('dsa_progress') };
        }

        // 4. Bookmark button on lesson
        const bm = document.querySelector('.bookmark-btn');
        if (bm) { const before = bm.classList.contains('active'); bm.click(); await wait(50); out.bookmark = { before, after: bm.classList.contains('active'), stored: !!localStorage.getItem('dsa_bookmarks') }; }

        // 5. Theme toggle
        const tt = document.getElementById('theme-toggle');
        const themeBefore = document.documentElement.getAttribute('data-theme');
        tt.click(); await wait(50);
        out.themeToggle = { before: themeBefore, after: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('dsa_theme') };

        // 6. Assessments placeholder
        location.hash = 'assessments'; await wait(150);
        out.assessments = { comingSoonButtons: document.querySelectorAll('#content-area button[disabled]').length, cards: document.querySelectorAll('.assessment-card').length };

        // 7. Code Lab run attempt
        location.hash = 'code-lab'; await wait(400);
        out.codeLab = { runBtn: !!document.getElementById('run-btn'), editor: !!document.querySelector('.editor-input, #code-editor'), templates: document.querySelectorAll('.template-btn').length };
        const runBtn = document.getElementById('run-btn');
        if (runBtn) {
            runBtn.click();
            await wait(2500);
            const outEl = document.getElementById('output-content') || document.querySelector('.output-content');
            out.codeLab.runOutput = outEl ? norm(outEl.textContent).slice(0, 400) : 'no output element';
        }

        // 8. Settings compiler status
        location.hash = 'settings'; await wait(500);
        out.settings = {
            status: norm(text('#compiler-status-indicator')),
            version: norm(text('#compiler-version')),
            exportButtons: ['export-progress', 'export-notes', 'import-data'].map(id => !!document.getElementById(id))
        };

        // 9. Visualizer page canvases
        location.hash = 'visualizers'; await wait(200);
        out.visualizersPage = { cards: document.querySelectorAll('.visualizer-card').length, canvases: document.querySelectorAll('canvas').length };

        // 10. Topic nav progress + counts
        out.curriculum = { topics: Object.keys(CURRICULUM).length, navTopics: document.querySelectorAll('#nav-list a[data-topic]').length };
    } catch (e) {
        out.error = e.message + ' | ' + e.stack;
    }
    const pre = document.createElement('pre');
    pre.id = 'harness3-results';
    pre.textContent = JSON.stringify(out, null, 2);
    document.body.appendChild(pre);
})();
