import {writeFileSync} from 'node:fs';
import {bank,categories,levelNames} from '../web/questions.js';
const target = new URL('../ios/Quizkrutt/Resources/questions.json',import.meta.url);
writeFileSync(target,JSON.stringify({categories,levelNames,questions:bank},null,2)+'\n');
console.log(`Exported ${bank.length} questions for iOS.`);
