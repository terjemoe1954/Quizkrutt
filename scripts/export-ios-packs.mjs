import {writeFileSync,copyFileSync} from 'node:fs';
import {catalog} from '../web/catalog.js';
const resources = new URL('../ios/Quizkrutt/Resources/',import.meta.url);
writeFileSync(new URL('pack-catalog.json',resources),JSON.stringify(catalog,null,2)+'\n');
for(const entry of catalog) copyFileSync(new URL('../web/'+entry.file,import.meta.url),new URL(entry.file.split('/').at(-1),resources));
console.log(`Exported ${catalog.length} bundled packs, ${catalog.reduce((n,p)=>n+p.count,0)} questions. No network required.`);
