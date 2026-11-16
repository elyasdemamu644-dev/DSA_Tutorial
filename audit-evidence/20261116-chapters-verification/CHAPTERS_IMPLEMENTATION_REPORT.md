# Course Chapters — implementation report

**Project:** C++ DSA Academy — `C:\Users\LENEVO\Desktop\My Projects\DSA_Tutorial`
**Date:** 2026-11-16
**Status:** Implemented and browser-verified. **Intentionally uncommitted** — no commit, push, or deploy was performed for this work.
**Related reports:** `GIT_CHECKPOINT_REPORT.md` (Part A commit), `..\phase-0-investigation-20261114-123504\` (Phase 0/1 evidence).

---

## 1. What this is

A separate, additive learning area named **📖 Course Chapters**, built from the three canonical AASTU SWEG 3103 decks in `document/`:

| # | Chapter | Primary source | Sections | Checks | Exercises | Minutes |
|---|---|---|---|---|---|---|
| 1 | Introduction to Data Structures & Algorithms | `Chapter 1 - Introduction _Data Structure and Algorithm.pdf` (pp. 2–74) | 10 | 10 | 5 | 95 |
| 2 | Simple Sorting and Searching | `Chapter 2 - Simple Sorting and Searching Algorithms.pdf` (pp. 2–43) | **8** | 10 | 6 | 110 |
| 3 | Lists and Linked Lists | `Chapter 3 - Linked Lists.pdf` (pp. 2–56) | **10** | 10 | **6** | 120 |

It renders at `#chapters`, `#chapters/<chapter-id>`, and `#chapters/<chapter-id>/<section-id>`. The existing 18-topic curriculum, its 39 lessons, 101 quizzes, visualizers, Code Lab, notes, bookmarks, assessments, settings, search, and offline shell are untouched in behaviour and appearance.

The `ch-1`, `ch-2`, `ch-3` files in `document/` are alternate-author duplicates of the same outline; they were used only as corroboration. Preiss, Jimma COMP331 notes, and handout worksheets were used as supplementary cross-checks, never as the primary citation for a section. No page or slide number is cited unless it was actually read. For Chapter 3 the PDF is primary; the PPTX is the same deck with template/blank slides, so PPTX slide numbers appear only where a slide was read.

## 2. Content inventory

| Chapter | Objectives | Key terms | Tables | Diagrams | Callouts | Code listings | Compiler-verified | Output blocks |
|---|---|---|---|---|---|---|---|---|
| 1 | 8 | 8 | 12 | 2 | 20 | 5 | 3 | 1 |
| 2 | 6 | 8 | 14 | 0 | 12 | 14 | 7 | 7 |
| 3 | 8 | 10 | 11 | 5 | 13 | 18 | 7 | 7 |
| **Total** | **22** | **26** | **37** | **7** | **45** | **37** | **17** | **15** |

Block types authored and rendered: `p`, `h3`, `ul`, `ol`, `table`, `callout` (source/info/warn/tip), `formula`, `code`, `diagram` (ASCII), and `note`.

Five non-verified **C++** code blocks are clearly presented as fragments or bare type declarations, not runnable programs (the other non-verified `code` blocks are labelled “Actual output” text, not C++):

- Ch 1 `list-adt` — "A minimal List contract (fragment — not a complete program)".
- Ch 3 `list-adt` — the source ADT contract, cleaned to standard C++ syntax.
- Ch 3 `linked-nodes` — the `struct` declaration template and teacher’s `student` record.
- Ch 3 `linked-nodes` — node type and header pointer.
- Ch 3 `doubly-linked` — DLL node structure.

## 2.1 Teacher-notes integration (mandatory source coverage — 2026-11-16)

The mandatory sources `ch-1.txt`, `ch-2.txt`, and `ch-3.txt` were read end to end twice: once in a
first integration pass and again in a **full-integration pass** that found and fixed further omissions.
Existing lessons were preserved and improved, not rewritten. Source page counts were verified from the
`===== PAGE n =====` markers: `ch-1.txt` = 66 pages, `ch-2.txt` = **30** pages (earlier reports wrongly
said 64), `ch-3.txt` = 64 pages.

