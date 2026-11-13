const ROOT='https://terjemoe1954.github.io/app-page/quizkrutt/library/';
const KEY='quizkrutt.catalog.v1';
export function validateCatalog(value){
 if(!Array.isArray(value)||value.length>200)throw Error('Ugyldig katalog');
 const ids=new Set();
 return value.map(p=>{if(!p||typeof p.id!=='string'||!/^([a-z][a-z0-9-]{1,70})$/.test(p.id)||ids.has(p.id)||!Number.isSafeInteger(p.version)||p.version<1||!Number.isInteger(p.count)||p.count<10||p.count>200||!Number.isInteger(p.bytes)||p.bytes<1||p.bytes>1000000||!Number.isInteger(p.level)||p.level<0||p.level>2||typeof p.category!=='string'||!/^([a-z][a-z0-9-]{1,70})$/.test(p.category)||!['title','description'].every(k=>typeof p[k]==='string'&&p[k].trim()&&p[k].length<=(k==='title'?100:300))||!/[a-f0-9]{64}/.test(p.sha256)||p.sha256.length!==64||p.file!==`packs/${p.id}.v${p.version}.json`||p.categoryName!==undefined&&(typeof p.categoryName!=='string'||p.categoryName.length>80))throw Error('Ugyldig katalog');ids.add(p.id);return {...p,remote:true};});
}
function merge(target,items){for(const p of items){const i=target.findIndex(x=>x.id===p.id);if(i<0)target.push(p);else if(p.version>target[i].version)target[i]=p;}}
export function restoreCatalog(storage,target){try{const raw=storage.getItem(KEY);if(raw)merge(target,validateCatalog(JSON.parse(raw)));}catch{/* Keep bundled catalog when cache is unavailable. */}}
export async function refreshCatalog(storage,target,fetcher=fetch){const response=await fetcher(ROOT+'catalog.json',{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok||response.redirected)throw Error('Biblioteket er utilgjengelig');const raw=await response.text();if(raw.length>1000000)throw Error('For stor katalog');const items=validateCatalog(JSON.parse(raw));const next=target.map(p=>({...p}));merge(next,items);storage.setItem(KEY,JSON.stringify(next));merge(target,items);return target;}
