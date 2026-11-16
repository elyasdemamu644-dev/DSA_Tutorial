# Phase 0 Forensic Investigation Report — C++ DSA Academy

**Audit:** `audit-evidence/phase-0-investigation-20261114-123504/`
**Date:** 2026-11-14
**Scope:** Read-only investigation. No source code, educational document, backup, or existing audit artifact was modified. Verified by SHA-256 re-hash of all 51 pre-existing files (see `evidence/integrity-verification.json`).

---

## 1. Verified project identity and path

- Resolved absolute path: `C:\Users\LENEVO\Desktop\My Projects\DSA_Tutorial` — exists, is the project.
- `document\` exists — 31 educational documents, ~76.9 MB.
- No other `dsa-web-tutorial` directory exists anywhere under `C:\Users\LENEVO\Desktop` (searched to depth 3). The similarly named sibling `C:\Users\LENEVO\Desktop\My Projects\Academy` is a broken Python/uv environment (`.venv`), not a web app, and is unrelated.
- Git repository already existed at project root (created and pushed earlier at the user's explicit request, before Phase 0). All Phase 0 work was performed without git writes. Working tree is clean except for the new `phase-0-investigation-20261114-123504/` directory.
- The `document\` folder is excluded from git (`.gitignore` line 1). The repository is public on GitHub.

## 2. Actual architecture

**Static, single-page, client-only vanilla HTML/CSS/JS web app. No build system, no package manager, no backend, no database, no service worker.**

```
index.html                     (shell, 4.7 KB, 96 lines; external Google Fonts; defer scripts)
test-compiler.html             (standalone compiler test page, uses same broken compiler service)
styles/main.css                (94.2 KB, 3595 lines, 9 @media rules, 19 [data-theme] selectors, 85 custom properties)
scripts/curriculum.js          (219.4 KB — CURRICULUM data object + demo algorithm classes)
scripts/code-editor.js         (CodeEditor: custom C++ editor, textarea-overlay highlighting, bracket matching, autocomplete)
scripts/main.js                (2430 lines — AppState, CurriculumRenderer, Router, renderers, Search, Toast, init)
scripts/compiler-service.js    (1911 lines — CppCompilerService: mock/simulation "WASM" compiler)
scripts/sorting-visualizer.js  (SortingVisualizer: bubble/selection/insertion/merge/quick/heap generators + canvas)
scripts/sorting-visualizer-renderer.js (UI wiring for sorting visualizer)
scripts/tree-visualizer.js     (TreeVisualizer: BST insert/delete/search + traversals on canvas)
scripts/graph-visualizer.js    (GraphVisualizer: random graph, BFS/DFS, canvas)
scripts/tree-graph-renderer.js (TreeGraphRenderer: wiring for BST/Graph canvases + theory panel)
scripts/tree-graph-visualizer.js (316 lines — UNREFERENCED dead code, duplicate TreeVisualizer/GraphVisualizer classes)
document/                      (25 PDFs, 1 PPTX, 5 DOCX — source of truth for curriculum)
backups/                       (3 stale baseline files)
audit-evidence/                (existing 20261114-audit1 stubs; new phase-0 dir)
content/, images/, videos/, graphs/  (all empty)
```

**Persistence:** `localStorage` only. Keys in use: `dsa_bookmarks`, `dsa_code_files`, `dsa_compiler_backend`, `dsa_cpp_standard`, `dsa_notes`, `dsa_optimization_level`, `dsa_progress`, `dsa_theme`, plus editor option keys (`opt-auto-indent`, `opt-autocomplete`, `opt-bracket-match`, `opt-line-numbers`, `opt-syntax-highlight`).

**Router:** `AppState` + hash router in `scripts/main.js:439-500`. Default route renders the dashboard; empty/unknown hashes also render the dashboard.

## 3. Project inventory summary

- 51 pre-existing files, 31 directories, 77,580,713 bytes (excluding the new audit dir).
- Extensions: 25 PDF, 10 JS, 5 DOCX, 3 MD, 2 HTML, 1 CSS, 1 PPTX, plus 3 `*_baseline` files and 1 `.gitignore`.
- Empty directories: `graphs/`, `images/`, `videos/`, six `content/*/submodules/`, six `audit-evidence/20261114-audit1/*/` (browser-test-results, cpp-compilation-results, known-issues, offline-test-results, screenshots, source-diffs).
- Machine-readable: `project-inventory.json`, `project-inventory.csv`, `directory-inventory.json` in the audit root.

## 4. Source-code health

- All 10 scripts pass `node --check` (syntax OK). Runtime, however, is not error-free (see defects).
- `curriculum.js` is syntactically valid, parses the `CURRICULUM` object, and its IDs/prerequisites are internally consistent (no key/ID mismatches; no dangling prerequisite references; levels are 6/6/6).
- `main.js` has one trivially detected real defect family:
  - MCQ exercise renderer returns only the opening markup (see D-03).
  - Lesson syntax highlighter corrupts code blocks (see D-05).
  - Sidebar topic navigation is mismatched with the router (see D-02).
- `compiler-service.js` crashes during initialization (D-01).
- No linting, formatting, or test tooling is configured anywhere in the project.

## 5. Existing feature status (summary — full matrix in `FEATURE_VERIFICATION_MATRIX.md`)

Working (runtime-verified): dashboard render, curriculum nav (18 topics listed), topic page, lesson rendering, lesson completion + persistence, notes save/list, bookmarks toggle + persistence, search index (searching works programmatically), theme toggle, sorting visualizer (6 algorithms produce correct sorted arrays), tree and graph visualizers (BST ops, BFS/DFS produce steps), code editor UI (overlay, line numbers), Code Lab UI (templates, editor).

Broken / partially broken: C++ Code Lab (mock compiler crashes on init; shows error; no real compilation), quiz MCQ grading (scores only true/false), MCQ exercise rendering (options never rendered), code-complete exercises (return empty string), lesson code highlighting (produces nested broken spans), sidebar topic navigation (clicking a topic lands on the dashboard), search UI (typing does nothing; only focus with pre-filled value shows results).

Placeholder only: Assessments page (3 "Coming Soon" cards), 8 of 39 curriculum lessons (all Level 2/3 stub topics), sorting lesson (92 chars).

Not implemented: offline/PWA support, service worker, linked-list visualizer (card exists, no canvas class wired), array/stack/queue/searching visualizers (cards exist, no implementations), Assessments content, print UI (print CSS exists, no button).

Not tested: real-device mobile behavior (CSS breakpoints exist but were not device-tested; **no mobile testing claim is made**), screen-reader behavior, multi-browser behavior, compile-time behavior of any real C++ toolchain.

## 6. Confirmed defects (details with file:line in Feature Verification Matrix)

- **D-01** Code Lab compiler service throws `Cannot set properties of undefined (setting 'bits/stdc++.h')` at `scripts/compiler-service.js:222` — `_setupVirtualFilesystem()` writes into `this.virtualFS['/usr/include/c++/v1']` which is never defined (constructor defines only `/working`, `/usr/include`, `/usr/lib` at lines 31-35). Initialization therefore never completes; `Settings → Compiler Status` shows `❌ Error`; `Code Lab → Run` shows the same error; `test-compiler.html` behaves identically.
- **D-02** Sidebar topic links (`renderTopicList`, `scripts/main.js:134`) use `href="#topicId"` (e.g. `#arrays`), but the router only matches `topic/:topicId/...` (lines 444-472). Clicking any sidebar topic navigates to `#arrays`, which falls through to `showDashboard()`. Direct hashes like `#topic/arrays` work; sidebar clicks do not.
- **D-03** MCQ exercise rendering is broken: `renderExercise` returns the opening `<ul>` at `main.js:337` and exits; option markup is built inside a `forEach` whose return values are discarded, and the closing `</ul>` is unreachable. Runtime result: the exercise block contains no `<input type="radio">` and no options (verified: `mcqHasRadio=false`, `mcqHtmlLength=147`).
- **D-04** Quiz grading only counts true/false questions. `gradeQuiz` (`main.js:646`) has an explicit "For MCQ ... Simplified for now" branch (lines 659-662) that does nothing for MCQs. Verified at runtime: a form with one correct MCQ and one correct true/false scores `1/2 (50%)`.
- **D-05** Lesson code syntax highlighting corrupts the markup it generates. `initCodeHighlighting`/`highlightCode` (`main.js:672-687`) runs regexes over already-escaped HTML in order: keywords → types → comments → strings → numbers. Later passes match inside the `<span class="...">` attributes produced by earlier passes, producing `<span class="<span ...` garbage. Verified: 32 nested-broken spans in one sample lesson code block.
- **D-06** `code-complete` exercises render as empty strings (`renderExercise` falls through to `return ''` at `main.js:362`). 12 of 21 exercises (all code-complete ones) are invisible on the page.
- **D-07** Search UI wiring is broken: the `input` event handler (`main.js:2366-2369`) computes results and discards them; `Search.showResults` is only called from the `focus` handler, and only if the value is already ≥ 2 chars. Typing never shows results. Programmatic search itself works (harness: `binary` → 8 hits, `linked list` → 11 hits).
- **D-08** Export/import round-trip mismatch: `exportProgress()` writes a bare progress object as `dsa-progress.json`; `importData()` expects a wrapped object `{ progress, notes, bookmarks }` (`main.js:1810-1865`). Importing an exported file does nothing. `exportNotes()` produces Markdown that the JSON-only importer can never read.
- **D-09** `AssessmentsRenderer` is a "Coming Soon" placeholder (`main.js:1507-1534`).
- **D-10** No offline capability: no `service-worker.js`, no registration call, no `manifest`, and `index.html:10` pulls Google Fonts from `fonts.googleapis.com`/`fonts.gstatic.com`.
- **D-11** Conflicting embedded claim: the standalone compiler path advertises "WASM Clang" but no WASM toolchain is present; the only "compiler" is `_createMockWasmCompiler()` (`compiler-service.js:98`) which simulates output (`[Simulation Mode] C++ code would execute here.`, line 471) even before the crash.
- **D-12** `tree-graph-visualizer.js` is unreferenced dead code; `index.html` loads `tree-graph-renderer.js` which instantiates `TreeVisualizer`/`GraphVisualizer` from `tree-visualizer.js`/`graph-visualizer.js`.