**First pass:** Ch1 design questions (p. 8) + data-structure philosophy (p. 10); Ch2 binary insertion sort
(p. 25–26); Ch3 static vs dynamic structures (p. 7–8); Ch3 teacher assignment `ch3-ex-6` (p. 64).

**Full-integration pass (this pass):**

- **Ch1 / `why-efficiency`:** added the seconds-vs-days note (p. 5), the definition of efficiency and
  the “do not over-optimize” caution (p. 6), and the teacher’s three-step data-structure selection
  procedure (p. 7).
- **Ch1 / `algorithms`:** added the “problem as mathematical function” note (p. 21) with an academy
  compiled C++ example and a labelled explanation of domain/range/parameters.
- **Ch2 / `sorting-basics`:** added the why-study rationale (p. 2), the **in-place** and **stable**
  properties (pp. 7–8), and the O(n²) simple / O(n log n) advanced classification (p. 8).
- **Ch2 / new section `simple-sort`:** the teacher’s first algorithm (pp. 9–12) — algorithm, `4 2 3 1`
  trace, cleaned compiled C++17 implementation, line-by-line explanation, dry run, and cost analysis.
- **Ch2 / `binary-search`:** added the **divide and conquer** wording (p. 5).
- **Ch2 / `selection-sort`:** added the 60% improvement claim, the `7 9 11 3` source example, and the
  “writes more expensive than reads” note (pp. 20, 24).
- **Ch2 / `insertion-sort`:** preserved the source’s **O(n log n) binary-insertion claim** (p. 30) and
  added a clearly labelled clarification that shifting still makes the total O(n²), plus a compiled
  academy example that separates the two phases.
- **Ch3 / `list-adt`:** added that elements have a data type, not necessarily all the same (p. 3).
- **Ch3 / `linked-nodes`:** added structures/members, the `struct` declaration template, the teacher’s
  `student` record, the **dot vs arrow** operators (p. 16), and **self-referential structures** (p. 17).
- **Ch3 / new section `traversal`:** the five-step display procedure, `display()` code, forward
  navigation, and backward navigation in an SLL (pp. 36–39), with a compiled academy implementation.
- **Ch3 / `doubly-linked`:** added why a DLL needs no start pointer (pp. 49–50) and backward navigation
  through a DLL (p. 59).
- **Ch3 / `applications`:** added the **circular linked list** definition from p. 63 (last node points
  to the first; stop when the current pointer equals `Start`) with a diagram and compiled traversal.
  The earlier text incorrectly said the chapter did not define circular lists.

**Authoritative full mapping, per-heading checklist, integrity notes and limitations:**
`FULL_SOURCE_COVERAGE_20261116.md`. (`TEACHER_NOTES_COVERAGE_20261116.md` is the superseded first pass
and is retained with a banner.)

## 3. C++ verification (real compilation, not simulation)

Every listing marked `verified: "MSVC 19.44 · /std:c++17 /EHsc"` was re-extracted from the chapter data and compiled on 2026-11-16 with:

```
cl /nologo /std:c++17 /EHsc <block>.cpp /Fe:build/<block>.exe
```

Compiler: **MSVC 19.44.35207** (Visual Studio Build Tools 2022). Result, recorded in `code-verification.json`:

- **17 / 17 compiler-verified blocks compile with exit code 0.**
- **17 / 17 run with exit code 0.**
- **15 / 15 embedded "Actual output" blocks match the real program output byte-for-byte** after trailing-whitespace/newline normalisation.
- The two older Chapter 1 verified listings have no output block (self-contained snippets without console output); they still compile and run. The pre-integration 12/12 report is retained as `code-verification.pre-full-integration.json`.

This pass found and fixed two genuine defects in the authored chapter content:

1. **Chapter 2 `linear-search` and `binary-search`** used `std::to_string` without `#include <string>`. Both listings were marked verified but fail on MSVC as authored. `#include <string>` was added to both; both now compile.
2. **Chapter 2 `binary-search` output block** claimed `iterative comparisons=4, recursive comparisons=4` for a missing key. The program actually performs **3** comparisons on the 9-element array (indices 4 → 6 → 5, then the loop exits). The displayed output was corrected to 3/3 to match the real run.

The JSON evidence stores, per block: chapter, section, block index, title, verified label, SHA-256 of the exact source compiled, compile exit code, run exit code, expected output, actual output, and match verdict. Anyone can rebuild the sources from the chapter data and re-run the comparison.

**Not compiled in the browser.** The Code Lab still uses the existing simulation; the proven WASM Clang toolchain (Stage 2 PoC) is not wired in. Chapter code blocks are static, verified listings with copy buttons.

## 4. Files

New:

| File | Size | Lines | Purpose |
|---|---|---|---|
| `content/course-chapters/chapter-01.js` | 49,260 B | 587 | Chapter 1 data |
| `content/course-chapters/chapter-02.js` | 47,885 B | 719 | Chapter 2 data |
| `content/course-chapters/chapter-03.js` | 68,066 B | 1,090 | Chapter 3 data |
| `scripts/course-chapters.js` | 41,653 B | 842 | Renderer, interactions, search adapter, progress store |
| `styles/course-chapters.css` | 34,300 B | 1,481 | All chapter styles, scoped under `.cc-*` |

Each chapter file does `(window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || []).push({ ... })`, so chapters can be added without touching the renderer. The renderer exposes `window.CourseChapters` with `chapters`, `getChapter`, `renderRoute`, `renderOverview`, `renderChapter`, `searchEntries`, `init`, and `progressKey`.

Modified (minimal integration only):

- `index.html` (+10 lines): chapter stylesheet, three data scripts, renderer script, one feature card, one quick-start link.
- `scripts/main.js` (+63/−8): `chapters` routes and `showChapters(parts)`; chapters-aware active-nav matching; **28** chapter sections appended to the global search index with explicit hrefs; backup `version: 2` carries `chapters`; import restores it; clear-all removes it.
- `service-worker.js` (+7/−1): cache name bumped to `dsa-academy-shell-v3`; chapter CSS, renderer, and three data files precached.

## 5. Progress and data model

- Storage key: **`dsa_chapters_v1`** — completely separate from `dsa_progress`, `dsa_notes`, `dsa_bookmarks`, and `dsa_code_files`.
- Shape: `{ version: 1, chapters: { [chapterId]: { sections: { [sectionId]: { read, readAt } }, checks: { [checkId]: { attempts, correct, lastAt } }, completedAt } } }`.
- Marking a section read updates the TOC tick, progress bar, percentage, and chapter card. Reading every section sets `completedAt`, shows a completion banner, and fires a toast once at the transition. Un-marking clears completion.
- Knowledge checks grade immediately, show the explanation, and persist attempts plus the best correct/not-correct result. The header score counts distinct checks whose best result is correct.
- Exercise hints and worked answers are session-only toggles; they are never written to storage.
- Hints and answers use `aria-expanded`; check feedback is announced in a live container; copy buttons confirm with a transient label.
- Export produces `dsa-backup.json` at version 2 with a `chapters` object; import accepts v1 backups (chapter key absent) and v2 backups (chapter key restored); clear-all deletes the chapter key. Import keeps the pre-existing "refresh the page" behaviour because the progress module caches state in memory.

## 6. Browser verification

Evidence: `results.json` in this folder — **58 automated checks, 58 passed, 0 failed**, generated 2026-11-16T20:22:41Z.

Method: Node static server on `http://127.0.0.1:8137`, headless Microsoft Edge driven over the DevTools Protocol with a fresh profile; `localStorage`, service-worker registrations, and Cache Storage are cleared at the start of every run. Seven screenshots were captured at 1440×900 (six) and 375×812 @2× (one).

Coverage groups (all pass):

