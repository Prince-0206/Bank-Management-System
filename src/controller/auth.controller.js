const  jwt  = require("jsonwebtoken");
const usermodel = require("../models/user.model");
const cookieParser = require("cookie-parser");
const  EmailSender  = require("../services/email.service");



async function userResisterController(req,res){
const {email , name , password} = req.body
const isexist = await usermodel.findOne({
    email:email
})
if(isexist){
    return res.status(422).json({
        message:"user already exist with email",
        status:"failed"
    })
}
const user = await usermodel.create({
    email,password,name 
})
const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'3d'})

res.cookie('token' , token)
res.status(201).json({
    user:{
        _id:user._id,
        email:user.email,   
        name:user.name
    },
    token
})
await EmailSender.sendRegistrationEmail(user.email , user.name)
}
module.exports = {userResisterController}