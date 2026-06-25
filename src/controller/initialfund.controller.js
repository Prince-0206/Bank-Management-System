const transactionmodel = require('../models/transaction.model')
const ledgermodel = require('../models/ledger.model')
const accountmodel = require('../models/account.model')
const mongoose  = require('mongoose')


async function createInitialFundsTransaction(req,res) {
     const { toaccount, amount, idempotencyKey } = req.body

     if (!toaccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Necessary details are required"
        })
    }

    const touseraccount = await accountmodel.findOne({ _id: toaccount })

    if (!touseraccount) {
        return res.status(400).json({
            message: "Invalid user"
        })
    }

    const fromuseraccount = await accountmodel.findOne({
        user: req.user._id
    })
    if(!fromuseraccount){
        return res.status(400).json({
            message: "system user not found"
    })
}
const session = mongoose.startSession()
session.startTransaction()

const transaction = new transactionmodel({
    fromaccount:fromuseraccount._id,
        toaccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })
const debitledgerEntry = await ledgermodel.create([{
    account:fromuseraccount._id,
    amount:amount,
    transaction:transaction._id,
    type:'DEBIT'
}],{session})

const creditledgerEntry = await ledgermodel.create([{
    account:touseraccount._id,
    amount:amount,
    transaction:transaction._id,
    type:'CREDIT'
}],{session})


transaction.status = "SUCCESSFULL"
await transaction.save({session})

(await session).commitTransaction()
session.endSession()

return res.status(201).json({
    message:"Initial fund transaction completed",
    transaction:transaction
})

}

module.exports ={ createInitialFundsTransaction}