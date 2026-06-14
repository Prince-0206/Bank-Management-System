const { JsonWebTokenError } = require("jsonwebtoken");
const usermodel = require("../models/user.model");

async function loginchecker(req , res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(410).json({
            message:"Unauthorized access , token is missing"
        })
    }
    try{
        const decoded = jwt.verify('token' , process.env.JWT_SECRET)
        const user = await usermodel.findById(decoded.userId)
        req.user = user
        return next()
    }catch(err){
        return res.status(410).json({
            message:"Unauthorized access , token is invalid"
    })
}
}