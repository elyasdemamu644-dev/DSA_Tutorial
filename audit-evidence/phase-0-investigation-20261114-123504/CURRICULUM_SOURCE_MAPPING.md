# Curriculum Source Mapping — C++ DSA Academy ↔ Local Documents

**Evidence dir:** `audit-evidence/phase-0-investigation-20261114-123504/evidence/extraction/`
**Extraction evidence:** `term-presence.json` (term × document counts), `topic-hits.json` (curriculum-topic × pages), `topic-hits-outlines.txt` (per-page first lines), `document-extraction.json`, `extraction-quality-2.json`, `duplicate-analysis.json`, `evidence/extracted-text/*.txt`

**Ratings:** Strong = enough relevant material to build substantial lessons; Partial = useful but missing key concepts; Weak = only brief/intro reference; No identified coverage = nothing usable found; Needs manual review = extraction too degraded to judge reliably (scanned PDFs).

**Important notes**
- Counts in parentheses are literal keyword-hit counts on extracted text. They indicate *presence*, not pedagogical sequence or depth. Scanned documents were excluded from ratings.
- No external/web research was performed. Gaps are reported, not filled.
- Document pairs with heavy overlap (e.g. `ch-1 .pdf` vs `Chapter 1 … .pdf`) should be treated as one source with two authors; the academy should select one canonical version per set and note the others as corroborating.
- C++ code appears in: Preiss (OO-C++ templates, full implementations), AASTU chapter sets and chapters (pointer/class-based C++), Jimma COMP331 (structures/pointers, implementations), worksheets (C++ fragments).

---

## Part 1 — The 18 core topics

### 1. C++ Foundations for DSA — **Strong (scattered)**
Sources: Preiss (templates/OO, `#include` 14, classes 2,622, pointers 318, STL vector 36), `ch-3.pdf` (59 pointer hits, singly/doubly linked impl.), `Chapter 3` PDF/PPTX (class/pointer impl.), Jimma COMP331 (108 pointers, structures/self-referential), `DS Excercise.docx` + `worksheet.docx` (C++ code-fragment analysis), `Data Structure Course Outline.pdf` (Weeks 1–2 C++ revision), AASTU `ch-3/4` (classes/objects in code).
Content quality: university-level memory-model and class/template coverage exists in Preiss and AASTU material, but it is spread across data-structure chapters rather than presented as a coherent "C++ for DSA" unit (stack vs heap, RAII, smart pointers, templates).
Examples/C++: abundant (linked-list and tree classes). Exercises: worksheets analyze code fragments, not writing new owners.
Missing: a dedicated, ordered C++ foundations sequence (RAII, move semantics, STL internals, `vector`/`unordered_map` behaviour guarantees). `ch-3`/`Chapter 3` give the best pointer/class entry points.
Recommendation (not a decision): build this topic from Preiss + Chapter 3 material; add original authoring where a coherent sequence is needed.

### 2. Algorithm Analysis and Complexity — **Strong**
Sources: `ALgo_Efficiency 74864.pdf` (51 pp, space/time complexity, asymptotics), `ch-1 .pdf` (75 pp, Big-O/Ω/Θ/𝒪-notations), `Chapter 1 … .pdf` (74 pp, efficiency/ADTs + assignments), `ch-1.pdf` (degraded duplicate), `worksheet.docx`, `DS Excercise.docx`, `Data structure workshit.docx` / `(2).docx` (identical), `Data Structure and Algorithm_Worksheet.pdf`, dsa Mid-Test 2023 (solutions for Big-Ω/Θ and T(n) = 3nlogn analysis), Preiss (models of computer, axioms, asymptotic notation, recurrence relations — Ch. 2–3 of the book; 85+ hits on big-O/asymptotic, 62 recurrence), Jimma COMP331 §1 (13–19 pp. asymptotics, o/ω notations), Course Outline (Weeks 2–3).
C++ code: fragments + complexity programs (yes). Exercises: **rich** — 5 worksheet/exercise documents with practice problems and solutions (MID TEST).
Depth: university-level, with both theoretical (limits, growth rates) and empirical analysis; supports AASTU-style assessment.
Missing: formal recurrence/Master Theorem as a named theorem is absent (Preiss covers recursion trees and "recurrence" but the term "master theorem" does not occur); amortized analysis exists only in Preiss (24 hits).

