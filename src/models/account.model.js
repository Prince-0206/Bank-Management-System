const  mongoose  = require("mongoose");

const accountschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: [true ,'Account mush be assosiated with a user'],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['ACTIVE','FROZEN','CLOSED'],
            message:"Status can be either active , frozen or closed",
            
        },default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true ,'currency is required to creating an account'],
        default:'INR'
    }
},{
    timestamps:true
})

accountschema.index({user:1,status:1})

const accountmodel = mongoose.model('account', accountschema)
module.exports = accountmodel