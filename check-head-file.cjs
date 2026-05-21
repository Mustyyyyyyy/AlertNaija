const { execSync } = require('child_process');
const commit = 'c24f8b6';
const file = 'server/src/app.js';
try {
  const content = execSync(`git --git-dir=.git show ${commit}:${file}`, {encoding:'utf8',cwd:'C:\\Users\\HP\\Desktop\\AlertNaija',timeout:8000});
  console.log('lines:', content.split('\n').length);
  console.log('has helmet:', content.includes('helmet'));
  console.log('has morgan:', content.includes('morgan'));
  console.log('first 200:', content.substring(0,200));
} catch(e) {
  console.error(e.message);
}
