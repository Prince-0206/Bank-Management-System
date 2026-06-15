const mongoose  = require("mongoose");

 const transactionschema = new mongoose.Schema({
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,'Transaction mush be associated with a from account'],
        index:true
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,'Transaction mush be associated with a to account'],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['PENDING','SUCCESSFULL','REVERSED','FAILED'],
            message:'Status can be either failed , success , reversed or pending'
        },
        default:'PENDING'
    },
    ammount:{
        type:Number,
        required:true,
        min:0
    },
    idempotencyKey:{
        type:String,
        required:true,
        index:true,
        unique:true
    }
 },{timestamps:true}
)

const transactionmodel = mongoose.model('transaction',transactionschema)

module.exports = transactionmodel