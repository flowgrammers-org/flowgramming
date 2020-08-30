const cacheName = 'flowgramming-v0.0.1'

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
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
          "/assets/zoomin.svg", 
          "/assets/zoomout.png",
          '/assets/fonts/inter.eot',
          '/assets/fonts/inter.woff2',
          '/assets/fonts/inter.woff',
          '/assets/fonts/inter.ttf',
          '/assets/fonts/inter.svg#inter',
          '/assets/fonts/inter.eot?#iefix',
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
