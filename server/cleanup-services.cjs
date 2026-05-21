const fs = require('fs');
const serverDir = 'C:\\Users\\HP\\Desktop\\AlertNaija\\server\\src';
const filesToDelete = [
  'services/upload.service.js',
  'services/notifications.service.js',
  'services/analytics.service.js',
  'services/audit.service.js',
  'services/autoDispatch.service.js',
];

// Also check if geocode.service.js exists
const extra = ['services/geocode.service.js'];
const all = [...filesToDelete, ...extra];

let count = 0;
for (const f of all) {
  const p = serverDir + '\\' + f;
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log('DELETED: ' + f);
    count++;
  } else {
    console.log('NOT FOUND: ' + f);
  }
}

console.log('Total deleted:', count);
process.exit(0);
