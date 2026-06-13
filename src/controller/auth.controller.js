const  jwt  = require("jsonwebtoken");
const usermodel = require("../models/user.model");


async function userResisterController(res , req){
const { email , name , password} = req.body
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
const token = jwt.sign({userId: user._id},process.env.JWT_SECRET)
}
module.exports = {userResisterController}