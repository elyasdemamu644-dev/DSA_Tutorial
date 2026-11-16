// Phase 1 verification harness — re-tests all Phase 0 defects in headless Edge
(async () => {
    const out = { ranAt: new Date().toISOString(), checks: {} };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const ok = (name, pass, detail) => { out.checks[name] = { pass, detail: detail === undefined ? null : detail }; };
    try {
        await wait(600);

        // D-02 sidebar topic navigation
        const navLink = document.querySelector('#nav-list a[data-topic="arrays"]');
        out.d02 = { href: navLink ? navLink.getAttribute('href') : null };
        navLink.click();
        await wait(150);
        ok('D-02 sidebar topic href', navLink.getAttribute('href') === '#topic/arrays', navLink.getAttribute('href'));
        ok('D-02 sidebar click renders topic', !!document.querySelector('#content-area .modules-list, #content-area h2'), (document.querySelector('#content-area h2') || {}).textContent);

        // D-03 MCQ exercise renders options
        const cpp01 = CurriculumRenderer.renderLesson('cpp-foundations', 'cpp-basics', 'cpp-01');
        const holder = document.createElement('div');
        holder.innerHTML = cpp01;
        ok('D-03 mcq exercise has radios', holder.querySelectorAll('.exercise.mcq input[type="radio"]').length === 4, holder.querySelectorAll('.exercise.mcq input[type="radio"]').length);

        // D-06 code-complete renders
        const ll01 = CurriculumRenderer.renderLesson('linked-lists', 'll-basics', 'll-01');
        const holder2 = document.createElement('div');
        holder2.innerHTML = ll01;
        ok('D-06 code-complete renders code + reveal', !!holder2.querySelector('.exercise.code-complete pre code') && !!holder2.querySelector('.reveal-btn'), holder2.querySelectorAll('.exercise.code-complete').length);
        ok('D-06 code-trace renders', !!holder2.querySelector('.exercise.code-trace pre code'), holder2.querySelectorAll('.exercise.code-trace').length);

        // D-06 reveal button end-to-end on a real lesson page
        location.hash = 'topic/linked-lists/module/ll-basics/lesson/ll-01';
        await wait(250);
        const rb = document.querySelector('.reveal-btn');
        let revealOk = false, revealHasContent = false;
        if (rb) {
            const box = document.querySelector('.exercise-solution');
            rb.click();
            revealOk = box ? box.style.display !== 'none' : false;
            revealHasContent = box ? box.textContent.length > 20 : false;
            rb.click();
        }
        ok('D-06 reveal button toggles worked solution', revealOk && revealHasContent, { hasButton: !!rb, revealed: revealOk, solutionChars: revealHasContent });

        // D-04 quiz grading — one MCQ + one T/F both correct
        const form = document.createElement('form');
        form.innerHTML = '<div class="quiz-question mcq" data-id="q1" data-correct="1"><input type="radio" name="quiz-q1" value="1" checked></div>' +
            '<div class="quiz-question true-false" data-id="q2" data-correct="true"><input type="radio" name="quiz-q2" value="true" checked></div>' +
            '<div id="quiz-results"></div>';
        document.body.appendChild(form);
        Router.gradeQuiz(form);
        const scoreText = document.getElementById('quiz-results').textContent.replace(/\s+/g, ' ').trim();
        ok('D-04 MCQ+T/F both correct scores 2/2', scoreText.includes('2/2'), scoreText);

        // D-05 syntax highlighting no longer corrupts
        const lessonHtml = CurriculumRenderer.renderLesson('arrays', 'array-basics', 'arr-01');
        const holder3 = document.createElement('div');
        holder3.innerHTML = lessonHtml;
        document.body.appendChild(holder3);
        holder3.querySelectorAll('pre code').forEach(block => { block.innerHTML = Router.highlightCode(block.textContent); });
        const brokenSpans = holder3.querySelectorAll('span[class*="<span"]').length;
        ok('D-05 no corrupted nested spans', brokenSpans === 0, brokenSpans);

        // D-07 search UI shows results on input
        const input = document.getElementById('global-search');
        input.value = 'binary search';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait(400);
        const resultCount = document.querySelectorAll('.search-results .search-result').length;
        ok('D-07 typing shows results', resultCount > 0, resultCount);
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // D-01 compiler initializes past the crash and cannot fake success
        const compiler = new CppCompilerService();
        await compiler.initialize();
        ok('D-01 compiler initializes without crash', compiler.initialized === true, compiler.initialized);
        ok('D-11 honest version label', typeof compiler.getVersion === 'function' && /SIMULATION/i.test(compiler.getVersion()), compiler.getVersion ? compiler.getVersion() : null);
        const result = await compiler.compile('#include <iostream>\nint main(){ return 0; }', { run: true });
        ok('D-01 compile resolves (simulation)', !!result && !!result.execution && /SIMULAT/i.test(result.execution.stdout || ''), result && result.execution ? result.execution.stdout.slice(0, 80) : 'none');

        // D-09 assessments hub renders real topic cards
        location.hash = 'assessments';
        await wait(200);
        const cards = document.querySelectorAll('#content-area .assessment-card').length;
        const quizLinks = document.querySelectorAll('#content-area .assessment-card a[href^="#topic/"]').length;
        ok('D-09 assessments shows 18 topic cards', cards === 18, cards);
        ok('D-09 assessments cards link to lessons', quizLinks >= 10, quizLinks);

        // D-08 export backup contains wrapped data shape
        const exporterText = SettingsRenderer.exportBackup ? 'function-present' : 'missing';
        ok('D-08 exportBackup exists', typeof SettingsRenderer.exportBackup === 'function', exporterText);

        // D-10 manifest + service worker file references
        ok('D-10 manifest link present', !!document.querySelector('link[rel="manifest"]'), document.querySelector('link[rel="manifest"]')?.href);
        ok('D-12 dead renderer not referenced', !document.querySelector('script[src*="tree-graph-visualizer"]'), document.querySelector('script[src*="tree-graph-visualizer"]'));

        // Visualizers still fine
        location.hash = 'visualizers/sorting';
        await wait(200);
        ok('sorting visualizer intact', !!document.getElementById('sorting-canvas'), true);
    } catch (e) {
        out.error = e.message + ' | ' + e.stack;
    }
    out.summary = Object.fromEntries(Object.entries(out.checks).map(([k, v]) => [k, v.pass ? 'PASS' : 'FAIL']));
    const pre = document.createElement('pre');
    pre.id = 'phase1-results';
    pre.textContent = JSON.stringify(out, null, 2);
    document.body.appendChild(pre);
})();


