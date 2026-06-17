const jwt  = require("jsonwebtoken");
const usermodel = require("../models/user.model");

async function authsystemusermiddleware(req, res , next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(410).json({
            message:"Unauthorized access , token is missing"
        })
}

try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const user = await usermodel.findById(decoded.userId).select('+systemuser')
        if(!user.systemuser){
            return res.status(401).json({
                message:"forbidden access , not a system user"
            })
        }
        req.user = user
        return next()
    }catch(err){
        return res.status(410).json({
            message:"Unauthorized access , token is invalid"
    })
}
}

module.exports = {authsystemusermiddleware}