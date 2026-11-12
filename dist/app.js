import {createDuel,validateNames,currentPlayer,currentIndex,duelQuestion,duelScores,openDuelTurn,answerDuel,advanceDuel,hideDuel,duelWinner} from './duel.js?v=m4-1';
import {catalog} from './catalog.js?v=m4-1';
import {createPackLibrary,packKey,recommendPacks} from './packs.js?v=m4-1';
import {categories,levelNames} from './questions.js?v=m4-1';
import {createStore,unlocked,startRound,answerRound,advanceRound,questionFor,scoreRound,summary,startPackRound} from './game.js?v=m4-1';
const app=document.querySelector('#app');
let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error('Utilgjengelig');}};}
const libraryStore=createPackLibrary(storage,catalog);
const store=createStore(storage),loaded=store.load();
let state=loaded.state,saveError=loaded.error,category=null,view='home',lastResult=null,duel=null;
let duelDraft={names:['',''],category:'mix',level:0,count:5};
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
 <section class="journey" aria-label="Din fremdrift"><div><span class="eyebrow">GRUNNSPILLET · DIN QUIZREISE</span><h2>${stats.badges?`${stats.badges} av 18 merker`:'Ditt første aha venter!'}</h2><p>${stats.rounds} ${stats.rounds===1?'fullført runde':'fullførte runder'} · 540 spørsmål å utforske</p></div><div class="badge-track" aria-label="${stats.badges} av 18 nivåer bestått">${categories.map(c=>`<span title="${c.name}: ${[0,1,2].filter(l=>(record(c.id,l)?.best??0)>=700).length} av 3 merker"><img src="icons/${c.id}.svg" alt=""><small>${[0,1,2].map(l=>(record(c.id,l)?.best??0)>=700?'★':'☆').join('')}</small></span>`).join('')}</div>${target?`<button class="primary" id="continue">${active?'Fortsett runden':'Spill videre'} →</button><p class="continue-label">${escape(target.type==='pack'?target.packTitle:categoryById(target.category).name)} · ${levelNames[target.level]}${active?` · Spørsmål ${active.index+1} av 10`:''}</p>`:''}</section>
 <section class="duel-banner"><div class="duel-friends" aria-hidden="true"><span>•ᴗ•</span><span>•ᴗ•</span></div><div><span class="eyebrow">EN TELEFON. TO NYSGJERRIGE HODER.</span><h2>Duell på sofaen</h2><p>Hvem har mest quizkrutt? Bytt på telefonen og finn det ut.</p></div><button class="primary" id="openDuel">Spill mot en venn ↗</button></section>
 <section><div class="sectionhead"><div><h2>Hva er du nysgjerrig på?</h2><p>Seks temaer. Tre nivåer. Masse små seire.</p></div><span class="mini">06 KATEGORIER Å UTFORSKE</span></div><div class="cards">${categories.map(c=>{const count=[0,1,2].filter(l=>(record(c.id,l)?.best??0)>=700).length;return `<button class="card" data-category="${c.id}" style="--tint:${c.color}"><span class="icon" aria-hidden="true"><img src="icons/${c.id}.svg" alt=""></span><h3>${c.name}</h3><p>${c.description}</p><span class="tag">90 SPØRSMÅL · ${count}/3 MERKER</span><span class="arrow" aria-hidden="true">↗</span></button>`;}).join('')}</div></section><section class="pack-banner"><div><span class="eyebrow">NYE TEMAER, MER QUIZKRUTT</span><h2>Finn ditt neste aha.</h2><p>Seks quizpakker med 120 nye spørsmål.<br>Last ned favorittene og ta dem med uten nett.</p><p class="pack-overview">${catalog.filter(p=>libraryStore.read(p.id).pack).length} ${catalog.filter(p=>libraryStore.read(p.id).pack).length===1?'pakke nedlastet':'pakker nedlastet'} · ${Object.values(state.packProgress??{}).reduce((n,p)=>n+p.rounds,0)} ${Object.values(state.packProgress??{}).reduce((n,p)=>n+p.rounds,0)===1?'pakkerunde':'pakkerunder'} spilt</p></div><button class="primary" id="openLibrary">Flere quizer ↓</button></section><p class="local-note">Fremdriften lagres i denne nettleseren på denne enheten. Ingen konto eller synkronisering. Sletting av nettsteddata fjerner fremdriften.</p>`);
 app.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=categoryById(b.dataset.category);levels();});
 document.querySelector('#openDuel').onclick=duelSetup;
 document.querySelector('#openLibrary').onclick=()=>libraryView();
 if(target)document.querySelector('#continue').onclick=()=>{category=categoryById(target.category);active?resume():levels();};
}
function levels(){
 view='levels';
 show(`<div class="panel"><button class="back" id="back">← Alle kategorier</button><div class="icon" style="--tint:${category.color}" aria-hidden="true"><img src="icons/${category.id}.svg" alt=""></div><div class="eyebrow">VELG UTFORDRING</div><h1 class="category-title">${category.name}</h1><p>7 av 10 riktige gir et merke og åpner neste nivå.<br>30 spørsmål per nivå. 10 spørsmål i hver runde.</p><div class="levels">${levelNames.map((name,l)=>{const r=record(category.id,l),open=unlocked(state,category.id,l),passed=(r?.best??0)>=700;return `<button class="level ${passed?'passed':''}" data-level="${l}" ${open?'':'disabled'}><div><h3>0${l+1} · ${name}</h3><span>${!open?`Få 7 av 10 på ${levelNames[l-1]} for å åpne`:r?`Beste: ${r.best/100}/10 · ${r.rounds} runder${passed?' · Merke vunnet':''}`:'Klar for ditt første forsøk?'}</span></div><span aria-hidden="true">${!open?'🔒':passed?'★':'→'}</span></button>`;}).join('')}</div><p class="mini">NYE SPØRSMÅL PRIORITERES FØR DE DU NYLIG HAR SETT.</p></div>`);
 document.querySelector('#back').onclick=home;
 app.querySelectorAll('[data-level]:not(:disabled)').forEach(b=>b.onclick=()=>requestStart(Number(b.dataset.level)));
}
let pendingLevel=0,pendingAction=null;
function requestStart(level){
 pendingLevel=level;pendingAction=()=>start(level);
 if(state.active){const a=state.active;document.querySelector('#replaceText').textContent=`Du har en påbegynt runde i ${a.type==='pack'?a.packTitle:categoryById(a.category).name}, ${levelNames[a.level]}. Vil du fortsette den eller erstatte den med en ny runde?`;document.querySelector('#replaceDialog').showModal();return;}
 start(level);
}
function start(level){persist(startRound(state,category.id,level));resume();}
function resume(){category=categoryById(state.active.category);view='quiz';question();}
function question(){
 const a=state.active,q=questionFor(a.cards[a.index]);
 show(`<section class="panel"><button class="back" id="quit">← Pause og gå til forsiden</button><div class="quizmeta"><span>${category.icon} ${escape(a.type==='pack'?a.packTitle:category.name)}<small>${levelNames[a.level]}</small></span><span>${scoreRound(a)} poeng</span></div><div class="progress" role="progressbar" aria-label="Spørsmål besvart" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${a.answers.length}"><div style="width:${a.answers.length*10}%"></div></div><div class="eyebrow">SPØRSMÅL ${a.index+1} AV 10</div><h2 class="question">${escape(q.question)}</h2><div class="answers">${q.options.map((option,i)=>`<button class="answer" data-answer="${i}"><span class="letter">${letters[i]}</span><span>${escape(option)}</span></button>`).join('')}</div><div id="feedback" role="status" aria-live="polite"></div></section>`);
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
 document.querySelector('#next').onclick=()=>{if(a.index===9){lastResult={type:a.type,packId:a.packId,packVersion:a.packVersion,packTitle:a.packTitle,category:a.category,level:a.level,score:scoreRound(a),newBadge:a.type==='pack'?false:!((record(a.category,a.level)?.best??0)>=700)&&scoreRound(a)>=700};persist(advanceRound(state));result();}else{persist(advanceRound(state));question();}};
 if(focus)document.querySelector('#next').focus({preventScroll:true});
}
function result(){
 view='result';if(lastResult.type==='pack'){packResult();return;}const r=lastResult,passed=r.score>=700,nextOpen=r.level<2&&unlocked(state,r.category,r.level+1);
 show(`<section class="panel results"><div class="medal" aria-hidden="true">${passed?'🏆':'🎉'}</div><div class="eyebrow" style="justify-content:center">${r.newBadge?'NYTT MERKE VUNNET':'RUNDE FULLFØRT'} · ${levelNames[r.level]}</div><h1 class="result-title">${passed?'Du har skikkelig quizkrutt!':'Et lite aha rikere!'}</h1><div class="score">${r.score}<span style="font-size:20px"> / 1000</span></div><p>Du svarte riktig på <strong>${r.score/100} av 10</strong> spørsmål i ${category.name}.</p><p>${r.newBadge?`★ ${levelNames[r.level]}-merket er ditt! `:''}${passed?(r.level<2?`${levelNames[r.level+1]} er åpent.`:'Alle tre nivåene i denne kategorien er mestret!'):nextOpen?'Neste nivå er allerede åpent fra et tidligere forsøk.':'7 av 10 gir et merke. Nye spørsmål venter på neste forsøk!'}<br>Beste resultat på nivået: ${record(r.category,r.level).best/100}/10.</p><div class="actions">${nextOpen?'<button class="primary" id="nextLevel">Neste nivå →</button>':''}<button class="${nextOpen?'secondary':'primary'}" id="again">Prøv igjen ↻</button><button class="secondary" id="home">Velg kategori</button></div>${passed?recommendationMarkup(r.category,r.level):''}<p class="local-note" id="resultSave">${saveError?'Resultatet er bare beholdt i denne økten. Se lagringsmeldingen over.':'Resultatet er lagret på denne enheten.'}</p></section>`);
 document.querySelector('#again').onclick=()=>requestStart(r.level);document.querySelector('#home').onclick=home;
 if(nextOpen)document.querySelector('#nextLevel').onclick=()=>requestStart(r.level+1);bindRecommendations();
}

