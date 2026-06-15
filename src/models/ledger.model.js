const mongoose  = require("mongoose");

const ledgerschema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true , 'ledger must be associated with an account'],
        index: true,
        immutable:true
    },
    ammount:{
        type:Number,
        required:[true ,'Ammount is required to create a ledger entry'],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        required:[true , 'ledger must be associated with a transaction'],
        index: true,
        immutable:true
    },
    type:{
        type:String,
        immutable:true,
        required:true,
        enum:{
            values:['CREDIT , DEBIT']
        }
    }
})


function preventledgermodification(){
    throw new Error("ledgeer is immutable and cannot be modified or change and delete")
}

ledgerschema.pre('findOneAndUpdate', preventModification)
ledgerschema.pre('updateOne', preventModification)
ledgerschema.pre('updateMany', preventModification)
ledgerschema.pre('findByIdAndUpdate', preventModification)

ledgerschema.pre('findOneAndDelete', preventModification)
ledgerschema.pre('deleteOne', preventModification)
ledgerschema.pre('deleteMany', preventModification)
ledgerschema.pre('findByIdAndDelete', preventModification)


const ledgermodel = mongoose.model('ledger', ledgerschema);
 module.exports = ledgermodel