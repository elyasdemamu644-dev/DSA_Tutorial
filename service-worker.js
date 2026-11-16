/* C++ DSA Academy — offline app-shell service worker.
   Serves the fully local student experience when the site is hosted over
   http(s) or localhost. On file:// this SW cannot register; the app still
   works but Google Fonts (if used) need the network. */

const CACHE = 'dsa-academy-shell-v3';
const SHELL = [
    './',
    './index.html',
    './test-compiler.html',
    './styles/main.css',
    './styles/course-chapters.css',
    './scripts/curriculum.js',
    './content/course-chapters/chapter-01.js',
    './content/course-chapters/chapter-02.js',
    './content/course-chapters/chapter-03.js',
    './scripts/course-chapters.js',
    './scripts/code-editor.js',
    './scripts/main.js',
    './scripts/compiler-service.js',
    './scripts/sorting-visualizer.js',
    './scripts/sorting-visualizer-renderer.js',
    './scripts/tree-visualizer.js',
    './scripts/graph-visualizer.js',
    './scripts/tree-graph-renderer.js',
    './manifest.webmanifest',
    './icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Same-origin: cache-first for app-shell assets, network fallback.
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(req, { ignoreSearch: true })
                .then(cached => cached || fetch(req).then(resp => {
                    if (resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE).then(cache => cache.put(req, clone));
                    }
                    return resp;
                }))
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Cross-origin (fonts): network-first, fall back to cached copy when offline.
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            fetch(req)
                .then(resp => {
                    if (resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE).then(cache => cache.put(req, clone));
                    }
                    return resp;
                })
                .catch(() => caches.match(req))
        );
    }
});