### 3. Arrays and Strings — **Strong for arrays / Partial for strings**
Arrays: `ch-2.pdf`, `ch-8.pdf` (53 array hits; merge/quick sort context), `Chapter 2 … .pdf`, `sorting  74869.pdf`, `Searching 74867.pdf` (array problem statement + linear search), Preiss (951+155 array hits; sorting/searching contexts, 2D arrays 155), Jimma (90 arrays, 11 2D/matrix), Course Outline (Weeks 3–4 labs in C++).
Strings: thin. Preiss strings (86+ string/substring hits across sort/search/hash chapters); AASTU material barely mentions strings; no dedicated string algorithms lecture in local docs.
C++ code: yes in all array-heavy docs. Exercises: MID TEST sorting/searching items; worksheets have none for strings.
Missing: dedicated string operations/algorithms (substring matching, editing), 2D arrays beyond matrix contexts; "binary search on answer" is not present anywhere.
Rating split: Arrays = **Strong**; Strings = **Weak**.

### 4. Linked Lists — **Strong**
Sources: `ch-3.pdf` (singly/doubly/circular; applications; 46 C++ code signals), `Chapter 3 ….pdf` (Eleni T., AASTU 2015 E.C.; 19 pointer/class signals), `Chapter 3 ….pptx` (same content, 129 slides, 37 real), `ch-6` (linked lists 145 hits — tree traversals context), Jimma COMP331 §3 (singly/doubly lists; 3 pages each; 13 doubly hits), Preiss (75 singly/59 doubly/21 circular; lists as foundation chapter), `Data structure and Algorithm in C++.pdf` (unusable).
Duplication: three AASTU list sources + Jimma + Preiss — heavy overlap; one canonical should be chosen (e.g. `Chapter 3 ….pdf`) and the others kept as corroborating.
C++ code: abundant (pointer/class implementations, destructors, allocators — note `ll-04` lesson needs canonical code).
Exercises: AASTU chapters and Jimma include list exercises; `Data Structure & Algorithm questions.docx` does NOT cover lists (it is trees).
Depth: university-level. Missing: advanced list patterns (skip lists), allocator details (covered thinly in Preiss).

### 5. Stacks and Queues — **Strong**
Sources: `ch-4.pdf` (40 pp; stack ADT, infix→postfix conversion, function calls; 153 stack hits), `ch-5.pdf` (39 pp; queue ADT, circular array, deque, priority queue; 214 queue hits, 29 deque), `ch-6` (stack hits in tree/backtracking contexts), Jimma COMP331 §4–5 (stack operations; infix→postfix §4.5; queue/deque/priority §5; 75 stack-application hits incl. expression evaluation), Preiss (423 stack hits, 647 queue, STL stack/queue mentions), Final Exam 2024 (queue/deque items), Course Outline (Weeks 6–7).
Code: yes (array and linked implementations). Exercises: expression-evaluation exercises in Jimma and AASTU Ch-4; exam items reuse.
Depth: university-level. Missing: monotonic stacks/queues (0 hits anywhere), deque-as-double-ended in depth; priority-queue internals link to heaps (see Topic 7 / expansion).

