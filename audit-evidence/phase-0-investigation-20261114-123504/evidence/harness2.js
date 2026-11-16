// Phase 0 runtime verification harness #2 (visualizers, search UI, editor, service worker)
(async () => {
    const out = { ranAt: new Date().toISOString() };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    try {
        // --- search UI behavior ---
        const input = document.getElementById('global-search');
        input.value = 'binary';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait(400);
        out.searchUi = { afterInputResults: document.querySelectorAll('.search-results').length };
        input.dispatchEvent(new Event('focus'));
        await wait(100);
        out.searchUi.afterFocusResults = document.querySelectorAll('.search-results').length;
        out.searchUi.resultLinkCount = document.querySelectorAll('.search-results a.search-result').length;

        // --- sorting visualizer ---
        const sc = document.createElement('canvas');
        sc.width = 800; sc.height = 400;
        document.body.appendChild(sc);
        const sv = new SortingVisualizer(sc, { speed: 10, arraySize: 12 });
        const sortResults = {};
        for (const alg of ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap']) {
            sv.setAlgorithm(alg);
            sv.reset();
            sv.generateArray(10);
            sv.generateSteps();
            const steps = sv.steps.length;
            const finalStep = sv.steps[sv.steps.length - 1];
            const arr = finalStep ? finalStep.array : null;
            const sorted = arr ? arr.every((v, i) => i === 0 || arr[i - 1] <= v) : null;
            sortResults[alg] = { steps, sorted, sample: arr ? arr.slice(0, 6) : null };
        }
        out.sortingVisualizer = { algorithms: Object.keys(sv.algorithms || {}), results: sortResults };

        // --- tree visualizer ---
        const tc = document.createElement('canvas');
        tc.width = 800; tc.height = 400;
        document.body.appendChild(tc);
        const tv = new TreeVisualizer(tc, { speed: 10 });
        tv.generateRandomBST(7);
        let treeNodes = 0;
        const countNodes = n => { if (!n) return 0; return 1 + countNodes(n.left) + countNodes(n.right); };
        treeNodes = countNodes(tv.root);
        const tsteps = tv.steps ? tv.steps.length : 0;
        out.treeVisualizer = { nodes: treeNodes, steps: tsteps, ops: typeof tv.insertNode === 'function' && typeof tv.deleteNode === 'function' && typeof tv.searchNode === 'function' };

        // --- graph visualizer ---
        const gc = document.createElement('canvas');
        gc.width = 800; gc.height = 400;
        document.body.appendChild(gc);
        const gv = new GraphVisualizer(gc, { speed: 10 });
        gv.generateRandomGraph(8, 0.4);
        const vertexCount = gv.nodes.size;
        const startVal = gv.nodes.keys().next().value;
        let bfsSteps = 0, dfsSteps = 0;
        if (startVal !== undefined) { gv.bfs(startVal); bfsSteps = gv.steps.length; gv.dfs(startVal); dfsSteps = gv.steps.length; }
        out.graphVisualizer = { vertices: vertexCount, bfsSteps, dfsSteps, hasDfs: typeof gv.dfs === 'function' };

        // --- code editor ---
        const ta = document.createElement('textarea');
        document.body.appendChild(ta);
        const ed = new CodeEditor(ta, { lineNumbers: true, syntaxHighlighting: true });
        ed.init();
        ed.inputTextarea.value = '#include <iostream>\nint main() { return 0; }';
        ed.inputTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        await wait(50);
        out.codeEditor = {
            wrapperCreated: !!document.querySelector('.code-editor-wrapper, .editor-wrapper'),
            lineNumbers: !!document.querySelector('.editor-line-numbers'),
            highlightLayer: !!document.querySelector('.editor-highlighted'),
            highlightHasSpans: (document.querySelector('.editor-highlighted') || {}).innerHTML ? document.querySelector('.editor-highlighted').innerHTML.includes('<span') : false
        };

        // --- broken lesson highlighting ---
        const lessonHtml = CurriculumRenderer.renderLesson('arrays', 'array-basics', 'arr-01');
        const holder = document.createElement('div');
        holder.innerHTML = lessonHtml;
        document.body.appendChild(holder);
        Router.initCodeHighlighting && null;
        document.querySelectorAll('pre code').forEach(block => { block.innerHTML = Router.highlightCode(block.textContent); });
        const brokenSpans = document.querySelectorAll('span[class*="<span"]').length;
        out.lessonHighlighting = { brokenNestedSpanCount: brokenSpans, sample: (document.querySelector('pre code') || {}).outerHTML ? document.querySelector('pre code').outerHTML.slice(0, 240) : null };

        // --- service worker / offline ---
        try {
            out.serviceWorker = navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : 'unsupported';
        } catch (e) {
            out.serviceWorker = 'unavailable on file:// origin: ' + e.message;
        }
        out.externalResources = Array.from(document.querySelectorAll('link[href^="http"], script[src^="http"]')).map(e => e.href || e.src);
        out.registeredScripts = Array.from(document.querySelectorAll('script[src]')).map(e => e.getAttribute('src'));
        out.nav = { topicLinks: document.querySelectorAll('#nav-list a[href^="#topic/"]').length, allLinks: document.querySelectorAll('#nav-list a').length };
    } catch (e) {
        out.error = e.message + ' | ' + e.stack;
    }
    const pre = document.createElement('pre');
    pre.id = 'harness2-results';
    pre.textContent = JSON.stringify(out, null, 2);
    document.body.appendChild(pre);
})();
