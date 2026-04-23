/* =========================================
   HyperCare AI - Service Worker
   Production Ready PWA Version
========================================= */

const CACHE_VERSION = "hypercare-v1.0.0";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

/* Files to cache immediately */
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/config.js",
  "./js/encryption.js",
  "./js/auth.js",
  "./js/bluetooth.js",
  "./js/ai.js",
  "./js/audit.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/* =========================
   INSTALL EVENT
========================= */
self.addEventListener("install", event => {
  console.log("Service Worker Installing...");
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* =========================
   ACTIVATE EVENT
========================= */
self.addEventListener("activate", event => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* =========================
   FETCH EVENT
========================= */
self.addEventListener("fetch", event => {

  const request = event.request;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // API requests (Network First Strategy)
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (Cache First Strategy)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request)
        .then(networkResponse => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
    })
  );
});

/* =========================
   BACKGROUND SYNC (Future Ready)
========================= */
self.addEventListener("sync", event => {
  if (event.tag === "sync-bp-data") {
    event.waitUntil(syncBPData());
  }
});

async function syncBPData() {
  console.log("Background sync triggered");
  // Placeholder for future offline sync logic
}

/* =========================
   PUSH NOTIFICATIONS READY
========================= */
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "New health alert";

  event.waitUntil(
    self.registration.showNotification("HyperCare Alert", {
      body: data,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png"
    })
  );
});
