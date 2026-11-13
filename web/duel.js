import {bank,categories} from './questions.js?v=m7-1';
import {shuffle,questionFor} from './game.js?v=m7-1';
const copy=value=>JSON.parse(JSON.stringify(value));
export function validateNames(values){
 if(!Array.isArray(values)||values.length!==2||values.some(n=>typeof n!=='string'))throw Error('Skriv et kallenavn til hver spiller.');
 const names=values.map(n=>n.trim().replace(/\s+/gu,' '));
 if(names.some(n=>!n||Array.from(n).length>20||/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(n)))throw Error('Bruk kallenavn på 1–20 tegn.');
 if(names[0].normalize('NFKC').toLocaleLowerCase('nb-NO')===names[1].normalize('NFKC').toLocaleLowerCase('nb-NO'))throw Error('Velg to ulike kallenavn, så vi vet hvem sin tur det er.');
 return names;
}
export function createDuel({names,category,level,count=5},random=Math.random){
 names=validateNames(names);
 if(!categories.some(c=>c.id===category)||!Number.isInteger(level)||level<0||level>2||![5,10].includes(count))throw Error('Velg en kategori, et nivå og 5 eller 10 spørsmål hver.');
 const groups=new Map();
 for(const q of bank.filter(q=>q.category===category&&q.level===level)){const key=q.id.replace(/-\d+$/,'');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}
 const topics=shuffle([...groups.keys()],random),sets=[[],[]];
 // Samme temakvoter for begge. Ulike spørsmål; ingen spiller ser den andres fasit først.
 for(let i=0;i<topics.length;i++){
  const quota=Math.floor(count/topics.length)+(i<count%topics.length?1:0),pool=shuffle(groups.get(topics[i]),random);
  if(pool.length<quota*2)throw Error('Ikke nok ulike spørsmål til en balansert duell.');
  for(let j=0;j<quota*2;j++)sets[j%2].push(pool[j]);
 }
 const cards=sets.map(set=>shuffle(set,random).map(q=>{const order=shuffle([0,1,2,3],random);return {id:q.id,order,correct:order.indexOf(q.correct)};}));
 return {names,category,level,count,cards,answers:[[],[]],turn:0,first:random()<.5?0:1,phase:'handover'};
}
export function currentPlayer(duel){return (duel.first+duel.turn)%2;}
export function currentIndex(duel){return Math.floor(duel.turn/2);}
export function duelQuestion(duel){return questionFor(duel.cards[currentPlayer(duel)][currentIndex(duel)]);}
export function duelScores(duel){return duel.answers.map((answers,p)=>answers.reduce((sum,choice,i)=>sum+(choice===duel.cards[p][i].correct?100:0),0));}
export function openDuelTurn(duel){if(duel.phase!=='handover')return duel;const next=copy(duel);next.phase=next.answers[currentPlayer(next)].length>currentIndex(next)?'feedback':'question';return next;}
export function answerDuel(duel,choice){
 if(duel.phase!=='question'||!Number.isInteger(choice)||choice<0||choice>3||duel.answers[currentPlayer(duel)].length!==currentIndex(duel))return duel;
 const next=copy(duel);next.answers[currentPlayer(next)].push(choice);next.phase='feedback';return next;
}
export function advanceDuel(duel){if(duel.phase!=='feedback')return duel;const next=copy(duel);next.turn++;next.phase=next.turn===next.count*2?'finished':'handover';return next;}
export function hideDuel(duel){if(!['question','feedback'].includes(duel.phase))return duel;return {...duel,phase:'handover'};}
export function duelWinner(duel){if(duel.phase!=='finished')return null;const [a,b]=duelScores(duel);return a===b?'tie':a>b?0:1;}
