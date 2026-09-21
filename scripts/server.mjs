import http from 'node:http';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const files={'/assets/PretendardVariable.woff2':['assets/PretendardVariable.woff2','font/woff2'],'/':['index.html','text/html'],'/index.html':['index.html','text/html'],'/styles.css':['styles.css','text/css'],'/app.js':['app.js','text/javascript'],'/data.js':['data.js','text/javascript']};
export function createServer(root=process.cwd()){
 let queue=Promise.resolve();
 return http.createServer(async(req,res)=>{
 const reply=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname.startsWith('/api/news/')){
  if(req.method!=='DELETE')return reply(405,{error:'지원하지 않는 요청입니다.'});
  const origin=req.headers.origin;
  if(req.headers['x-news-action']!=='delete'||!origin||!['http://127.0.0.1:'+req.socket.localPort,'http://localhost:'+req.socket.localPort].includes(origin)||req.headers.host!==new URL(origin).host)return reply(403,{error:'사이트 안에서 삭제해 주세요.'});
  const id=decodeURIComponent(pathname.slice('/api/news/'.length));
  if(!/^[a-zA-Z0-9_-]+$/.test(id))return reply(400,{error:'잘못된 뉴스 번호입니다.'});
  const task=queue.then(async()=>{
   const context={window:{}};vm.runInNewContext(await readFile(path.join(root,'data.js'),'utf8'),context);
   const cases=context.window.CASES;
   const target=cases.find(c=>c.id===id);
   if(!target)return reply(404,{error:'이미 삭제됐거나 찾을 수 없는 뉴스입니다.'});
   await mkdir(path.join(root,'.news-trash'),{recursive:true});
   await writeFile(path.join(root,'.news-trash',id+'.json'),JSON.stringify({deletedAt:new Date().toISOString(),news:target},null,2));
   const remaining=cases.filter(c=>c.id!==id);
   const temp=path.join(root,'data.js.tmp');
   await writeFile(temp,'window.CASES = '+JSON.stringify(remaining,null,2)+';\n');
   await rename(temp,path.join(root,'data.js'));
   reply(200,{deletedId:id,count:remaining.length});
  });
  queue=task.catch(()=>{});
  try{await task;}catch{reply(500,{error:'저장하지 못했습니다. 다시 시도해 주세요.'});}
  return;
 }
 if(!['GET','HEAD'].includes(req.method))return reply(405,{error:'지원하지 않는 요청입니다.'});
 const f=files[pathname];if(!f){res.writeHead(404);return res.end('Not found');}
 try{const data=await readFile(path.join(root,f[0]));res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(500);res.end('Unable to load file');}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))createServer().listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
