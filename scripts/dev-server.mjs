import {createServer} from 'node:http';
import {mkdirSync} from 'node:fs';
import worker from '../dist/server/index.js';
import {localDatabase} from './local-db.mjs';
mkdirSync('.local',{recursive:true});const db=localDatabase('.local/network.sqlite');
const server=createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const request=new Request('http://127.0.0.1:4174'+req.url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});const response=await worker.fetch(request,{DB:db},{waitUntil:p=>p.catch(()=>{})});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Local preview error');}});
server.listen(4174,'127.0.0.1',()=>console.log('Quizkrutt Worker preview: http://127.0.0.1:4174'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));
