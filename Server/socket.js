// socket.js

const socketIO = require("socket.io");

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3001", 
      methods: ["GET", "POST"],
    },
  });

  const users = {};

  io.on("connection", (socket) => {
    console.log(" A user connected");

    socket.on("user-joined", (name) => {

      users[socket.id] = name;
      console.log(name);
      socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", (message) => {
      socket.broadcast.emit("recieve", {
        message: message,
        name: users[socket.id],
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

module.exports = initializeSocket;
