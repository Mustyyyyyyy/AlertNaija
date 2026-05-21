const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("command-center-join", () => {
      socket.join("command-center");
      console.log("Client joined command-center room");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