1. **Overview** — three cards, Chapters 1–3 titles, stats `3 / 28 / 30 / 17`, active nav, all 18 topic links still present.
2. **Chapter rendering** — Chapter 1: 10 sections, 10 checks, 5 exercises, 10 TOC links, code with verified markers, tables/diagrams/callouts, source attribution; Chapter 3: **10 sections** / 10 checks / **6 exercises** and verified compiled examples; Chapters nav stays active deep inside a chapter. Chapter 2 now renders 8 sections including the new `simple-sort` section.
3. **Teacher-note rendering (new)** — explicit assertions that the newly integrated notes appear in the rendered pages: Ch1 three-step selection / problem-as-function / efficiency caution; Ch2 simple-sort trace / in-place+stable / divide-and-conquer / binary-insertion O(n log n) claim; Ch3 struct+dot/arrow / traversal section / DLL-no-start-pointer rationale / circular-list definition.
4. **Layout** — desktop two-column with sticky TOC beside the main column; chapter headers do not inherit the sticky app-bar chrome; mobile 375 px single column with TOC above content and no horizontal overflow.
5. **Reading progress** — mark all, 100% bar and label, banner, toast, persistence under `dsa_chapters_v1`, no writes to `dsa_progress`, reload persistence, unmark to 90%, remark to 100%.
6. **Knowledge checks** — correct and incorrect grading, attempt counters, best-result persistence, explanation text, score update, reload persistence.
7. **Exercises and copy** — hint/answer hidden by default, correct labels and `aria-expanded`, re-hide, nothing persisted, copy button reports success.
8. **Search** — chapter sections indexed (now 28); a chapter hit deep-links to the right section with the TOC entry active.
9. **Backup** — valid JSON at version 2, chapter store present, original four data sets still present; import of a v2 backup stores chapter progress, renders after reload, and clear-all removes it.
10. **Regression** — curriculum still 18 topics / 25 modules / 39 lessons / 101 quizzes at runtime; service worker cache `dsa-academy-shell-v3` includes the chapter CSS, renderer, and all three data files; zero uncaught exceptions; zero `console.error` output.

Phase 1 regression harness re-run after integration: **18/18 PASS**.

Final state of this verification pass: **58/58 checks PASS**, last run 2026-11-16T20:22:41Z after all content edits (full teacher-notes integration included); zero uncaught exceptions; zero console errors.

## 7. Limitations and honest gaps

- **Screenshots were not visually inspected by the agent.** This model cannot accept image input. Layout is verified only through DOM presence, computed styles, and element geometry. A human should open `01-overview.png` … `07-chapter-03-mobile.png` before sign-off.
- No real-device testing (physical phone/tablet) and no formal accessibility audit (screen reader, keyboard-only walkthrough). Focus-visible styling and semantics were authored but not externally audited.
- Chapter progress export/import requires the documented page refresh before the imported state renders.
- The chapter renderer is a classic script and depends on top-level `const` globals (`CURRICULUM`, `Toast`, `SettingsRenderer`) being visible from later scripts; this matches the existing app architecture but is not module-isolated.
- Chapter 1 and Chapter 3 both use a section id `list-adt`. It is harmless because only one chapter renders at a time and every route includes the chapter id; it is recorded here so it is not mistaken for a bug later.
- No commit, push, deploy, database change, or toolchain vendoring was done as part of this work.

## 8. How to review locally

```
# from the project root, with a static server available (Node example)
node <static-server>.js "C:\Users\LENEVO\Desktop\My Projects\DSA_Tutorial" 8137
```

Then open `http://127.0.0.1:8137/index.html#chapters`. A plain `file://` open also works for content, but the service worker and cache assertions require http.

## 9. Reproduce the evidence

```
node --check content/course-chapters/chapter-01.js   # and 02/03, scripts/course-chapters.js, scripts/main.js, service-worker.js
# re-extract verified blocks, compile with MSVC, compare outputs, then run the CDP driver
```

The extraction/compare scripts and the CDP driver live in `%TEMP%\dsa-chapters-verify\` (test tooling, deliberately outside the repository). The durable result of the compile comparison is `code-verification.json` in this folder; the durable result of the browser run is `results.json`.
