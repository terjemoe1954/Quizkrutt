import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bank,categories} from '../web/questions.js';
import {emptyState,unlocked,startRound,answerRound,advanceRound,questionFor,scoreRound,summary,validateState,createStore,STORAGE_KEY} from '../web/game.js';
function storage(initial=null){let value=initial;return {getItem:()=>value,setItem:(_,s)=>{value=s;},get raw(){return value;}};}
function complete(state,category,level,correct=10){
 state=startRound(state,category,level);
 for(let i=0;i<10;i++){const card=state.active.cards[i],choice=i<correct?card.correct:(card.correct+1)%4;state=answerRound(state,choice);state=advanceRound(state);}
 return state;
}
test('540 unike spørsmål: 30 per kategori og nivå, fire ulike svar og fasit',()=>{
 assert.equal(bank.length,540);assert.equal(new Set(bank.map(q=>q.id)).size,540);assert.equal(new Set(bank.map(q=>q.question)).size,540);
 for(const c of categories)for(let l=0;l<3;l++)assert.equal(bank.filter(q=>q.category===c.id&&q.level===l).length,30);
 for(const q of bank){assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.options[q.correct],q.id);assert.ok(q.explanation.length>10,q.id);assert.ok(!/[<>]/.test(q.question));}
});
test('6/10 holder nivå låst, 7/10 åpner bare neste nivå i samme kategori',()=>{
 let s=complete(emptyState(),'world',0,6);assert.equal(unlocked(s,'world',1),false);assert.throws(()=>startRound(s,'world',1));
 s=complete(s,'world',0,7);assert.equal(unlocked(s,'world',1),true);assert.equal(unlocked(s,'world',2),false);assert.equal(unlocked(s,'nature',1),false);
 assert.equal(summary(s).badges,1);assert.equal(summary(s).rounds,2);
 s=complete(s,'world',0,3);assert.equal(s.results['world:0'].best,700);assert.equal(summary(s).badges,1);assert.equal(s.results['world:0'].rounds,3);
});
test('alle 18 nivåer kan fullføres, mestres og spilles igjen',()=>{
 let s=emptyState();for(const c of categories)for(let l=0;l<3;l++){s=complete(s,c.id,l);assert.equal(s.results[`${c.id}:${l}`].best,1000);s=validateState(JSON.parse(JSON.stringify(s)));}
 assert.deepEqual(summary(s),{rounds:18,badges:18});assert.equal(s.active,null);s=complete(s,'nature',0,0);assert.equal(s.results['nature:0'].best,1000);assert.equal(summary(s).badges,18);
});
test('tre runder bruker alle 30 spørsmål før gjentakelse',()=>{
 let s=emptyState();const seen=[];
 for(let r=0;r<3;r++){s=startRound(s,'culture',0);const ids=s.active.cards.map(c=>c.id);assert.equal(new Set(ids).size,10);seen.push(...ids);for(let i=0;i<10;i++){s=answerRound(s,0);s=advanceRound(s);}}
 assert.equal(new Set(seen).size,30);
 s=startRound(s,'culture',0);assert.deepEqual(new Set(s.active.cards.map(c=>c.id)),new Set(seen.slice(0,10)));
});
test('lagring og omstart bevarer svarrekkefølge, fasit, poeng, runde og opplåsing',()=>{
 const disk=storage();let db=createStore(disk),s=db.load().state;s=complete(s,'mix',0,7);s=startRound(s,'mix',1);
 for(let i=0;i<4;i++){s=answerRound(s,s.active.cards[i].correct);if(i<3)s=advanceRound(s);}
 assert.equal(db.save(s).ok,true);db=createStore(disk);const loaded=db.load();assert.equal(loaded.error,null);assert.deepEqual(loaded.state,s);assert.equal(scoreRound(loaded.state.active),400);assert.equal(unlocked(loaded.state,'mix',1),true);
 const before=loaded.state.active.cards[3];assert.deepEqual(questionFor(before).options,before.order.map(i=>bank.find(q=>q.id===before.id).options[i]));
 s=advanceRound(loaded.state);assert.equal(s.active.index,4);assert.equal(scoreRound(s.active),400);
});
test('dobbelt svar og dobbelt avslutning gir ikke flere poeng eller runder',()=>{
 let s=startRound(emptyState(),'science',0);s=answerRound(s,s.active.cards[0].correct);s=answerRound(s,0);assert.equal(scoreRound(s.active),100);assert.equal(s.active.answers.length,1);
 for(let i=0;i<9;i++){s=advanceRound(s);s=answerRound(s,s.active.cards[i+1].correct);}s=advanceRound(s);s=advanceRound(s);assert.equal(s.results['science:0'].rounds,1);assert.equal(s.results['science:0'].best,1000);
});
test('ingen resultatopplåsing før siste svar og fullføring',()=>{
 let s=startRound(emptyState(),'sport',0);for(let i=0;i<10;i++){s=answerRound(s,s.active.cards[i].correct);if(i<9)s=advanceRound(s);}assert.equal(unlocked(s,'sport',1),false);s=advanceRound(s);assert.equal(unlocked(s,'sport',1),true);
});
test('ugyldig lagring bevares og blir ikke overskrevet',()=>{
 for(const raw of ['{broken',JSON.stringify({version:99}),JSON.stringify({...emptyState(),results:{'mix:0':{best:1001,rounds:1}}})]){const disk=storage(raw),db=createStore(disk);assert.ok(db.load().error);assert.equal(db.save(emptyState()).ok,false);assert.equal(disk.raw,raw);}
});
test('lagringskvote kan feile og prøves på nytt uten å miste øktens tilstand',()=>{
 let fail=true,value=null;const disk={getItem:()=>value,setItem:(_,s)=>{if(fail)throw Error('QuotaExceededError');value=s;}};const db=createStore(disk);let s=db.load().state;s=complete(s,'sport',0,8);assert.equal(db.save(s).ok,false);fail=false;assert.equal(db.save(s).ok,true);assert.equal(createStore(disk).load().state.results['sport:0'].best,800);
});
test('utilgjengelig localStorage krasjer ikke appen',()=>{const db=createStore({getItem(){throw Error('SecurityError');}});assert.ok(db.load().error);assert.equal(db.save(emptyState()).ok,false);});
test('to faner overskriver ikke nyere fremdrift',()=>{
 const disk=storage(),a=createStore(disk),b=createStore(disk),sa=a.load().state,sb=b.load().state;
 const saved=complete(sa,'world',0,8);assert.equal(a.save(saved).ok,true);assert.equal(b.save(complete(sb,'nature',0,7)).ok,false);assert.equal(JSON.parse(disk.raw).results['world:0'].best,800);assert.equal(JSON.parse(disk.raw).results['nature:0'],undefined);
});
test('ugyldig aktiv runde, doble spørsmål og endret fasit avvises',()=>{
 const s=startRound(emptyState(),'nature',0);for(const mutate of [s=>s.active.index=10,s=>s.active.cards[1]=s.active.cards[0],s=>s.active.answers=[9],s=>s.active.cards[0].correct=9,s=>s.active.cards[0].order=[0,0,2,3]]){const copy=JSON.parse(JSON.stringify(s));mutate(copy);assert.throws(()=>validateState(copy));}
});
