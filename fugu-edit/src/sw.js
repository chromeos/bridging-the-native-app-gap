/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global importScripts, workbox */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

/**
 * Normalizes requests that end with a backslash (/) to request the same resource
 * From https://github.com/GoogleChrome/workbox/issues/2217#issuecomment-528023769
 *
 * @param {object} param0 - An object containing a Workbox request object
 * @return {request} Either the original request or a normalized request
 */
async function normalizeIfNeeded({ request }) {
  if (request.mode === 'navigate' && !request.url.endsWith('/')) {
    return new Request(`${request.url}/`);
  }
  return request;
}

const navigationNormalizationPlugin = {
  cacheKeyWillBeUsed: normalizeIfNeeded,
  requestWillFetch: normalizeIfNeeded,
};

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.setConfig({
    debug: true,
  });

  workbox.precaching.precacheAndRoute([]);

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    }),
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    }),
  );

  // Images
  workbox.routing.registerRoute(
    /(.*)images(.*)\.(?:png|gif|jpg)/,
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  // HTML
  workbox.routing.registerRoute(
    new RegExp('/(.*)/.+'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'pages-cache',
      plugins: [
        navigationNormalizationPlugin,
        new workbox.cacheableResponse.Plugin({
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
          },
          statuses: [200, 301, 404, 0],
        }),
      ],
    }),
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
