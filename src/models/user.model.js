const mongoose  = require("mongoose");
 const bcrypt = require('bcryptjs')

const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating user"],
        trim: true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "enter valid mail"],
            unique:[true , "email already exists."]
    },
        name:{
            type:String,
            required:[true,"useername is required for creating user"],    
        },
        password:{
            required:[true,"Password is required for creating user"],
            type:String,
            minlength:[6,"password should be contain more than 6 character"],
            select:false
        }
}
,{ timestamps:true
        })
userschema.pre("save" , async function (next) {
    if(!this.isModified('password')){
        return next()
    }
    const hashedpass = await bcrypt.hash(this.password,10)
    this.password = hashedpass
        return next()
})

userschema.methods.comparepassword = async function (password){
return await bcrypt.compare(password , this.password)
}

const usermodel = mongoose.model('user' , userschema)

module.exports = usermodel