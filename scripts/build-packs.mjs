import {writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {packs} from '../content/packs.mjs';
await mkdir(new URL('../web/packs/',import.meta.url),{recursive:true});
const catalog=[];
for(const pack of packs){const content=JSON.stringify(pack);const file=`packs/${pack.id}.v${pack.version}.json`;await writeFile(new URL('../web/'+file,import.meta.url),content);catalog.push({id:pack.id,version:pack.version,title:pack.title,description:pack.description,category:pack.category,level:pack.level,count:pack.questions.length,bytes:Buffer.byteLength(content),sha256:createHash('sha256').update(content).digest('hex'),file});}
await writeFile(new URL('../web/catalog.js',import.meta.url),`// Generert av scripts/build-packs.mjs. Inneholder metadata, ikke spørsmål.\nexport const catalog=${JSON.stringify(catalog,null,2)};\n`);
console.log(`${packs.length} quizpakker, ${packs.reduce((n,p)=>n+p.questions.length,0)} nye spørsmål.`);
