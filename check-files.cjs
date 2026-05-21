const fs = require('fs');
const p = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\app.js';
const stat = fs.statSync(p);
console.log('mtime:', stat.mtime.toISOString());
console.log('size:', stat.size, 'bytes');
const content = fs.readFileSync(p, 'utf8');
console.log('first 120 chars:', content.substring(0,120));
console.log('total lines:', content.split('\n').length);

const p2 = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src\\app.js';
const content2 = fs.readFileSync(p2, 'utf8');
console.log('contains helmet:', content2.includes('helmet'));
console.log('contains morgan:', content2.includes('morgan'));
process.exit(0);