## 7. Conflicting reports reconciliation (full detail in Section F of completion report)

Report A (18 topics / 255 lessons / 72 quizzes / three Canvas visualizers / offline support / mobile testing) and Report B (1.5 KB index.html / 1.9 KB CSS / 17 KB unparsable main.js / 7 topics / 10–15% complete) **describe different things**, and neither is fully accurate for the current working tree:

- Report A's "18 topics" and "72-ish quizzes" are directionally true; the current curriculum has exactly 18 topics and 70 quiz questions. Report A's "255 lessons" is false — there are 39 lessons. Report A's "three working Canvas visualizers" is partially true (sorting + tree + graph = 3, though the card grid lists 9). Report A's "offline support", "mobile browser testing", "print/export working", and "Linked List visualizer" are unsupported/false.
- Report B describes the **`backups/*_baseline` snapshot** of the project (1.5 KB index.html, 1.9 KB CSS, 17 KB main.js with a hard syntax error at line 22 `if (link.getAttribute('href') === #) {`). All three baselines are byte-different from the current working files and are NOT recoverable working code — the current tree is much further along (a full app shell, real visualizer classes) but still broken in the ways above.
- The baselines also mean "the old project" is not cleanly recoverable, but nothing of value exists there beyond the token skeleton.

## 8. Backup and recovery findings (summary)

