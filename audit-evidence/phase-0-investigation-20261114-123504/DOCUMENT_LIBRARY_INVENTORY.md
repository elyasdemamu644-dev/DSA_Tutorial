# Document Library Inventory — C++ DSA Academy

**Evidence dir:** `audit-evidence/phase-0-investigation-20261114-123504/`
**Location:** `C:\Users\LENEVO\Desktop\My Projects\DSA_Tutorial\document\`
**Audit artifacts:** `evidence/extraction/document-extraction.json`, `evidence/extraction/topic-hits.json`, `evidence/extraction/topic-hits-outlines.txt`, `evidence/extraction/term-presence.json`, `evidence/extraction/extraction-quality-2.json`, `evidence/extraction/duplicate-analysis.json`, `evidence/extracted-text/*.txt`

## Methodology and limitations

- 32 files examined (25 PDF + 1 PPTX + 5 DOCX = 31, plus one PPTX duplicate relationship noted below). Total ~76.9 MB.
- PDFs were converted to flat XML (`*.fodg`) with LibreOffice headless (`draw_pdf_import`) and text was extracted from `<text:p>` nodes. PPTX was converted to `.fodp`. DOCX was converted to UTF-8 `.txt`. All conversion output was written to `%TEMP%\phase0-extract*` — **originals untouched**.
- 3,779 pages parsed. Text volume ≈ 674,400 raw "words", but that figure includes embedded-image base64 noise; figures in this inventory are **real text** where meaningful.
- Three files are unusable for content extraction: two are scanned image-only (0 real text pages), one is a scanned book with only running headers extractable. These are marked **unreadable** — they require OCR or manual visual review.
- Slides whose body is a picture or a master template render as empty text (e.g. 57 of 129 slides of the linked-lists PPTX), so slide counts and text counts are both reported.
- No TXT files exist in `document/`.

## Duplicates and overlapping material (verified)

| Files | Relationship | Evidence |
|---|---|---|
| `Data structure workshit.docx` and `Data structure workshit (2).docx` | **Byte-identical** (both 119,193 B, SHA-256 prefix `80729CEDB4A83AA6`) | SHA-256 comparison |
| `Data Structure and Algorithm_Worksheet.pdf` ↔ `Data structure workshit*.docx` | Same worksheet content (big-O / complexity exercises) | 5-shingle containment 0.389 |
| `worksheet.docx` | Related but different (loop-complexity code snippets) | text comparison |
| `Chapter 3 - Linked Lists.pdf` ↔ `Chapter 3 - Linked Lists.pptx` | Same chapter content, different formats | shingle containment 0.294/0.331 |
| `ch-1 .pdf` (AASTU Alemitu & Ashenafi, 2011 E.C.) ↔ `Chapter 1 - Introduction _Data Structure and Algorithm.pdf` (Eleni T., AASTU 2015 E.C.) and `ch-1.pdf` | Same course chapter (Introduction & Algorithm Analysis) by different authors or editions | content inspection, containment 0.398; `ch-1.pdf` also carries heavy image-base64 noise |
| `DSA MID TEST 2023-ANSWERSHEET.pdf`, `DSA-Final Exam-ANSWER SHEET -.pdf`, `data struct final exam collections.pdf` | AASTU/SWEG3103 assessment items | course outline match |
| `ch-1.pdf` ↔ `ch-1 .pdf` | Sibling chapter-1 files, different casing/space in name (`ch-1 ` vs `ch-1`) | names inventory |

No documents were deleted, renamed, or modified. Duplicates identified here are preserved as-is.

---

## PDFs (25)

| # | File | Size | Pages | Text extraction | Subject | C++ code? | Exercises? | Value | Classification |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ALgo_Efficiency 74864.pdf | 1.56 MB | 51 | Partial (image pages 13, noisy base64; 31/51 pages real) | Algorithmic efficiency / space & time complexity; references BST/AVL/BFS/complexity questions | Yes (21 code signals) | Some (complexity quiz/exam items) | Core complexity material | **Strong** for Topic 2 |
| 2 | ch-1 .pdf | 0.36 MB | 75 | Good (58/75 real text pages) | Ch. 1 Introduction & Analysis of Algorithms (AASTU, Alemitu & Ashenafi) — ADT, algorithm analysis, Big-O/Ω/Θ | Yes | Some | Primary Chapter 1 source | **Strong** (Tabs 1–2) — near-duplicate of #12 |
| 3 | ch-1.pdf | 0.94 MB | 66 | Poor (all 66 pages contain image/base64; real text intermixed with noise) | Ch. 1 Introduction (same course, likely other edition) | Noise | Unknown | Similar to #2 but degraded | **Needs manual review** — likely duplicates #12/#2 |
| 4 | ch-2.pdf | 0.28 MB | 30 | Good (26/30 pages; 17 real) | Ch. 2 Simple sorting & searching (bubble/selection/insertion/quick sort; linear/binary search) | Yes | Yes | Core sorting/searching algorithms | **Strong** (Tabs 10–11) |
| 5 | ch-3.pdf | 0.50 MB | 64 | Good (60/64 pages; 45 real) | Ch. 3 Linked Lists (singly/doubly/circular, applications) | Yes (46 signals) | Some | Core linked lists with C++ | **Strong** (Tab 4) |
| 6 | ch-4.pdf | 0.44 MB | 40 | Good (37/40; 28 real) | Ch. 4 Stacks & Applications (array/linked impl., infix→postfix, function calls) | Yes (20) | Some | Core stacks | **Strong** (Tab 5) |
| 7 | ch-5.pdf | 0.61 MB | 39 | Good (28/39 real; 15 image) | Ch. 5 Queues (array/circular/linked, deque, priority queue, applications) | Minimal | Some | Core queues | **Strong** (Tab 5) |
| 8 | ch-6.pdf | 0.91 MB | 49 | Good (44/49; 29 real; 34 image) | Ch. 6 Trees (binary tree, BST, traversals, AVL, B-trees, threaded) | Yes (18) | Some | Core trees | **Strong** (Tab 7) |
| 9 | ch-7.pdf | 1.99 MB | 34 | Partial (17/34 real; 29 image) | Ch. 7 Graphs (representation, BFS/DFS, Prim, Kruskal, MST) | Yes (28) | Some (incl. a Prim-heavy set) | Core graphs | **Strong** (Tab 9, 16 partial) |
| 10 | ch-8.pdf | 0.58 MB | 51 | Partial (33/51 real; 30 image) | Ch. 8 Advanced sorting (shell/heap/merge/quick/radix, external sorting) | Yes (3) | Some | Advanced sorting | **Strong** (Tab 11) |
| 11 | ch-9.pdf | 0.52 MB | 35 | Good (33/35; 29 real) | Ch. 9 Searching & Hashing (binary/interpolation search, hash functions, collision resolution, open addressing) | Yes (16) | Some | Core searching & hashing | **Strong** (Tabs 8, 10) |
| 12 | Chapter 1 - Introduction _Data Structure and Algorithm.pdf | 1.64 MB | 74 | Good (68/74; 63 real) | Introduction & Analysis of Algorithms (Eleni T., AASTU 2015 E.C.) — ADT, efficiency, Big-O | Yes (11) | Yes (assignments) | Primary Chapter 1 source | **Strong** (Tabs 1–2) — duplicate-ish of #2 |
| 13 | Chapter 2 - Simple Sorting and Searching Algorithms.pdf | 1.58 MB | 43 | Good (40/43; 23 real) | Same as #4 (Eleni T., AASTU) — sorting/searching fundamentals, internal/external sorting | Yes (10) | Some | Core sorting/searching | **Strong** (Tabs 10–11) |
| 14 | Chapter 3 - Linked Lists.pdf | 0.68 MB | 56 | Good (49/56; 35 real) | Linked Lists (Eleni T., AASTU) — list ADT, singly/doubly/circular, C++ | Yes (49) | Some | Core linked lists | **Strong** (Tab 4); same content as PPTX #27 |
| 15 | data struct final exam collections.pdf | 1.51 MB | 20 | **Unreadable** (0 real pages, 20 image pages) | Likely SWEG3103 final-exam paper(s) | — | Exam | Assessment items only | **Needs manual review** (scan) |
| 16 | Data structure and Algorithm in C++.pdf | 16.84 MB | 738 | **Unreadable** (text yields only running headers, e.g. `"main" - 2011/1/13`; body is images) | Goodrich & Tamassia, *Data Structures and Algorithms in C++*, 2nd ed. (copyright lines extracted) | — | — | Comprehensive reference but content unusable without OCR | **Needs manual review** (scanned); do not cite as reviewed content |
| 17 | Data Structure and Algorithm_Worksheet.pdf | 0.17 MB | 3 | Partial (2/3 real pages) | Worksheet: algorithm/data-structure reasoning, growth rates, asymptotics | Snippets | Yes | Complexity exercises | **Strong** (Tab 2 exercises) |
| 18 | Data Structure and Algoritms-Jimma Univ.pdf | 1.36 MB | 117 | Excellent (104/117 real pages) | **Jimma University COMP331 course notes**: all of intro/analysis, searching/sorting, linked lists, stacks, queues/deque/priority queue, trees, graphs (shell/quick/heap/merge sort §7–8) | Yes (71) | Yes (17 markers) | Closest thing to a complete syllabus-matched course text | **Strong** broad coverage (Tabs 1–12) |
| 19 | Data Structure Course Outline.pdf | 0.46 MB | 4 | Excellent (4/4 real) | **AASTU SWEG 3103 syllabus** — course info, weekly plan, textbook (Shaffer *Introduction to Data Structures and Algorithm Analysis*), outcomes, grading | No | Yes (outline) | Authoritative curriculum skeleton (16 weeks) | **Reference (meta)** |
| 20 | Data Structures and Algorithms in C++.pdf | 11.49 MB | 1325 | Good (1155/1325 pages real; images for figures) | **Bruno R. Preiss, *Data Structures and Algorithms with Object-Oriented Design Patterns in C++*** (Waterloo, CUP-1991/ACM knowledge units AL1–AL8) — models of computer, complexity recursions, lists/stacks/queues, hashing, trees, graphs, exercises & projects per chapter | Yes (134 code signals; full OO C++) | Yes (231 exercise/assignment markers; projects) | Deep, complete reference incl. projects | **Strong** broad coverage (Tabs 1–18, esp. DP/greedy partial) |
| 21 | Drozdek_A_Data_Structures_and_Algorithms_in_C++Bookos_org.pdf | 26.59 MB | 664 | **Unreadable** (0 real pages; 663 image pages) — scan of *Drozdek, Data Structures and Algorithms in C++* (Alexandria eLibrary) | Drozdek textbook | — | — | Comprehensive textbook but unusable without OCR | **Needs manual review** (scanned); do not cite as reviewed content |
| 22 | DSA MID TEST 2023-ANSWERSHEET.pdf | 0.68 MB | 4 | Good (4/4 real) | **AASTU DSA Test (20%), 21/12/2023** — complexity MCQs, big-Ω/Θ, binary search trace, bubble sort worst case (with solutions) | Yes (fragments) | Yes (exam + solutions) | Assessment source (AASTU) | **Strong** (Assessments; Tab 2/10/11) |
| 23 | DSA-Final Exam-ANSWER SHEET -.pdf | 0.24 MB | 4 | Good (4/4 real; 1 mixed) | **AASTU DSA Final Exam SWEG3103, 29 Jan 2024** — queues/deque, BFS, tick-box format (with answer key) | Some | Yes (exam + solutions) | Assessment source (AASTU) | **Strong** (Assessments; Tabs 5/9) |
| 24 | Searching 74867.pdf | 0.15 MB | 11 | Good (9/11 real) | Handout: the Searching Problem; LinearSearch pseudocode; binary search context | Pseudocode | One exercise | Searching intro | **Partial** (Tab 10) |
| 25 | sorting  74869.pdf | 0.63 MB | 53 | Partial (23/53 real; 15 mixed; 19 garbage) | Lecture: Why sorting; problem statement; bubble/selection/insertion; shell/merge/quick/heap/radix; divide & conquer mention | Yes (9 recursion signals) | Some | Core sorting material | **Strong** (Tab 11) |

## PowerPoint (1)

| # | File | Size | Slides | Text extraction | Subject | C++ code? | Notes | Classification |
|---|---|---|---|---|---|---|---|---|
| 26 | Chapter 3 - Linked Lists.pptx | 0.29 MB | 129 | Partial — 37/129 slides real text; 57 slides empty/master or image-only; 13 image slides; 69 low-text | Same as PDF #14 (AASTU Ch. 3, Eleni T.) | Yes (48 code signals) | Slides re-render of the PDF; not reliable as standalone content | **Partial** — use #14/#5 instead |

## Word (5)

| # | File | Size (bytes) | Text extraction | Subject / content | C++ code? | Exercises? | Value | Classification |
|---|---|---|---|---|---|---|---|---|
| 27 | Data Structure & Algorithm questions.docx | 30,472 | Excellent (11,927 chars, ~80 numbered items) | **Tree-question bank**: post-order/pre-order, extended binary trees, threaded trees, BST, AVL, head trees; ~80 MCQ items | No | Yes (all) | Directly reusable for tree quiz assessment | **Strong** (Tabs 7, Assessments) |
| 28 | Data structure workshit (2).docx | 119,193 | Excellent | Same as #29 (**byte-identical duplicate**) | No | Yes | Complexity/asymptotic-notation worksheet | **Strong** (Tab 2 exercises) |
| 29 | Data structure workshit.docx | 119,193 | Excellent | Growth rates, Big-Ω/Θ problems, limit-based notation; worksheet used with #17 | No | Yes | Complexity exercises | **Strong** (Tab 2 exercises) |
| 30 | DS Excercise.docx | 17,864 | Excellent | "Determine, in terms of n, the running time … and its Big-O" — code-fragment analysis (fun1–fun6) | Yes (code fragments) | Yes | Complexity exercises | **Strong** (Tab 2 exercises) |
| 31 | worksheet.docx | 27,964 | Excellent | Loop-complexity code snippets (`for` with multipliers, powers, sqrt/cuberoot) | Yes (code fragments) | Yes | Complexity exercises | **Strong** (Tab 2 exercises) |

## Totals

- Documents examined: **31** (25 PDF + 1 PPTX + 5 DOCX)
- Pages/slides: **3,779** (≈674,400 raw extracted words; ≈fewer real words after removing image-base64 noise; see per-file notes)
- Fully unusable without OCR/manual review: **3** files — `data struct final exam collections.pdf`, `Data structure and Algorithm in C++.pdf` (Goodrich, scanned), `Drozdek_A_Data_Structures_and_Algorithms_in_C++Bookos_org.pdf`
- Pure duplicates: **1 pair** (`Data structure workshit (2).docx` = `Data structure workshit.docx`)
- Near-duplicates (same source material, different authors/editions): Chapter 1×2 (Alemitu vs Eleni T.), Linked Lists PDF vs PPTX vs `ch-3.pdf`, `ch-2.pdf` vs `Chapter 2`, `sorting 74869.pdf` vs `ch-8.pdf`

## Most valuable sources for the academy

1. `Data Structure and Algoritms-Jimma Univ.pdf` — broad, real-text course coverage matching SWEG 3103.
2. `Data Structures and Algorithms in C++.pdf` (Preiss) — complete reference with exercises and projects; extractable.
3. `Data Structure Course Outline.pdf` — authoritative weekly syllabus (16 weeks, AASTU SWEG 3103).
4. Chapter PDFs 1–9 (Alemitu/Ashenafi + Eleni T. AASTU sets) — lecture-structured, instructor-ready material with code.
5. Assessment PDFs/DOCX — reusable quiz/exam sources (trees MCQ bank, Big-O code exercises, complexity worksheets, AASTU mid-test/final with answer keys).

## Not usable / awaiting manual work

- The two scanned textbooks and the scanned final-exam paper must be handled manually or via OCR; they are out of scope of reliable automated extraction.
- `ch-1.pdf` is noise-heavy; use `ch-1 .pdf` / `Chapter 1 …` instead.
