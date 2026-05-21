#!/usr/bin/env node
const { execSync } = require('child_process');
try {
  const result = execSync('git status --porcelain', { cwd: 'C:\\Users\\HP\\Desktop\\AlertNaija', encoding: 'utf8', timeout: 30000 });
  console.log('STATUS:', result);
} catch(e) {
  console.error('ERR:', e.message);
  try { console.error('STDOUT:', e.stdout); } catch(e2) {}
  try { console.error('STDERR:', e.stderr); } catch(e2) {}
}