### 6. Recursion and Backtracking — **Strong (recursion) / Partial (backtracking)**
Recursion: Preiss (119 recursion hits; recursive algorithms as ACM AL3), Jimma §2–4 (recursion in tree traversals, sorting), AASTU `ch-1` (recursion introduction), `sorting  74869.pdf` (9 recursive-sort hits), all sorting sources (merge/quick sort), Course Outline (Week 3 lab recursion practice).
Backtracking: Preiss (37 hits — explicit backtracking discussion and n-queens 8 hits? n-queens 8 in Preiss), Jimma (3), AASTU `ch-4` (1), `ch-1` (1). Backtracking sources are real but thin.
Code: yes (recursive C++ fragments in AASTU/Jimma; Preiss OO-C++).
Exercises: limited (Preiss exercise sections; no dedicated backtracking worksheet).
Missing: memoization word 0 hits; DP-style recursion↔DP bridge; n-queens/sudoku problem sets; "tower of hanoi" (4 hits in scanned Goodrich — not usable).

### 7. Trees — **Strong (classic) / Partial (advanced structures)**
Classic trees/BST/AVL/traversals: `ch-6.pdf` (49 pp; 181 tree hits, B-tree 14, BST 29, traversal 11), Jimma COMP331 §6 (tree terminology, BST insertion/traversal/deletion/searching; 59 BST), Preiss (188 binary-tree, 445 BST, 129 AVL, B-tree 76, traversal 131 incl. visitor pattern; red-black 101), `Chapter 1` (reference), `Data Structure & Algorithm questions.docx` (~80-item tree MCQ bank: post-order, extended trees, threaded trees, Huffman-related ❓not Huffman — extended/threaded/heap/AVL items).
Heaps: `ch-5.pdf` (priority queue 6), `ch-8.pdf` (heap sort 8), Jimma (heap 12), Preiss (heap 312 — excellent).
Code: abundant C++ (AASTU + Preiss). Exercises: tree MCQ bank (`questions.docx`) + Preiss per-chapter exercises + AASTU answers/exam items.
Missing: Fenwick/Segment trees (0), tries (weak — index references only), threaded trees covered only in MCQ bank; self-balancing provenance (AVL rotations in Jimma/AASTU reasonably covered).
Depth: university-level for classic trees; advanced trees only via Preiss.

### 8. Hashing — **Strong (hash tables) / Partial (advanced)**
Sources: `ch-9.pdf` (35 pp; hash function 9, collision 6, open addressing, linear probing context, interpolation search), Preiss (hash chapter; collision 25, open addressing 77, chaining 11), Course Outline (Week 14), DS MID TEST (hashing mentioned), `Chapter 2` (hashing search 1; external sort — minimal).
Code: yes. Exercises: limited.
Missing: double hashing depth, perfect hashing, SHA/cryptographic hashing, library internals (`unordered_map`).
Depth: university-level for chaining/open addressing (Preiss is analytical).

### 9. Graph Algorithms — **Strong**
Sources: `ch-7.pdf` (34 pp; representation, BFS 17, DFS 21, Prim 1, Kruskal 1, MST 2), Jimma COMP331 §7 (Graph chapter: BFS/DFS/Prim/Kruskal/MST 29; graph representation 14), Preiss (BFS 81, DFS 82, Dijkstra 38, Prim 63, Kruskal 24, topological sort 55, MST 94, Floyd 17, SCC 6, graph representation 108), Course Outline (Weeks 10–11), Final/MID exams (graph items).
Code: yes (AASTU/Jimma pseudocode+C++; Preiss OO-C++).
Exercises: AASTU exam items; Preiss exercises; Jimma exercises.
Missing: negative-weight shortest paths (Bellman-Ford 0), network flow (max flow 0), bridges/articulation (1 hit), DSU-based connectivity (weak).
Depth: university-level for representation/traversal/MST/Dijkstra/topological sort.

