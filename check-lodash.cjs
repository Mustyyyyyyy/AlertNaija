const fs = require('fs');
const p = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\node_modules\\lodash';

console.log('=== LODASH DIR CONTENTS ===');
const files = fs.readdirSync(p);
console.log('File count:', files.length);
console.log('Has toString.js?', files.includes('toString.js'));
console.log('Has _toString.js?', files.includes('_toString.js'));
console.log('Has package.json?', files.includes('package.json'));

// Check if toString.js exists directly
const toStringPath = p + '\\toString.js';
const _toStringPath = p + '\\_toString.js';
console.log('\\ntoString.js exists:', fs.existsSync(toStringPath));
console.log('_toString.js exists:', fs.existsSync(_toStringPath));

// Check size of toString.js if exists
if (fs.existsSync(toStringPath)) {
  console.log('toString.js size:', fs.statSync(toStringPath).size);
}

// Check cloudinary
const cp = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\node_modules\\cloudinary';
if (fs.existsSync(cp)) {
  console.log('\\ncloudinary exists at:', cp);
  console.log('cloudinary files:', fs.readdirSync(cp).join(', '));
} else {
  console.log('\\ncloudinary NOT FOUND');
}

process.exit(0);
