try { const c = require('cloudinary'); console.log('cloudinary OK'); process.exit(0); }
catch(e) { console.error('cloudinary FAIL:', e.message); console.error(e.stack.split('\n').slice(0,5).join('\n')); process.exit(1); }
