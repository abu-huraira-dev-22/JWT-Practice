const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../model/UserModel");
dotenv.config();

router.post("signup", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    res.status(400).json({
      message: "Username or email is already exists",
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, hashedPassword });
    const savedUser = await user.save();
    res.json(savedUser);
  }
});

router.post("login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(passwrod, user.password);
    if (!isMatch) {
      res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/logout',(req,res)=>{
    res.json({
        message:"Logged out Successfully"
    })
})

module.exports = router