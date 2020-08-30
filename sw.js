const flowgorithmCacheName = 'flowgramming-v0.0.2'

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(flowgorithmCacheName).then(function (cache) {
            return cache.addAll(
                [
                    "/",
                    "/js/vendor/jquery.js",
                    "/js/vendor/popper.js",
                    "/js/vendor/bootstrap.js",
                    "/js/vendor/cycle.js",
                    "/js/vendor/handlebars.min.js",
                    "/js/chat.js",
                    "/js/vendor/lodash.js",
                    "/js/vendor/backbone.js",
                    "/js/vendor/joint.js",
                    "/js/vendor/require.js",
                    "/js/main.js",
                    "/js/utility.js",
                    "/js/addElement.js",
                    "/js/run.js",
                    "/js/events.js",
                    "/js/save.js",
                    "/css/vendor/bootstrap.min.css",
                    "/css/vendor/joint.css",
                    "/css/main.css",
                    "/css/chat.css",
                    '/assets/fonts/inter.eot',
                    '/assets/fonts/inter.woff2',
                    '/assets/fonts/inter.woff',
                    '/assets/fonts/inter.ttf',
                    '/assets/fonts/inter.svg#inter',
                    '/assets/fonts/inter.eot?#iefix',
                    '/assets/fonts/merinda.ttf'
                ]
            )
        })
    )
})

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request)
        })
    )
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== flowgorithmCacheName) {
                        // If this cache name isn't the same as current version of cache, then delete it.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
