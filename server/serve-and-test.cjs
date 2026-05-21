// AlertNaija server startup + endpoint self-test
const { execSync } = require("child_process");
const path = require("path");

const ROOT = "C:\\Users\\HP\\Desktop\\AlertNaija";
const SERVER_JS = path.join(ROOT, "server", "src", "server.js");

let proc;

function kill() {
  if (proc && proc.pid) {
    try { process.kill(proc.pid, "SIGTERM"); } catch(e) { /* already dead */ }
  }
}

function startServer() {
  proc = require("child_process").fork(SERVER_JS, { cwd: path.join(ROOT, "server"), env: { ...process.env, NODE_ENV: "test" }, stdio: "pipe" });

  let stdout = "", stderr = "";
  proc.stdout.on("data", d => stdout += d);
  proc.stderr.on("data", d => stderr += d);

  proc.on("exit", (code, sig) => {
    console.log(`\n[Server exited] code=${code} sig=${sig}`);
  });

  setTimeout(() => {
    if (proc && proc.pid) {
      console.log("[Server-PID]", proc.pid);
      console.log("[Server-STDOUT]", stdout.substring(0, 300));
      if (stderr) console.log("[Server-STDERR]", stderr.substring(0, 300));

      // Now probe endpoints
      const endpoints = [
        ["GET", "/", null],
        ["GET", "/api/incidents", null],
        ["POST", "/api/auth/register", { fullName:"Test", email:"testcheck@test.com", phone:"08012345678", password:"test123", role:"CITIZEN" }],
      ];

      let allOk = true;
      (async () => {
        for (const [method, ep, body] of endpoints) {
          const http = require("http");
          const r = await new Promise((resolve) => {
            const data = body ? JSON.stringify(body) : null;
            const opts = { hostname: "localhost", port: 5001, path: ep, method, timeout: 4000 };
            if (data) opts.headers = { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) };
            const req = http.request(opts, (res) => {
              let d = "";
              res.on("data", c => d += c);
              res.on("end", () => resolve(`  ${method} ${ep} => ${res.statusCode} ${d.substring(0,100)}`));
            });
            req.on("error", e => { allOk = false; resolve(`  ${method} ${ep} => ERR ${e.message}`); });
            req.on("timeout", () => { req.destroy(); allOk = false; resolve(`  ${method} ${ep} => TIMEOUT`); });
            if (data) req.write(data);
            req.end();
          });
          console.log(r);
        }
        console.log("\n" + (allOk ? "✅ All endpoint checks passed" : "⚠️ Some checks failed"));
        kill();
        process.exit(0);
      })();
    } else {
      console.log("No PID at timeout, check stderr:", stderr.substring(0, 300));
      process.exit(1);
    }
  }, 4000);
}

startServer();
setTimeout(() => { if (proc) kill(); process.exit(0); }, 18000);
