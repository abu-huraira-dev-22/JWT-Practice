const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

app.post("/signup", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password,10)
    const newUserData = {...req.body, password:hashPassword}
    const addUsers = new UserModel(newUserData);
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

app.post('/login',async(req,res)=>{
  try {
    const user = await UserModel.findOne({email:req.body.email})
    if(!user){
      res.status(404).json({
        status:false,
        message: 'User Not Found'
      })
    }
    else{
      const isMatch = await bcrypt.compare(req.body.password,user.password)
      if(!isMatch){
        res.status(401).json({
          status:false,
          message:"Wrong Password"
        })
      }
      else{
        const token = jwt.sign(
          {userId: user._id},
          'mySecretKey123',
          {expiresIn:"1h"}
        )

        res.status(200).json({
        status:true,
        message: "User Found",
        token:token
      })
      }
    }
  } catch (error) {
    res.status(500).json({
      status:false,
      message:"Internal Server Error"
    })
  }
})

app.listen(5000, () => {
  console.log("Server is running");
});
