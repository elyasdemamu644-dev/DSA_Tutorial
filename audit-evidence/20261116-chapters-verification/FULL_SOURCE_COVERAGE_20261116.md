# Full source-to-lesson coverage audit — mandatory teacher notes (2026-11-16)

**Project:** C++ DSA Academy — `C:\Users\LENEVO\Desktop\My Projects\DSA_Tutorial`
**Mandatory sources (read end to end for this pass):**

| Source file | Pages actually present | Used for |
|---|---|---|
| `audit-evidence\phase-0-investigation-20261114-123504\evidence\extracted-text\ch-1.txt` | 1–66 | Chapter 1 |
| `...\extracted-text\ch-2.txt` | 1–30 | Chapter 2 |
| `...\extracted-text\ch-3.txt` | 1–64 | Chapter 3 |

**Correction to earlier reports:** previous coverage notes described `ch-2.txt` as “pp. 1–64”. That was
wrong — the file ends at `===== PAGE 30 =====`. All page citations below use the pages actually present
in the extracted text.

**Website implementation:** `content/course-chapters/chapter-01.js` … `chapter-03.js` (Course Chapters area).
This pass added two new sections and many new blocks; all work is local and uncommitted.

## Status legend

- **COVERED** — substantive note was already represented before this pass.
- **ADDED** — note was missing and was integrated in this pass (2026-11-16, full-integration pass).
- **ADDED (earlier)** — note was integrated in the preceding teacher-notes pass on the same day.
- **PARTIAL** — represented in an equivalent form where the extracted text lost formatting (e.g. a graph
  rendered as a computed table). Explained, not silently dropped.
- **CLARIFIED** — source statement preserved verbatim, with a separate labelled explanation where the
  source is ambiguous or technically imprecise.

Extra C++ examples written by this academy are marked “academy example” and are never presented as
teacher material.

---

## Chapter 1 — `ch-1.txt` (66 pages) → `chapter-01.js`

