/* ============================================================
   C++ DSA Academy — Centralized Theme Manager
   ============================================================
   Single authoritative appearance system (Light / Dark / System).

   Two distinct values are tracked:
   - preference: what the user picked — light | dark | system
   - effective:  what the UI actually shows — light | dark

   Example: preference = system, OS = dark  →  effective = dark.
   If the OS then switches to light, effective becomes light while
   preference remains 'system' (the stored value is never overwritten).

   Persistence: localStorage. 'dsa_theme' is this app's canonical key;
   'academy.theme' is honored as an alias and kept in sync. When
   preference is 'system', a singleton matchMedia listener applies OS
   appearance changes live, without a reload and without persisting.
   ============================================================ */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'dsa_theme';
    const ALIAS_KEY = 'academy.theme';
    const VALID = ['light', 'dark', 'system'];
    const DEFAULT = 'system';

    const darkMedia = () => (typeof global.matchMedia === 'function'
        ? global.matchMedia('(prefers-color-scheme: dark)')
        : null);

    const systemPrefersDark = () => !!(darkMedia() && darkMedia().matches);

    function normalize(value) {
        const v = String(value == null ? '' : value).trim().toLowerCase();
        return VALID.includes(v) ? v : null;
    }

    function readStored() {
        try {
            // academy.theme (brief-mandated alias) wins when present; dsa_theme is canonical.
            return normalize(localStorage.getItem(ALIAS_KEY))
                ?? normalize(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            return null; // storage unavailable (private mode, file://) — theme works for the session
        }
    }

    function writeStored(preference) {
        try {
            localStorage.setItem(STORAGE_KEY, preference);
            localStorage.setItem(ALIAS_KEY, preference); // keep both keys in sync
        } catch (e) { /* storage unavailable — preference kept for this session only */ }
    }

    function getPreference() {
        return readStored() || DEFAULT;
    }

    function resolve(preference) {
        const pref = VALID.includes(preference) ? preference : DEFAULT;
        return pref === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : pref;
    }

    /* Sync DOM affordances: header quick-toggle, Settings segmented control, meta theme-color. */
    function syncControls(preference, effective) {
        const effectiveName = effective === 'dark' ? 'Dark' : 'Light';

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            const dark = effective === 'dark';
            toggle.textContent = dark ? '☀️' : '🌙';
            toggle.setAttribute('aria-pressed', String(dark));
            toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
            toggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
        }

        document.querySelectorAll('[data-theme-option]').forEach(btn => {
            const selected = btn.getAttribute('data-theme-option') === preference;
            btn.setAttribute('aria-checked', String(selected));
            btn.classList.toggle('is-selected', selected);
        });

        document.querySelectorAll('[data-effective-theme]').forEach(el => {
            el.textContent = effectiveName;
        });

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', effective === 'dark' ? '#1a1a2e' : '#f8f9fa');
    }

    function apply(preference, options) {
        const opts = options || {};
        const persist = opts.persist !== false;
        const announce = opts.announce === true;

        const pref = VALID.includes(preference) ? preference : DEFAULT;
        const effective = resolve(pref);

        const root = document.documentElement;
        root.setAttribute('data-theme', effective);
        root.style.colorScheme = effective; // native controls, scrollbars, form widgets

        if (persist) writeStored(pref);
        syncControls(pref, effective);

        if (announce && typeof global.AriaHelpers !== 'undefined' && global.AriaHelpers && typeof global.AriaHelpers.announce === 'function') {
            global.AriaHelpers.announce(
                pref === 'system' ? `Theme follows system (${effective})` : `Theme set to ${pref}`
            );
        }
        return effective;
    }

    /* Singleton OS listener: re-resolves only while preference === 'system'.
       Explicit Light/Dark are never overwritten by OS changes. */
    let listening = false;
    function ensureSystemListener() {
        if (listening) return;
        const m = darkMedia();
        if (!m) return;
        const handler = () => {
            if (getPreference() === 'system') {
                apply('system', { persist: false });
            }
        };
        if (typeof m.addEventListener === 'function') m.addEventListener('change', handler);
        else if (typeof m.addListener === 'function') m.addListener(handler); // legacy Safari
        listening = true;
    }

    function init() {
        // Sanitize: drop individually-invalid stored values (fall back to what remains, then System).
        [ALIAS_KEY, STORAGE_KEY].forEach(key => {
            try {
                const v = localStorage.getItem(key);
                if (v !== null && normalize(v) === null) localStorage.removeItem(key);
            } catch (e) { /* storage unavailable */ }
        });

        apply(getPreference(), { persist: false });
        ensureSystemListener();
    }

    global.ThemeManager = {
        init,
        apply,
        getPreference,
        resolve,
        syncControls,
        getEffective: () => resolve(getPreference()),
        STORAGE_KEY,
        ALIAS_KEY
    };
})(typeof window !== 'undefined' ? window : this);
