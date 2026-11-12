const DAY=86400000;
const CATEGORIES=['mix','world','nature','culture','sport','science'];
const TOKEN=/^[a-f0-9]{64}$/;
const CODE=/^[A-HJ-NP-Z2-9]{8}$/;
const roomCode=cryptoApi=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',bytes=cryptoApi.getRandomValues(new Uint8Array(8));return Array.from(bytes,b=>chars[b%32]).join('');};
const sha=async(cryptoApi,value)=>Array.from(new Uint8Array(await cryptoApi.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
function problem(message,status=400){const e=new Error(message);e.status=status;return e;}
function nickname(value){if(typeof value!=='string')throw problem('Skriv et kallenavn.');const n=value.trim().replace(/\s+/g,' ');if(!n||Array.from(n).length>20||/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(n))throw problem('Bruk et kallenavn på 1–20 tegn.');return n;}
function sameName(a,b){return a.normalize('NFKC').toLocaleLowerCase('nb-NO')===b.normalize('NFKC').toLocaleLowerCase('nb-NO');}
function shuffled(items,cryptoApi){const a=[...items];for(let i=a.length-1;i>0;i--){const max=0x100000000-(0x100000000%(i+1));let n;do{n=cryptoApi.getRandomValues(new Uint32Array(1))[0];}while(n>=max);const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createApi({questions,cryptoApi=globalThis.crypto,now=()=>Date.now()}){
 function response(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff','Vary':'Authorization'}});}
 async function body(request){if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw problem('Forespørselen må være JSON.');if(Number(request.headers.get('Content-Length')||0)>2048)throw problem('Forespørselen er for stor.',413);const reader=request.body?.getReader();let text='',received=0;if(reader){const decoder=new TextDecoder();try{while(true){const {value,done}=await reader.read();if(done)break;received+=value.length;if(received>2048)throw problem('Forespørselen er for stor.',413);text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{try{await reader.cancel();}catch{}}}try{const data=JSON.parse(text);if(!data||Array.isArray(data)||typeof data!=='object')throw Error();return data;}catch{throw problem('Ugyldig forespørsel.');}}
 async function limit(db,request,action,max){const actor=request.headers.get('CF-Connecting-IP')||request.headers.get('oai-authenticated-user-id')||'private-visitor';const minute=Math.floor(now()/60000),key=action+':'+minute+':'+await sha(cryptoApi,actor);const result=await db.prepare('INSERT INTO network_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now()+DAY).first();if(result.count>max)throw problem('For mange forsøk akkurat nå. Vent et minutt og prøv igjen.',429);}
 function publicState(row,p,player){
  const completed=Math.min(p.answers[0].length,p.answers[1].length),expired=now()>=row.expires_at;
  const status=expired?'expired':p.cancelledBy!==null?'cancelled':p.names[1]===null?(now()>=row.invite_until?'invite-expired':'waiting'):completed===p.questions.length?'finished':'playing';
  const reviews=p.questions.slice(0,completed).map((q,index)=>({index,question:q.question,options:q.options,correct:q.correct,explanation:q.explanation,answers:p.answers.map(a=>a[index])}));
  const scores=[0,1].map(player=>reviews.reduce((n,r)=>n+(r.answers[player]===r.correct?100:0),0));
  const current=status==='playing'?p.questions[completed]:null;
  return {id:row.id,code:row.code,revision:row.revision,status,player,names:p.names,category:p.category,level:p.level,count:p.questions.length,completed,scores,submitted:p.answers[player].length,opponentAnswered:p.answers[1-player].length>completed,ownAnswer:p.answers[player].length>completed?p.answers[player][completed]:null,question:current?{index:completed,question:current.question,options:current.options}:null,reviews,inviteUntil:row.invite_until,expiresAt:row.expires_at,cancelledBy:p.cancelledBy};
 }
 async function auth(db,id,token){if(!TOKEN.test(token))throw problem('Du har ikke tilgang til denne duellen.',404);const row=await db.prepare('SELECT * FROM network_rooms WHERE id=?').bind(id).first();if(!row)throw problem('Duellen finnes ikke eller har utløpt.',404);const key=await sha(cryptoApi,token),player=row.host_key===key?0:row.guest_key===key?1:-1;if(player<0)throw problem('Du har ikke tilgang til denne duellen.',404);return {row,p:JSON.parse(row.payload),player};}
 async function create(db,data,request){
  const name=nickname(data.name);if(!TOKEN.test(data.token))throw problem('Ugyldig spillernøkkel.');if(!CATEGORIES.includes(data.category)||!Number.isInteger(data.level)||data.level<0||data.level>2)throw problem('Velg kategori og nivå.');
  const key=await sha(cryptoApi,data.token);let row=await db.prepare('SELECT * FROM network_rooms WHERE host_key=?').bind(key).first();if(row)return publicState(row,JSON.parse(row.payload),0);
  await limit(db,request,'create',6);
  const source=shuffled(questions.filter(q=>q.category===data.category&&q.level===data.level),cryptoApi).slice(0,5);if(source.length!==5)throw problem('Spørsmålene er ikke klare for dette nivået.',503);
  const qs=source.map(q=>{const order=shuffled([0,1,2,3],cryptoApi);return {question:q.question,options:order.map(i=>q.options[i]),correct:order.indexOf(q.correct),explanation:q.explanation};});
  const p={names:[name,null],category:data.category,level:data.level,questions:qs,answers:[[],[]],cancelledBy:null};const time=now();
  for(let retry=0;retry<4;retry++){
   await db.prepare('INSERT OR IGNORE INTO network_rooms (id,code,host_key,guest_key,payload,revision,created_at,invite_until,expires_at) VALUES (?,?,?,NULL,?,1,?,?,?)').bind(cryptoApi.randomUUID(),roomCode(cryptoApi),key,JSON.stringify(p),time,time+DAY,time+7*DAY).run();
   row=await db.prepare('SELECT * FROM network_rooms WHERE host_key=?').bind(key).first();if(row)return publicState(row,JSON.parse(row.payload),0);
  }
  throw problem('Kunne ikke opprette rom. Prøv igjen.',503);
 }
 async function join(db,data,request){
  const name=nickname(data.name),code=String(data.code??'').toUpperCase().replace(/[\s-]/g,'');if(!TOKEN.test(data.token)||!CODE.test(code))throw problem('Skriv romkoden med åtte tegn.');await limit(db,request,'join',20);
  const key=await sha(cryptoApi,data.token);
  for(let retry=0;retry<5;retry++){
   const row=await db.prepare('SELECT * FROM network_rooms WHERE code=?').bind(code).first();if(!row||now()>=row.expires_at)throw problem('Romkoden finnes ikke eller duellen har utløpt.',404);const p=JSON.parse(row.payload);
   if(row.guest_key===key)return publicState(row,p,1);
   if(row.host_key===key)throw problem('Denne enheten er allerede vert i rommet.',409);
   if(p.cancelledBy!==null)throw problem('Duellen er avsluttet.',410);
   if(row.guest_key!==null)throw problem('Rommet har allerede to spillere.',409);
   if(now()>=row.invite_until)throw problem('Invitasjonen har utløpt. Be vennen opprette en ny duell.',410);
   if(sameName(name,p.names[0]))throw problem('Velg et annet kallenavn enn verten.',409);
   p.names[1]=name;
   const saved=await db.prepare('UPDATE network_rooms SET guest_key=?,payload=?,revision=revision+1 WHERE id=? AND revision=? AND guest_key IS NULL').bind(key,JSON.stringify(p),row.id,row.revision).run();
   if(saved.meta.changes)return publicState({...row,guest_key:key,revision:row.revision+1},p,1);
  }
  throw problem('Rommet ble endret samtidig. Prøv igjen.',409);
 }
 async function mutate(db,id,token,action,data){
  for(let retry=0;retry<8;retry++){
   const {row,p,player}=await auth(db,id,token);if(now()>=row.expires_at)throw problem('Duellen har utløpt.',410);
   if(action==='answer'){
    if(!Number.isInteger(data.index)||data.index<0||data.index>=p.questions.length||!Number.isInteger(data.choice)||data.choice<0||data.choice>3)throw problem('Ugyldig svar.');
    const previous=p.answers[player][data.index];if(previous!==undefined){if(previous!==data.choice)throw problem('Et annet svar er allerede lagret for dette spørsmålet.',409);return publicState(row,p,player);}
    if(p.cancelledBy!==null)throw problem('Duellen er avsluttet.',410);
    if(p.names[1]===null)throw problem('Vent til vennen har blitt med.',409);
    const current=Math.min(p.answers[0].length,p.answers[1].length);if(data.index!==current||p.answers[player].length!==current)throw problem('Vent på den andre spilleren før neste spørsmål.',409);
    p.answers[player].push(data.choice);
   }else{
    if(p.cancelledBy!==null)return publicState(row,p,player);
    if(p.answers.every(a=>a.length===p.questions.length))throw problem('Duellen er allerede fullført.',409);
    p.cancelledBy=player;
   }
   const saved=await db.prepare('UPDATE network_rooms SET payload=?,revision=revision+1 WHERE id=? AND revision=?').bind(JSON.stringify(p),id,row.revision).run();
   if(saved.meta.changes)return publicState({...row,revision:row.revision+1},p,player);
  }
  throw problem('Begge svarte samtidig. Oppdater og prøv igjen.',409);
 }
 return async(request,env,ctx={})=>{
  try{
   if(!env.DB)throw problem('Nettduell er ikke klar. Prøv igjen senere.',503);
   const url=new URL(request.url);if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)throw problem('Forespørselen ble avvist.',403);
   const path=url.pathname,method=request.method;let result;
   if(method==='POST'&&path==='/api/rooms'){
    result=await create(env.DB,await body(request),request);
    const cleanup=env.DB.batch([env.DB.prepare('DELETE FROM network_rooms WHERE id IN (SELECT id FROM network_rooms WHERE expires_at<? LIMIT 100)').bind(now()),env.DB.prepare('DELETE FROM network_limits WHERE key IN (SELECT key FROM network_limits WHERE expires_at<? LIMIT 100)').bind(now())]);if(ctx.waitUntil)ctx.waitUntil(cleanup);else await cleanup;
   }else if(method==='POST'&&path==='/api/rooms/join')result=await join(env.DB,await body(request),request);
   else{
    const match=path.match(/^\/api\/rooms\/([a-f0-9-]{36})(?:\/(answer|cancel))?$/);if(!match)throw problem('Ukjent nettduell-adresse.',404);
    const token=(request.headers.get('Authorization')??'').replace(/^Bearer /,'');
    if(method==='GET'&&!match[2]){const {row,p,player}=await auth(env.DB,match[1],token);result=publicState(row,p,player);}
    else if(method==='POST'&&match[2])result=await mutate(env.DB,match[1],token,match[2],await body(request));
    else throw problem('Denne handlingen er ikke tillatt.',405);
   }
   return response(result);
  }catch(error){return response({error:error.status?error.message:'Serveren kunne ikke behandle handlingen. Prøv igjen.'},error.status??503);}
 };
}
