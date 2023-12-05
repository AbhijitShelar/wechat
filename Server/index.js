const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const http = require("http"); // Import http module
const socketIO = require("socket.io");
const mongoose = require("mongoose");
dotenv.config();



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app); // Create an HTTP server
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3001', // Update with the correct origin of your client application
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', (socket) => {
  console.log("A user connected");

  socket.on('user-joined', (name) => {
    users[socket.id] = name;
    console.log(name);
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.json({ message: "server" });
});

const userInfo = mongoose.model("userInfo", {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  mobile: Number,
  age: Number,
});

app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, age } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    await userInfo.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      mobile,
      age,
    });
    res.json({
      status: "SUCCESS",
      message: "You've signed up successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

app.post("/api/validateToken", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({
      status: false,
      message: "Token not provided",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userInfo.findOne({ email });

    if (user && user.password) {
      let hasPasswordMatched = await bcrypt.compare(password, user.password);
      if (hasPasswordMatched) {
        const token = jwt.sign({ userId: user._id }, '123', { expiresIn: '1h' });
        res.json({
          message: "You have Logged In successfully",
          status: true,
          token: token,
          name: user.firstName
        });
      } else {
        res.json({
          message: "Incorrect Password",
          status: false
        });
      }
    } else {
      res.json({
        message: "User Does not Exist",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Connection Successful and Server running on port: ${PORT}`)
    )
    .catch((error) => console.log(error));
});
