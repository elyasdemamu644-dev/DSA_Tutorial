# Feature Verification Matrix — C++ DSA Academy

**Verification methods:** (1) source-code inspection with file:line; (2) headless Microsoft Edge (157.0.4341.46) DOM dumps and scripted harnesses — all in `evidence/` (DOM copies in `evidence/runtime-dom/`, harness outputs embedded in this report and referenced); (3) `node --check` on all scripts; (4) programmatic curriculum analysis (`evidence/curriculum-stats.json`).
**No mobile device testing was performed.** No cross-browser testing beyond Edge. No C++ toolchain testing (none exists).

Status legend: **Verified working** · **Partially implemented** · **Present but broken** · **Placeholder only** · **Not implemented** · **Not tested**

| # | Feature | Evidence | Verification | Actual result | Status | Defects / remaining work |
|---|---|---|---|---|---|---|
| 1 | Dashboard | `scripts/main.js:704+` (`DashboardRenderer.render`, `getOverallStats`); `evidence/runtime-dom/dom-dashboard.html`; harness1 | Headless Edge render + harness (`DashboardRenderer.render()` → 12,638 chars) | Renders stats grid, recent lessons, per-topic progress bars; totals derived from localStorage + curriculum | Verified working (data correctness of "recent lessons" depends on persisted data) | None blocking |
| 2 | Curriculum navigation (sidebar) | `renderTopicList` `main.js:104-141`; nav render `main.js:2334-2357` | Headless Edge DOM | 18 topics listed in three levels with progress bars | Partially implemented | **D-02:** sidebar topic links (`href="#arrays"`) navigate to the dashboard instead of the topic (`main.js:134` + router `main.js:444-472`); direct `#topic/arrays` hashes work |
| 3 | Topic page | `renderTopicContent` `main.js:144-206`; `evidence/runtime-dom/dom-arrays.html` | Headless Edge route `#topic/arrays` | Renders module list, lesson links, bookmark buttons, progress | Verified working | Bookmark buttons only exist here (not on lesson page) |
| 4 | Lesson rendering | `renderLesson` `main.js:222-365`; `evidence/runtime-dom/dom-lesson.html`, `dom-search.html` | Headless Edge route `#topic/arrays/module/array-basics/lesson/arr-01` | Lesson HTML, code examples, notes section, quiz, prev/next nav all render | Partially implemented | **D-05** code highlighting broken (D-05); content coverage thin (8 stub lessons) |
| 5 | Lesson completion | `AppState.markLessonComplete` `main.js:32-59`; harness3 | Scripted click on `#complete-btn` | Button flips to "✓ Completed"; `dsa_progress` written; `isLessonComplete` true; topic progress recomputed (1/3, 33%) | Verified working | — |
| 6 | Progress tracking | `AppState.getTopicProgress` `main.js:47-59` | Harness1 + runtime | Per-topic % computed from `dsa_progress` (verified 33% example) | Verified working | Export asymmetry (D-08); no sync/export round-trip |
| 7 | Notes | `AppState.saveNote/getNote/loadNotes` `main.js:61-75`; `NotesRenderer` `main.js` (`#notes`); harness1/3 | Scripted save/get + DOM | Save + list + page render verified (963-char page render); lesson notes textarea wired (`main.js:606-618`) | Verified working (UI wiring unverified — `alert()` not exercised) | `alert()` in save path; export is Markdown-only (no import) |
| 8 | Bookmarks | `AppState.toggleBookmark` `main.js:82-102`; topic-page `.bookmark-btn` `main.js:189-195`; `BookmarksRenderer` `main.js:1446+`; harness1 | Scripted toggle + DOM | Toggle persists to `dsa_bookmarks`; page renders 735-char view | Partially implemented | No bookmark button on the lesson page itself; only on topic lists. Requires manual review for UX completeness |
| 9 | Search | `Search` `main.js:1883-1957`; init wiring `main.js:2360-2385`; harness2/3 | Scripted `input`/`focus` events + programmatic search | Programmatic search works: `binary`→8, `linked list`→11; results render when `focus` fires with prefilled value. **Typing does nothing** (`input` handler discards results) | Present but broken (UI); index works | **D-07:** input handler must call `Search.showResults`; no keyboard navigation of results |
| 10 | Theme switching | `applyTheme`, `#theme-toggle` wiring `main.js:2388-2406`; harness2/3 | Clicked toggle in headless Edge | `data-theme` set/removed (`dark`→`light`); `dsa_theme` persists; toggle aria-pressed updated | Verified working | — |
| 11 | Sorting visualizer | `sorting-visualizer.js`, `sorting-visualizer-renderer.js`; `dom-sortviz.html`; harness2 | Headless Edge + programmatic instantiation | Canvas renders; all six algorithms (bubble/selection/insertion/merge/quick/heap) generate steps and produce correctly sorted arrays (verified with 10-element arrays) | Verified working | Not verified: animation timing, keyboard controls, accessibility |
| 12 | Tree visualizer (BST) | `tree-visualizer.js`, instantiated by `tree-graph-renderer.js:498,615`; `dom-treegraph.html`; harness2 | Programmatic BST generate + node count | 7-node BST generated; insert/delete/search present; 14–15 recorded steps | Verified working | Instance wiring present in renderer; renderer canvas measured 1 canvas; step animation unverified |
| 13 | Graph visualizer (BFS/DFS) | `graph-visualizer.js` (`nodes` Map, `bfs` `main.js` line 150, `dfs` line 209), wired in `tree-graph-renderer.js:501,618`; harness2 | Programmatic random graph + traversals | 8 vertices, BFS 50 steps, DFS 59 steps | Verified working | DFS neighbor order logic unverified for correctness of *visited set*; not a UI defect |
| 14 | Linked-list visualizer | `renderTopicList` card: `VisualizerRenderer` `main.js:874-884` (`id: 'linked-list'`) | Source inspection | **Card exists; no linked-list canvas class exists anywhere** (no `linked-list-visualizer.js`; global search of `LinkedList` shows only curriculum demo classes) | Placeholder only | This is NOT a visualizer; card/grid item must be removed or implemented |
| 15 | Additional visualizers (array, stack, queue, searching) | `main.js:874-884` (9 cards: array, linked-list, stack, queue, tree, graph, sorting, tree-graph, searching) | Source + DOM | Only `sorting` and `tree-graph` have implementations; the other 7 cards render with canvases but **no renderer classes exist** | Placeholder only | Dead UI surface area |
| 16 | Practice & quizzes | `renderQuizQuestion` `main.js:365-387`; `gradeQuiz` `main.js:646-670`; `renderExercise` `main.js:335-362`; harness1/3 | Scripted DOM forms | T/F grading works; **both-correct MCQ+T/F scores 1/2 (50%)**; MCQ exercise options never render; code-trace renders but code is mangled by highlighter; code-complete renders empty (12/21 exercises invisible) | Present but broken | **D-03, D-04, D-06**; quiz data has 54 mcq + 16 true/false, only T/F scored |
| 17 | C++ editor | `code-editor.js` (1243 lines: line numbers, overlay highlight, bracket match, autocomplete, tab handling); `dom-codelab.html`; harness2 | Headless Edge Code Lab | Editor instantiates around textarea; wrapper/line-numbers/overlay created | Partially implemented | Editor works but overlay highlight produces no spans on `input` in automated test (needs manual verification); large surface, minimal testing |
| 18 | **Genuine C++ compilation & execution** | `compiler-service.js`; harness1 (`compile()` call); `test-compiler.html`; Settings status | Headless Edge | `initialize()` throws `Cannot set properties of undefined (setting 'bits/stdc++.h')` at `compiler-service.js:222`; Settings shows `❌ Error`; Run shows identical error; canned `[Simulation Mode] C++ code would execute here.` exists in `_interpretCpp` (line 471) but is unreachable because init crashes first | Present but broken — **no genuine compilation exists** | **D-01, D-11**; requires architectural decision (see `CPP_COMPILER_FEASIBILITY.md`) |
| 19 | Local persistence | `AppState` + `localStorage` keys enumerated in codebase: `dsa_progress`, `dsa_notes`, `dsa_bookmarks`, `dsa_code_files`, `dsa_theme`, `dsa_compiler_backend`, `dsa_cpp_standard`, `dsa_optimization_level`, editor opts | Harness1 runtime | Read/write round-trips verified for progress/notes/bookmarks/theme | Verified working | No schema versioning; no migration path |
| 20 | Export/Import | `exportProgress` `main.js:1810`, `exportNotes` `main.js:1821`, `importData` `main.js:1842`, `clearAllData` `main.js:1867`; `SettingsRenderer` export buttons verified in DOM | Source + DOM | Export buttons exist; **export format (bare object) cannot be re-imported** (import expects wrapped `{progress,notes,bookmarks}`); Markdown export is unimportable (JSON only) | Present but broken | **D-08** |
| 21 | Offline operation | No `service-worker.js`; no registration; `index.html:10` external Google Fonts; `Directory inventory` confirms no manifest | Source search + Edge | **Not supported** | Not implemented | D-10; fonts + all JS local but no app-shell caching |
| 22 | Mobile-responsive interface | `main.css` 9 `@media` (3× max-1024px, 3× max-768px, print, contrast, reduced-motion); `index.html:5` viewport meta | Source only | Responsive rules exist; **never tested on a device** | Not tested | Claims of "mobile-tested" in stale reports are false; verification requires device pass |
| 23 | Assessments hub | `AssessmentsRenderer` `main.js:1507-1534`; `evidence/runtime-dom/dom-quizzes.html` | Headless Edge route `#assessments` | 3 cards with disabled "Coming Soon" buttons; no quiz/challenge content | Placeholder only | D-09; assessments must be designed in a later phase |
| 24 | Print / print CSS | `styles/main.css` `@media print` block; `PROJECT_REPORT.md` claims "print/export" | Source | Print stylesheet exists; **no print button or JS print path**; Ctrl+P would work but untested | Partially implemented (CSS only) | Not tested at runtime |
| 25 | Lesson code syntax highlighting | `initCodeHighlighting`/`highlightCode` `main.js:672-687`; harness2 | Scripted application to lesson `<pre><code>` | 2-pass regex over HTML corrupts output (32 broken nested `<span class="<span…` in one arr-01 block) | Present but broken | **D-05** |
| 26 | Settings page | `SettingsRenderer` `main.js:1539+`; `dom-settings.html`; harness3 | Headless Edge route `#settings` | Theme select, export/import/clear buttons render; compiler status = `❌ Error` (see #18) | Partially implemented | Compiler status broken (D-01); data-management UI OK |
| 27 | Notes page | `#notes` route | Headless Edge `#notes` | Renders saved notes list (963 chars for one seeded note) | Verified working | — |
| 28 | Bookmarks page | `#bookmarks` route | Headless Edge `#bookmarks` | Renders bookmarked list (735 chars) | Verified working | Empty-state unverified visually |
| 29 | `test-compiler.html` | Standalone page loading same `compiler-service.js` | Source + Edge run | Same D-01 crash; not usable as a compiler | Present but broken | Fix D-01 or remove page per decision |
| 30 | `tree-graph-visualizer.js` | `scripts/tree-graph-visualizer.js` (316 lines) | `Select-String` across HTML | **Dead code — never referenced by any HTML** | Not implemented (dead) | D-12 |
| 31 | `service-worker.js` | — | File search | Absent | Not implemented | D-10 |

---

## Verified topics content (the seven named topics)

| Topic | Modules | Lessons | Quizzes | Code ex. | Status |
|---|---|---|---|---|---|
| Arrays and Strings | 2 | 3 | 3 | 3 | Content exists, lesson page renders; stub-free |
| Linked Lists | 2 | 4 | 9 | 7 | Content exists + exercises (linked-list code-complete among the 21) |
| Stacks and Queues | 2 | 3 | 8 | 6 | Content exists (incl. a real Queue lesson sq-02 + priority queue pq-01) |
| Trees | 2 | 4 | 9 | 6 | Content exists (BST/AVL/Segment-Fenwick); strongest single topic |
| Graph Algorithms | 2 | 3 | 8 | 3 | Content exists (BFS/DFS, Dijkstra, MST Prim/Kruskal) |
| Sorting Algorithms | 1 | **1 (stub, 92 chars)** | 1 | 0 | **Effectively missing** — nav entry is a shell |
| Searching Algorithms | 1 | 1 | 3 | 1 | Content exists (Binary Search on Answer, 4,748 chars) |

Reference: `evidence/curriculum-stats.json`. Note the curriculum contains 18 topics total; eight of them (sorting, greedy, DP, divide-conquer, bit-manipulation, advanced-graphs, competitive-programming, practical-projects) are **87–113-character stubs** with a single quiz question and no code/exercises.

## Evidence files

- `evidence/runtime-dom/` — serialized DOMs for home, lesson, dashboard, codelab, sorting visualizer, tree-graph visualizer, settings, assessments, visualizers, notes, bookmarks, search lesson (see `runtime-harness*.html/js` for exact reproduction).
- `evidence/screenshots/*.png` — 12 headless-Edge screenshots (home, dashboard, topic-arrays, lesson-arrays, visualizers, sorting-visualizer, tree-graph-visualizer, code-lab, settings, assessments, sorting-lesson-stub, linked-lists-lesson). Desktop 1440×1100 viewport only — **not** mobile/device evidence.
- `evidence/curriculum-stats.json` — machine-extracted curriculum statistics.
- `evidence/extraction/*.json` — document extraction metrics.
- Compiler crash log references: `compiler-service.js:222`; runtime message captured in `evidence/runtime-dom/dom-settings.html` ("❌ Error"), `evidence/screenshots/settings.png` (visible UI error), and Code Lab output (harness3).

## Feature counts

- Verified working: 10 (dashboard, topic page, lesson completion, progress, notes, theme, sorting viz, tree viz, graph viz, notes/bookmarks pages + local persistence + search index).
- Partially working / present-but-broken: 9 (nav sidebar, lesson rendering, quizzes, C++ editor, Code Lab, assessments, export/import, print CSS, settings).
- Verified broken: Code Lab compiler (D-01), quiz grading (D-04), exercise rendering (D-03/D-06), highlighting (D-05), search UI (D-07), sidebar topic nav (D-02).
- Not implemented: offline/service worker, linked-list visualizer, 7 other visualizer cards, Assessments content, Bit Manipulation & DP & CP content.
- Not tested: real mobile behavior, cross-browser, accessibility/screen-reader, print output, animation/UX polish.