| Source page / heading | Website chapter / section | Status | Added explanation or C++ |
|---|---|---|---|
| pp. 1–2 — title and outline | Ch1 / page header + objectives | COVERED | — |
| p. 3 — Program = Data structure + Algorithm | Ch1 / `why-efficiency` | COVERED | — |
| p. 4 — efficiency concern; faster-computer argument; computational infeasibility | Ch1 / `why-efficiency` | COVERED | “special training in efficient program design” restored this pass |
| p. 5 — any organization can be searched at a time cost; seconds vs many days | Ch1 / `why-efficiency` | **ADDED** | explicit teacher wording |
| p. 6 — efficient = within resource constraints; relative definition; space/time; cost; do not over-optimize | Ch1 / `why-efficiency` | **ADDED** | source callout preserved |
| p. 7 — Selecting a Data Structure: analyze → basic operations → select; simplest that works | Ch1 / `why-efficiency` | **ADDED** | three-step procedure |
| p. 8 — Some Questions to Ask | Ch1 / `why-efficiency` | ADDED (earlier) | — |
| p. 9 — Data Structure Philosophy: costs/benefits, space+time+effort | Ch1 / `why-efficiency` | COVERED | — |
| p. 10 — bank example; choose for operation mix | Ch1 / `why-efficiency` | COVERED | — |
| p. 11 — Goals of the Course | Ch1 / `why-efficiency` | COVERED | — |
| p. 12 — type, data item, member, simple vs aggregate, data type | Ch1 / `adt` | COVERED | — |
| p. 13 — ADT definition; employee example; encapsulation | Ch1 / `adt` | COVERED | — |
| p. 14 — data structure; data members; main memory vs file structure | Ch1 / `adt` | COVERED | — |
| p. 15 — ADT vs data structure comparison | Ch1 / `adt` | COVERED | — |
| p. 16 — List ADT example and five operations | Ch1 / `list-adt` | COVERED | — |
| p. 17 — two implementations: array-based and linked | Ch1 / `list-adt` | COVERED | — |
| p. 18 — List is ADT, linked list is representation; more than one implementation | Ch1 / `list-adt` | COVERED | — |
| p. 19 — logical and physical forms | Ch1 / `adt` | COVERED | — |
| p. 20 — abstraction; hierarchies of labels | Ch1 / `adt` | COVERED | — |
| p. 21 — problems as functions; domain/range; parameters; deterministic | Ch1 / `algorithms` | **ADDED** | academy C++ example `square_of`, compiled + output |
| p. 22 — algorithm definition; English / program / pseudocode | Ch1 / `algorithms` | COVERED | — |
| p. 23 — one problem, many algorithms; best algorithm depends on input class | Ch1 / `algorithms` | COVERED | — |
| p. 24 — five algorithm properties | Ch1 / `algorithms` | COVERED | canonical PDF lists eight; the five teacher properties are included |
| p. 25 — two design goals (understandability vs efficiency) | Ch1 / `counting-operations` | COVERED | — |
| p. 26 — empirical vs asymptotic; why empirical is unsatisfactory | Ch1 / `counting-operations` | COVERED | — |
| p. 27 — factors affecting running time; critical resources | Ch1 / `counting-operations` | COVERED | machine, OS, compiler, input, effort |
| p. 28 — time and space complexity; T(n) | Ch1 / `counting-operations` | COVERED | — |
| pp. 29–30 — five analysis rules | Ch1 / `counting-operations` | COVERED | — |
| pp. 31–33 — worked counts 4n+6, 5n+5, 2n²+4n+5 | Ch1 / `counting-operations` | COVERED | — |
| pp. 34–35 — formal approach; size; basic operation | Ch1 / `counting-operations` | COVERED | — |
| pp. 36–39 — for loops → summations; nested loops; consecutive; conditional | Ch1 / `counting-operations` | COVERED | — |
| pp. 40–41 — T(n) = cn and T(n) = C | Ch1 / `growth-rates`, `notation` | COVERED | — |
| p. 42 — asymptotic analysis | Ch1 / `growth-rates` | COVERED | — |
| p. 43 — growth-rate table | Ch1 / `growth-rates` | COVERED | — |
| p. 44 — growth-rate graph | Ch1 / `growth-rates` | PARTIAL | graph image lost in extraction; replaced by a clearly labelled computed comparison table |
| p. 45 — best/worst/average sequential search; (n+1)/2 | Ch1 / `cases` | COVERED | — |
| pp. 46–50 — upper bound; Big-Oh definition and three examples | Ch1 / `notation` | COVERED | — |
| p. 51 — “best case is n=1” misunderstanding | Ch1 / `cases` | COVERED | — |
| p. 52 — lower bound | Ch1 / `notation` | COVERED | — |
| pp. 53–54 — Big-Omega definition and example | Ch1 / `notation` | COVERED | — |
| p. 55 — Theta notation | Ch1 / `notation` | COVERED | — |
| p. 56 — worst case vs upper bound misunderstanding | Ch1 / `cases` | COVERED | — |
| pp. 57–58 — four simplifying rules; ignore constants and lower-order terms | Ch1 / `notation` | COVERED | — |
| pp. 59–61 — running-time examples | Ch1 / `notation` | COVERED | — |
| p. 62 — while / if / switch / function call | Ch1 / `notation` | COVERED | — |
| p. 63 — space bounds; overhead | Ch1 / `space` | COVERED | — |
| pp. 64–65 — array Θ(n), friendship matrix Θ(n²) | Ch1 / `space` | COVERED | — |
| p. 66 — space/time trade-off; packing; factorial lookup; disk I/O | Ch1 / `space` | COVERED | — |

## Chapter 2 — `ch-2.txt` (30 pages) → `chapter-02.js`

