const { execSync } = require("child_process");

const serverDir = "C:\\Users\\HP\\Desktop\\AlertNaija\\server";

// Delete test/debug/old root-level scripts
const toDelete = [
  "startup.js",
  "startup-debug.cjs",
  "startup-verify.cjs",
  "step-debug.cjs",
  "full-test.cjs",
  "serve-and-test.cjs",
  "quick-test.js",
  "test-db.js",
  "test-deps.js",
  "test-routes.js",
  "test-reg.js",
  "test-endpoints.js",
  "test-cloud.cjs",
  "check-deps.cjs",
  "check-lodash.cjs",
  "debug-server.js",
  "debut-server.js",
  "capture.js",
  "server-debug.js",
  "server.pid",
  "pid-test.cjs",
  "node-works.cjs",
  "verify-app.cjs",
  // Add notification temp files that might have been missing last time
  /* server/err.log via .gitignore line: *.log */
];

let deleted = 0;
const errors = [];

for (const f of toDelete) {
  const p = serverDir + "\\" + f;
  try {
    if (require('fs').existsSync(p)) {
      require('fs').unlinkSync(p);
      deleted++;
      console.log("DELETED: " + f);
    }
  } catch (e) {
    errors.push(f + ": " + e.message);
  }
}

// Delete log files
const logFiles = ["err.log","server-out.log","filter.log","filter2.log","startup.log"];
for (const f of logFiles) {
  const p = serverDir + "\\" + f;
  try {
    if (require('fs').existsSync(p)) {
      require('fs').unlinkSync(p);
      deleted++;
      console.log("DELETED LOG: " + f);
    }
  } catch(e) {}
}

console.log("\nDeleted: " + deleted + " files");
if (errors.length) console.log("Errors:\n" + errors.join('\n'));

// Now list what remains in server/
try {
  const list = execSync('git status --short', {cwd: serverDir, encoding: 'utf8', timeout: 15000});
  console.log("\n--- git status --short ---");
  console.log(list.substring(0, 3000));
} catch(e) {
  console.log("git status err:", e.message);
}
