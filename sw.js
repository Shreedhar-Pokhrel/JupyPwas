importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js')

self.__WB_DISABLE_DEV_LOGS = true;

workbox.routing.registerRoute(
  ({request}) =>true,
  new workbox.strategies.CacheFirst()
);

const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const utilsCacheName = 'site-utils-v1';
const assets = [
  '/lab/index.html',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
var noOfReq = 250;


// workbox caries out fetch event so no longer using given funcion
// fetch events 
self.addEventListener('fetch', evt => {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
	  var caching = utilsCacheName;
	  noOfReq--;
 	  if(noOfReq<0){
	    caching=dynamicCacheName;
	  }
          return caches.open(caching).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
	    if(caching===dynamicCacheName){
	      limitCacheSize(caching, 50);
	    }
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/lab/index.html');
        }
      })
    );
});


