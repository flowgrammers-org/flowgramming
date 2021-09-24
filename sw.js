/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

const latestCacheName = 'flowgramming-v1632446274'

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(latestCacheName).then(function (cache) {
            return cache.addAll([
                'index.html',
                'functions.html',
                'js/build/indexVendor.js',
                'js/build/indexMain.js',
                'js/build/functionVendor.js',
                'js/build/functionMain.js',
                'js/build/codeMain.js',
                'js/build/codeVendor.js',
                'css/build/main.css',
                'css/build/code.css',
                'css/build/functions.css',
                'assets/fonts/inter.eot',
                'assets/fonts/inter.woff2',
                'assets/fonts/inter.woff',
                'assets/fonts/inter.ttf',
                'assets/fonts/inter.svg#inter',
                'assets/fonts/inter.eot?#iefix',
                'assets/fonts/merinda.ttf',
            ])
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
                    if (cacheName !== latestCacheName) {
                        // If this cache name isn't the same
                        // as current version of cache, then delete it.
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})
