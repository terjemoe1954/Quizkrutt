import {bank,categories} from './questions.js?v=m2-3';
export const STORAGE_KEY='quizkrutt.progress.v2';
const byId=new Map(bank.map(q=>[q.id,q]));
const bucket=(category,level)=>`${category}:${level}`;
const clone=value=>JSON.parse(JSON.stringify(value));
export function emptyState(){return {version:2,results:{},seen:{},active:null,lastPlayed:null};}
export function unlocked(state,category,level){return level===0||(state.results[bucket(category,level-1)]?.best??0)>=700;}
export function shuffle(items,random=Math.random){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function scoreRound(active){return active.answers.reduce((sum,a,i)=>sum+(a===active.cards[i].correct?100:0),0);}
export function startRound(state,category,level,random=Math.random){
 if(!categories.some(c=>c.id===category)||!Number.isInteger(level)||level<0||level>2||!unlocked(state,category,level))throw Error('Nivået er låst.');
 const key=bucket(category,level),seen=state.seen[key]??[];
 const pool=shuffle(bank.filter(q=>q.category===category&&q.level===level),random);
 // Nytt innhold først, deretter det som ble spilt lengst tilbake.
 pool.sort((a,b)=>seen.indexOf(a.id)-seen.indexOf(b.id));
 const cards=pool.slice(0,10).map(q=>{const order=shuffle([0,1,2,3],random);return {id:q.id,order,correct:order.indexOf(q.correct)};});
 const next=clone(state);
 next.active={category,level,cards,index:0,answers:[]};
 next.lastPlayed={category,level};
 return next;
}
export function answerRound(state,choice){
 const next=clone(state),a=next.active;
 if(!a||a.answers.length>a.index||!Number.isInteger(choice)||choice<0||choice>3)return next;
 a.answers.push(choice);
 const key=bucket(a.category,a.level),seen=next.seen[key]??[];
 const id=a.cards[a.index].id;
 next.seen[key]=[...seen.filter(x=>x!==id),id].slice(-30);
 return next;
}
export function advanceRound(state){
 const next=clone(state),a=next.active;
 if(!a||a.answers.length!==a.index+1)return next;
 if(a.index<9){a.index++;return next;}
 const key=bucket(a.category,a.level),old=next.results[key]??{best:0,rounds:0},score=scoreRound(a);
 next.results[key]={best:Math.max(old.best,score),rounds:old.rounds+1};
 next.active=null;
 return next;
}
export function questionFor(card){const q=byId.get(card.id);return {...q,options:card.order.map(i=>q.options[i]),correct:card.correct};}
export function summary(state){const records=Object.values(state.results);return {rounds:records.reduce((n,r)=>n+r.rounds,0),badges:records.filter(r=>r.best>=700).length};}
export function recommendedLevel(state,category){for(let l=0;l<3;l++)if((state.results[bucket(category,l)]?.best??0)<700)return l;return 2;}
export function validateState(raw){
 if(!raw||raw.version!==2||!raw.results||!raw.seen||!('active' in raw))throw Error('Ukjent lagringsformat.');
 const state=emptyState();
 for(const c of categories)for(let l=0;l<3;l++){
  const key=bucket(c.id,l),r=raw.results[key];
  if(r!==undefined){if(!r||!Number.isInteger(r.best)||r.best<0||r.best>1000||r.best%100||!Number.isSafeInteger(r.rounds)||r.rounds<1)throw Error('Ugyldig resultat.');state.results[key]={best:r.best,rounds:r.rounds};}
  const seen=raw.seen[key];
  if(seen!==undefined){if(!Array.isArray(seen))throw Error('Ugyldig historikk.');state.seen[key]=[...new Set(seen.filter(id=>byId.get(id)?.category===c.id&&byId.get(id)?.level===l))].slice(-30);}
 }
 for(const c of categories)for(let l=1;l<3;l++)if(state.results[bucket(c.id,l)]&&!unlocked(state,c.id,l))throw Error('Ugyldig nivårekkefølge.');
 const validTarget=t=>t&&categories.some(c=>c.id===t.category)&&Number.isInteger(t.level)&&t.level>=0&&t.level<=2&&unlocked(state,t.category,t.level);
 if(validTarget(raw.lastPlayed))state.lastPlayed={category:raw.lastPlayed.category,level:raw.lastPlayed.level};
 if(raw.active!==null){
  const a=raw.active;
  if(!validTarget(a)||!Array.isArray(a.cards)||a.cards.length!==10||new Set(a.cards.map(c=>c.id)).size!==10||!Number.isInteger(a.index)||a.index<0||a.index>9||!Array.isArray(a.answers)||a.answers.length<a.index||a.answers.length>a.index+1||a.answers.some(n=>!Number.isInteger(n)||n<0||n>3))throw Error('Ugyldig runde.');
  for(const card of a.cards){const q=byId.get(card.id);if(!q||q.category!==a.category||q.level!==a.level||!Array.isArray(card.order)||card.order.length!==4||[...card.order].sort().join('')!=='0123'||card.correct!==card.order.indexOf(q.correct))throw Error('Ugyldig spørsmål.');}
  state.active=clone(a);
 }
 return state;
}
export function createStore(storage){
 let lastRaw=null,blocked=false;
 return {
  load(){try{lastRaw=storage.getItem(STORAGE_KEY);return {state:lastRaw===null?emptyState():validateState(JSON.parse(lastRaw)),error:null};}catch{blocked=true;return {state:emptyState(),error:'Fremdriften kunne ikke leses. Du kan spille, men nye resultater lagres bare i denne økten. Eksisterende lagring blir ikke overskrevet.'};}},
  save(state){if(blocked)return {ok:false,error:'Lagringen er utilgjengelig. Fremdriften beholdes bare i denne økten.'};try{if(storage.getItem(STORAGE_KEY)!==lastRaw){blocked=true;return {ok:false,error:'Fremdriften er endret i en annen fane. Last siden på nytt for å hente den. Denne økten overskriver ikke den andre fanen.'};}const raw=JSON.stringify(state);storage.setItem(STORAGE_KEY,raw);lastRaw=raw;return {ok:true,error:null};}catch{return {ok:false,error:'Kunne ikke lagre fremdriften. Behold denne fanen åpen og prøv «Lagre på nytt». Hvis du lukker den, kan siste endringer gå tapt.'};}},
 };
}
