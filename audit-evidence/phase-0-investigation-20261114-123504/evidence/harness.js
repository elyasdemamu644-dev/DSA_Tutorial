// Phase 0 runtime verification harness (read-only against app code)
(async () => {
    const out = { ranAt: new Date().toISOString() };
    try {
        out.state = {};
        AppState.markLessonComplete('arrays', 'array-basics', 'arr-01');
        out.state.markComplete = AppState.isLessonComplete('arrays', 'array-basics', 'arr-01');
        out.state.progressStored = !!localStorage.getItem('dsa_progress');
        out.state.topicProgress = AppState.getTopicProgress('arrays');
        AppState.saveNote('arrays', 'array-basics', 'arr-01', 'phase0 test note');
        out.state.note = AppState.getNote('arrays', 'array-basics', 'arr-01');
        AppState.toggleBookmark('arrays', 'array-basics', 'arr-01');
        out.state.bookmarked = AppState.isBookmarked('arrays', 'array-basics', 'arr-01');
        out.state.notesPageLength = NotesRenderer.render().length;
        out.state.bookmarksPageLength = BookmarksRenderer.render().length;

        Search.buildIndex();
        const s1 = Search.search('binary');
        const s2 = Search.search('linked list');
        out.search = { binary: s1.length, linkedList: s2.length, firstBinary: s1[0] ? (s1[0].title || s1[0].lessonTitle || JSON.stringify(s1[0]).slice(0, 120)) : null };

        const mcq = { type: 'mcq', question: 'Pick one', options: ['a', 'b'], correct: 1 };
        const m = CurriculumRenderer.renderExercise(mcq, 0);
        const cc = CurriculumRenderer.renderExercise({ type: 'code-complete', question: 'x', code: 'y' }, 0);
        const ct = CurriculumRenderer.renderExercise({ type: 'code-trace', question: 'x', code: 'y' }, 0);
        out.exercises = { mcqHtmlLength: m.length, mcqHasRadio: m.includes('type="radio"'), mcqHasOptions: m.includes('>a<') || m.includes('a</label>'), codeCompleteHtmlLength: cc.length, codeTraceHasTextarea: ct.includes('<textarea') };

        const ll = CurriculumRenderer.renderLesson('linked-lists', 'll-basics', 'll-01');
        const arr = CurriculumRenderer.renderLesson('arrays', 'array-basics', 'arr-01');
        out.lessonRender = { ll01Chars: ll.length, ll01EmptyExercisesSection: ll.includes('class="exercises"') && ll.includes('<section class="exercises">\n            </section>'), arr01Chars: arr.length, arr01HasContent: arr.includes('lesson-content'), arr01QuizCount: (arr.match(/quiz-question/g) || []).length };

        const form = document.createElement('form');
        form.innerHTML = '<div class="quiz-question mcq" data-id="q1"><input type="radio" name="quiz-q1" value="1" checked></div>' +
            '<div class="quiz-question true-false" data-id="q2" data-correct="true"><input type="radio" name="quiz-q2" value="true" checked></div>' +
            '<div id="quiz-results"></div>';
        document.body.appendChild(form);
        Router.gradeQuiz(form);
        out.quiz = { scoredText: document.getElementById('quiz-results').textContent.replace(/\s+/g, ' ').trim(), bothAnswersCorrectButScore: document.getElementById('quiz-results').textContent.includes('1/2') };

        applyTheme('dark');
        out.theme = { htmlAttr: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('dsa_theme') };

        out.dashboard = { htmlChars: DashboardRenderer.render().length };

        out.visualizers = {
            cards: VisualizerRenderer.visualizers.length,
            sortingRenderChars: SortingVisualizerRenderer.render().length,
            treeGraphRenderChars: TreeGraphRenderer.render().length,
            canvasCount: document.querySelectorAll('canvas').length
        };

        const compiler = new CppCompilerService();
        await compiler.initialize();
        out.compiler = { version: compiler.getVersion(), mode: compiler.mode || compiler.backend || null };
        const result = await compiler.compile('#include <iostream>\nint main(){ std::cout << "hello"; return 0; }', { run: true });
        out.compiler.success = result.success;
        out.compiler.stdout = result.execution ? result.execution.stdout : null;
        out.compiler.errors = result.errors ? result.errors.map(e => e.message) : [];
    } catch (e) {
        out.error = e.message + ' | ' + e.stack;
    }
    const pre = document.createElement('pre');
    pre.id = 'harness-results';
    pre.textContent = JSON.stringify(out, null, 2);
    document.body.appendChild(pre);
})();
