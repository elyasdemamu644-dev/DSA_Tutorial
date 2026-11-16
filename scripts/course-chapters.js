/* C++ DSA Academy — Course Chapters renderer.
   Additive learning area for the canonical AASTU SWEG 3103 Chapters 1–3.
   Kept separate from the 18-topic curriculum so existing progress is untouched.
   Progress namespace: dsa_chapters_v1 (versioned, local-only). */
(function () {
    'use strict';

    const STORAGE_KEY = 'dsa_chapters_v1';

    // ------------------------------------------------------------
    // Small formatting helpers
    // ------------------------------------------------------------
    const escapeHtml = (value) => String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // Supports **bold**, *italic*, and `inline code` without letting the
    // asterisks inside a code span turn into emphasis.
    function inline(text) {
        const tokens = [];
        let out = escapeHtml(text).replace(/`([^`]+)`/g, (match, code) => {
            tokens.push(`<code>${code}</code>`);
            return `\u0001${tokens.length - 1}\u0001`;
        });
        out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        out = out.replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s).,;:!?])/g, '$1<em>$2</em>');
        out = out.replace(/\u0001(\d+)\u0001/g, (match, index) => tokens[index]);
        return out;
    }

    function renderParagraphs(text) {
        return String(text || '')
            .split(/\n{2,}/)
            .map(chunk => chunk.trim())
            .filter(Boolean)
            .map(chunk => `<p>${inline(chunk).replace(/\n/g, '<br>')}</p>`)
            .join('');
    }

    // Exercise prompts may contain fenced C++ snippets.
    function renderRichText(text) {
        const source = String(text || '');
        const fence = /```(\w*)\n([\s\S]*?)```/g;
        let html = '';
        let last = 0;
        let match;
        while ((match = fence.exec(source)) !== null) {
            html += renderParagraphs(source.slice(last, match.index));
            html += `<pre class="cc-inline-code"><code>${escapeHtml(match[2].replace(/\n$/, ''))}</code></pre>`;
            last = fence.lastIndex;
        }
        html += renderParagraphs(source.slice(last));
        return html || '<p></p>';
    }

    const CHAPTERS = () => {
        const raw = window.COURSE_CHAPTERS;
        return Array.isArray(raw) ? raw.slice().sort((a, b) => a.number - b.number) : [];
    };

    function getChapter(idOrNumber) {
        if (idOrNumber == null) return null;
        const key = String(idOrNumber);
        return CHAPTERS().find(chapter =>
            chapter.id === key || String(chapter.number) === key
        ) || null;
    }

    // ------------------------------------------------------------
    // Local progress (separate from dsa_progress)
    // ------------------------------------------------------------
    const Progress = {
        state: null,

        load() {
            if (this.state) return this.state;
            try {
                const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (parsed && typeof parsed === 'object' && parsed.chapters && typeof parsed.chapters === 'object') {
                    this.state = parsed;
                }
            } catch (error) {
                this.state = null;
            }
            if (!this.state) {
                this.state = { version: 1, chapters: {} };
            }
            return this.state;
        },

        save() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch (error) {
                /* storage may be unavailable; the session still works */
            }
        },

        chapter(chapterId) {
            const state = this.load();
            if (!state.chapters[chapterId] || typeof state.chapters[chapterId] !== 'object') {
                state.chapters[chapterId] = { sections: {}, checks: {}, completedAt: null };
            }
            const record = state.chapters[chapterId];
            if (!record.sections || typeof record.sections !== 'object') record.sections = {};
            if (!record.checks || typeof record.checks !== 'object') record.checks = {};
            return record;
        },

        isRead(chapterId, sectionId) {
            return this.chapter(chapterId).sections[sectionId]?.read === true;
        },

        toggleSection(chapterId, sectionId) {
            const record = this.chapter(chapterId);
            const nowRead = record.sections[sectionId]?.read !== true;
            if (nowRead) {
                record.sections[sectionId] = { read: true, readAt: new Date().toISOString() };
            } else {
                delete record.sections[sectionId];
            }

            const chapter = getChapter(chapterId);
            const complete = !!chapter && chapter.sections.length > 0
                && chapter.sections.every(section => record.sections[section.id]?.read === true);

            let completedNow = false;
            if (complete && !record.completedAt) {
                record.completedAt = new Date().toISOString();
                completedNow = true;
            } else if (!complete) {
                record.completedAt = null;
            }

            this.save();
            return { read: nowRead, completed: complete, completedNow };
        },

        recordCheck(chapterId, checkId, correct) {
            const record = this.chapter(chapterId);
            const previous = record.checks[checkId] || { attempts: 0, correct: false };
            record.checks[checkId] = {
                attempts: previous.attempts + 1,
                correct: previous.correct === true || correct === true,
                lastAt: new Date().toISOString()
            };
            this.save();
            return record.checks[checkId];
        },

        getCheck(chapterId, checkId) {
            return this.chapter(chapterId).checks[checkId] || null;
        }
    };

    function chapterStats(chapter) {
        const record = Progress.chapter(chapter.id);
        const totalSections = chapter.sections.length;
        const readSections = chapter.sections.filter(section => record.sections[section.id]?.read === true).length;
        const totalChecks = chapter.checks.length;
        const correctChecks = chapter.checks.filter(check => record.checks[check.id]?.correct === true).length;
        return {
            readSections,
            totalSections,
            totalChecks,
            correctChecks,
            totalExercises: chapter.exercises.length,
            percentage: totalSections ? Math.round(readSections / totalSections * 100) : 0,
            completed: totalSections > 0 && readSections === totalSections
        };
    }

    function overallStats() {
        return CHAPTERS().reduce((totals, chapter) => {
            const stats = chapterStats(chapter);
            totals.chapters += 1;
            totals.sections += stats.totalSections;
            totals.read += stats.readSections;
            totals.checks += stats.totalChecks;
            totals.correct += stats.correctChecks;
            totals.exercises += stats.totalExercises;
            return totals;
        }, { chapters: 0, sections: 0, read: 0, checks: 0, correct: 0, exercises: 0 });
    }

    // ------------------------------------------------------------
    // Search integration
    // ------------------------------------------------------------
    function blockText(block) {
        if (!block) return '';
        switch (block.type) {
            case 'p':
            case 'h3':
            case 'formula':
            case 'note':
                return block.text || '';
            case 'ul':
            case 'ol':
                return (block.items || []).join(' ');
            case 'table':
                return [block.caption || '', ...(block.head || []), ...((block.rows || []).flat())].join(' ');
            case 'callout':
                return `${block.title || ''} ${block.text || ''}`;
            case 'code':
                return `${block.title || ''} ${block.language || ''} ${block.code || ''}`;
            case 'diagram':
                return `${block.title || ''} ${block.text || ''}`;
            default:
                return block.text || '';
        }
    }

    function searchEntries() {
        return CHAPTERS().flatMap(chapter => {
            const shared = [
                chapter.title,
                chapter.subtitle,
                ...(chapter.objectives || []),
                ...(chapter.keyTerms || []).map(term => `${term.term} ${term.definition}`)
            ].join(' ');

            return chapter.sections.map(section => ({
                href: `#chapters/${chapter.id}/${section.id}`,
                title: section.title,
                chapterTitle: `Chapter ${chapter.number} · ${chapter.title}`,
                content: [section.title, ...(section.blocks || []).map(blockText)].join(' ').replace(/[*`]/g, ' '),
                keywords: shared
            }));
        });
    }

    // ------------------------------------------------------------
    // Block rendering
    // ------------------------------------------------------------
    let codeCounter = 0;

    function renderCode(block) {
        codeCounter += 1;
        const id = `cc-code-${codeCounter}`;
        const language = block.language || 'text';
        const label = language === 'text' ? 'Output' : language.toUpperCase();
        const verified = block.verified
            ? `<div class="cc-verified"><span aria-hidden="true">✓</span> Compiled and run · ${escapeHtml(block.verified)}</div>`
            : '';
        return `
            <figure class="cc-code-block" id="${id}">
                <figcaption>
                    <span class="cc-code-title">${escapeHtml(block.title || 'Code')}</span>
                    <span class="cc-code-tools">
                        <span class="cc-code-language">${escapeHtml(label)}</span>
                        <button type="button" class="cc-copy-btn" data-cc-action="copy-code" data-code-target="${id}" aria-label="Copy code to clipboard">Copy</button>
                    </span>
                </figcaption>
                ${verified}
                <pre><code class="language-${escapeHtml(language)}">${escapeHtml(block.code || '')}</code></pre>
            </figure>`;
    }

    function renderTable(block) {
        const head = (block.head || []).map(cell => `<th scope="col">${inline(cell)}</th>`).join('');
        const rows = (block.rows || []).map(row => {
            const cells = row.map((cell, index) => index === 0
                ? `<th scope="row">${inline(cell)}</th>`
                : `<td>${inline(cell)}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `
            <figure class="cc-table-figure">
                ${block.caption ? `<figcaption>${inline(block.caption)}</figcaption>` : ''}
                <div class="cc-table-wrap">
                    <table>
                        <thead><tr>${head}</tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </figure>`;
    }

    function renderBlock(block) {
        switch (block.type) {
            case 'p':
                return `<p>${inline(block.text)}</p>`;
            case 'h3':
                return `<h3>${inline(block.text)}</h3>`;
            case 'ul':
                return `<ul>${(block.items || []).map(item => `<li>${inline(item)}</li>`).join('')}</ul>`;
            case 'ol':
                return `<ol>${(block.items || []).map(item => `<li>${inline(item)}</li>`).join('')}</ol>`;
            case 'table':
                return renderTable(block);
            case 'callout':
                return `
                    <aside class="cc-callout cc-callout-${escapeHtml(block.tone || 'info')}">
                        ${block.title ? `<p class="cc-callout-title">${inline(block.title)}</p>` : ''}
                        <p>${inline(block.text)}</p>
                    </aside>`;
            case 'formula':
                return `<div class="cc-formula">${inline(block.text)}</div>`;
            case 'code':
                return renderCode(block);
            case 'diagram':
                return `
                    <figure class="cc-diagram">
                        ${block.title ? `<figcaption>${inline(block.title)}</figcaption>` : ''}
                        <pre>${escapeHtml(block.text || '')}</pre>
                    </figure>`;
            case 'note':
                return `<aside class="cc-note"><span aria-hidden="true">ℹ</span><p>${inline(block.text)}</p></aside>`;
            default:
                return block.text ? `<p>${inline(block.text)}</p>` : '';
        }
    }

    // ------------------------------------------------------------
    // Page rendering
    // ------------------------------------------------------------
    function renderOverview(notice) {
        const chapters = CHAPTERS();
        const totals = overallStats();
        const continueChapter = chapters.find(chapter => !chapterStats(chapter).completed) || chapters[0];

        if (chapters.length === 0) {
            return `
                <div class="cc-page cc-overview">
                    <div class="cc-overview-hero">
                        <p class="cc-eyebrow">Course Chapters</p>
                        <h2>Chapter content is not loaded</h2>
                        <p>The chapter data files were not found. Check that the <code>content/course-chapters/</code> scripts are included on the page.</p>
                    </div>
                </div>`;
        }

        return `
            <div class="cc-page cc-overview">
                <div class="cc-overview-hero">
                    <p class="cc-eyebrow">Guided sequence · AASTU SWEG 3103</p>
                    <h2>📖 Course Chapters</h2>
                    <p class="cc-overview-lead">
                        A chapter-by-chapter path through the three canonical course decks:
                        introduction and analysis, simple sorting and searching, and lists.
                        Read the sections, mark them off, and test yourself with knowledge checks and exercises.
                    </p>
                    <div class="cc-overview-actions">
                        ${continueChapter ? `<a class="btn primary large" href="#chapters/${continueChapter.id}">${totals.read > 0 ? 'Continue Chapter' : 'Start Chapter'} ${continueChapter.number} →</a>` : ''}
                        <a class="btn large" href="#dashboard">Back to Dashboard</a>
                    </div>
                    ${notice ? `<p class="cc-notice">${escapeHtml(notice)}</p>` : ''}
                </div>

                <section class="cc-stats-grid" aria-label="Chapter progress summary">
                    <div class="cc-stat">
                        <span class="cc-stat-value">${totals.chapters}</span>
                        <span class="cc-stat-label">Chapters</span>
                    </div>
                    <div class="cc-stat">
                        <span class="cc-stat-value">${totals.read}<span class="cc-stat-sub"> / ${totals.sections}</span></span>
                        <span class="cc-stat-label">Sections read</span>
                    </div>
                    <div class="cc-stat">
                        <span class="cc-stat-value">${totals.correct}<span class="cc-stat-sub"> / ${totals.checks}</span></span>
                        <span class="cc-stat-label">Checks correct</span>
                    </div>
                    <div class="cc-stat">
                        <span class="cc-stat-value">${totals.exercises}</span>
                        <span class="cc-stat-label">Worked exercises</span>
                    </div>
                </section>

                <section class="cc-chapter-cards" aria-label="Chapters">
                    ${chapters.map(chapter => {
                        const stats = chapterStats(chapter);
                        return `
                            <article class="cc-chapter-card ${stats.completed ? 'is-complete' : ''}">
                                <div class="cc-chapter-card-top">
                                    <span class="cc-chapter-number">Chapter ${chapter.number}</span>
                                    ${stats.completed ? '<span class="cc-complete-chip">✓ Complete</span>' : `<span class="cc-progress-chip">${stats.percentage}%</span>`}
                                </div>
                                <h3>${escapeHtml(chapter.title)}</h3>
                                <p>${inline(chapter.subtitle)}</p>
                                <div class="cc-mini-progress" role="progressbar" aria-label="Chapter ${chapter.number} reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stats.percentage}">
                                    <span style="width:${stats.percentage}%"></span>
                                </div>
                                <dl class="cc-card-meta">
                                    <div><dt>Sections</dt><dd>${stats.readSections} / ${stats.totalSections}</dd></div>
                                    <div><dt>Checks</dt><dd>${stats.correctChecks} / ${stats.totalChecks}</dd></div>
                                    <div><dt>Exercises</dt><dd>${stats.totalExercises}</dd></div>
                                    <div><dt>Time</dt><dd>~${chapter.minutes} min</dd></div>
                                </dl>
                                <p class="cc-card-source">Source: ${escapeHtml(chapter.source.document)} · pp. ${escapeHtml(chapter.source.pages)}</p>
                                <a class="btn ${stats.completed ? '' : 'primary'}" href="#chapters/${chapter.id}">${stats.completed ? 'Review chapter' : 'Open chapter'} →</a>
                            </article>`;
                    }).join('')}
                </section>

                <section class="cc-howto">
                    <h3>How this learning area works</h3>
                    <ol>
                        <li><strong>Read a section, then mark it read.</strong> The chapter completes automatically when every section is marked.</li>
                        <li><strong>Answer the knowledge checks.</strong> Attempts and your best result are saved separately from section reading.</li>
                        <li><strong>Use the exercises for practice.</strong> Hints and worked answers are revealed only when you ask; they are not stored.</li>
                        <li><strong>Your chapter progress is local.</strong> It uses its own <code>dsa_chapters_v1</code> storage key and is included in JSON backups.</li>
                    </ol>
                    <p class="cc-howto-note">This area is additive. The original 18-topic curriculum, its lessons, quizzes, notes, bookmarks, and progress are unchanged.</p>
                </section>
            </div>`;
    }

    function renderSection(chapter, section, index) {
        const read = Progress.isRead(chapter.id, section.id);
        const blocks = (section.blocks || []).map(renderBlock).join('');
        return `
            <section class="cc-section ${read ? 'is-read' : ''}" id="cc-section-${escapeHtml(section.id)}" data-cc-section="${escapeHtml(section.id)}">
                <div class="cc-section-head">
                    <div>
                        <p class="cc-section-kicker">Section ${chapter.number}.${index + 1}</p>
                        <h3>${escapeHtml(section.title)}</h3>
                        <p class="cc-section-pages">Source: ${escapeHtml(section.pages)}</p>
                    </div>
                    <button type="button"
                            class="cc-read-btn ${read ? 'is-read' : ''}"
                            data-cc-action="toggle-read"
                            data-section-id="${escapeHtml(section.id)}"
                            aria-pressed="${read}">
                        ${read ? '✓ Read' : 'Mark as read'}
                    </button>
                </div>
                <div class="cc-section-body">${blocks}</div>
            </section>`;
    }

    function renderCheck(chapter, check, index) {
        const history = Progress.getCheck(chapter.id, check.id);
        const isTrueFalse = check.type === 'true-false';
        const options = isTrueFalse ? ['True', 'False'] : (check.options || []);
        const values = isTrueFalse ? ['true', 'false'] : options.map((_, optionIndex) => String(optionIndex));
        const status = history
            ? `Attempts: ${history.attempts} · Best: ${history.correct ? 'correct' : 'not yet'}`
            : 'Not attempted yet';

        return `
            <fieldset class="cc-check" data-cc-check="${escapeHtml(check.id)}" data-check-type="${escapeHtml(check.type)}">
                <legend>
                    <span class="cc-check-number">Check ${chapter.number}.${index + 1}</span>
                    ${inline(check.question)}
                </legend>
                <div class="cc-options">
                    ${options.map((option, optionIndex) => `
                        <label class="cc-option">
                            <input type="radio" name="cc-${escapeHtml(chapter.id)}-${escapeHtml(check.id)}" value="${escapeHtml(values[optionIndex])}">
                            <span>${inline(option)}</span>
                        </label>`).join('')}
                </div>
                <div class="cc-check-actions">
                    <button type="button" class="btn small" data-cc-action="check-submit">Check answer</button>
                    <span class="cc-check-status">${status}</span>
                </div>
                <div class="cc-check-feedback" hidden aria-live="polite"></div>
            </fieldset>`;
    }

    function renderExercise(chapter, exercise, index) {
        const hintId = `cc-hint-${exercise.id}`;
        const solutionId = `cc-solution-${exercise.id}`;
        return `
            <article class="cc-exercise" data-cc-exercise="${escapeHtml(exercise.id)}">
                <div class="cc-exercise-head">
                    <p class="cc-exercise-kicker">Exercise ${chapter.number}.${index + 1}</p>
                    <h3>${escapeHtml(exercise.title)}</h3>
                </div>
                <div class="cc-rich">${renderRichText(exercise.prompt)}</div>
                <div class="cc-exercise-actions">
                    <button type="button" class="btn small" data-cc-action="exercise-hint" data-exercise-id="${escapeHtml(exercise.id)}" aria-expanded="false" aria-controls="${escapeHtml(hintId)}">Show hint</button>
                    <button type="button" class="btn small" data-cc-action="exercise-solution" data-exercise-id="${escapeHtml(exercise.id)}" aria-expanded="false" aria-controls="${escapeHtml(solutionId)}">Reveal worked answer</button>
                </div>
                <div class="cc-hint" id="${escapeHtml(hintId)}" hidden>
                    <p class="cc-panel-label">Hint</p>
                    ${renderRichText(exercise.hint)}
                </div>
                <div class="cc-solution" id="${escapeHtml(solutionId)}" hidden>
                    <p class="cc-panel-label">Worked answer</p>
                    <pre class="cc-solution-text">${escapeHtml(exercise.solution)}</pre>
                </div>
            </article>`;
    }

    function renderChapter(chapter, activeSectionId) {
        codeCounter = 0;
        const stats = chapterStats(chapter);
        const chapters = CHAPTERS();
        const position = chapters.findIndex(item => item.id === chapter.id);
        const previous = position > 0 ? chapters[position - 1] : null;
        const next = position >= 0 && position < chapters.length - 1 ? chapters[position + 1] : null;

        return `
            <div class="cc-page cc-chapter" data-cc-chapter="${escapeHtml(chapter.id)}">
                <nav class="cc-breadcrumb" aria-label="Breadcrumb">
                    <a href="#chapters">Course Chapters</a>
                    <span aria-hidden="true">›</span>
                    <span>Chapter ${chapter.number}</span>
                </nav>

                <div class="cc-chapter-hero">
                    <div class="cc-chapter-hero-text">
                        <p class="cc-eyebrow">Chapter ${chapter.number} · ${escapeHtml(chapter.shortTitle || chapter.title)}</p>
                        <h2>${escapeHtml(chapter.title)}</h2>
                        <p class="cc-chapter-subtitle">${inline(chapter.subtitle)}</p>
                        <p class="cc-chapter-source">
                            Based on <strong>${escapeHtml(chapter.source.document)}</strong>
                            · ${escapeHtml(chapter.source.author)} · pp. ${escapeHtml(chapter.source.pages)}
                        </p>
                        <p class="cc-chapter-note">${inline(chapter.source.note)}</p>
                    </div>
                    <div class="cc-chapter-meta">
                        <span>${chapter.sections.length} sections</span>
                        <span>${chapter.checks.length} checks</span>
                        <span>${chapter.exercises.length} exercises</span>
                        <span>~${chapter.minutes} min</span>
                    </div>
                    <div class="cc-chapter-progress">
                        <div class="cc-progress-row">
                            <span>Reading progress</span>
                            <strong id="cc-chapter-progress-text">${stats.readSections} of ${stats.totalSections} sections read</strong>
                        </div>
                        <div class="cc-progress" role="progressbar" aria-label="Chapter reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stats.percentage}">
                            <span id="cc-chapter-progress-bar" style="width:${stats.percentage}%"></span>
                        </div>
                        <p class="cc-check-score" id="cc-check-score">${stats.correctChecks} of ${stats.totalChecks} knowledge checks answered correctly</p>
                    </div>
                </div>

                <div class="cc-complete-banner" id="cc-complete-banner" ${stats.completed ? '' : 'hidden'}>
                    <span class="cc-complete-icon" aria-hidden="true">✓</span>
                    <div>
                        <strong>Chapter ${chapter.number} complete.</strong>
                        Every section has been marked as read. Keep going with the checks and exercises, or move to the next chapter.
                    </div>
                </div>

                <div class="cc-chapter-layout">
                    <div class="cc-chapter-main">
                        <section class="cc-objectives" aria-labelledby="cc-objectives-title">
                            <h3 id="cc-objectives-title">Learning objectives</h3>
                            <ul>
                                ${(chapter.objectives || []).map(objective => `<li>${inline(objective)}</li>`).join('')}
                            </ul>
                        </section>

                        ${chapter.sections.map((section, index) => renderSection(chapter, section, index)).join('')}

                        <section class="cc-checks" id="cc-checks" aria-labelledby="cc-checks-title">
                            <h2 id="cc-checks-title">Knowledge checks</h2>
                            <p class="cc-section-intro">Answer without looking back, then read the explanation. Your attempts and best result are saved.</p>
                            ${chapter.checks.map((check, index) => renderCheck(chapter, check, index)).join('')}
                        </section>

                        <section class="cc-exercises" aria-labelledby="cc-exercises-title">
                            <h2 id="cc-exercises-title">Exercises</h2>
                            <p class="cc-section-intro">Work each problem on paper first. Hints and worked answers stay hidden until you ask for them.</p>
                            ${chapter.exercises.map((exercise, index) => renderExercise(chapter, exercise, index)).join('')}
                        </section>

                        <section class="cc-summary" aria-labelledby="cc-summary-title">
                            <h2 id="cc-summary-title">Chapter summary</h2>
                            <ul>
                                ${(chapter.summary || []).map(item => `<li>${inline(item)}</li>`).join('')}
                            </ul>
                        </section>

                        <section class="cc-keyterms" aria-labelledby="cc-keyterms-title">
                            <h2 id="cc-keyterms-title">Key terms</h2>
                            <dl>
                                ${(chapter.keyTerms || []).map(term => `
                                    <div>
                                        <dt>${escapeHtml(term.term)}</dt>
                                        <dd>${inline(term.definition)}</dd>
                                    </div>`).join('')}
                            </dl>
                        </section>

                        <nav class="cc-chapter-nav" aria-label="Chapter navigation">
                            ${previous
                                ? `<a class="btn" href="#chapters/${previous.id}">← Chapter ${previous.number}: ${escapeHtml(previous.shortTitle || previous.title)}</a>`
                                : '<a class="btn" href="#chapters">← All chapters</a>'}
                            ${next
                                ? `<a class="btn primary" href="#chapters/${next.id}">Chapter ${next.number}: ${escapeHtml(next.shortTitle || next.title)} →</a>`
                                : '<a class="btn primary" href="#chapters">Back to overview →</a>'}
                        </nav>
                    </div>

                    <aside class="cc-toc" aria-label="Chapter contents">
                        <h3>Chapter contents</h3>
                        <ol class="cc-toc-list">
                            ${chapter.sections.map((section, index) => {
                                const read = Progress.isRead(chapter.id, section.id);
                                const active = section.id === activeSectionId;
                                return `
                                    <li>
                                        <a href="#chapters/${chapter.id}/${section.id}" class="${read ? 'is-read' : ''} ${active ? 'is-active' : ''}">
                                            <span class="cc-toc-mark" aria-hidden="true">${read ? '✓' : String(index + 1)}</span>
                                            <span>${escapeHtml(section.title)}</span>
                                        </a>
                                    </li>`;
                            }).join('')}
                        </ol>
                        <div class="cc-toc-footer">
                            <p><strong>${stats.readSections}/${stats.totalSections}</strong> sections read</p>
                            <p><strong>${stats.correctChecks}/${stats.totalChecks}</strong> checks correct</p>
                            <a href="#chapters" class="cc-toc-back">← All chapters</a>
                        </div>
                    </aside>
                </div>
            </div>`;
    }

    // ------------------------------------------------------------
    // Rendering entry points
    // ------------------------------------------------------------
    function renderRoute(chapterId, sectionId) {
        if (!chapterId) return renderOverview();
        const chapter = getChapter(chapterId);
        if (!chapter) {
            return renderOverview(`Chapter “${chapterId}” was not found. Showing all chapters instead.`);
        }
        return renderChapter(chapter, sectionId || null);
    }

    // ------------------------------------------------------------
    // Interaction
    // ------------------------------------------------------------
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return Promise.reject(new Error('Clipboard API unavailable'));
    }

    function legacyCopy(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }
        area.remove();
        return copied;
    }

    function flashCopyButton(button, success) {
        const original = button.dataset.originalLabel || button.textContent;
        button.dataset.originalLabel = original;
        button.textContent = success ? 'Copied ✓' : 'Copy failed';
        button.classList.toggle('is-copied', success);
        window.setTimeout(() => {
            button.textContent = original;
            button.classList.remove('is-copied');
        }, 1600);
    }

    function updateProgressUI(chapterElement) {
        if (!chapterElement) return;
        const chapter = getChapter(chapterElement.dataset.ccChapter);
        if (!chapter) return;
        const stats = chapterStats(chapter);
        const record = Progress.chapter(chapter.id);

        const bar = chapterElement.querySelector('#cc-chapter-progress-bar');
        const barWrap = chapterElement.querySelector('.cc-chapter-progress .cc-progress');
        const text = chapterElement.querySelector('#cc-chapter-progress-text');
        if (bar) bar.style.width = `${stats.percentage}%`;
        if (barWrap) barWrap.setAttribute('aria-valuenow', String(stats.percentage));
        if (text) text.textContent = `${stats.readSections} of ${stats.totalSections} sections read`;

        const checkScore = chapterElement.querySelector('#cc-check-score');
        if (checkScore) {
            checkScore.textContent = `${stats.correctChecks} of ${stats.totalChecks} knowledge checks answered correctly`;
        }

        const banner = chapterElement.querySelector('#cc-complete-banner');
        if (banner) banner.hidden = !stats.completed;

        chapter.sections.forEach(section => {
            const read = record.sections[section.id]?.read === true;
            const link = chapterElement.querySelector(`.cc-toc-list a[href="#chapters/${chapter.id}/${section.id}"]`);
            if (link) link.classList.toggle('is-read', read);
            const mark = link ? link.querySelector('.cc-toc-mark') : null;
            if (mark) mark.textContent = read ? '✓' : String(chapter.sections.indexOf(section) + 1);
        });

        const tocFooter = chapterElement.querySelector('.cc-toc-footer');
        if (tocFooter) {
            const lines = tocFooter.querySelectorAll('p strong');
            if (lines[0]) lines[0].textContent = `${stats.readSections}/${stats.totalSections}`;
            if (lines[1]) lines[1].textContent = `${stats.correctChecks}/${stats.totalChecks}`;
        }
    }

    function handleClick(event) {
        if (!(event.target instanceof Element)) return;
        const actionElement = event.target.closest('[data-cc-action]');
        if (!actionElement || !actionElement.closest('#content-area')) return;

        const action = actionElement.dataset.ccAction;
        const chapterElement = actionElement.closest('[data-cc-chapter]');

        if (action === 'toggle-read') {
            event.preventDefault();
            if (!chapterElement) return;
            const chapterId = chapterElement.dataset.ccChapter;
            const sectionId = actionElement.dataset.sectionId;
            const result = Progress.toggleSection(chapterId, sectionId);
            const sectionElement = chapterElement.querySelector(`[data-cc-section="${sectionId}"]`);

            actionElement.classList.toggle('is-read', result.read);
            actionElement.setAttribute('aria-pressed', String(result.read));
            actionElement.textContent = result.read ? '✓ Read' : 'Mark as read';
            if (sectionElement) sectionElement.classList.toggle('is-read', result.read);
            updateProgressUI(chapterElement);

            if (result.completedNow && typeof Toast !== 'undefined' && Toast && typeof Toast.show === 'function') {
                Toast.show('Chapter complete — every section is marked as read.', {
                    type: 'success',
                    title: 'Nice work'
                });
            }
            return;
        }

        if (action === 'check-submit') {
            event.preventDefault();
            if (!chapterElement) return;
            const fieldset = actionElement.closest('[data-cc-check]');
            if (!fieldset) return;
            const chapter = getChapter(chapterElement.dataset.ccChapter);
            if (!chapter) return;
            const check = chapter.checks.find(item => item.id === fieldset.dataset.ccCheck);
            if (!check) return;

            const selected = fieldset.querySelector('input[type="radio"]:checked');
            const feedback = fieldset.querySelector('.cc-check-feedback');
            if (!feedback) return;

            if (!selected) {
                feedback.hidden = false;
                feedback.className = 'cc-check-feedback is-warning';
                feedback.textContent = 'Choose an answer first.';
                return;
            }

            const isCorrect = check.type === 'true-false'
                ? selected.value === String(check.correct)
                : Number(selected.value) === Number(check.correct);

            const record = Progress.recordCheck(chapter.id, check.id, isCorrect);
            fieldset.classList.toggle('is-correct', isCorrect);
            fieldset.classList.toggle('is-incorrect', !isCorrect);
            feedback.hidden = false;
            feedback.className = `cc-check-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
            feedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not quite.'}</strong> ${inline(check.explanation)}`;

            const status = fieldset.querySelector('.cc-check-status');
            if (status) {
                status.textContent = `Attempts: ${record.attempts} · Best: ${record.correct ? 'correct' : 'not yet'}`;
            }
            updateProgressUI(chapterElement);
            return;
        }

        if (action === 'exercise-hint' || action === 'exercise-solution') {
            event.preventDefault();
            const exercise = actionElement.closest('[data-cc-exercise]');
            if (!exercise) return;
            const isHint = action === 'exercise-hint';
            const panel = exercise.querySelector(isHint ? '.cc-hint' : '.cc-solution');
            if (!panel) return;
            const showing = !panel.hidden;
            panel.hidden = showing;
            actionElement.setAttribute('aria-expanded', String(!showing));
            actionElement.textContent = isHint
                ? (showing ? 'Show hint' : 'Hide hint')
                : (showing ? 'Reveal worked answer' : 'Hide worked answer');
            return;
        }

        if (action === 'copy-code') {
            event.preventDefault();
            const target = document.getElementById(actionElement.dataset.codeTarget);
            const code = target ? target.querySelector('pre code') : null;
            const text = code ? code.textContent : '';
            if (!text) return;
            copyToClipboard(text)
                .then(() => flashCopyButton(actionElement, true))
                .catch(() => flashCopyButton(actionElement, legacyCopy(text)));
        }
    }

    function bindInteractions() {
        const area = document.getElementById('content-area');
        if (!area || area.dataset.ccBound === 'true') return;
        area.dataset.ccBound = 'true';
        area.addEventListener('click', handleClick);
    }

    function init(activeSectionId) {
        bindInteractions();
        if (!activeSectionId) return;
        const chapterElement = document.querySelector('[data-cc-chapter]');
        if (!chapterElement) return;
        const sectionElement = chapterElement.querySelector(`[data-cc-section="${activeSectionId}"]`);
        if (!sectionElement) return;
        sectionElement.classList.add('is-active');
        const link = chapterElement.querySelector(`.cc-toc-list a[href="#chapters/${chapterElement.dataset.ccChapter}/${activeSectionId}"]`);
        if (link) link.classList.add('is-active');
        window.requestAnimationFrame(() => {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    window.CourseChapters = {
        renderRoute,
        renderOverview,
        renderChapter: (chapterId, sectionId) => {
            const chapter = getChapter(chapterId);
            return chapter ? renderChapter(chapter, sectionId || null) : renderOverview();
        },
        searchEntries,
        init,
        getChapter,
        chapters: CHAPTERS,
        progressKey: STORAGE_KEY
    };
})();
