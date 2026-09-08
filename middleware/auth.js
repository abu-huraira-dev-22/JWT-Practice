const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const auth = async(req,res,next)=>{
    try {
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader != 'undefined'){
            const token = bearerHeader.split(' ')[1]
            const user = jwt.verify(token, process.env.JWT_SECRET)
        }
        else{
            res.status(401).json({
                message:"Not token provided"
            })
        }
        next()
    } catch (error) {
        res.status(403).json({
                message:"Invalid or expired token"
            })
    }
}

module.exports= auth