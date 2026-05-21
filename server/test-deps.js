// Minimal test: can we load 'bcrypt' directly?
try {
  const bcrypt = require('bcrypt');
  console.log('bcrypt loaded OK, version:', require('bcrypt/package.json').version);
} catch(e) {
  console.error('bcrypt ERR:', e.message);
  process.exit(1);
}

try {
  const bcryptJs = require('bcryptjs');
  console.log('bcryptjs loaded OK');
} catch(e) {
  console.warn('bcryptjs not available:', e.message);
}

try {
  const crypt = require('cookie-parser');
  console.log('cookie-parser loaded OK');
} catch(e) {
  console.error('cookie-parser ERR:', e.message);
  process.exit(2);
}

console.log('All deps OK');
