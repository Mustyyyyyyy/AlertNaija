// Test express, cors, helmet, morgan
try {
  const express = require('express');
  console.log('express OK');
  const cors = require('cors');
  console.log('cors OK');
  const helmet = require('helmet');
  console.log('helmet OK');
  const morgan = require('morgan');
  console.log('morgan OK');
} catch(e) {
  console.error('FAIL:', e.message);
  process.exit(1);
}

// Test routes
try {
  require('./src/routes/auth.routes');
  console.log('auth.routes OK');
} catch(e) {
  console.error('auth.routes FAIL:', e.message);
  process.exit(2);
}

try {
  require('./src/routes/incident.routes');
  console.log('incident.routes OK');
} catch(e) {
  console.error('incident.routes FAIL:', e.message);
  process.exit(3);
}

try {
  require('./src/routes/analytics.routes');
  console.log('analytics.routes OK');
} catch(e) {
  console.error('analytics.routes FAIL:', e.message);
  process.exit(4);
}

try {
  require('./src/middleware/error.middleware');
  console.log('error.middleware OK');
} catch(e) {
  console.error('error.middleware FAIL:', e.message);
}

console.log('ALL ROUTES OK');
