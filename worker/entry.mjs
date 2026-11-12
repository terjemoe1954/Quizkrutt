// Imports replaced by the deterministic builder; server-only assets are never routed.
import {createApi} from './api.mjs';
const api=createApi({questions:QUESTIONS});
export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/'))return api(request,env,ctx);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 let path;try{path=decodeURIComponent(url.pathname);}catch{return new Response('Not found',{status:404});}
 if(path==='/')path='/index.html';
 const asset=ASSETS[path];if(!asset)return new Response('Not found',{status:404});
 const [type,base64]=asset;const body=request.method==='HEAD'?null:Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
 return new Response(body,{headers:{'Content-Type':type,'Cache-Control':path==='/sw.js'?'no-store':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}};
