const ids=new Set(['mix','world','nature','culture','sport','science']);
export const validId=id=>typeof id==='string'&&/^[a-z][a-z0-9-]{1,70}$/.test(id);
const text=(value,max)=>typeof value==='string'&&value.trim().length>0&&value.length<=max&&!/[<>\u0000-\u0008]/.test(value);
export function validQuestion(q){return q&&validId(q.id)&&text(q.question,500)&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(x=>text(x,200))&&new Set(q.options).size===4&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4&&text(q.explanation,1000);}
export function validatePack(pack,expected=null){
 if(!pack||pack.schema!==1||!validId(pack.id)||!Number.isSafeInteger(pack.version)||pack.version<1||!text(pack.title,100)||!text(pack.description,300)||!validId(pack.category)||!Number.isInteger(pack.level)||pack.level<0||pack.level>2||!Array.isArray(pack.questions)||pack.questions.length<10||pack.questions.length>200||!pack.questions.every(validQuestion)||new Set(pack.questions.map(q=>q.id)).size!==pack.questions.length||new Set(pack.questions.map(q=>q.question)).size!==pack.questions.length)throw Error('Quizpakken har ugyldig eller ufullstendig innhold. Ingen lagret pakke ble endret.');
 if(expected&&['id','version','title','description','category','level'].some(k=>pack[k]!==expected[k]))throw Error('Quizpakken stemmer ikke med biblioteket. Prøv igjen etter at appen er oppdatert.');
 if(expected&&pack.questions.length!==expected.count)throw Error('Quizpakken mangler spørsmål. Prøv å laste den ned igjen.');
 return pack;
}
