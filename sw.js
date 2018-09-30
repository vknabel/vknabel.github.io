/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-4c24f2a041e4cd84bdd8.js"
  },
  {
    "url": "app.8b9047187be1dc55ee9b.css"
  },
  {
    "url": "app-abae471c27299c107bb6.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-2586fe11e3310436385a.js"
  },
  {
    "url": "index.html",
    "revision": "9d026fb65bb942a8917cf67633fc2ef4"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "e2d7be9a1c4dfcfb5e045dc41211e9bd"
  },
  {
    "url": "component---src-pages-index-js.f0d520400f59d805f884.css"
  },
  {
    "url": "0-7fc2396d58a13c4290f1.js"
  },
  {
    "url": "component---src-pages-index-js-3c7b3ec0dfeaa4c3ad24.js"
  },
  {
    "url": "static/d/858/path---index-6a9-OF8DclD2WubDOMs0RD7jMFPsMs.json",
    "revision": "cc4d1566219e1ae4b04a9c9d02be21ac"
  },
  {
    "url": "component---src-pages-404-js.f0d520400f59d805f884.css"
  },
  {
    "url": "component---src-pages-404-js-75531d8b1650103549e1.js"
  },
  {
    "url": "static/d/164/path---404-html-516-62a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "static/d/520/path---offline-plugin-app-shell-fallback-a-30-c5a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "9cec1fc424d51bcaffd8ad0c8cff46c5"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/offline-plugin-app-shell-fallback/index.html", {
  whitelist: [/^[^?]*([^.?]{5}|\.html)(\?.*)?$/],
  blacklist: [/\?(.+&)?no-cache=1$/],
});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, workbox.strategies.staleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https:/, workbox.strategies.networkFirst(), 'GET');
"use strict";

/* global workbox */
self.addEventListener("message", function (event) {
  var api = event.data.api;

  if (api === "gatsby-runtime-cache") {
    var resources = event.data.resources;
    var cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then(function (cache) {
      return Promise.all(resources.map(function (resource) {
        return cache.add(resource).catch(function (e) {
          // ignore TypeErrors - these are usually due to
          // external resources which don't allow CORS
          if (!(e instanceof TypeError)) throw e;
        });
      }));
    }));
  }
});