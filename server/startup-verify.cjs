// Writes all output to a temp file, then exits
const fs = require('fs');
const OUT = 'C:\\Users\\HP\\AppData\\Local\\Temp\\kilo\\server-test-result.txt';
const origLog = console.log, origErr = console.error;
console.log = (...a) => { origLog(...a); fs.appendFileSync(OUT, a.join(' ') + '\n'); };
console.error = (...a) => { origErr(...a); fs.appendFileSync(OUT, 'ERR: ' + a.join(' ') + '\n'); };

process.env.NODE_ENV = 'test';
try { require('dotenv').config({path:'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\.env'}); } catch(e) { console.log('dotenv err:', e.message); }

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

console.log('express OK');
console.log('cors OK');
console.log('morgan OK');

try {
  const authRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\auth.routes');
  console.log('authRoutes OK');
} catch(e) { console.error('authRoutes FAIL:', e.message); }

try {
  const incidentRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\incident.routes');
  console.log('incidentRoutes OK');
} catch(e) { console.error('incidentRoutes FAIL:', e.message); }

try {
  const directoryRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\directory.routes');
  console.log('directoryRoutes OK');
} catch(e) { console.error('directoryRoutes FAIL:', e.message); }

try {
  const analyticsRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\analytics.routes');
  console.log('analyticsRoutes OK');
} catch(e) { console.error('analyticsRoutes FAIL:', e.message); }

try {
  const dashboardRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\dashboard.routes');
  console.log('dashboardRoutes OK');
} catch(e) { console.error('dashboardRoutes FAIL:', e.message); }

try {
  const errorMw = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\middleware\\error.middleware');
  console.log('errorMw OK');
} catch(e) { console.error('errorMw FAIL:', e.message); }

try {
  const geocodeRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\geocode.routes');
  console.log('geocodeRoutes OK');
} catch(e) { console.error('geocodeRoutes FAIL:', e.message); }

try {
  const geoRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\geo.routes');
  console.log('geoRoutes OK');
} catch(e) { console.error('geoRoutes FAIL:', e.message); }

try {
  const assignmentRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\assignment.routes');
  console.log('assignmentRoutes OK');
} catch(e) { console.error('assignmentRoutes FAIL:', e.message); }

try {
  const verificationRoutes = require('C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\routes\\verification.routes');
  console.log('verificationRoutes OK');
} catch(e) { console.error('verificationRoutes FAIL:', e.message); }

console.log('Building app...');
const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => res.json({ message: 'AlertNaija API Running' }));
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/verification', verificationRoutes);
app.use(errorMw);
console.log('App built OK');

const http = require('http');
const PORT = 4999;
const server = http.createServer(app);
server.listen(PORT, () => console.log('Listening on', PORT));

// Test GET /api/incidents after 2s
setTimeout(() => {
  const r = http.request({hostname:'localhost',port:PORT,path:'/api/incidents',method:'GET',timeout:3000}, (res) => {
    let d=''; res.on('data',c=>d+=c); res.on('end',()=>{
      console.log('GET /api/incidents:', res.statusCode, d.substring(0,150));
      server.close(() => { console.log('DONE'); process.exit(0); });
    });
  });
  r.on('error', e => { console.error('ERR:', e.message); server.close(); process.exit(1); });
  r.on('timeout', () => { r.destroy(); console.error('TIMEOUT'); server.close(); process.exit(1); });
  r.end();
}, 3000);

setTimeout(() => { console.error('TEST TIMEOUT'); server.close(); process.exit(1); }, 10000);
