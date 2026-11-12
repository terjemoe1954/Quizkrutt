import {readFile,writeFile,mkdir,readdir,rm,copyFile} from 'node:fs/promises';
import {networkQuestions} from '../worker/network-bank.mjs';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const assets={};
async function walk(dir,prefix=''){for(const entry of await readdir(dir,{withFileTypes:true})){const filename=entry.name,path=dir+'/'+filename,key=prefix+'/'+filename;if(entry.isDirectory())await walk(path,key);else{const ext=filename.slice(filename.lastIndexOf('.'));if(!types[ext])throw Error('Unknown public asset '+key);assets[key]=[types[ext],(await readFile(path)).toString('base64')];}}}
await walk('web');const api=await readFile('worker/api.mjs','utf8'),entry=await readFile('worker/entry.mjs','utf8');
const bundle=`// Generated from worker/, web/ and server-only question bank.\nconst QUESTIONS=${JSON.stringify(networkQuestions)};\nconst ASSETS=${JSON.stringify(assets)};\n${api.replace('export function createApi','function createApi')}\n${entry.replace("import {createApi} from './api.mjs';",'')}\n`;
if(/\bimport\s+(?:[\w{*]|\()/m.test(bundle))throw Error('Unexpected unbundled import');
await rm('dist',{recursive:true,force:true});await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});await writeFile('dist/server/index.js',bundle);await copyFile('.openai/hosting.json','dist/.openai/hosting.json');console.log(`Worker built: ${Object.keys(assets).length} public assets, ${networkQuestions.length} server-only questions.`);
