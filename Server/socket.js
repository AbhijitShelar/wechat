const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connection Successful"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

const User = new mongoose.model("User", {
  userId: String,
  socketId: String,
});

const handleUserJoined = async (io, socket, userData) => {
  try {
    const { userId } = userData;
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, socketId: socket.id });
      await user.save();
    } else {
      user.socketId = socket.id;
      await user.save();
    }

    io.emit("user-joined", userData);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      // Handle the case where the document is not found
      console.log(`User not found for userId: ${userData.userId}`);
    } else {
      console.error("Error handling user-joined event:", error);
    }
  }
};

const handleSendMessage = async (io, socket, data) => {
  console.log("Server received a message:", data);

  const { message, name, to } = data;

  try {
    const recipient = await User.findOne({ userId: to });
    console.log("hlo", recipient);

    if (recipient && recipient.socketId) {
      io.to(recipient.socketId).emit("receive", { message, name });
    } else {
      console.log("Invalid user or user not online");
    }
  } catch (err) {
    console.error("Error finding recipient:", err);
  }
};

const handleDisconnect = async (io, socket) => {
  try{

    console.log("User disconnected");
  } catch (error) {
    console.error("Error handling disconnect event:", error);
  }
};

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("connect", () => {
      console.log("User connected:", socket.id);
    });

    socket.on("user-joined", (userData) =>
      handleUserJoined(io, socket, userData)
    );

    socket.on("send", (data) => handleSendMessage(io, socket, data));

    socket.on("disconnect", () => handleDisconnect(io, socket));
  });

  return io;
};

module.exports = {initializeSocket,User};
