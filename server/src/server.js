const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

initSocket(server);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is in use.`);
    process.exit(1);
  }
  console.error("Server error:", error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`AlertNaija API running on port ${PORT}`);
});
