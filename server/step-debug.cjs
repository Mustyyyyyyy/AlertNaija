const fs = require('fs');
const logFile = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\server-startup.log';
function log(msg) { 
  const line = new Date().toISOString() + ' ' + msg; 
  console.log(msg); 
  try { fs.appendFileSync(logFile, line + '\n'); } catch(e) {}
}

process.env.NODE_ENV = 'test';
try { require('dotenv').config(); } catch(e) { log('dotenv err: ' + e.message); }

log('step 1: loading express...');
try {
  const express = require('express');
  log('express OK: ' + express.version);
} catch(e) {
  log('express FAIL: ' + e.message);
  process.exit(1);
}

log('step 2: loading cors...');
try {
  const cors = require('cors');
  log('cors OK');
} catch(e) { log('cors FAIL: ' + e.message); }

log('step 3: loading helmet...');
try {
  const helmet = require('helmet');
  log('helmet OK');
} catch(e) { log('helmet FAIL: ' + e.message); }

log('step 4: loading morgan...');
try {
  const morgan = require('morgan');
  log('morgan OK');
} catch(e) { log('morgan FAIL: ' + e.message); }

log('step 5: loading authRoutes...');
try {
  const authRoutes = require('./src/routes/auth.routes');
  log('authRoutes OK');
} catch(e) { log('authRoutes FAIL: ' + e.message); if (e.stack) log(e.stack.split('\n').slice(0,3).join(' | ')); }

log('step 6: loading incidentRoutes...');
try {
  const incidentRoutes = require('./src/routes/incident.routes');
  log('incidentRoutes OK');
} catch(e) { log('incidentRoutes FAIL: ' + e.message); if (e.stack) log(e.stack.split('\n').slice(0,3).join(' | ')); }

log('step 7: loading directoryRoutes...');
try {
  const directoryRoutes = require('./src/routes/directory.routes');
  log('directoryRoutes OK');
} catch(e) { log('directoryRoutes FAIL: ' + e.message); if (e.stack) log(e.stack.split('\n').slice(0,3).join(' | ')); }

log('step 8: loading analyticsRoutes...');
try {
  const analyticsRoutes = require('./src/routes/analytics.routes');
  log('analyticsRoutes OK');
} catch(e) { log('analyticsRoutes FAIL: ' + e.message); }

log('step 9: loading dashboardRoutes...');
try {
  const dashboardRoutes = require('./src/routes/dashboard.routes');
  log('dashboardRoutes OK');
} catch(e) { log('dashboardRoutes FAIL: ' + e.message); }

log('step 10: loading errorMiddleware...');
try {
  const errorMw = require('./src/middleware/error.middleware');
  log('errorMw OK');
} catch(e) { log('errorMw FAIL: ' + e.message); }

log('step 11: loading uploadRoutes...');
try {
  const uploadRoutes = require('./src/routes/upload.routes');
  log('uploadRoutes OK');
} catch(e) { log('uploadRoutes FAIL: ' + e.message); }

log('step 12: loading geocodeRoutes...');
try {
  const geocodeRoutes = require('./src/routes/geocode.routes');
  log('geocodeRoutes OK');
} catch(e) { log('geocodeRoutes FAIL: ' + e.message); }

log('step 13: loading geoRoutes...');
try {
  const geoRoutes = require('./src/routes/geo.routes');
  log('geoRoutes OK');
} catch(e) { log('geoRoutes FAIL: ' + e.message); }

log('step 14: loading assignmentRoutes...');
try {
  const assignmentRoutes = require('./src/routes/assignment.routes');
  log('assignmentRoutes OK');
} catch(e) { log('assignmentRoutes FAIL: ' + e.message); }

log('step 15: loading verificationRoutes...');
try {
  const verificationRoutes = require('./src/routes/verification.routes');
  log('verificationRoutes OK');
} catch(e) { log('verificationRoutes FAIL: ' + e.message); }

log('step 16: building app...');
try {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
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
  log('app built OK');

  log('step 17: starting server...');
  const http = require('http');
  const server = http.createServer(app);
  server.listen(4999, () => log('Server on 4999'));
  
  setTimeout(() => {
    log('testing GET /api/incidents...');
    const http2 = require('http');
    const r = http2.request({hostname:'localhost',port:4999,path:'/api/incidents',method:'GET',timeout:3000}, (res) => {
      let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ log('/api/incidents: '+res.statusCode+' '+d.substring(0,200)); kill(); process.exit(0); });
    });
    r.on('error', e => { log('err: '+e.message); kill(); process.exit(1); });
    r.on('timeout', () => { r.destroy(); log('timeout'); kill(); process.exit(1); });
    r.end();
  }, 2000);
} catch(e) {
  log('build app FAIL: ' + e.message);
  if (e.stack) log(e.stack.split('\n').slice(0,5).join(' | '));
}

process.on('uncaughtException', e => log('uncaught: '+e.message));
process.on('unhandledRejection', e => log('unhandled: '+JSON.stringify(e)));
