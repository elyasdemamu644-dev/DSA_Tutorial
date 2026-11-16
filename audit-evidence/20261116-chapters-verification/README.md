# Evidence index — Course Chapters verification, 2026-11-16

All items below were produced in this session. No prior evidence file was overwritten; this is a new directory.

| File | What it proves |
|---|---|
| `results.json` | 58/58 automated browser checks passed in headless Microsoft Edge over the DevTools Protocol (fresh profile, storage and caches cleared at start). Includes every check name, verdict, detail payload, and the console/exception log. Three of the checks assert that newly integrated teacher notes actually render. |
| `code-verification.json` | 17 compiler-verified C++ listings compiled (17/17) and ran (17/17) with MSVC 19.44.35207 at `/std:c++17 /EHsc`; 15/15 embedded "Actual output" blocks match real program output; SHA-256 of each compiled source. The pre-integration report is kept as `code-verification.pre-full-integration.json`. |
| `01-overview.png` | `#chapters` overview, 1440×900. |
| `02-chapter-01-top.png` | Chapter 1 hero, TOC, and first section, 1440×900. |
| `03-chapter-01-complete.png` | Chapter 1 with all sections marked read, 1440×900. |
| `04-chapter-01-checks.png` | Chapter 1 knowledge checks with grading feedback, 1440×900. |
| `05-chapter-03-top.png` | Chapter 3 hero and first section, 1440×900. |
| `06-chapter-03-code.png` | Chapter 3 verified code block and output, 1440×900. |
| `07-chapter-03-mobile.png` | Chapter 3 at 375×812 @2× (single column, TOC above content). |
| `CHAPTERS_IMPLEMENTATION_REPORT.md` | What was built, content inventory, compilation results, progress model, 58-check coverage, teacher-notes integration, limitations, review steps. |
| `FULL_SOURCE_COVERAGE_20261116.md` | **Authoritative** source-to-lesson audit: every heading and substantive note of `ch-1.txt` (66 pp), `ch-2.txt` (30 pp) and `ch-3.txt` (64 pp) mapped to a website section, with status and added examples. |
| `TEACHER_NOTES_COVERAGE_20261116.md` | Superseded first-pass coverage audit, retained with a banner pointing to the full audit. |
| `pre-full-integration-backup-v3\` | Versioned copies of the four chapter files as they stood before this pass (no backup was overwritten). |
| `GIT_CHECKPOINT_REPORT.md` | The separate Part A commit: `fa46698` on `main`, pushed; `main == origin/main`. |

**Important:** the screenshots were captured but **not visually reviewed by the agent** (the model cannot accept image input). Layout assertions in `results.json` come from computed styles and element geometry. Human visual sign-off is still outstanding.

Supporting evidence outside this folder:

- `..\phase-0-investigation-20261114-123504\evidence\phase1-verify.js|html` — 18-check Phase 1 regression harness; **18/18 PASS** after the chapter integration.
- `..\phase-0-investigation-20261114-123504\evidence\integrity-verification.json` — 51/51 source-document hashes unchanged.
- `..\phase-0-investigation-20261114-123504\evidence\runtime-dom\` — serialized DOM snapshots from Phase 0.

Test tooling (extraction, MSVC build, output comparison, CDP driver) is in `%TEMP%\dsa-chapters-verify\` and is intentionally not part of the repository.
