import {validatePack} from './pack-format.js?v=m4-1';
export const PACK_PREFIX='quizkrutt.pack.';
export const packKey=(id,version)=>`${id}@${version}`;
export function recommendPacks(catalog,category,level){
 const higher=Math.min(level+1,2);
 return catalog.filter(p=>p.level>=higher).sort((a,b)=>(a.category===category?0:1)-(b.category===category?0:1)||a.level-b.level||a.title.localeCompare(b.title,'nb')).slice(0,2);
}
export function createPackLibrary(storage,catalog,{fetcher=(...args)=>fetch(...args),cryptoApi=globalThis.crypto}={}){
 const lookup=id=>{const item=catalog.find(p=>p.id===id);if(!item)throw Error('Ukjent quizpakke.');return item;};
 function read(id){lookup(id);try{const raw=storage.getItem(PACK_PREFIX+id);if(raw===null)return {pack:null,error:null};const envelope=JSON.parse(raw);if(envelope.schema!==1)throw Error();const pack=validatePack(envelope.pack);if(pack.id!==id)throw Error();return {pack,error:null};}catch{return {pack:null,error:'Den lagrede pakken kunne ikke leses. Fjern den og last ned på nytt. Resultatene beholdes.'};}}
 async function download(id,{signal,onProgress=()=>{}}={}){
  const item=lookup(id);if(signal?.aborted)throw new DOMException('Avbrutt','AbortError');
  // Les eksisterende versjon før nettverkskallet. En annen fane må ikke overskrives.
  let previous;try{previous=storage.getItem(PACK_PREFIX+id);}catch{throw Error('Lagring er ikke tilgjengelig. Quizpakken ble ikke lastet ned.');}
  if(previous){try{if(JSON.parse(previous).pack?.version>item.version)throw Error('newer');}catch(error){if(error.message==='newer')throw Error('En nyere pakkeversjon er allerede lagret. Oppdater appen før du laster ned på nytt.');}}
  const response=await fetcher('./'+item.file,{cache:'no-store',signal,credentials:'same-origin'});
  if(!response.ok||response.redirected)throw Error('Kunne ikke hente quizpakken. Kontroller nettet og innloggingen, og prøv igjen.');
  const max=item.bytes;let bytes;
  if(response.body?.getReader){const reader=response.body.getReader(),chunks=[];let received=0;try{while(true){if(signal?.aborted)throw new DOMException('Avbrutt','AbortError');const {done,value}=await reader.read();if(done)break;received+=value.length;if(received>max)throw Error('Quizpakken er større enn forventet. Ingen lagret pakke ble endret.');chunks.push(value);onProgress(received,max);}bytes=new Uint8Array(received);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}}finally{try{await reader.cancel();}catch{}reader.releaseLock();}}
  else bytes=new Uint8Array(await response.arrayBuffer());
  if(signal?.aborted)throw new DOMException('Avbrutt','AbortError');
  if(bytes.length!==item.bytes)throw Error('Nedlastingen er ufullstendig. Prøv igjen.');
  const digest=Array.from(new Uint8Array(await cryptoApi.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==item.sha256)throw Error('Quizpakken besto ikke innholdskontrollen. Ingen lagret pakke ble endret.');
  let parsed;try{parsed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw Error('Quizpakken har ugyldig format. Ingen lagret pakke ble endret.');}
  const pack=validatePack(parsed,item);
  if(signal?.aborted)throw new DOMException('Avbrutt','AbortError');
  try{if(storage.getItem(PACK_PREFIX+id)!==previous)throw Error('changed');storage.setItem(PACK_PREFIX+id,JSON.stringify({schema:1,pack}));}catch(error){if(error.message==='changed')throw Error('Pakken er endret i en annen fane. Åpne biblioteket igjen.');throw Error('Det var ikke plass til quizpakken, eller lagring er blokkert. Den gamle pakken er beholdt.');}
  return pack;
 }
 function remove(id){lookup(id);try{storage.removeItem(PACK_PREFIX+id);}catch{throw Error('Pakken kunne ikke fjernes. Prøv igjen.');}}
 return {read,download,remove};
}
