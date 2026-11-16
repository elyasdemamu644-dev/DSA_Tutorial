# C++ Compiler Feasibility — C++ DSA Academy

**Evidence dir:** `audit-evidence/phase-0-investigation-20261114-123504/`
**Status: investigation only. No architecture has been selected or implemented. No toolchain was installed. No source code was sent to any external service.**

## 1. Current reality (verified)

- **No C++ compiler exists on this machine.** Verified absences: `g++`, `gcc`, `clang`, `clang-cl`, `cl`, `zig`, `tcc`, `emcc`, `wasm-ld` (not on PATH); no `LLVM`, `MinGW`, `MSVC`, `Emscripten`, or `emsdk` directories; no `*.wasm`, `*.bc`, `*.a`, `*.lib` assets anywhere in the project.
- **Docker exists** (`docker` command found), but the only registered distro is `docker-desktop`, and its WSL is **stopped**; no images are present or were pulled.
- **The project's "compiler" is a mock.** `scripts/compiler-service.js` advertises a "WebAssembly-compiled clang/LLVM toolchain (via Emscripten)" in comments (lines 8, 90-99) but creates a *mock* (`_createMockWasmCompiler()`), and even that path **crashes before producing anything**: `_setupVirtualFilesystem()` writes `this.virtualFS['/usr/include/c++/v1'][name]` at line 222 while the constructor only creates `/working`, `/usr/include`, `/usr/lib` (lines 31-35). Result (runtime-verified in headless Edge): `Cannot set properties of undefined (setting 'bits/stdc++.h')` — shown by Code Lab "Run" and by Settings → Compiler Status (`❌ Error`).
- Had the crash not occurred, the mock's `_interpretCpp()` returns a canned string (`"[Simulation Mode] C++ code would execute here.\nActual execution requires WebAssembly …"`, line 471) — **no C++ is ever compiled or executed, even in the non-crashing path** (`_simulateCompile`/`_simulateLink` also mock).
- `test-compiler.html` is a standalone page pointing at the same broken service.
- **No honest labeling exists today**: Settings presents "WebAssembly (WASM Clang) ⚡" as if functional (`main.js:1577`), with "None (Simulation Mode)" as a selectable fallback — except the "Simulation Mode" is equally unreachable due to the crash.

**Conclusion: nothing about a genuine C++ Code Lab exists yet, and a "fix" that leaves the mock in place would not satisfy the product decision.**

## 2. Option 1 — Browser-based WebAssembly C++ compiler (preferred investigation track)

### What it would look like
- A WebAssembly build of Clang/LLVM (e.g. clang-wasm via Emscripten) vendored beside the app, running 100% in the browser, lazy-loaded on first "Run", optionally cached by a future service worker.
- The existing mock service's API surface (`initialize`, `compile`, `onProgress`, virtual FS for headers) is already shaped for this — but its internals must be replaced, and its claims must be honest.

### Feasibility on this machine
- Browsers present: Microsoft Edge 157.0.4341.46, Google Chrome 157.0.8103.79 — both support WebAssembly, SIMD (optional), streaming compilation. No COOP/COEP headers required for a basic single-threaded clang.
- No WASM assets exist; obtaining/building one requires either (a) building clang-wasm with Emscripten (a large, specialist effort: LLVM build, ~hours–days, significant expertise) or (b) vendoring a pre-built clang WASM release (evaluation of size, license, provenance needed — some are GPL/Apache; binary redistribution must be checked).

### Trade-offs
| Criterion | Assessment |
|---|---|
| Offline | **Best** — after first download, fully offline; fits local-first vision |
| Browser compat | Evergreen Chromium/Gecko/WebKit; performance varies; large memory footprint |
| Performance | Typically 5–30× slower than native; compile times of seconds for typical student programs; heavy (hundreds of MB) initial artifact |
| Security | **Strongest isolation available**: runs inside the browser sandbox; no filesystem/network/process access beyond explicit FS; no server to secure |
| Size/bandwidth | 50–150+ MB compressed artifact; conflicts with "local-first, instant load" unless lazy-loaded and cached |
| Maintenance | Pinned toolchain version; upgrade cadence; long-term dependency on a stalled clang-wasm ecosystem (several projects are unmaintained; risk) |
| Cost | Free (FOSS toolchain) |
| Privacy | Excellent — code never leaves the machine/browser |

### Sub-options
- **1a. Full clang/LLVM WASM** — genuine; large; build/maintenance risk; must prove artifact availability and license.
- **1b. WASMToy/”mini compiler” demos** — not genuine C++17/20; unacceptable per approved decisions.
- **1c. Forged from existing project mock** — forbidden (must not fake).

## 3. Option 2 — Locally installed C++ compiler (integration)

### What it would look like
- Install MinGW-w64 or LLVM/Clang on Windows (system change), then drive it from either a tiny local Node companion (stdin/stdout, temp files) or directly from the browser via a localhost bridge. The project's Settings already contains a fictitious "Local Companion App (Named Pipe)" option (`main.js:1578`) — it is a UI fiction today.

### Trade-offs
| Criterion | Assessment |
|---|---|
| Offline | Yes (local) |
| Performance | Native — fastest; best for large programs |
| Security | Weaker: compiling untrusted student code on the student's own machine is acceptable (it's their code), but a *hosted* shared workflow would need sandboxing (restricted user, timeouts, `rlimit`, job objects, AppContainer) |
| Maintenance | Installer/bundle management; PATH/toolchain resolution per OS; Windows-specific friction; can't be assumed on every contributor machine |
| Cost | Free (MinGW/LLVM) |
| Privacy | Excellent |