function recommendationMarkup(categoryId,level){const recs=recommendPacks(catalog.filter(p=>p.id!==lastResult?.packId),categoryId,level);return `<aside class="recommendations"><h2>Lyst på en ny utfordring?</h2><p>Velg selv om du vil laste ned. Ingen automatisk nedlasting.</p>${recs.map(p=>`<button class="recommendation" data-recommend="${p.id}"><img src="icons/${p.category}.svg" alt=""><span><strong>${escape(p.title)}</strong><small>${levelNames[p.level]} · ${p.count} spørsmål</small></span><span aria-hidden="true">↗</span></button>`).join('')}</aside>`;}
function bindRecommendations(){app.querySelectorAll('[data-recommend]').forEach(b=>b.onclick=()=>{libraryTheme='all';libraryLevel='all';libraryOnly=false;libraryFocus=b.dataset.recommend;libraryView();});}
function requestPack(id){const read=libraryStore.read(id);if(!read.pack){libraryMessage=read.error||'Last ned pakken før du spiller.';libraryView();return;}pendingAction=()=>{persist(startPackRound(state,read.pack));resume();};if(state.active){document.querySelector('#replaceText').textContent='Du har en runde på gang. Vil du fortsette den eller erstatte den med en ny pakkerunde?';document.querySelector('#replaceDialog').showModal();}else pendingAction();}
function packResult(){
 const r=lastResult,p=state.packProgress[packKey(r.packId,r.packVersion)],downloaded=libraryStore.read(r.packId).pack;
 show(`<section class="panel results"><div class="medal" aria-hidden="true">${r.score>=700?'★':'✦'}</div><div class="eyebrow" style="justify-content:center">PAKKERUNDE FULLFØRT · ${levelNames[r.level]}</div><h1 class="result-title">${escape(r.packTitle)}</h1><div class="score">${r.score}<span style="font-size:20px"> / 1000</span></div><p>${r.score/100} av 10 riktige. Beste på versjon ${r.packVersion}: ${p.best/100}/10.<br>${r.score>=700?'★ Pakken er bestått!':'Prøv en runde til – nye aha-opplevelser venter.'}</p><p class="local-note">Pakker har egne resultater. De 18 merkene og nivåene i grunnspillet beholdes separat.</p><div class="actions">${downloaded?'<button class="primary" id="packAgain">Spill pakken igjen ↻</button>':''}<button class="secondary" id="backLibrary">Flere quizer</button><button class="secondary" id="home">Forsiden</button></div>${r.score>=700?recommendationMarkup(r.category,r.level):''}<p id="resultSave" class="local-note">${saveError?'Resultatet er beholdt i denne økten. Se meldingen over.':'Resultatet er lagret på denne enheten.'}</p></section>`);
 if(downloaded)document.querySelector('#packAgain').onclick=()=>requestPack(r.packId);document.querySelector('#backLibrary').onclick=()=>libraryView();document.querySelector('#home').onclick=home;bindRecommendations();
}
let libraryTheme='all',libraryLevel='all',libraryOnly=false,libraryFocus=null,libraryMessage='';
const downloads=new Map();
const bytesLabel=bytes=>new Intl.NumberFormat('nb-NO',{maximumFractionDigits:1}).format(bytes/1000)+' kB';
function libraryView(keepPosition=false){
 view='library';const scroll=window.scrollY,focusedId=document.activeElement?.id;
 const entries=catalog.map(p=>({...p,installed:libraryStore.read(p.id)}));
 const filtered=entries.filter(p=>(libraryTheme==='all'||p.category===libraryTheme)&&(libraryLevel==='all'||p.level===Number(libraryLevel))&&(!libraryOnly||p.installed.pack)).sort((a,b)=>a.category.localeCompare(b.category)||a.level-b.level||a.title.localeCompare(b.title,'nb'));
 show(`<section class="library"><button class="back" id="libraryBack">← Forsiden</button><div class="eyebrow">ET LITE BIBLIOTEK. MANGE NYE AHA.</div><div class="library-heading"><div><h1>Mer å være<br><span class="highlight">nysgjerrig på.</span></h1><p>Velg en pakke, last ned og spill når det passer.<br>Alle pakker er åpne – du velger vanskelighetsgrad selv.</p></div><div class="library-stamp"><strong>${entries.filter(p=>p.installed.pack).length}</strong><span>av ${catalog.length} pakker<br>på denne enheten</span></div></div><p class="network-note" id="networkNote" role="status">${navigator.onLine?'Nett er nødvendig for nye nedlastinger. Lagrede pakker kan spilles uten nett.':'Du er uten nett. Spill nedlastede pakker, eller velg fra grunnspillets 540 spørsmål.'}</p><div class="library-filters"><label>Tema<select id="themeFilter"><option value="all">Alle temaer</option>${categories.filter(c=>catalog.some(p=>p.category===c.id)).map(c=>`<option value="${c.id}" ${libraryTheme===c.id?'selected':''}>${c.name}</option>`).join('')}</select></label><label>Nivå<select id="levelFilter"><option value="all">Alle nivåer</option>${levelNames.map((n,l)=>`<option value="${l}" ${libraryLevel===String(l)?'selected':''}>${n}</option>`).join('')}</select></label><label class="download-filter"><input type="checkbox" id="downloadedFilter" ${libraryOnly?'checked':''}> Bare nedlastede</label></div><p id="libraryNotice" class="library-message" role="status">${escape(libraryMessage)}</p><div class="pack-grid">${filtered.map(p=>packCard(p)).join('')||'<p>Ingen pakker passer til valget. Prøv et annet filter.</p>'}</div><p class="local-note">Pakkene og resultatene lagres i denne nettleseren. Du kan fjerne innholdet og beholde resultatene. En ny pakkeversjon har egen historikk; gamle resultater og påbegynte runder beholdes.</p></section>`);
 document.querySelector('#libraryBack').onclick=home;
 document.querySelector('#themeFilter').onchange=e=>{libraryTheme=e.target.value;libraryFocus=null;libraryView(true);};
 document.querySelector('#levelFilter').onchange=e=>{libraryLevel=e.target.value;libraryFocus=null;libraryView(true);};
 document.querySelector('#downloadedFilter').onchange=e=>{libraryOnly=e.target.checked;libraryFocus=null;libraryView(true);};
 app.querySelectorAll('[data-download]').forEach(b=>b.onclick=()=>downloadPack(b.dataset.download));
 app.querySelectorAll('[data-playpack]').forEach(b=>b.onclick=()=>requestPack(b.dataset.playpack));
 app.querySelectorAll('[data-cancelpack]').forEach(b=>b.onclick=()=>downloads.get(b.dataset.cancelpack)?.controller.abort());
 app.querySelectorAll('[data-removepack]').forEach(b=>b.onclick=()=>confirmRemove(b.dataset.removepack));
 if(keepPosition){window.scrollTo(0,scroll);if(['themeFilter','levelFilter','downloadedFilter'].includes(focusedId))document.getElementById(focusedId)?.focus({preventScroll:true});}
 if(libraryFocus){const card=document.querySelector(`[data-pack="${libraryFocus}"]`);card?.scrollIntoView({block:'center'});libraryFocus=null;}
}
function packCard(p){
 const installed=p.installed.pack,update=installed&&installed.version<p.version,job=downloads.get(p.id),busy=job?.status==='loading';
 const history=Object.values(state.packProgress??{}).filter(r=>r.id===p.id&&r.rounds>0).sort((a,b)=>b.version-a.version);
 return `<article class="pack-card" data-pack="${p.id}" style="--tint:${categoryById(p.category).color}"><div class="pack-card-top"><span class="icon"><img src="icons/${p.category}.svg" alt=""></span><span class="pill">${levelNames[p.level]}</span></div><span class="tag">${categoryById(p.category).name.toUpperCase()}</span><h2>${escape(p.title)}</h2><p>${escape(p.description)}</p><div class="pack-meta"><span>${p.count} spørsmål</span><span>${bytesLabel(p.bytes)}</span><span>Versjon ${p.version}</span></div><p class="pack-status">${p.installed.error?escape(p.installed.error):installed?`✓ Nedlastet · versjon ${installed.version}${update?' · Ny versjon tilgjengelig':''}`:'Ikke lastet ned'}</p>${history.length?`<p class="pack-history">${history.map(r=>`v${r.version}: ${r.best>=700?'★ Bestått · ':''}beste ${r.best/100}/10 · ${r.rounds} ${r.rounds===1?'runde':'runder'}`).join('<br>')}</p>`:''}<div class="pack-job" role="status" data-job="${p.id}">${busy?'<span>Henter og kontrollerer pakken …</span>':escape(job?.message||'')}</div><div class="pack-actions">${busy?`<button class="secondary" data-cancelpack="${p.id}">Avbryt nedlasting</button>`:`${installed?`<button class="primary" data-playpack="${p.id}">Spill pakken →</button>`:''}${!installed||update?`<button class="${installed?'secondary':'primary'}" data-download="${p.id}" ${navigator.onLine?'':'disabled'}>${update?'Last ned oppdatering':job?.status==='error'?'Prøv nedlasting igjen':'Last ned pakke ↓'}</button>`:''}${installed||p.installed.error?`<button class="text-button" data-removepack="${p.id}">Fjern fra enheten</button>`:''}`}</div></article>`;
}
async function downloadPack(id){
 if(downloads.get(id)?.status==='loading')return;
 const controller=new AbortController(),job={controller,status:'loading',message:''};downloads.set(id,job);libraryMessage='';libraryView(true);
 const timer=setTimeout(()=>{job.timedOut=true;controller.abort();},20000);
 try{await libraryStore.download(id,{signal:controller.signal,onProgress:(received,total)=>{if(view==='library'){const el=document.querySelector(`[data-job="${id}"]`);if(el)el.textContent=`${bytesLabel(received)} av ${bytesLabel(total)} · Kontrollerer innhold`;}}});job.status='done';job.message='Pakken er lagret og klar uten nett.';}
 catch(error){job.status=error.name==='AbortError'?'cancelled':'error';job.message=error.name==='AbortError'?(job.timedOut?'Nedlastingen tok for lang tid. Prøv igjen.':'Nedlasting avbrutt. Ingen lagret pakke ble endret.'):error instanceof TypeError?'Kunne ikke hente pakken. Kontroller nettet og prøv igjen.':error.message;}
 finally{clearTimeout(timer);if(view==='library')libraryView(true);}
}
let removeId=null;
function confirmRemove(id){removeId=id;document.querySelector('#removeText').textContent=`Fjerne «${catalog.find(p=>p.id===id).title}» fra enheten? Resultater beholdes. En påbegynt runde kan fortsatt fullføres, men pakken må lastes ned igjen for nye runder.`;document.querySelector('#removeDialog').showModal();}
document.querySelector('#removeCancel').onclick=()=>document.querySelector('#removeDialog').close();
document.querySelector('#removeConfirm').onclick=()=>{document.querySelector('#removeDialog').close();try{libraryStore.remove(removeId);downloads.delete(removeId);libraryMessage='Pakkeinnholdet er fjernet. Resultatene er beholdt.';}catch(error){libraryMessage=error.message;}libraryView(true);};
for(const event of ['online','offline'])window.addEventListener(event,()=>{if(view==='library')libraryView(true);});
window.addEventListener('storage',event=>{if(event.key?.startsWith('quizkrutt.pack.')&&view==='library')libraryView(true);});

