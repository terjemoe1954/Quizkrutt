import {test} from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../dist/questions.js';
import {createDuel,validateNames,currentPlayer,currentIndex,duelQuestion,duelScores,openDuelTurn,answerDuel,advanceDuel,hideDuel,duelWinner} from '../dist/duel.js';
import {emptyState,startRound,answerRound,validateState} from '../dist/game.js';
const options={names:['Ada','Leo'],category:'world',level:0,count:5};
const group=id=>id.replace(/-\d+$/,'');
function tally(cards){return cards.reduce((result,c)=>(result[group(c.id)]=(result[group(c.id)]??0)+1,result),{});}
function play(state,decide=()=>true){while(state.phase!=='finished'){state=openDuelTurn(state);const right=duelQuestion(state).correct;state=answerDuel(state,decide(currentPlayer(state),currentIndex(state))?right:(right+1)%4);state=advanceDuel(state);}return state;}
test('balanserer alle 18 kategori/nivåvalg, begge lengder og ulike startspillere',()=>{
 for(const c of categories)for(let level=0;level<3;level++)for(const count of [5,10])for(const fixed of [.1,.8]){
  const duel=createDuel({...options,category:c.id,level,count},()=>fixed);
  assert.equal(duel.cards[0].length,count);assert.equal(duel.cards[1].length,count);assert.equal(new Set(duel.cards.flat().map(q=>q.id)).size,count*2);assert.deepEqual(tally(duel.cards[0]),tally(duel.cards[1]));
  const finished=play(duel);assert.deepEqual(finished.answers.map(a=>a.length),[count,count]);assert.deepEqual(duelScores(finished),[count*100,count*100]);assert.equal(duelWinner(finished),'tie');assert.equal(finished.turn,count*2);
 }
});
test('vinner og uavgjort bestemmes først etter at begge har like mange turer',()=>{
 assert.equal(duelWinner(createDuel(options)),null);
 for(const winner of [0,1]){const result=play(createDuel(options),p=>p===winner);assert.equal(duelWinner(result),winner);assert.equal(duelScores(result)[winner],500);assert.equal(duelScores(result)[1-winner],0);}
 assert.equal(duelWinner(play(createDuel(options),()=>false)),'tie');
});
test('hver tur starter skjult; svar kan ikke sendes fra overlevering eller to ganger',()=>{
 let duel=createDuel(options);assert.equal(duel.phase,'handover');assert.equal(answerDuel(duel,0),duel);assert.equal(advanceDuel(duel),duel);
 duel=openDuelTurn(duel);assert.equal(duel.phase,'question');const first=currentPlayer(duel);duel=answerDuel(duel,duelQuestion(duel).correct);assert.equal(duel.phase,'feedback');const second=answerDuel(duel,0);assert.deepEqual(duelScores(second)[first],100);assert.equal(second.answers[first].length,1);
 duel=advanceDuel(duel);assert.equal(duel.phase,'handover');assert.notEqual(currentPlayer(duel),first);assert.equal(currentIndex(duel),0);
});
test('skjuling ved appbytte gir overleveringsskjerm uten å slette eller gjenta svar',()=>{
 let duel=openDuelTurn(createDuel(options));const before=duelQuestion(duel);duel=hideDuel(duel);assert.equal(duel.phase,'handover');duel=openDuelTurn(duel);assert.deepEqual(duelQuestion(duel),before);
 duel=answerDuel(duel,before.correct);duel=hideDuel(duel);assert.equal(duel.phase,'handover');duel=openDuelTurn(duel);assert.equal(duel.phase,'feedback');assert.equal(duelScores(duel).reduce((a,b)=>a+b),100);
});
test('turene alternerer og ingen spiller kan se et spørsmål fra den andres sett',()=>{
 let duel=createDuel(options,()=>.9);const seen=[[],[]];let previous=null;
 for(let turn=0;turn<10;turn++){const player=currentPlayer(duel);assert.notEqual(player,previous);previous=player;duel=openDuelTurn(duel);seen[player].push(duelQuestion(duel).id);duel=advanceDuel(answerDuel(duel,0));}
 assert.equal(new Set(seen.flat()).size,10);assert.equal(duel.phase,'finished');assert.equal(advanceDuel(duel),duel);assert.equal(openDuelTurn(duel),duel);
});
test('duell påvirker verken soloresultater, påbegynt runde eller pakkehistorikk',()=>{
 let solo=startRound(emptyState(),'nature',0);solo=answerRound(solo,solo.active.cards[0].correct);const saved=JSON.stringify(solo);const duel=play(createDuel(options));assert.equal(duel.phase,'finished');assert.equal(JSON.stringify(solo),saved);assert.deepEqual(validateState(solo),solo);
});
test('kallenavn normaliseres og like, tomme eller for lange navn avvises',()=>{
 assert.deepEqual(validateNames(['  Ada  Lovelace  ',' Leo ']),['Ada Lovelace','Leo']);assert.deepEqual(validateNames(['Åse','Øyvind']),['Åse','Øyvind']);
 for(const names of [['','Leo'],['Ada','ada'],['Ada','  ADA  '],['Ａda','Ada'],['x'.repeat(21),'Leo'],['Ada\u202e','Leo']])assert.throws(()=>validateNames(names));
});
test('ugyldig kategori, nivå, lengde og svar avvises',()=>{
 for(const changes of [{category:'missing'},{level:3},{level:-1},{level:1.5},{count:0},{count:20}])assert.throws(()=>createDuel({...options,...changes}));
 const duel=openDuelTurn(createDuel(options));for(const choice of [-1,4,1.5,'0'])assert.equal(answerDuel(duel,choice),duel);
});
