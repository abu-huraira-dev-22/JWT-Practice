const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./model/UserSchema");
const app = express();

app.use(express.json());
app.use(cors());
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    status: true,
    message: "Login successful",
    token: token,
  });
});