### 10. Searching Algorithms — **Strong**
Sources: `Searching 74867.pdf` (11 pp handout, LinearSearch pseudocode), `ch-2.pdf` (linear/binary/interpolation preview; 41 search hits), `ch-9.pdf` (interpolation search 6, full hashing/search chapter), `Chapter 2 … .pdf` (18 hits), Jimma COMP331 (linear 19, binary 31), Preiss (binary search 125), MID TEST (binary search trace with solution), Course Outline (Week 4).
Code: yes. Exercises: MID TEST binary search; worksheets.
Missing: binary search on answer (implementation pattern) — no local source; interpolation search covered in ch-9; sentinel search in ch-2/Chapter 2 only thin.
Depth: university-level for linear/binary/interpolation; insufficient for competitive-programming-style "binary search on answer".

### 11. Sorting Algorithms — **Strong**
Sources: `sorting  74869.pdf` (53 pp; why sorting, bubble/selection/insertion/shell/merge/quick/heap/radix), `ch-2.pdf` + `Chapter 2 … .pdf` (simple sorts), `ch-8.pdf` (51 pp; advanced: shell 6, merge 2, quick 3, heap 8, radix 2), Jimma §7–8 (shell/quick/heap/merge sorts), Preiss (bubble 32, selection 28, insertion 60, merge 48, quick 47, heap sort 22, radix 56, bucket 41), MID TEST (bubble sort worst case; selection sort swaps), Course Outline (Weeks 3, 12 + labs), AASTU `ch-1` (sorting refs).
Code: yes, abundant. Exercises: sorting MCQs/items (MID/Final), AASTU worksheets.
Missing: counting/bucket sort in depth, external sorting (Chapter 2 mentions twice only), stability discussions in AASTU more than Jimma; radix sort good in Preiss.
Depth: university-level overall.

