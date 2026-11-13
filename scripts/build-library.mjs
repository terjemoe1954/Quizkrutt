import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {catalog} from '../web/catalog.js';
import {validatePack} from '../web/pack-format.js';
const root=new URL('../web/library/',import.meta.url);await mkdir(new URL('packs/',root),{recursive:true});
const entries=[];
for(const entry of catalog){const raw=await readFile(new URL('../web/'+entry.file,import.meta.url));validatePack(JSON.parse(raw),entry);await writeFile(new URL(entry.file,root),raw);entries.push(entry);}
for(const {pack,categoryName} of JSON.parse(await readFile(new URL('../content/library-packs.json',import.meta.url)))){validatePack(pack);const raw=JSON.stringify(pack),file=`packs/${pack.id}.v${pack.version}.json`;await writeFile(new URL(file,root),raw);entries.push({id:pack.id,version:pack.version,title:pack.title,description:pack.description,category:pack.category,categoryName,level:pack.level,count:pack.questions.length,bytes:Buffer.byteLength(raw),sha256:createHash('sha256').update(raw).digest('hex'),file});}
await writeFile(new URL('catalog.json',root),JSON.stringify(entries,null,2)+'\n');console.log(`${entries.length} packs in shared public library`);
