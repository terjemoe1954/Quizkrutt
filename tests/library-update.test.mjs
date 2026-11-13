import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
import {catalog} from '../web/catalog.js';
import {validateCatalog,refreshCatalog,restoreCatalog} from '../web/remote-library.js';
import {createPackLibrary} from '../web/packs.js';
import {createStore,emptyState,startPackRound,answerRound,advanceRound,validateState,STORAGE_KEY} from '../web/game.js';
const disk=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
const manifest=JSON.parse(await readFile(new URL('../web/library/catalog.json',import.meta.url)));
test('public library adds categories; remote download survives restart and offline play',async()=>{
 const storage=disk(),target=structuredClone(catalog);await refreshCatalog(storage,target,async()=>new Response(JSON.stringify(manifest)));
 assert.equal(target.length,8);const entry=target.find(p=>p.category==='history');assert.equal(entry.remote,true);
 const lib=createPackLibrary(storage,target,{cryptoApi:webcrypto,fetcher:async(url,options)=>{assert.ok(url.startsWith('https://terjemoe1954.github.io/app-page/quizkrutt/library/packs/'));assert.equal(options.credentials,'omit');return new Response(await readFile(new URL('../web/library/'+entry.file,import.meta.url)));}});
 const pack=await lib.download(entry.id);let state=startPackRound(emptyState(),pack);for(let i=0;i<10;i++){state=answerRound(state,state.active.cards[i].correct);state=advanceRound(state);}assert.equal(validateState(state).packProgress[entry.id+'@1'].best,1000);
 const restored=structuredClone(catalog);restoreCatalog(storage,restored);const offline=createPackLibrary(storage,restored,{fetcher:()=>{throw Error('offline');}});assert.equal(offline.read(entry.id).pack.id,entry.id);
});
test('catalog failure and invalid path preserve cache and do not publish partial entries',async()=>{
 const storage=disk(),target=structuredClone(catalog);await refreshCatalog(storage,target,async()=>new Response(JSON.stringify(manifest)));const prior=storage.getItem('quizkrutt.catalog.v1');
 const bad=structuredClone(manifest);bad[0].file='../secret';assert.throws(()=>validateCatalog(bad));await assert.rejects(refreshCatalog(storage,target,async()=>new Response(JSON.stringify(bad))));assert.equal(storage.getItem('quizkrutt.catalog.v1'),prior);
 await assert.rejects(refreshCatalog(storage,target,async()=>{throw Error('offline');}));assert.equal(target.length,8);
});
test('reset clears results, seen and active but retains installed packs and preferences',()=>{
 const storage=disk(),store=createStore(storage);store.load();const state=emptyState();state.results['mix:0']={best:900,rounds:1};store.save(state);storage.setItem('quizkrutt.pack.example','pack');storage.setItem('quizkrutt.preferences.v1','prefs');
 const reset=store.reset();assert.equal(reset.ok,true);assert.deepEqual(reset.state,emptyState());assert.equal(storage.getItem('quizkrutt.pack.example'),'pack');assert.equal(storage.getItem('quizkrutt.preferences.v1'),'prefs');assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)),emptyState());
});
test('reset refuses concurrent edits and write failures',()=>{
 const storage=disk(),store=createStore(storage);store.load();storage.setItem(STORAGE_KEY,'other tab');assert.equal(store.reset().ok,false);assert.equal(storage.getItem(STORAGE_KEY),'other tab');
 const disk2=disk(),store2=createStore(disk2);store2.load();disk2.setItem=()=>{throw Error('full');};assert.equal(store2.reset().ok,false);assert.equal(disk2.getItem(STORAGE_KEY),null);
});
