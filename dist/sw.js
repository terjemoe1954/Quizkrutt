const CACHE='quizkrutt-m2-v3';
const FILES=['./','./index.html','./style.css?v=m2-3','./app.js?v=m2-3','./questions.js?v=m2-3','./game.js?v=m2-3','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',...['mix','world','nature','culture','sport','science'].map(id=>'./icons/'+id+'.svg')];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(async()=>{
   const cache=await caches.open(CACHE);
   return await cache.match('./index.html')||Response.error();
  }));return;
 }
 event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(event.request)||fetch(event.request)));
});
