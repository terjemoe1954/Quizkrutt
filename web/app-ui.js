import {loadPreferences,savePreferences,createFeedbackSound} from './preferences.js?v=m7-1';
import {release} from './release.js?v=m7-1';
export function createAppUi({storage}){
 const loaded=loadPreferences(storage);let preferences=loaded.value,notice=loaded.error;
 function apply(){document.documentElement.dataset.text=String(preferences.textSize);document.documentElement.dataset.reduceMotion=String(preferences.reduceMotion);}
 apply();
 const sound=createFeedbackSound(()=>preferences);
 const byId=id=>document.getElementById(id);
 function announce(message){const el=byId('announcer');el.textContent='';requestAnimationFrame(()=>el.textContent=message);}
 for(const dialog of document.querySelectorAll('dialog')){const title=dialog.querySelector('h2');if(title){title.id ||=dialog.id+'Title';dialog.setAttribute('aria-labelledby',title.id);}dialog.querySelectorAll('[data-close-dialog]').forEach(button=>button.onclick=()=>dialog.close());}
 byId('releaseVersion').textContent=release.version;
 byId('aboutVersion').textContent=release.version+' · '+release.stage;
 function intro(){byId('introDialog').showModal();}
 function settings(){byId('textSize').value=String(preferences.textSize);byId('reduceMotion').checked=preferences.reduceMotion;byId('soundFeedback').checked=preferences.sound;byId('preferenceNotice').textContent=notice??'Innstillingene lagres på denne enheten.';byId('settingsDialog').showModal();}
 byId('settings').onclick=settings;
 byId('settingsForm').onchange=()=>{preferences={version:1,textSize:Number(byId('textSize').value),reduceMotion:byId('reduceMotion').checked,sound:byId('soundFeedback').checked};notice=savePreferences(storage,preferences);apply();byId('preferenceNotice').textContent=notice??'Innstillingene er lagret.';};
 byId('soundTest').onclick=async()=>{const played=await sound(true);byId('soundTestStatus').textContent=played?'Prøvelyd spilt.':'Lyd er av eller ikke tilgjengelig i denne nettleseren.';};
 byId('about').onclick=()=>byId('aboutDialog').showModal();
 byId('introStart').onclick=()=>{byId('introDialog').close();const categoryHeading=byId('categoryHeading');if(categoryHeading){categoryHeading.tabIndex=-1;categoryHeading.focus();categoryHeading.scrollIntoView({block:'start'});}};
 document.addEventListener('click',e=>{const button=e.target.closest('[data-open-intro]');if(button)intro();});
 byId('reportCopy').onclick=async()=>{try{await navigator.clipboard.writeText(byId('reportText').value);byId('reportStatus').textContent='Beskrivelsen er kopiert. Ingenting er sendt automatisk.';}catch{byId('reportStatus').textContent='Kopiering var ikke tilgjengelig. Marker og kopier teksten under.';byId('reportText').focus();byId('reportText').select();}};
 function report({question,answer,category,level,id}){byId('reportText').value=`Quizkrutt ${release.version}\nSpørsmål: ${question}\nOppgitt riktig svar: ${answer}\nKategori/nivå: ${category} / ${level}\nSpørsmål-ID: ${id??'nettduell'}\n\nDet jeg vil melde fra om: `;byId('reportStatus').textContent='Legg til hva du mener bør rettes, og kopier teksten til den du tester appen for. Ingen spillernavn, romkoder eller adgangsnøkler tas med.';byId('reportDialog').showModal();}
 return {intro,settings,report,announce,feedback:(right,message)=>{sound(right);announce(message);}};
}
