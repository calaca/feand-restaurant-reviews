let cacheName = 'v1-04-04-18';
const cacheFiles = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js'
];

/**
 * The install event is fired when an install is successfully completed. The install event is generally used to populate your browser’s offline caching capabilities with the assets you need to run your app offline. To do this, we use Service Worker’s brand new storage API — cache — a global on the service worker that allows us to store assets delivered by responses, and keyed by their requests. This API works in a similar way to the browser’s standard cache, but it is specific to your domain. It persists until you tell it not to — again, you have full control.
 */
self.addEventListener('install', e => {
  console.log('serviceWorker installed!');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('serviceWorker is caching files...');
      return cache.addAll(cacheFiles);
    })
    .catch(err => {
      console.log('Error while caching files with ', err);
    })
  );
});

/**
 * The activate event is a generally used to do stuff that would have broken the previous version while it was still running, for example getting rid of old caches. This is also useful for removing data that is no longer needed to avoid filling up too much disk space — each browser has a hard limit on the amount of cache storage that a given service worker can use. The browser does its best to manage disk space, but it may delete the Cache storage for an origin.  The browser will generally delete all of the data for an origin or none of the data for an origin.
 */
self.addEventListener('activate', e => {
  console.log('serviceWorker activated!');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(name => {
        if(cacheName !== name) {
          console.log('serviceWorker is removing the old cache...');
          return caches.delete(name);
        }
      }));
    })
    .catch(err => {
      console.log('Error while removing old cache with ', err);
    })
  );
});

/**
 * A fetch event fires every time any resource controlled by a service worker is fetched, which includes the documents inside the specified scope, and any resources referenced in those documents (for example if index.html makes a cross origin request to embed an image, that still goes through its service worker.)
 * NOTE: google maps are not cachable via service workers with current technology.
 */
self.addEventListener('fetch', e => {
  console.log('serviceWorker is fetching content...');
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if(res) {
          console.log('serviceWorker found content in cache!', res.url);
          return res;
        }
        return fetch(e.request);
      })
      .catch(err => {
        console.log('Error while fetching data with ', err);
      })
  );
});

// Resource: https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API/Using_Service_Workers
