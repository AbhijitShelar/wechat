//Server files

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = 3000;
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
    await userInfo.create({
      firstName,
      lastName,
      email,
      password,
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

app.listen(port, () => {
  mongoose
    .connect(
       "mongodb+srv://admin:admin1761@cluster0.0ljqxdd.mongodb.net/?retryWrites=true&w=majority" )
    .then(() =>
      console.log("Connection Succesfull and Server running on port 3000")
    )
    .catch((error) => console.log(error));
});
