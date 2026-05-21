// Minimal server startup test - writes to startup.log
const fs = require('fs');
const LOG = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\startup.log';
fs.writeFileSync(LOG, '=== SERVER STARTUP LOG ===\n');
function log(m) { fs.appendFileSync(LOG, new Date().toISOString() + ' ' + m + '\n'); console.log(m); }

process.env.NODE_ENV = 'test';
try { require('dotenv').config({path:'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\.env'}); } catch(e) { log('dotenv err: '+e.message); }

log('Loading express...');
const express = require('express');
log('express OK');

log('Loading cors...');
const cors = require('cors');
log('cors OK');

log('Loading morgan...');
const morgan = require('morgan');
log('morgan OK');

log('Loading routes...');
try {
  const authRoutes = require('./src/routes/auth.routes');
  log('authRoutes OK');
} catch(e) { log('authRoutes FAIL: ' + e.message); }

try {
  const incidentRoutes = require('./src/routes/incident.routes');
  log('incidentRoutes OK');
} catch(e) { log('incidentRoutes FAIL: ' + e.message); }

try {
  const directoryRoutes = require('./src/routes/directory.routes');
  log('directoryRoutes OK');
} catch(e) { log('directoryRoutes FAIL: ' + e.message); }

try {
  const analyticsRoutes = require('./src/routes/analytics.routes');
  log('analyticsRoutes OK');
} catch(e) { log('analyticsRoutes FAIL: ' + e.message); }

try {
  const dashboardRoutes = require('./src/routes/dashboard.routes');
  log('dashboardRoutes OK');
} catch(e) { log('dashboardRoutes FAIL: ' + e.message); }

try {
  const errorMw = require('./src/middleware/error.middleware');
  log('errorMw OK');
} catch(e) { log('errorMw FAIL: ' + e.message); }

try {
  const uploadRoutes = require('./src/routes/upload.routes');
  log('uploadRoutes OK');
} catch(e) { log('uploadRoutes FAIL: ' + e.message); if(e.stack) log(e.stack.split('\n').slice(0,3).join(' | ')); }

try {
  const geocodeRoutes = require('./src/routes/geocode.routes');
  log('geocodeRoutes OK');
} catch(e) { log('geocodeRoutes FAIL: ' + e.message); }

try {
  const geoRoutes = require('./src/routes/geo.routes');
  log('geoRoutes OK');
} catch(e) { log('geoRoutes FAIL: ' + e.message); }

try {
  const assignmentRoutes = require('./src/routes/assignment.routes');
  log('assignmentRoutes OK');
} catch(e) { log('assignmentRoutes FAIL: ' + e.message); }

try {
  const verificationRoutes = require('./src/routes/verification.routes');
  log('verificationRoutes OK');
} catch(e) { log('verificationRoutes FAIL: ' + e.message); }

log('Building app...');
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
app.use('/api/upload', uploadRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/verification', verificationRoutes);
app.use(errorMw);
log('App built OK');

const http = require('http');

log('Starting server on 4999...');
const server = http.createServer(app);
server.listen(4999, () => log('Server listening on 4999'));

setTimeout(() => {
  log('Probing /api/incidents...');
  const r = http.request({hostname:'localhost', port:4999, path:'/api/incidents', method:'GET', timeout:3000}, (res) => {
    let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ log('GET /api/incidents: '+res.statusCode+' '+d.substring(0,200)); server.close(); process.exit(0); });
  });
  r.on('error', e => { log('GET err: '+e.message); server.close(); process.exit(1); });
  r.on('timeout', ()=> { r.destroy(); log('GET timeout'); server.close(); process.exit(1); });
  r.end();
}, 3000);

setTimeout(() => { log('TIMEOUT - exiting'); server.close(); process.exit(1); }, 10000);
