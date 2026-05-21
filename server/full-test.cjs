const fs = require('fs');
const path = require('path');
const http = require('http');

const OUT = 'C:\\Users\\HP\\AppData\\Local\\Temp\\kilo\\server-test-result.txt';
fs.writeFileSync(OUT, '=== START ===\n');

// Override console to also write to file
const origLog = console.log;
console.log = (...args) => {
  origLog(...args);
  try { fs.appendFileSync(OUT, args.join(' ') + '\n', {encoding: 'utf8'}); } catch(e) { /* ignore */ }
};

process.env.NODE_ENV = 'test';
try { require('dotenv').config({path:'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\.env'}); } catch(e) { console.log('dotenv err:', e.message); }

async function main() {
  const results = [];
  
  // Check all modules
  const mods = [
    ['express', () => require('express')],
    ['cors', () => require('cors')],
    ['helmet', () => require('helmet')],
    ['morgan', () => require('morgan')],
  ];
  
  for (const [name, fn] of mods) {
    try { fn(); console.log(name, 'OK'); } 
    catch(e) { console.error(name, 'FAIL:', e.message); }
  }

  // Check routes
  const routeFiles = [
    ['auth.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\auth.routes'],
    ['incident.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\incident.routes'],
    ['directory.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\directory.routes'],
    ['analytics.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\analytics.routes'],
    ['dashboard.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\dashboard.routes'],
    ['geocode.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\geocode.routes'],
    ['geo.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\geo.routes'],
    ['assignment.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\assignment.routes'],
    ['verification.routes', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\verification.routes'],
    ['error.middleware', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\middleware\\error.middleware'],
    ['rate-limit.middleware', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\middleware\\rate-limit.middleware'],
    ['auth.middleware', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\middleware\\auth.middleware'],
  ];
  
  for (const [name, p] of routeFiles) {
    try { require(p); console.log(name, 'OK'); } 
    catch(e) { console.error(name, 'FAIL:', e.message); }
  }

  // Check controllers
  const controllers = [
    ['auth.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\auth.controller'],
    ['incident.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\incident.controller'],
    ['directory.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\directory.controller'],
    ['analytics.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\analytics.controller'],
    ['dashboard.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\dashboard.controller'],
    ['assignment.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\assignment.controller'],
    ['verification.controller', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\controllers\\verification.controller'],
  ];
  
  for (const [name, p] of controllers) {
    try { require(p); console.log(name, 'OK'); }
    catch(e) { console.error(name, 'FAIL:', e.message); }
  }

  // Skip pushNotifications (needs Firebase)
  console.log('--- SKIPPED: pushNotifications (needs Firebase creds) ---');

  // Check services (without push/upload which need cloudinary/Firebase)
  const services = [
    ['responder.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\responder.service'],
    ['dispatch.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\dispatch.service'],
    ['autoDispatch.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\autoDispatch.service'],
    ['analytics.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\analytics.service'],
    ['audit.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\audit.service'],
    ['notifications.service', 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\services\\notifications.service'],
  ];
  
  for (const [name, p] of services) {
    try { require(p); console.log(name, 'OK'); }
    catch(e) { console.error(name, 'FAIL:', e.message); }
  }

  console.log('--- SKIPPED: upload.service (needs cloudinary/lodash fix) ---');

  // Check app.js
  try {
    const app = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\app');
    console.log('app.js OK');
  } catch(e) { console.error('app.js FAIL:', e.message); if(e.stack) console.error(e.stack.split('\n').slice(0,3).join(' | ')); }

  // Start test server
  console.log('\nStarting test server on 4999...');
  const server = http.createServer(
    require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\app')
  );
  
  server.listen(4999, () => {
    console.log('Server listening on 4999');
    
    // Wait for listen, then test
    setTimeout(async () => {
      try {
        const r = await new Promise((resolve) => {
          const req = http.request({hostname:'localhost', port:4999, path:'/', method:'GET', timeout:3000}, (res) => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({s: res.statusCode, b}));
          });
          req.on('error', e => resolve({s: -1, b: e.message}));
          req.on('timeout', () => { req.destroy(); resolve({s: -2, b: 'TIMEOUT'}); });
          req.end();
        });
        console.log('GET /:', r.s, r.b.substring(0, 100));
        
        const r2 = await new Promise((resolve) => {
          const req = http.request({hostname:'localhost', port:4999, path:'/api/incidents', method:'GET', timeout:3000}, (res) => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => resolve({s: res.statusCode, b}));
          });
          req.on('error', e => resolve({s: -1, b: e.message}));
          req.on('timeout', () => { req.destroy(); resolve({s: -2, b: 'TIMEOUT'}); });
          req.end();
        });
        console.log('GET /api/incidents:', r2.s, r2.b.substring(0, 150));
        
        console.log('\nDONE');
        server.close();
        process.exit(0);
      } catch(e) {
        console.error('TEST ERR:', e.message);
        server.close();
        process.exit(1);
      }
    }, 3000);
  });
  
  server.on('error', e => { console.error('SERVER ERR:', e.message); process.exit(1); });
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
setTimeout(() => { console.error('TIMEOUT - exiting'); fs.appendFileSync(OUT, 'TIMEOUT\n'); process.exit(1); }, 15000);