| Source page / heading | Website chapter / section | Status | Added explanation or C++ |
|---|---|---|---|
| p. 1 — title | Ch2 / page header | COVERED | — |
| p. 2 — why study sorting/searching; searching definition; key; index or −1 | Ch2 / `sorting-basics`, `linear-search` | **ADDED** | teacher rationale preserved |
| p. 3 — two searching algorithms; linear-search algorithm | Ch2 / `linear-search` | COVERED | — |
| p. 4 — `LinearSearch` source code; worst case n → O(n) | Ch2 / `linear-search` | COVERED | cleaned C++17 |
| p. 5 — binary search; **divide and conquer**; three steps; repeat until one element | Ch2 / `binary-search` | **ADDED** | source callout with exact wording |
| p. 6 — `BinarySearch` source code; O(log n) | Ch2 / `binary-search` | COVERED | cleaned C++17, iterative + recursive |
| p. 7 — sorting definition; importance; **in-place** property | Ch2 / `sorting-basics` | **ADDED** | property table + stability analysis |
| p. 8 — **stable** property; O(n²) simple vs O(n log n) advanced classes | Ch2 / `sorting-basics` | **ADDED** | class table |
| pp. 9–12 — **Simple sort**: algorithm, source code, `4 2 3 1` trace, comparison/swap sums | Ch2 / **new section `simple-sort`** | **ADDED** | compiled academy implementation, line-by-line explanation, dry run, cost table |
| p. 13 — 32-item exercise | Ch2 / `comparison`, exercise `ch2-ex-6` | COVERED | — |
| pp. 14–18 — bubble sort algorithm, two traces, source code, O(n²) | Ch2 / `bubble-sort` | COVERED | — |
| pp. 19–24 — selection sort; 60% claim; `7 9 11 3` example; source code; swaps; write-cost note | Ch2 / `selection-sort` | **ADDED** | claims + source example + write-cost callout |
| pp. 25–30 — insertion sort; card analogy; binary insertion; complexity claims incl. O(n log n) | Ch2 / `insertion-sort` | **ADDED** | binary-insertion note + source claim preserved + labelled clarification + compiled academy example |

## Chapter 3 — `ch-3.txt` (64 pages) → `chapter-03.js`

| Source page / heading | Website chapter / section | Status | Added explanation or C++ |
|---|---|---|---|
| p. 1 — title | Ch3 / page header | COVERED | — |
| p. 2 — chronological order; simple list | Ch3 / `list-adt` | COVERED | — |
| pp. 3–4 — list definition, position, notation, “ordered” = positions, element data type, empty/length/head/tail | Ch3 / `list-adt` | COVERED + **ADDED** | element-data-type note added this pass |
| p. 5 — sorted vs unsorted; design basic operations first | Ch3 / `list-adt` | COVERED | — |
| p. 6 — current position; add/find/delete/next/prev/clear/empty | Ch3 / `list-adt` | COVERED | — |
| pp. 7–8 — static vs dynamic data structures | Ch3 / `list-adt` | ADDED (earlier) | — |
| p. 9 — array insert shifts elements, Θ(n) | Ch3 / `array-list` | COVERED | — |
| pp. 10–13 — `AList` class (constructor, clear, navigation, getValue, insert, append, remove) | Ch3 / `array-list` | COVERED | cleaned, compiled C++17 |
| pp. 14–17 — **struct** and **member**; declaration template; student record; **dot** and **arrow** operators; **self-referential** structure | Ch3 / `linked-nodes` | **ADDED** | template + operator table + explanation |
| p. 18 — linked list uses dynamic allocation; self-referential; node data and pointer fields | Ch3 / `linked-nodes` | COVERED | — |
| p. 19 — diagram; Start/Head; last node → NULL | Ch3 / `linked-nodes` | COVERED | — |
| pp. 20–23 — SLL and DLL types; schematic representation | Ch3 / `linked-nodes` | COVERED | — |
| p. 24 — basic operations: create, insert, delete, search | Ch3 / `linked-nodes` | COVERED | — |
| pp. 25–27 — declaring the node, `new`, filling name/age/dept | Ch3 / `sll-insert` | COVERED | — |
| pp. 28–35 — three insertion cases with `insert_beg`, `insert_end`, `insert_after` | Ch3 / `sll-insert` | COVERED | compiled |
| pp. 36–39 — **display the list (five steps)**; `display()` code; **move forward**; **move backward in an SLL** | Ch3 / **new section `traversal`** | **ADDED** | compiled academy implementation of the teacher’s steps, labelled as such |
| pp. 40–46 — three deletion cases with `del_first`, `del_last`, `del` | Ch3 / `sll-delete` | COVERED | edge-case fixes explained |
| pp. 47–48 — arrays vs linked lists table; operation-complexity table | Ch3 / `arrays-vs-linked` | COVERED | — |
| pp. 49–50 — DLL fields; two NULLs; **no start pointer needed**; why an SLL needs one | Ch3 / `doubly-linked` | **ADDED** | rationale paragraph |
| p. 51 — DLL advantages and disadvantages vs SLL | Ch3 / `doubly-linked` | COVERED | — |
| pp. 52–58 — DLL structure; `insert_beg`, `insert_end`, `insert_after` | Ch3 / `doubly-linked` | COVERED | compiled |
| p. 59 — navigating backward through a DLL | Ch3 / `doubly-linked` | **ADDED** | three-step list |
| pp. 60–61 — deletion changes two links; `del_at` | Ch3 / `doubly-linked` | COVERED | — |
| p. 62 — applications: MRU, browser cache, undo, stack/hash/tree | Ch3 / `applications` | COVERED | — |
| p. 63 — **circular linked lists**: last → first; how to know traversal is finished (compare current with Start) | Ch3 / `applications` | **ADDED** | definition + diagram + compiled academy traversal |
| p. 64 — student-record assignment | Ch3 / exercise `ch3-ex-6` | COVERED | — |

