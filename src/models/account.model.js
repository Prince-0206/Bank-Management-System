const  mongoose  = require("mongoose");
const ledgermodel = require("./ledger.model");

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

accountschema.methods.getbalance = async function() {
    const balancedata = await ledgermodel.aggregate([
        {
            $match: { account: this._id }
        },
        {
            $group: {
                _id: null,
                totaldebit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'DEBIT'] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalcredit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'CREDIT'] },
                            '$amount',
                            0
                        ]
                    }
                }
            }
        },{
            $project:{
                _id:0,
                balance:{$subtract:['$totalcredit','totaldebit']}
            }
        }
    ])
    if(balancedata.length === 0){
        return 0
    }
    return balancedata[0].balance
    
}
const accountmodel = mongoose.model('account', accountschema)
module.exports = accountmodel