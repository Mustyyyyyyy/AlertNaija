const fs = require('fs');
const logFile = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\server-startup.log';

function log(msg) { 
  const line = new Date().toISOString() + ' ' + msg; 
  console.log(msg); 
  try { fs.appendFileSync(logFile, line + '\n'); } catch(e) {}
}

process.env.NODE_ENV = 'test';

try { log('loading dotenv...'); require('dotenv').config(); log('dotenv loaded'); } catch(e) { log('dotenv err: ' + e.message); }

try {
  log('loading app.js...');
  const app = require('./src/app.js');
  log('app.js loaded OK');
} catch(e) {
  log('app.js ERROR: ' + e.message);
  if (e.stack) log(e.stack.split('\n').slice(0,5).join('\n'));
}

try {
  log('loading server.js...');
  const http = require('http');
  const srv = require('./src/server.js');
  log('server.js returned (process should be running now)');

  // Wait for server to listen
  const http2 = require('http');
  new Promise((resolve) => {
    setTimeout(() => {
      log('checking port...');
      const r = http2.request({hostname:'localhost', port:5001, path:'/', method:'GET', timeout:3000}, (res) => {
        let d=''; res.on('data',c=>d+=c); res.on('end',()=>{log('GET /: '+res.statusCode+' ' + d); resolve();});
      });
      r.on('error',e=>{ log('GET / err: ' + e.message); resolve(); });
      r.on('timeout',()=>{ log('GET / timeout'); r.destroy(); resolve(); });
      r.end();
    }, 3000);
  }).then(() => {
    log('DONE - exiting');
    // Try to shutdown server gracefully
    try { process.kill(process.pid, 'SIGTERM'); } catch(e) { log('exit err: ' + e.message); }
  });

} catch(e) {
  log('server.js ERROR: ' + e.message);
  if (e.stack) log(e.stack.split('\n').slice(0,5).join('\n'));
}
