const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
const UserModel = require("./model/UserSchema");
dotenv.config();

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("Connection Error:", err));

app.post('/users',async(req,res)=>{
  try {
    const addUsers = new UserModel(req.body)
    await addUsers.save()
    const token =jwt.sign({userId: addUsers._id}, 'secret-key',{expiresIn:'1h'})
    res.json({
      status:true,
      message:'User Added Succesfully', 
      token:token
    })
  } catch (error) {
    res.status(500).json({
      status:false,
      message:"Something went wrong",
      error: error.message
    })
  }
})




app.listen(2000,()=>{
  console.log('Server is running')
})