function duelSetup(){
 view='duel-setup';duel=null;
 show(`<section class="panel duel-setup"><button class="back" id="duelSetupBack">← Forsiden</button><div class="duel-friends" aria-hidden="true"><span>•ᴗ•</span><span>•ᴗ•</span></div><div class="eyebrow">LITT VENNLIG KONKURRANSE</div><h1>Duell på<br><span class="highlight">sofaen.</span></h1><p>Velg to kallenavn. Dere bytter på telefonen og får like mange spørsmål i samme kategori og nivå.</p><form id="duelForm"><div class="duel-names"><label>Spiller 1<input id="playerOne" name="playerOne" maxlength="20" required autocomplete="off" placeholder="F.eks. Ada" value="${escape(duelDraft.names[0])}"></label><span class="versus" aria-hidden="true">VS</span><label>Spiller 2<input id="playerTwo" name="playerTwo" maxlength="20" required autocomplete="off" placeholder="F.eks. Leo" value="${escape(duelDraft.names[1])}"></label></div><div class="duel-options"><label>Kategori<select id="duelCategory">${categories.map(c=>`<option value="${c.id}" ${duelDraft.category===c.id?'selected':''}>${c.name}</option>`).join('')}</select></label><label>Nivå<select id="duelLevel">${levelNames.map((name,l)=>`<option value="${l}" ${duelDraft.level===l?'selected':''}>${name}</option>`).join('')}</select></label><label>Lengde<select id="duelCount"><option value="5" ${duelDraft.count===5?'selected':''}>5 spørsmål hver</option><option value="10" ${duelDraft.count===10?'selected':''}>10 spørsmål hver</option></select></label></div><p id="duelError" class="form-error" role="alert"></p><button class="primary" type="submit">Start duellen →</button></form><div class="duel-rules"><h2>Sånn spiller dere</h2><ol><li>Appen trekker hvem som starter.</li><li>Les, velg et svar og se en kort forklaring. Riktig svar gir 100 poeng.</li><li>Trykk «Skjul og gi videre» før den andre tar telefonen.</li></ol><p>Ulike spørsmål, samme fordeling av temaer. Alle tre nivåene er åpne i duell. Ingen tidspress.</p></div><p class="local-note">Solospillets fremdrift og påbegynte runde beholdes. Duellen lagres ikke; lukking eller omlasting avslutter den. Spill uten nett etter at appens offlinekopi er klar.</p></section>`);
 document.querySelector('#duelSetupBack').onclick=home;
 document.querySelector('#duelForm').onsubmit=e=>{
  e.preventDefault();const form=e.currentTarget;
  duelDraft={names:[form.elements.playerOne.value,form.elements.playerTwo.value],category:document.querySelector('#duelCategory').value,level:Number(document.querySelector('#duelLevel').value),count:Number(document.querySelector('#duelCount').value)};
  try{validateNames(duelDraft.names);duel=createDuel(duelDraft);renderDuel();}catch(error){document.querySelector('#duelError').textContent=error.message;}
 };
}
function requestQuitDuel(){document.querySelector('#duelQuitDialog').showModal();}
function renderDuel(){
 view='duel';if(duel.phase==='finished'){duelResult();return;}
 const player=currentPlayer(duel),name=escape(duel.names[player]),c=categoryById(duel.category),step=currentIndex(duel)+1;
 if(duel.phase==='handover'){
  show(`<section class="panel handover player-${player}"><button class="back" id="duelQuit">← Avslutt duellen</button><div class="handover-card"><div class="duel-avatar" aria-hidden="true">•ᴗ•</div><div class="eyebrow">GI TELEFONEN TIL</div><h1>${name}</h1><p>Din tur · Spørsmål ${step} av ${duel.count}<br>${c.name} · ${levelNames[duel.level]}</p><p class="handover-hint">Spørsmål og svar er skjult.<br>Vent til du har telefonen for deg selv.</p><button class="primary" id="revealDuel">Jeg er ${name} – vis min tur →</button></div><p class="local-note">Bytt på telefonen etter hver tur. Resultatet kommer når begge har svart på alle spørsmålene.</p></section>`);
  document.querySelector('#revealDuel').onclick=()=>{duel=openDuelTurn(duel);renderDuel();};
 }else{
  const q=duelQuestion(duel),answered=duel.phase==='feedback',choice=duel.answers[player][step-1],right=choice===q.correct;
  show(`<section class="panel duel-question player-${player}"><button class="back" id="duelQuit">← Avslutt duellen</button><div class="duel-turn-label"><span class="player-dot"></span><span>Din tur, <strong>${name}</strong></span><span>${duelScores(duel)[player]} poeng</span></div><p class="duel-category">${c.name} · ${levelNames[duel.level]}</p><div class="progress" role="progressbar" aria-label="Dine besvarte spørsmål" aria-valuemin="0" aria-valuemax="${duel.count}" aria-valuenow="${duel.answers[player].length}"><div style="width:${duel.answers[player].length/duel.count*100}%"></div></div><div class="eyebrow">DITT SPØRSMÅL ${step} AV ${duel.count}</div><h2 class="question">${escape(q.question)}</h2><div class="answers">${q.options.map((option,i)=>`<button class="answer ${answered&&i===q.correct?'correct':answered&&i===choice?'wrong':''}" data-duel-answer="${i}" ${answered?'disabled':''}><span class="letter">${letters[i]}</span><span>${escape(option)}</span></button>`).join('')}</div><div id="duelFeedback" role="status" aria-live="polite">${answered?`<div class="feedback"><strong>${right?'✦ Helt riktig! +100 poeng':`Godt forsøk! Riktig svar: ${escape(q.options[q.correct])}.`}</strong><p>${escape(q.explanation)}</p><button class="primary" id="duelNext">${duel.turn===duel.count*2-1?'Se duellresultatet':'Skjul og gi videre →'}</button></div>`:''}</div></section>`);
  if(answered){document.querySelector('#duelNext').onclick=()=>{duel=advanceDuel(duel);renderDuel();};document.querySelector('#duelNext').focus({preventScroll:true});}
  else app.querySelectorAll('[data-duel-answer]').forEach(b=>b.onclick=()=>{duel=answerDuel(duel,Number(b.dataset.duelAnswer));renderDuel();});
 }
 document.querySelector('#duelQuit').onclick=requestQuitDuel;
}
function duelResult(){
 view='duel-result';const winner=duelWinner(duel),scores=duelScores(duel);
 show(`<section class="panel results duel-results"><div class="medal" aria-hidden="true">${winner==='tie'?'✦':'★'}</div><div class="eyebrow" style="justify-content:center">DUELLEN ER FULLFØRT</div><h1 class="result-title">${winner==='tie'?'Delt sofa. Delt seier!':`${escape(duel.names[winner])} vinner!`}</h1><p>${winner==='tie'?'Uavgjort! Dere har like mye quizkrutt denne gangen.':'Godt spilt, begge to! Klar for en omkamp?'}<br>${categoryById(duel.category).name} · ${levelNames[duel.level]}</p><div class="duel-scorecards">${duel.names.map((name,p)=>`<article class="duel-scorecard player-${p} ${winner===p?'duel-winner':''}"><div class="duel-avatar" aria-hidden="true">•ᴗ•</div><h2>${escape(name)}</h2><strong>${scores[p]} <small>poeng</small></strong><p>${scores[p]/100} av ${duel.count} riktige<br>${duel.answers[p].length} turer spilt</p><span class="pill">${winner==='tie'?'Uavgjort':winner===p?'Vinner':'God innsats!'}</span></article>`).join('')}</div><div class="actions"><button class="primary" id="duelRematch">Omkamp ↻</button><button class="secondary" id="duelChange">Endre spillere eller tema</button><button class="secondary" id="duelHome">Forsiden</button></div><p class="local-note">Solospillets resultater og merker er uendret. Duellresultatet lagres ikke.</p></section>`);
 document.querySelector('#duelRematch').onclick=()=>{duel=createDuel(duelDraft);renderDuel();};
 document.querySelector('#duelChange').onclick=duelSetup;
 document.querySelector('#duelHome').onclick=()=>{duel=null;home();};
}
document.querySelector('#duelQuitKeep').onclick=()=>document.querySelector('#duelQuitDialog').close();
document.querySelector('#duelQuitConfirm').onclick=()=>{document.querySelector('#duelQuitDialog').close();duel=null;home();};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&duel&&view==='duel'&&['question','feedback'].includes(duel.phase)){duel=hideDuel(duel);renderDuel();}});
const replace=document.querySelector('#replaceDialog');
document.querySelector('#replaceCancel').onclick=()=>replace.close();
document.querySelector('#replaceResume').onclick=()=>{replace.close();resume();};
document.querySelector('#replaceStart').onclick=()=>{replace.close();pendingAction?.();};
document.querySelector('#brand').onclick=e=>{e.preventDefault();if(duel&&duel.phase!=='finished'){requestQuitDuel();return;}duel=null;home();};
document.querySelector('#help').onclick=()=>document.querySelector('#info').showModal();
document.querySelector('#closeInfo').onclick=()=>document.querySelector('#info').close();
window.addEventListener('storage',e=>{if(e.key==='quizkrutt.progress.v2'||e.key===null){saveError='Fremdriften er endret i en annen fane. Last siden på nytt for å hente den.';updateStorageNotice();}});
async function prepareOffline(){
 if(!('serviceWorker' in navigator))return;
 try{
  // Versioned assets keep an open round on the same code during a background update.
  try{const registration=await navigator.serviceWorker.register('./sw.js');registration.update().catch(()=>{});}catch{/* Eksisterende offlinekopi kontrolleres også når nettet er borte. */}
  await navigator.serviceWorker.ready;
  const keys=await caches.keys();
  const cache=keys.includes('quizkrutt-m4-v1')?await caches.open('quizkrutt-m4-v1'):null;
  const ready=cache&&await cache.match(new URL('./game.js?v=m4-1',location.href).href);
  document.querySelector('#offline').textContent=ready?'M4 er klargjort for bruk uten nett. Åpne appen én gang på nett etter installasjon.':'En oppdatering klargjøres. Åpne appen igjen på nett før du prøver uten nett.';
 }catch{document.querySelector('#offline').textContent='Bruk uten nett kunne ikke bekreftes. Fremdriften lagres lokalt, men åpne appen på nett før du prøver uten nett.';}
}
home();prepareOffline();