- `backups/index.html_baseline` 1,588 B ≠ current 4,784 B (SHA-256 prefix C79C3719 vs 343D9918).
- `backups/main.css_baseline` 2,074 B ≠ current 96,495 B (3980526B vs 8AF34349).
- `backups/main.js_baseline` 17,529 B ≠ current 98,490 B (4D2F2706 vs 657557F5).
- Baseline `main.js` does not parse (`node --check` fails at line 22, `#` token).
- Existing audit stubs `audit-evidence/20261114-audit1/audit-report.md` (22 B, literal `"audit-report content"`) and `PLAN.md` (20 B) are placeholders, not reports.
- See `BACKUP_AND_RECOVERY_REPORT.md`.

## 9. Important risks

1. **No real compiler exists in the project or on the machine.** Any claim of "C++ Code Lab works" is false today. The path to a genuine Code Lab requires a new architectural decision (see `CPP_COMPILER_FEASIBILITY.md`).
2. **Curriculum content is thin:** 39 lessons, 8 of which are 87–113 character stubs with a single quiz each; only 14 of 39 lessons have exercises; 31 of 39 have code examples.
3. **Lesson highlighting is corrupt** — most C++ code blocks on lesson pages render mangled markup.
4. **Navigation is misleading:** sidebar topic links silently dump users onto the dashboard.
5. **Export/import is asymmetric** — a user's exported data cannot be re-imported.
6. **Offline claims in stale reports are false** — but the `document/` folder is the authoritative asset and is untracked to git, so it is protected from push but also unbacked-up in version control.
7. **`document/` is not under version control** by design; original PDFs exist only on this machine.
8. **Two large reference PDFs cannot be read** (Drozdek 664 p., Goodrich 738 p.) — both are scanned image files; content mapping relies on other sources.

## 10. Recommended next steps

1. Approve Phase 0 findings.
2. Phase 1 should be infrastructure repair (fix D-01 to D-12) and Code Lab architecture decision, then curriculum build-out from `document/` sources.
3. Do not invest in any "offline" or "mobile" claims until verified.
4. Preserve `document/` and `backups/` untouched; treat the new audit dir as evidence to be archived.
