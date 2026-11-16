# Backup and Recovery Report — C++ DSA Academy

**Evidence dir:** `audit-evidence/phase-0-investigation-20261114-123504/`
**No backups were restored, overwritten, renamed, or modified. SHA-256 of every pre-existing file re-verified unchanged after this investigation (see `evidence/integrity-verification.json`: 51/51 unchanged).**

## 1. Existing backup inventory

| Backup | Size | SHA-256 (prefix) | Corresponding working file | Working size | Working SHA-256 (prefix) | Identical? |
|---|---|---|---|---|---|---|
| `backups/index.html_baseline` | 1,588 B | `C79C3719` | `index.html` | 4,784 B | `343D9918` | **No** |
| `backups/main.css_baseline` | 2,074 B | `3980526B` | `styles/main.css` | 96,495 B | `8AF34349` | **No** |
| `backups/main.js_baseline` | 17,529 B | `4D2F2706` | `scripts/main.js` | 98,490 B | `657557F5` | **No** |

Full backup hashes are available in `project-inventory.json`/`project-inventory.csv` (SHA-256, computed 2026-11-14 ~12:35) and were not altered.

## 2. What the backups actually contain

**`backups/main.js_baseline` fails to parse** — `node --check` reports:

```
backups/main.js_baseline:22
            if (link.getAttribute('href') === #) {
                                              ^
SyntaxError: Invalid or unexpected token
```

(Reproduced by copying the file to `%TEMP%\baseline-main.js` and running `node --check`. The backups directory itself was not touched.)

- Its content is a small top-level prototype: navigation highlighting against `.content-area`, seven topic names as in-page anchors, no router, no curriculum data, no visualizers, no persistence, no Code Lab.
- `index.html_baseline` and `main.css_baseline` are the matching shell/styles for that prototype (index 1.5 KB, CSS 1.9 KB).
- `PROJECT_REPORT.md` (stale, dated 2026-11-14, claims "Version control: None" and "backups byte-identical to working files") actually describes this baseline state, not the current tree — it is outdated on both points.

**Conclusion: the backups are a snapshot of the old, broken prototype. They do not represent a usable prior version of the current app. They should be preserved as historical artifacts, not used as a restore source.**

## 3. Existing audit evidence (not modified)

- `audit-evidence/20261114-audit1/audit-report.md` — 22 bytes, literal `"audit-report content"` (placeholder).
- `audit-evidence/20261114-audit1/PLAN.md` — 20 bytes, literal `"audit-plan content"` (placeholder).
- Six empty result folders (`browser-test-results`, `cpp-compilation-results`, `known-issues`, `offline-test-results`, `screenshots`, `source-diffs`).
- These are stubs, not evidence. They are also untouched.

## 4. Version-control recovery

The project is a git repository pushed to `https://github.com/elyasdemamu644-dev/DSA_Tutorial` (HEAD `1704840`, 20 local commits, one file per commit). Recovery possibilities:

- `git` history contains the backups commit and the current-state files, but the baseline commit itself contains the broken prototype. The most recent committed state **is** the current working tree (clean except the new audit dir).
- No earlier "working" commit exists — the repository was created by this same effort after the app was already broken (crashing compiler service, broken highlighter, etc.). Git is therefore **not a rescue path** for a working app; it only preserves the current state.

## 5. Recovery opportunities

| Item | Location | Recoverable content | Assessment |
|---|---|---|---|
| Baseline prototype | `backups/*_baseline` | 7 topic shells, nav highlighting skeleton | Low value — every claim it supports is obsolete; do not restore |
| Stale `PROJECT_REPORT.md` | project root | Old status narrative | Historically useful; superseded by this audit; do not rely on it |
| Audit stubs | `audit-evidence/20261114-audit1/` | None | Placeholders only |
| `document/` originals | project root | The real educational assets (~76.9 MB, 31 files) | **High-value and irreplaceable; not under version control** |
| Preiss book extracted text | `evidence/extracted-text/Data Structures and Algorithms in C++.txt` (audit copy) | Real text of all 1325 pages of the Bruno Preiss book | Useful for content authoring; **not** a substitute for the original PDF |
| Extracted AASTU/Jimma chapter texts | `evidence/extracted-text/*.txt` | Clean reference text for syllabus-matched chapters | Same |

## 6. Files with no baseline backup

Everything except the three backed-up files — i.e. all 10 `scripts/*.js`, `index.html` (current), `styles/main.css` (current), `test-compiler.html`, `PROJECT_REPORT.md`, `.gitignore`, and the entire `document/` folder — has **no backup outside git**. The `document/` folder in particular is the largest single-point-of-failure (76.9 MB of irreplaceable, untracked PDFs/DOCX/PPTX).

## 7. Risks

1. **Single-machine loss of `document/`** — no version control, no cloud backup observed. Any disk failure destroys the only copy of the teaching material.
2. **Silent overwrite risk in future phases** — any "cleanup" of the audit dir or project would affect originals; this phase changed nothing (verified hashes).
3. **False sense of safety from `backups/`** — names imply recovery value; contents are a dead prototype.
4. **Public GitHub repository does not include `document/`** (gitignored). External distribution would expose nothing sensitive, but also protects nothing.

## 8. Recommendations (not actions — for a later approved phase)

1. Before any rebuild, create a read-only archive copy of `document/` (e.g. to external storage) — **do not** move or rename originals; copy, don't move.
2. Snapshot `document/` hashes (this audit contains them: `project-inventory.json`) and store the manifest in the repo (the PDFs themselves remain out of git by your choice).
3. Label `backups/*_baseline` as historical prototype in README or a note — or leave them; do not delete.
4. Replace/keep `audit-evidence/20261114-audit1/` stubs untouched (their "placeholder" nature is now documented).
5. If any recovery is ever needed, restore **only** via a new approved phase, after archival of current state; never in-place overwrite.
