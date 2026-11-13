const CACHE='quizkrutt-m7-v1';
const FILES=['./','./index.html','./style.css?v=m7-1','./app.js?v=m7-1','./questions.js?v=m7-1','./game.js?v=m7-1','./duel.js?v=m7-1','./network.js?v=m7-1','./app-ui.js?v=m7-1','./preferences.js?v=m7-1','./release.js?v=m7-1','./packs.js?v=m7-1','./pack-format.js?v=m7-1','./catalog.js?v=m7-1','./remote-library.js?v=m7-1','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',...['mix','world','nature','culture','sport','science'].map(id=>'./icons/'+id+'.svg')];
function expectedType(file){const path=file.split('?')[0];return path.endsWith('.js')?'javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':path.endsWith('.svg')?'image/svg+xml':path.endsWith('.webmanifest')?'json':'text/html';}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const responses=await Promise.all(FILES.map(async file=>{const response=await fetch(file,{cache:'reload',credentials:'same-origin'});if(!response.ok||response.redirected||!response.headers.get('Content-Type')?.includes(expectedType(file)))throw Error('Offline asset validation failed');return [file,response];}));
 const cache=await caches.open(CACHE);for(const [file,response] of responses)await cache.put(file,response);await cache.put('./__ready',new Response(CACHE));await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=(await caches.keys()).filter(key=>key.startsWith('quizkrutt-')&&key!==CACHE);let previous=null;
 for(const key of [...keys].reverse()){if(await (await caches.open(key)).match('./index.html')){previous=key;break;}}
 await Promise.all(keys.filter(key=>key!==previous).map(key=>caches.delete(key)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/packs/')||url.pathname.startsWith('/api/'))return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(async()=>await (await caches.open(CACHE)).match('./index.html')||Response.error()));return;}
 event.respondWith((async()=>{const current=await (await caches.open(CACHE)).match(event.request);if(current)return current;for(const key of await caches.keys()){if(key.startsWith('quizkrutt-')&&key!==CACHE){const hit=await (await caches.open(key)).match(event.request);if(hit)return hit;}}return fetch(event.request);})());
});
