const CACHE='quizkrutt-m5-v2';
const FILES=['./','./index.html','./style.css?v=m5-2','./app.js?v=m5-2','./questions.js?v=m5-2','./game.js?v=m5-2','./duel.js?v=m5-2','./network.js?v=m5-2','./packs.js?v=m5-2','./pack-format.js?v=m5-2','./catalog.js?v=m5-2','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',...['mix','world','nature','culture','sport','science'].map(id=>'./icons/'+id+'.svg')];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 // Quizinnhold lastes bare ned etter et eksplisitt valg i biblioteket.
 if(new URL(event.request.url).pathname.includes('/packs/')||new URL(event.request.url).pathname.startsWith('/api/'))return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(async()=>{
   const cache=await caches.open(CACHE);
   return await cache.match('./index.html')||Response.error();
  }));return;
 }
 event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(event.request)||fetch(event.request)));
});
