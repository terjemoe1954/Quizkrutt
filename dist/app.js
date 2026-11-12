import {categories,levelNames} from './questions.js?v=m2-3';
import {createStore,unlocked,startRound,answerRound,advanceRound,questionFor,scoreRound,summary} from './game.js?v=m2-3';
const app=document.querySelector('#app');
let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error('Utilgjengelig');}};}
const store=createStore(storage),loaded=store.load();
let state=loaded.state,saveError=loaded.error,category=null,view='home',lastResult=null;
const letters=['A','B','C','D'];
const categoryById=id=>categories.find(c=>c.id===id);
const record=(id,l)=>state.results[`${id}:${l}`];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(next){state=next;const saved=store.save(state);saveError=saved.error;updateStorageNotice();}
function updateStorageNotice(){const resultSave=document.querySelector('#resultSave');if(resultSave)resultSave.textContent=saveError?'Resultatet er bare beholdt i denne økten. Se lagringsmeldingen over.':'Resultatet er lagret på denne enheten.';const el=document.querySelector('#storageNotice');el.hidden=!saveError;el.replaceChildren();if(saveError){const text=document.createElement('p');text.textContent=saveError;const retry=document.createElement('button');retry.className='secondary';retry.textContent='Lagre på nytt';retry.onclick=()=>persist(state);el.append(text,retry);}}
function show(html){app.innerHTML=html;updateStorageNotice();window.scrollTo(0,0);const h=app.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
function home(){
 view='home';const stats=summary(state),active=state.active,target=active??state.lastPlayed;
 show(`<section class="hero"><div><div class="eyebrow">EN LITEN PAUSE. LITT MER PEILING.</div><h1>Gi hjernen din<br>litt <span class="highlight">konfetti.</span></h1><p>Verden er full av artige ting å vite.<br>Velg et tema, og se hva du kan!</p><span class="mini">✦ GRATIS HJERNETRIM · INGEN TIDSPRESS</span></div><div class="mascot" aria-hidden="true"><span class="spark">✧</span><div class="blob"><span class="face">•ᴗ•</span></div><span class="speech">Klar for et lite aha?</span></div></section>
 <section class="journey" aria-label="Din fremdrift"><div><span class="eyebrow">DIN QUIZREISE</span><h2>${stats.badges?`${stats.badges} av 18 merker`:'Ditt første aha venter!'}</h2><p>${stats.rounds} ${stats.rounds===1?'fullført runde':'fullførte runder'} · 540 spørsmål å utforske</p></div><div class="badge-track" aria-label="${stats.badges} av 18 nivåer bestått">${categories.map(c=>`<span title="${c.name}: ${[0,1,2].filter(l=>(record(c.id,l)?.best??0)>=700).length} av 3 merker"><img src="icons/${c.id}.svg" alt=""><small>${[0,1,2].map(l=>(record(c.id,l)?.best??0)>=700?'★':'☆').join('')}</small></span>`).join('')}</div>${target?`<button class="primary" id="continue">${active?'Fortsett runden':'Spill videre'} →</button><p class="continue-label">${categoryById(target.category).name} · ${levelNames[target.level]}${active?` · Spørsmål ${active.index+1} av 10`:''}</p>`:''}</section>
 <section><div class="sectionhead"><div><h2>Hva er du nysgjerrig på?</h2><p>Seks temaer. Tre nivåer. Masse små seire.</p></div><span class="mini">06 KATEGORIER Å UTFORSKE</span></div><div class="cards">${categories.map(c=>{const count=[0,1,2].filter(l=>(record(c.id,l)?.best??0)>=700).length;return `<button class="card" data-category="${c.id}" style="--tint:${c.color}"><span class="icon" aria-hidden="true"><img src="icons/${c.id}.svg" alt=""></span><h3>${c.name}</h3><p>${c.description}</p><span class="tag">90 SPØRSMÅL · ${count}/3 MERKER</span><span class="arrow" aria-hidden="true">↗</span></button>`;}).join('')}</div></section><aside class="soon"><img src="icons/science.svg" class="soon-icon" alt=""><div><h3>Mer krutt på vei</h3><p>Nedlastbare temaer og vennedueller.</p></div><span class="pill">KOMMER SENERE</span></aside><p class="local-note">Fremdriften lagres i denne nettleseren på denne enheten. Ingen konto eller synkronisering. Sletting av nettsteddata fjerner fremdriften.</p>`);
 app.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=categoryById(b.dataset.category);levels();});
 if(target)document.querySelector('#continue').onclick=()=>{category=categoryById(target.category);active?resume():levels();};
}
function levels(){
 view='levels';
 show(`<div class="panel"><button class="back" id="back">← Alle kategorier</button><div class="icon" style="--tint:${category.color}" aria-hidden="true"><img src="icons/${category.id}.svg" alt=""></div><div class="eyebrow">VELG UTFORDRING</div><h1 class="category-title">${category.name}</h1><p>7 av 10 riktige gir et merke og åpner neste nivå.<br>30 spørsmål per nivå. 10 spørsmål i hver runde.</p><div class="levels">${levelNames.map((name,l)=>{const r=record(category.id,l),open=unlocked(state,category.id,l),passed=(r?.best??0)>=700;return `<button class="level ${passed?'passed':''}" data-level="${l}" ${open?'':'disabled'}><div><h3>0${l+1} · ${name}</h3><span>${!open?`Få 7 av 10 på ${levelNames[l-1]} for å åpne`:r?`Beste: ${r.best/100}/10 · ${r.rounds} runder${passed?' · Merke vunnet':''}`:'Klar for ditt første forsøk?'}</span></div><span aria-hidden="true">${!open?'🔒':passed?'★':'→'}</span></button>`;}).join('')}</div><p class="mini">NYE SPØRSMÅL PRIORITERES FØR DE DU NYLIG HAR SETT.</p></div>`);
 document.querySelector('#back').onclick=home;
 app.querySelectorAll('[data-level]:not(:disabled)').forEach(b=>b.onclick=()=>requestStart(Number(b.dataset.level)));
}
let pendingLevel=0;
function requestStart(level){
 pendingLevel=level;
 if(state.active){const a=state.active;document.querySelector('#replaceText').textContent=`Du har en påbegynt runde i ${categoryById(a.category).name}, ${levelNames[a.level]}. Vil du fortsette den eller erstatte den med en ny runde?`;document.querySelector('#replaceDialog').showModal();return;}
 start(level);
}
function start(level){persist(startRound(state,category.id,level));resume();}
function resume(){category=categoryById(state.active.category);view='quiz';question();}
function question(){
 const a=state.active,q=questionFor(a.cards[a.index]);
 show(`<section class="panel"><button class="back" id="quit">← Pause og gå til forsiden</button><div class="quizmeta"><span>${category.icon} ${category.name}<small>${levelNames[a.level]}</small></span><span>${scoreRound(a)} poeng</span></div><div class="progress" role="progressbar" aria-label="Spørsmål besvart" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${a.answers.length}"><div style="width:${a.answers.length*10}%"></div></div><div class="eyebrow">SPØRSMÅL ${a.index+1} AV 10</div><h2 class="question">${escape(q.question)}</h2><div class="answers">${q.options.map((option,i)=>`<button class="answer" data-answer="${i}"><span class="letter">${letters[i]}</span><span>${escape(option)}</span></button>`).join('')}</div><div id="feedback" role="status" aria-live="polite"></div></section>`);
 document.querySelector('#quit').onclick=home;
 app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
 if(a.answers.length>a.index)renderAnswer(false);
}
function answer(choice){if(state.active.answers.length>state.active.index)return;persist(answerRound(state,choice));renderAnswer(true);}
function renderAnswer(focus){
 const a=state.active,q=questionFor(a.cards[a.index]),choice=a.answers[a.index],right=choice===q.correct;
 document.querySelector('.quizmeta>span:last-child').textContent=scoreRound(a)+' poeng';
 const progress=document.querySelector('[role="progressbar"]');progress.setAttribute('aria-valuenow',String(a.answers.length));progress.firstElementChild.style.width=a.answers.length*10+'%';
 app.querySelectorAll('[data-answer]').forEach(b=>{const n=Number(b.dataset.answer);b.disabled=true;if(n===q.correct)b.classList.add('correct');else if(n===choice)b.classList.add('wrong');});
 document.querySelector('#feedback').innerHTML=`<div class="feedback"><strong>${right?'✦ Helt riktig! +100 poeng':`Godt forsøk! Riktig svar: ${escape(q.options[q.correct])}.`}</strong><p>${escape(q.explanation)}</p><button class="primary" id="next">${a.index===9?'Se resultatet':'Neste spørsmål'} →</button></div>`;
 document.querySelector('#next').onclick=()=>{if(a.index===9){lastResult={category:a.category,level:a.level,score:scoreRound(a),newBadge:!((record(a.category,a.level)?.best??0)>=700)&&scoreRound(a)>=700};persist(advanceRound(state));result();}else{persist(advanceRound(state));question();}};
 if(focus)document.querySelector('#next').focus({preventScroll:true});
}
function result(){
 view='result';const r=lastResult,passed=r.score>=700,nextOpen=r.level<2&&unlocked(state,r.category,r.level+1);
 show(`<section class="panel results"><div class="medal" aria-hidden="true">${passed?'🏆':'🎉'}</div><div class="eyebrow" style="justify-content:center">${r.newBadge?'NYTT MERKE VUNNET':'RUNDE FULLFØRT'} · ${levelNames[r.level]}</div><h1 class="result-title">${passed?'Du har skikkelig quizkrutt!':'Et lite aha rikere!'}</h1><div class="score">${r.score}<span style="font-size:20px"> / 1000</span></div><p>Du svarte riktig på <strong>${r.score/100} av 10</strong> spørsmål i ${category.name}.</p><p>${r.newBadge?`★ ${levelNames[r.level]}-merket er ditt! `:''}${passed?(r.level<2?`${levelNames[r.level+1]} er åpent.`:'Alle tre nivåene i denne kategorien er mestret!'):nextOpen?'Neste nivå er allerede åpent fra et tidligere forsøk.':'7 av 10 gir et merke. Nye spørsmål venter på neste forsøk!'}<br>Beste resultat på nivået: ${record(r.category,r.level).best/100}/10.</p><div class="actions">${nextOpen?'<button class="primary" id="nextLevel">Neste nivå →</button>':''}<button class="${nextOpen?'secondary':'primary'}" id="again">Prøv igjen ↻</button><button class="secondary" id="home">Velg kategori</button></div><p class="local-note" id="resultSave">${saveError?'Resultatet er bare beholdt i denne økten. Se lagringsmeldingen over.':'Resultatet er lagret på denne enheten.'}</p></section>`);
 document.querySelector('#again').onclick=()=>requestStart(r.level);document.querySelector('#home').onclick=home;
 if(nextOpen)document.querySelector('#nextLevel').onclick=()=>requestStart(r.level+1);
}
const replace=document.querySelector('#replaceDialog');
document.querySelector('#replaceCancel').onclick=()=>replace.close();
document.querySelector('#replaceResume').onclick=()=>{replace.close();resume();};
document.querySelector('#replaceStart').onclick=()=>{replace.close();start(pendingLevel);};
document.querySelector('#brand').onclick=e=>{e.preventDefault();home();};
document.querySelector('#help').onclick=()=>document.querySelector('#info').showModal();
document.querySelector('#closeInfo').onclick=()=>document.querySelector('#info').close();
window.addEventListener('storage',e=>{if(e.key==='quizkrutt.progress.v2'||e.key===null){saveError='Fremdriften er endret i en annen fane. Last siden på nytt for å hente den.';updateStorageNotice();}});
async function prepareOffline(){
 if(!('serviceWorker' in navigator))return;
 try{
  // Versioned assets keep an open round on the same code during a background update.
  const registration=await navigator.serviceWorker.register('./sw.js');await registration.update();
  await navigator.serviceWorker.ready;
  const keys=await caches.keys();
  const cache=keys.includes('quizkrutt-m2-v3')?await caches.open('quizkrutt-m2-v3'):null;
  const ready=cache&&await cache.match(new URL('./game.js?v=m2-3',location.href).href);
  document.querySelector('#offline').textContent=ready?'M2 er klargjort for bruk uten nett. Åpne appen én gang på nett etter installasjon.':'En oppdatering klargjøres. Åpne appen igjen på nett før du prøver uten nett.';
 }catch{document.querySelector('#offline').textContent='Bruk uten nett kunne ikke bekreftes. Fremdriften lagres lokalt, men åpne appen på nett før du prøver uten nett.';}
}
home();prepareOffline();
