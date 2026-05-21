const fs = require('fs');
const pidFile = 'C:\\Users\\HP\\AppData\\Local\\Temp\\kilo\\test-node.pid';
fs.writeFileSync(pidFile, String(process.pid));
console.log('PID:', process.pid, '- node is running');
const http = require('http');

setTimeout(() => {
  http.get('http://localhost:5001/', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('GET /:', res.statusCode, d.substring(0, 60));
      fs.appendFileSync(pidFile, '\nRESULT:' + res.statusCode + ' ' + d.substring(0, 60));
      process.exit(0);
    });
  }).on('error', (e) => {
    console.log('ERR:', e.message);
    fs.appendFileSync(pidFile, '\nERR:' + e.message);
    process.exit(1);
  });
}, 3000);

setTimeout(() => {
  console.log('TIMEOUT');
  fs.appendFileSync(pidFile, '\nTIMEOUT');
  process.exit(2);
}, 10000);
