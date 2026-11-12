import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash,webcrypto} from 'node:crypto';
import {catalog} from '../dist/catalog.js';
import {packs} from '../content/packs.mjs';
import {validatePack} from '../dist/pack-format.js';
import {createPackLibrary,PACK_PREFIX,packKey,recommendPacks} from '../dist/packs.js';
import {emptyState,startPackRound,answerRound,advanceRound,questionFor,scoreRound,validateState,unlocked,createStore,STORAGE_KEY} from '../dist/game.js';
const clone=x=>JSON.parse(JSON.stringify(x));
const disk=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
const itemFor=p=>{const bytes=new TextEncoder().encode(JSON.stringify(p));return {...p,count:p.questions.length,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),file:`packs/${p.id}.v${p.version}.json`};};
const library=(storage,cat=catalog,fetcher=async path=>new Response(await readFile(new URL('../dist/'+path.slice(2),import.meta.url))))=>createPackLibrary(storage,cat,{fetcher,cryptoApi:webcrypto});
function finish(state){for(let i=state.active.index;i<10;i++){state=answerRound(state,state.active.cards[i].correct);state=advanceRound(state);}return state;}
test('seks faktiske nedlastinger, 120 nye spørsmål og metadata som samsvarer med filer',async()=>{
 assert.equal(packs.length,6);const ids=[],questions=[];
 for(const p of catalog){const bytes=await readFile(new URL('../dist/'+p.file,import.meta.url));assert.equal(bytes.length,p.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256);const pack=validatePack(JSON.parse(bytes),p);assert.equal(pack.questions.length,20);ids.push(...pack.questions.map(q=>q.id));questions.push(...pack.questions.map(q=>q.question));}
 assert.equal(ids.length,120);assert.equal(new Set(ids).size,120);assert.equal(new Set(questions).size,120);
});
test('nedlasting er eksplisitt og vises først etter at hele pakken er kontrollert og lagret',async()=>{
 const storage=disk();let calls=0;const db=library(storage,catalog,async path=>{calls++;return new Response(await readFile(new URL('../dist/'+path.slice(2),import.meta.url)));});
 assert.equal(db.read(catalog[0].id).pack,null);assert.equal(calls,0);await db.download(catalog[0].id);assert.equal(calls,1);assert.equal(db.read(catalog[0].id).pack.questions.length,20);
 const offline=library(storage,catalog,async()=>{throw new TypeError('offline');});assert.equal(offline.read(catalog[0].id).pack.id,catalog[0].id);
});
test('avbrutt nedlasting bevarer eksisterende innhold og kan prøves på nytt',async()=>{
 const storage=disk(),db=library(storage),id=catalog[0].id;await db.download(id);const old=storage.getItem(PACK_PREFIX+id),abort=new AbortController();
 await assert.rejects(()=>db.download(id,{signal:abort.signal,onProgress:()=>abort.abort()}),{name:'AbortError'});assert.equal(storage.getItem(PACK_PREFIX+id),old);await db.download(id);assert.ok(db.read(id).pack);
});
test('nettfeil, HTTP-feil, innloggingsomdirigering og avkuttet fil endrer ingen pakker',async()=>{
 const storage=disk();await library(storage).download(catalog[0].id);const original=storage.getItem(PACK_PREFIX+catalog[0].id);
 const broken=[async()=>{throw new TypeError('offline');},async()=>new Response('Unavailable',{status:503}),async()=>({ok:true,redirected:true}),async()=>new Response('{}')];
 for(const fetcher of broken){await assert.rejects(()=>library(storage,catalog,fetcher).download(catalog[0].id));assert.equal(storage.getItem(PACK_PREFIX+catalog[0].id),original);}
});
test('feil sjekksum eller ugyldig spørsmål avvises før lagring',async()=>{
 const storage=disk(),changed=clone(packs[0]);changed.questions[0].correct=8;const item=itemFor(changed),db=library(storage,[item],async()=>new Response(JSON.stringify(changed)));
 await assert.rejects(()=>db.download(item.id),/ugyldig/);assert.equal(storage.getItem(PACK_PREFIX+item.id),null);
 const good=JSON.stringify(packs[0]),corrupted=good.replace('Norge:','Xorge:');await assert.rejects(()=>library(storage,catalog,async()=>new Response(corrupted)).download(catalog[0].id),/innholdskontrollen/);
});
test('feil pakkeidentitet, versjon og antall avvises selv med korrekt transportkontroll',async()=>{
 for(const mutate of [p=>p.version++,p=>p.id='wrong-id',p=>p.questions.pop()]){const p=clone(packs[0]);mutate(p);const bytes=JSON.stringify(p);const item={...catalog[0],bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex')};await assert.rejects(()=>library(disk(),[item],async()=>new Response(bytes)).download(item.id));}
});
test('kvotefeil under oppdatering beholder gammel pakke og resultater',async()=>{
 const storage=disk();await library(storage).download(catalog[0].id);const original=storage.getItem(PACK_PREFIX+catalog[0].id),p=clone(packs[0]);p.version=2;const item=itemFor(p);storage.setItem=()=>{throw Error('QuotaExceededError');};await assert.rejects(()=>library(storage,[item],async()=>new Response(JSON.stringify(p))).download(p.id),/gamle pakken er beholdt/);assert.equal(storage.getItem(PACK_PREFIX+p.id),original);
});
test('oppdatering beholder gamle resultater og en påbegynt gammel runde',async()=>{
 const storage=disk(),p=packs[0];await library(storage).download(p.id);let state=finish(startPackRound(emptyState(),p));state=startPackRound(state,p);state=answerRound(state,state.active.cards[0].correct);const oldCard=questionFor(state.active.cards[0]);
 const updated=clone(p);updated.version=2;updated.questions[0].question='Et nytt formulert spørsmål?';const item=itemFor(updated);await library(storage,[item],async()=>new Response(JSON.stringify(updated))).download(p.id);
 assert.equal(library(storage).read(p.id).pack.version,2);state=validateState(clone(state));assert.deepEqual(questionFor(state.active.cards[0]),oldCard);assert.equal(state.packProgress[packKey(p.id,1)].best,1000);assert.equal(state.active.packVersion,1);
 state=finish(startPackRound(state,updated));assert.equal(state.packProgress[packKey(p.id,1)].rounds,1);assert.equal(state.packProgress[packKey(p.id,2)].rounds,1);
});
test('fjerning av innhold beholder resultater og gjenopptakbar runde',async()=>{
 const storage=disk(),db=library(storage),p=packs[0];await db.download(p.id);let state=finish(startPackRound(emptyState(),p));state=startPackRound(state,p);state=answerRound(state,state.active.cards[0].correct);storage.setItem(STORAGE_KEY,JSON.stringify(state));db.remove(p.id);assert.equal(db.read(p.id).pack,null);state=createStore(storage).load().state;assert.equal(scoreRound(state.active),100);assert.equal(state.packProgress[packKey(p.id,1)].best,1000);state=finish(state);assert.equal(state.packProgress[packKey(p.id,1)].rounds,2);
});
test('pakkerunden åpner ikke grunnnivåer, og samme pakke kan roteres uten duplikater',()=>{
 let state=startPackRound(emptyState(),packs[3]);assert.equal(state.active.level,2);state=finish(state);assert.equal(unlocked(state,packs[3].category,1),false);assert.deepEqual(state.results,{});
 const first=Object.values(state.packProgress)[0].seen;state=startPackRound(state,packs[3]);assert.equal(state.active.cards.filter(c=>first.includes(c.id)).length,0);assert.equal(new Set(state.active.cards.map(c=>c.id)).size,10);
});
test('resultat og aktiv pakke overlever M2-lagringsformat og etterfølgende omstart',()=>{
 const old={version:2,results:{'world:0':{best:700,rounds:1}},seen:{},active:null,lastPlayed:{category:'world',level:0}};const migrated=validateState(old);assert.equal(unlocked(migrated,'world',1),true);assert.deepEqual(migrated.packProgress,{});let state=startPackRound(migrated,packs[0]);state=answerRound(state,state.active.cards[0].correct);assert.deepEqual(validateState(clone(state)),state);
});
test('gammel katalog kan ikke nedgradere en nyere installert pakke',async()=>{
 const storage=disk(),p=clone(packs[0]);p.version=2;const item=itemFor(p);await library(storage,[item],async()=>new Response(JSON.stringify(p))).download(p.id);await assert.rejects(()=>library(storage).download(p.id),/nyere pakkeversjon/);assert.equal(library(storage).read(p.id).pack.version,2);
});
test('konkurrerende faner overskriver ikke pakker som er endret mens nedlasting pågår',async()=>{
 const storage=disk(),p=packs[0],db=library(storage,catalog,async path=>{storage.setItem(PACK_PREFIX+p.id,'newer-value');return new Response(await readFile(new URL('../dist/'+path.slice(2),import.meta.url)));});await assert.rejects(()=>db.download(p.id),/annen fane/);assert.equal(storage.getItem(PACK_PREFIX+p.id),'newer-value');
});
test('forslag etter bestått nivå prioriterer relevant tema og høyere nivå',()=>{const recs=recommendPacks(catalog,'science',0);assert.equal(recs[0].category,'science');assert.equal(recs[0].level,1);assert.ok(recs.every(p=>p.level>0));});
