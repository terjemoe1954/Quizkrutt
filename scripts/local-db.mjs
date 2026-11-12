import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';
export function localDatabase(filename=':memory:'){
 const sqlite=new DatabaseSync(filename);sqlite.exec('PRAGMA journal_mode=WAL;');
 sqlite.exec('CREATE TABLE IF NOT EXISTS __local_migrations (filename TEXT PRIMARY KEY)');
 for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){if(!sqlite.prepare('SELECT filename FROM __local_migrations WHERE filename=?').get(file)){sqlite.exec(readFileSync('drizzle/'+file,'utf8'));sqlite.prepare('INSERT INTO __local_migrations(filename) VALUES (?)').run(file);}}
 function statement(sql,values=[]){return {sql,values,bind(...args){return statement(sql,args);},async first(){return sqlite.prepare(sql).get(...values)??null;},async run(){const result=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(result.changes)},success:true};},async all(){return {results:sqlite.prepare(sql).all(...values)};}};}
 return {prepare:sql=>statement(sql),async batch(statements){sqlite.exec('BEGIN IMMEDIATE');try{const results=[];for(const s of statements)results.push(await s.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}},sqlite,close:()=>sqlite.close()};
}
