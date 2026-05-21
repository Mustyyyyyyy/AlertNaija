const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'C:\\Users\\HP\\Desktop\\AlertNaija';

// Write all server rebuild files from scratch
const files = {};

// server/src/app.js
files['server/src/app.js'] = `const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const directoryRoutes = require("./routes/directory.routes");
const incidentRoutes = require("./routes/incident.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const errorMiddleware = require("./middleware/error.middleware");
const uploadRoutes = require("./routes/upload.routes");
const geocodeRoutes = require("./routes/geocode.routes");
const geoRoutes = require("./routes/geo.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const verificationRoutes = require("./routes/verification.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "AlertNaija API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/verification", verificationRoutes);

app.use(errorMiddleware);

module.exports = app;
`;

files['server/src/server.js'] = `const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

initSocket(server);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(\`Port \${PORT} is in use.\`);
    process.exit(1);
  }
  console.error("Server error:", error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(\`AlertNaija API running on port \${PORT}\`);
});
`;

// Write all files
let written = 0;
for (const [rel, content] of Object.entries(files)) {
  const abs = path.join(ROOT, rel);
  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(abs, content.trimEnd() + '\n');
  written++;
}
console.log(\`Written \${written} server files\`);

// Run git status
try {
  const s = execSync('git status --short', { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  console.log('Status after write:', s.trim());
} catch(e) {
  console.log('Status check err:', e.message);
}
`;
