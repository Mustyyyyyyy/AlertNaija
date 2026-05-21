const fs = require('fs');
const p = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\node_modules\\lodash';
const items = fs.readdirSync(p, { withFileTypes: true });
console.log('Lodash entries:', items.map(i => i.name).join(', '));
const pkg = JSON.parse(fs.readFileSync(p + '\\package.json', 'utf8'));
console.log('lodash version:', pkg.version);

const cloudinaryPath = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\node_modules\\cloudinary';
try {
  const cpkg = JSON.parse(fs.readFileSync(cloudinaryPath + '\\package.json', 'utf8'));
  console.log('cloudinary version:', cpkg.version);
} catch(e) { console.log('cloudinary not found:', e.message); }

process.exit(0);
