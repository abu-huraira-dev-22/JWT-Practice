const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/UserSchema");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("Connection Error:", err));

app.get("/users", async (req, res) => {
  try {
    const getUsers = await UserModel.find();
    res.status(200).json({
      status: true,
      message: "All User Data",
      data: getUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const addUsers = new UserModel(req.body);
    await addUsers.save();
    res.status(200).json({
      status: true,
      message: "Users Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server is running");
});