### Blockers today
- **Nothing is installed** (verified). Installing a toolchain is a system-level change requiring explicit user authorization and must keep the project's preservation rules (no D: writes; C: only).
- Requires per-machine setup; harms the "just open index.html" local-first simplicity if not bundled as a companion installer.

## 4. Option 3 — Dedicated local execution service

### What it would look like
- A small local service (Node or similar) that accepts code, writes it to a sandboxed temp dir, invokes a real compiler with timeouts/memory limits, and returns stdout/stderr/exit code. The browser app talks to `http://localhost:<port>` (or a named pipe on Windows, as the UI already fictionalizes).

### Trade-offs
| Criterion | Assessment |
|---|---|
| Offline | Yes, once running |
| Performance | Native compile + run — best |
| Security | Requires real sandboxing design (least-privilege user, job objects/`Process job Object`, temp dir jails, timeouts, output caps) — non-trivial but standard |
| Maintenance | A second process to install/update/keep running; versioning the service vs the web app |
| Cost | Free |
| Privacy | Excellent (nothing leaves the machine) |

This is the **best student-experience outcome** and the strongest production architecture if a toolchain is bundled or documented for install — but it is the most engineering work and the most surface area.

## 5. Option 4 — Optional isolated online execution service (future)

### What it would look like
- Outsourcing to e.g. Wandbox/Godbolt/Paiza/JDoodle, or a self-hosted Judge0 in a locked-down container.

### Trade-offs
| Criterion | Assessment |
|---|---|
| Offline | No |
| Browser compat | Trivial |
| Security | Good public services sandbox well, but **the user's code flows through third-party infrastructure**; availability/rate-limits/policy changes out of our control; self-hosting Judge0 is again a Docker/server problem |
| Performance | Network round trips; queueing |
| Cost | Free tiers exist; paid tiers at scale; maintenance of keys/quotas |
| Privacy | **Poor — must not be the default**; only viable as an explicitly opt-in, clearly-labeled online mode, never silently |

Per your directive, **no code should be sent to any external service without authorization. None was.** This option is listed for completeness and is *not recommended as the primary path*.

## 6. Side-by-side comparison

| Criterion | 1. WASM Clang | 2. Local compiler | 3. Local service | 4. Online service |
|---|---|---|---|---|
| Genuine C++17/20 | ✅ | ✅ | ✅ | ✅ |
| Offline | ✅ (after cached download) | ✅ | ✅ | ❌ |
| Zero-install for students | ✅ | ❌ | ❌ (one-time) | ✅ |
| Isolation/security | ✅✅ browser sandbox | ⚠️ own machine | ⚠️ must engineer | ⚠️ third-party trust |
| Performance | ⚠️ slow-ish but fine for student programs | ✅ native | ✅ native | ⚠️ network |
| Artifact size | ❌ large (lazy-load) | n/a | n/a | n/a |
| Maintenance burden | ⚠️ toolchain vendoring | ⚠️ installer | ⚠️ service + installer | ⚠️ service account + policy |
| Privacy | ✅✅ | ✅ | ✅ | ❌ |
| Cost | ✅ free | ✅ free | ✅ free | ⚠️ variable |
| Complexity to deliver | High (build/vendor) | Low (if authorized) | High | Low |
| Fits "local-first" vision | ✅✅ | ✅ | ✅ | ❌ |

## 7. Recommendation (reasoned, not implemented)

**Primary recommendation: Option 1 (browser WASM Clang), delivered lazily (loaded on first Run), cached by a future service worker — with Option 3 as the explicit fallback if the WASM proof-of-concept fails.**

Rationale:
- It is the only option that satisfies all three hard constraints simultaneously: **genuine compilation**, **offline capability**, **no installs/privileged changes required from the student**, and **local-first** privacy.
- Security is inherited from the browser sandbox — no privileged process is created, no untrusted code runs with user privileges.
- The existing mock service is already API-shaped for this (initialize → compile → run), so the upgrade path replaces internals rather than the whole Code Lab UI.
- Option 2/3 require installing toolchains on this machine and on every student machine — possible later, but Option 3 additionally burdens every user with running a local service, and Option 2 leaks machine state without providing cross-platform uniformity; neither is "open index.html and learn".
- Option 4 is disqualified as the default by privacy and the user's own constraint; it may appear later only as an explicitly-labeled, opt-in online mode behind an authorization decision.

**Mandatory caveats / proof-of-concept gate before commitment:**
1. A WASM clang artifact suitable for C++17 must be located, license-checked, and size-measured — this is the single biggest unknown (artifact availability, provenance, license).
2. Compile-time benchmark on this machine for a 200-line program must be measured; if it exceeds classroom tolerance (~5–10 s), Option 3 becomes primary.
3. Test harness must prove: `#include <bits/stdc++.h>` support, STL linking, `cin`/stdin handling, error diagnostics surfaced verbatim.
4. UI must honestly label which mode is active and must never fabricate output.
5. The broken mock service must be replaced or fail loudly — silently "fixing" the crash while keeping the simulation would violate the approved requirement ("Genuine compilation and execution, not simulated output").

**Decision needed from you:** whether to authorize (a) a WASM clang investigation/PoC sub-phase in Phase 1 (no installs beyond project-local vendoring), or (b) authorizing installation of LLVM/MinGW on this machine to build Option 3 directly. Until that decision, Phase 1 should repair the existing defects (D-01 to D-12) and build the compiler behind a feature flag, leaving the genuine-compilation verification as a separate gate.

## 8. What NOT to do

- Do not keep or extend `_createMockWasmCompiler()`.
- Do not label anything "Simulation Mode" or "WASM Clang" while it compiles nothing.
- Do not send student code to any online compiler without explicit, separate authorization.
- Do not commit to a compiler architecture before the PoC measurements in Section 7 exist.