---

## Coverage checklist by note category

| Category | Ch1 | Ch2 | Ch3 |
|---|---|---|---|
| Definitions and terminology | `adt`, `list-adt` | `sorting-basics`, `linear-search` | `list-adt`, `linked-nodes` |
| Classifications and categories | `classification` | `sorting-basics` (in-place/stable, cost classes) | `list-adt` (static/dynamic), `linked-nodes` (SLL/DLL) |
| Principles, rules, conditions | `why-efficiency`, `counting-operations` | `binary-search` precondition | `sll-insert`, `sll-delete` pointer order |
| Algorithms and procedures | `algorithms` | `simple-sort`, `insertion-sort`, `selection-sort`, `bubble-sort`, searches | `sll-insert`, `traversal`, `sll-delete`, `doubly-linked` |
| Formulas and mathematical explanations | `counting-operations`, `notation` | cost analyses | complexity tables |
| Tables and comparisons | `adt`, `growth-rates` | `comparison` | `arrays-vs-linked` |
| Examples and worked problems | exercises 1–5 | exercises 1–6 | exercises 1–6 |
| C++ code and pseudocode | 3 verified blocks | 7 verified blocks | 7 verified blocks |
| Diagrams and descriptions | classification diagram, ADT diagram | cards trace, search traces | SLL/DLL diagrams, circular diagram |
| Advantages and disadvantages | `why-efficiency` | `comparison` | `doubly-linked`, `arrays-vs-linked` |
| Limitations and special cases | `space` | preconditions, non-adaptive sorts | single-node deletion, pointer order |
| Warnings and observations | two “common misunderstandings” | slide syntax artifacts, binary-insertion claim | sketch edge-case bugs |
| Exercises and assignments | 5 exercises | 6 exercises | 6 exercises, incl. teacher assignment |

## Verification of this pass

- **Source read:** all three extracted-text files read from line 1 to EOF; page ranges verified from the
  `===== PAGE n =====` markers.
- **Rendered-content check:** three browser assertions confirm the newly added teacher notes are actually
  present in the rendered pages (Ch1 selection procedure / function model / efficiency caution; Ch2 simple
  sort / properties / divide-and-conquer / binary-insertion claim; Ch3 structures / traversal / DLL rationale /
  circular lists).
- **Compilation:** 17/17 verified C++ blocks compiled and ran with MSVC 19.44.35207 at
  `/std:c++17 /EHsc`; 15/15 embedded “Actual output” blocks match real program output.
- **Browser:** 58/58 checks pass; zero console errors; zero uncaught exceptions.
- **Regression:** Phase 1 harness 18/18 pass; curriculum unchanged at 18 topics / 25 modules / 39 lessons / 101 quizzes.

## Genuine limitations

- `ch-2.txt` contains no sorting-classification diagrams or advanced-sort implementations; none were invented.
- The growth-rate **graph** (ch-1 p. 44) is lost in extraction; a computed table is used and labelled as an
  illustration, not a teacher quote.
- Several source C++ sketches use pseudo-C++ (`Void`, `datatype`, missing headers, stray braces). Every such
  example is preserved in meaning and paired with a clearly labelled cleaned/compiled C++17 version.
- Screenshots were regenerated but not visually reviewed by the agent (no image input); layout was verified
  programmatically. Human visual sign-off remains outstanding.
