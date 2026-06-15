const transactionmodel = require('../models/transaction.model')
const ledgermodel = require('../models/ledger.model')
const emailservice = require('../services/email.service')
const accountmoodel = require('../models/account.model')


async function createtransactions(req , res) {
    const{fromaccount , toaccount , amount , idempotencyKey} = req.body

    if(!fromaccount , !toaccount , !amount , !idempotencyKey){
        return res.status(401).json({
            message:"Necessary details are required"
        })
    }
    const fromuseraccount = await accountmoodel.findone({
        _id:fromaccount
    })
    const touseraccount = await accountmoodel.findone({
        _id:toaccount
    })
}if(!touseraccount || !fromuseraccount){
    return res.status(400).json({
            message:"invalid user"
        })
}