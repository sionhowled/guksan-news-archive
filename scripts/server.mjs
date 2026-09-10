import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':['index.html','text/html'],'/index.html':['index.html','text/html'],'/styles.css':['styles.css','text/css'],'/app.js':['app.js','text/javascript'],'/data.js':['data.js','text/javascript']};
http.createServer(async(req,res)=>{const f=files[new URL(req.url,'http://localhost').pathname];if(!f){res.writeHead(404);return res.end('Not found');}try{const data=await readFile(f[0]);res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(500);res.end('Unable to load file');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