### 12. Greedy Algorithms — **Partial**
Sources: Preiss (knapsack 35 hits — 0/1 knapsack; activity-selection style problems likely; Huffman 18 in Preiss's scanned Goodrich? — no: Huffman hits are all in the unusable Goodrich file; Preiss Huffman = 0). Re-checked: `huffman` total 18, all in `Data structure and Algorithm in C++` (unusable). `knapsack` 35, all real text in Preiss.
AASTU Course Outline (Week 12: greedy; "when it makes sense to proceed greedily").
No AASTU/Jimma lecture notes on greedy.
Depth/code/exercises: limited. University-level requirement not met by local library.
Rating rationale: Preiss knapsack + outline mention give partial scaffolding; a genuine greedy unit (MST as greedy example, interval scheduling, Huffman coding) needs new material or external sources — report the gap; do not fill from web without authorization.

### 13. Dynamic Programming — **Weak**
Sources: Preiss (knapsack 35 — 0/1 knapsack DP; "dynamic program" and LCS hits = 0 real text; memoization = 0). AASTU Course Outline (mentions DP in course description only). No worksheets, no example implementations in local docs.
Rating: weak. The 0/1 knapsack in Preiss is the only usable DP content (and it is also greedy-flavored). University-level DP (tabulation vs memoization, LCS, LIS, coin change, DP on trees/graphs, bitmask DP) is unsupported locally.
This is a significant knowledge gap for Phase 1 content production: needs authoring or authorized external material.

### 14. Divide and Conquer — **Partial**
Sources: sorting sources (merge sort everywhere — ch-2, ch-8, Chapter 2, Jimma §7–8, Preiss merge 48), `sorting  74869.pdf` (merge sort, divide-and-conquer mention), Preiss (divide-and-conquer 39 hits incl. quick select? median-of-medians not confirmed; recurrence Ch. covers divide-and-conquer recurrences), Jimma (divide and conquer 2 hits), Course Outline (mentions D&C).
Missing: closest pair, Strassen, D&C design-pattern treatment, quick select (not verified), master theorem statement.
Rating: partial — strong on the sort special case; thin on the design paradigm.

### 15. Bit Manipulation — **No identified coverage**
`bitwise`/`bit mask` hits = 0 in every readable document. C++ bitwise operators appear nowhere as instructional content.
Rating: no coverage. New authoring required regardless of phase decisions.

### 16. Advanced Graph Algorithms — **Partial**
Sources: Preiss (Floyd–Warshall 17, SCC 6, topological sort 55, Dijkstra 38, MST Prim 63/Kruskal 24), `ch-7.pdf` (Prim/Kruskal), Course Outline (Graph Part I/II).
Missing: Bellman-Ford (0), max flow/min cut (0), bridges/articulation (1 hit), SCC algorithms (Tarjan/Kosaraju as full treatments — only index-level mentions), A* / heuristics.
Rating: partial for Floyd/topological/SCC-intro; **no** flow algorithms.

### 17. Competitive Programming — **No identified coverage**
0 hits; no contest templates, no fast-I/O material, no problem sets.
Rating: none. Closest reusable assets would be worksheets/exam items repurposed as practice, but no structured track exists. Do not fabricate a track from these.

### 18. Practical DSA Projects — **Partial**
Sources: Preiss (**per-chapter programming Projects** — genuinely reusable capstone seeds, e.g. polynomial arithmetic via priority queues, expression trees, set/multiset projects; 62 syllabus/project-like hits at chapter ends), Jimma (projects? not confirmed — 7 practical-project hits), Course Outline (group project work 15%), AASTU worksheets (design tasks, e.g. spelling-checker dictionary).
Missing: none of the local docs defines an end-to-end capstone spec; project selection/evaluation rubric must be authored.
Rating: partial — raw material exists, no packaged project curriculum.

---

## Part 2 — Planned expansion topics

| Expansion topic | Local coverage | Rating | Notes |
|---|---|---|---|
| Heaps & Priority Queues | `ch-5.pdf` (priority queue 6), `ch-8.pdf` (heap sort 8), Jimma (heap 12), Preiss (312 heap hits) | **Strong** | Heapify/heapsort/priority-queue impl. natural fit |
| Tries | Index references only (Jimma 1, outline 2); no body | **No/Weak** | Author or drop from expansion |
| Disjoint Set Union | Index references only (Preiss 4, Goodrich 7 unusable); no body | **Weak** | Preiss index suggests presence but 0 body text extracted |
| Segment Trees | 0 hits | **No coverage** | Author required |
| Fenwick Trees | 0 hits | **No coverage** | Author required |
| Sparse Tables | 0 hits | **No coverage** | Author required |
| Balanced Search Trees (AVL/RB/B-tree/treap) | `ch-6` (AVL 4, B-tree 14), Preiss (AVL 129? — real Preiss AVL 115), red-black 101 (Preiss) | **Strong** | Strong material exists |
| Monotonic Stacks/Queues | 0 hits | **No coverage** | Author required |
| Minimum Spanning Trees | `ch-7` (Prim/Kruskal), Jimma (29 MST hits), Preiss (Prim 63, Kruskal 24, MST 94) | **Strong** | |
| Strongly Connected Components | Preiss 6, `questions.docx` 2, Goodrich 12 (unusable) | **Weak–Partial** | Only conceptual refs |
| Topological Sorting | Preiss 55 | **Strong** | Preiss only |
| Advanced Shortest Paths (Bellman-Ford, negative weights, 0–1 BFS) | 0 real | **No coverage** | Dijkstra/Floyd covered under core |
| Bridges & Articulation Points | 1 hit | **No coverage** | Author required |
| String Matching (KMP, Rabin-Karp, Z) | 0 usable (37 KMP hits = scanned Goodrich; unusable) | **No coverage** | Author required |
| Computational Geometry | 0 usable (7 hits, scanned) | **No coverage** | Out of scope of library |
| Number Theory | 0 real | **No coverage** | Out of scope of library |
| Two Pointers | Preiss 7 (context unverified) | **Weak** | Author/verify |
| Sliding Window | 0 | **No coverage** | Author required |
| Prefix/Difference Arrays | Preiss 6, Goodrich 5 (unusable) | **Weak** | Verify Preiss context during build |
| Binary Search on Answer | 0 | **No coverage** | Author required |
| Sweep Line | 0 usable (8 hits scanned) | **No coverage** | Author required |
| Meet in the Middle | 0 | **No coverage** | Author required |
| Bitmask Dynamic Programming | 0 | **No coverage** | Author required (needs DP first) |
| Offline Query Processing | 0 | **No coverage** | Author required |
| Competitive Programming Preparation | 0 | **No coverage** | Author required |
| Interview Problem Solving | Worksheets/exam items (Big-O, tree MCQs, binary-search trace) | **Partial** | Reuse as practice material only |
| Algorithm Design and Analysis | Strong (see Topic 2) | **Strong** | |
| Advanced C++ for DSA | Preiss OO design patterns; STL in code examples | **Partial** | |
| Problem-Solving Patterns | AASTU/Jimma informal + worksheets | **Weak–Partial** | |

---

## Part 3 — Exercises and assessments inventory

| Asset | Type | Usable as | Notes |
|---|---|---|---|
| `Data Structure & Algorithm questions.docx` | ~80 tree MCQs (post/pre-order, extended/threaded BST, AVL, heap, head-tree) | Tree quiz/mastery tests | Directly reusable |
| `DS Excercise.docx` | 6 code→Big-O items | Complexity exercises | Directly reusable |
| `worksheet.docx` | 10 loop-complexity code fragments | Complexity exercises | Directly reusable |
| `Data structure workshit.docx` (= `(2).docx`) | Growth-rate/Ω/Θ word problems | Complexity exercises | Directly reusable (dedupe) |
| `Data Structure and Algorithm_Worksheet.pdf` | Same worksheet (PDF) | Same | Same content as above |
| `DSA MID TEST 2023-ANSWERSHEET.pdf` | Timed test + worked solutions (complexity, bubble sort, binary search trace) | Auto-graded assessment seed | AASTU 2023 |
| `DSA-Final Exam-ANSWER SHEET -.pdf` | Final exam + key (queues, BFS) | Auto-graded assessment seed | AASTU Jan 2024 |
| `data struct final exam collections.pdf` | Scanned exam papers | Unknown | **Unusable** without manual review |
| Preiss exercises/projects (per chapter) | Open-ended exercises + programming projects | Homework, projects, challenge problems | Rich source |
| Jimma COMP331 exercise markers | Mixed (17 markers) | Practice | Verify item-by-item |
| AASTU ch-1/2/3… exams/answers markers | Solved items embedded in chapters | Practice | Verify item-by-item |
| AASTU Course Outline | Syllabus/outcomes | Curriculum architecture | Authoritative 16-week map |

## Part 4 — Missing material (explicit gaps)

University-level DP (tabulation/memoization; LCS, LIS, coin change, knapsack variants) — **only Preiss's knapsack exists**; no local DP unit exists.
Greedy — only Preiss knapsack + syllabus line.
Bit manipulation — **nothing**.
Competitive programming — **nothing**.
String matching / geometry / number theory — effectively nothing usable.
Negative-weight shortest paths, network flow — nothing.
Segment/Fenwick trees, tries, DSU body text, monotonic stacks — nothing.
Two pointers/sliding window/prefix arrays/binary search on answer — nothing or unverifiable.
External sorting, counting/bucket sort — marginal.
Complexity: recurrence/Master Theorem chapter missing.

**Authorization note:** closing these gaps requires either external/web material (not authorized in Phase 0) or new authoring. No research has been performed and none will be without your instruction.

## Part 5 — Consolidation notes (recommendations, not decisions)

1. Pick one canonical Chapter 1 source (Eleni T., AASTU 2015 E.C.) and one canonical Linked Lists source (Eleni T., AASTU 2015 E.C.); keep the rest as corroboration.
2. Drop nothing. Preserve `ch-1.pdf` (degraded duplicate) and the scanned textbooks as un-touched originals.
3. The `document\` folder is the curriculum authority; generated replacements should not silently overwrite these sources — they should cite them.
