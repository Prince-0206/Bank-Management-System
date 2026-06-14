const  jwt  = require("jsonwebtoken");
const usermodel = require("../models/user.model");
const cookieParser = require("cookie-parser");

async function userLoginController(req,res) {
    const { email ,password} = req.body
    const user = await usermodel.findOne({email}).select('+password')
    if(!user){
        return res.status(401).status({
            message:"user and password is invalid"
        })
    }
 const validuser = await user.comparepassword(password)
 if(!validuser){
    return res.status(401).status({
            message:"user and password is invalid"
        })
 }

 const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:'3d'})

res.cookie('token' , token)
res.status(200).json({
    user:{
        _id:user._id,
        email:user.email,   
        name:user.name
    },
    token
})
}
module.exports = {userLoginController}