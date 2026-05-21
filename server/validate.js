const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/config/socket");

const PORT = 5001;
const server = http.createServer(app);
initSocket(server);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("Port in use — kill old process first.");
    process.exit(1);
  }
  console.error("Server error:", error);
  process.exit(1);
});

const io = require("./src/config/socket").getIO();

server.listen(PORT, () => {
  console.log("AlertNaija API running on", PORT);

  // Quick inline checks
  (async () => {
    try {
      // 1. GET /incidents
      const r1 = await httpGet("/incidents");
      console.log("GET /incidents:", r1.status, r1.body);

      // 2. POST /auth/register
      const r2 = await httpPost("/auth/register", { fullName:"QuickTest", email:"quick@test.com", phone:"0800000000", password:"password123", role:"CITIZEN" });
      console.log("POST /auth/register:", r2.status, r2.body.substring(0, 80));

      // 3. GET /analytics
      const r3 = await httpGet("/analytics");
      console.log("GET /analytics:", r3.status, r3.body.substring(0, 60));

      // 4. GET /dashboard — need token
      const r4 = await httpGet("/dashboard/stats", r2.token);
      console.log("GET /dashboard/stats:", r4.status, r4.body.substring(0, 60));

      // 5. GET /directory
      const r5 = await httpGet("/directory");
      console.log("GET /directory:", r5.status, r5.body.substring(0, 60));

      console.log("\nAll checks done.");
    } catch (e) {
      console.error("Check error:", e.message);
    }
    process.exit(0);
  })();
});

function httpGet(path, token) {
  return new Promise((resolve) => {
    const opts = { hostname: "localhost", port: PORT, path, method: "GET", timeout: 5000 };
    if (token) opts.headers = { Authorization: "Bearer " + token };
    const req = http.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        let p;
        try { p = JSON.parse(d); } catch (e) { p = d; }
        resolve({ status: res.statusCode, body: JSON.stringify(p).substring(0, 200), token });
      });
    });
    req.on("error", e => resolve({ status: -1, body: e.message, token }));
    req.on("timeout", () => { req.destroy(); resolve({ status: -2, body: "TIMEOUT", token }); });
    req.end();
  });
}

function httpPost(path, body, token) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: "localhost", port: PORT, path, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
      timeout: 5000,
    };
    if (token) opts.headers.Authorization = "Bearer " + token;
    const req = http.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        let p;
        try { p = JSON.parse(d); } catch (e) { p = d; }
        resolve({ status: res.statusCode, body: JSON.stringify(p), token: p.token });
      });
    });
    req.on("error", e => resolve({ status: -1, body: e.message, token: null }));
    req.on("timeout", () => { req.destroy(); resolve({ status: -2, body: "TIMEOUT", token: null }); });
    req.write(data);
    req.end();
  });
}

process.on("uncaughtException", e => console.error("UNCAUGHT:", e.message));
process.on("unhandledRejection", e => console.error("UNHANDLED:", e));
