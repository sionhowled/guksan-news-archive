import {mkdir,copyFile,readFile} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(await readFile('data.js','utf8'),context);
const items=context.window.CASES;
if(!Array.isArray(items)||new Set(items.map(x=>x.id)).size!==items.length)throw new Error('Case data is incomplete');
for(const c of items){if(!c.title||!c.detail||!c.caution||new URL(c.url).protocol!=='https:')throw new Error('Invalid case '+c.id);}
await mkdir('dist',{recursive:true});
for(const f of ['index.html','styles.css','app.js','data.js']) await copyFile(f,'dist/'+f);
console.log('Built static archive with '+items.length+' validated cases.');

await mkdir('dist/assets',{recursive:true});
for(const f of ['PretendardVariable.woff2','OFL.txt']) await copyFile('assets/'+f,'dist/assets/'+f);
