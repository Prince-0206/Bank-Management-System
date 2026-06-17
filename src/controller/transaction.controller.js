const transactionmodel = require('../models/transaction.model')
const ledgermodel = require('../models/ledger.model')
const emailservice = require('../services/email.service')
const accountmodel = require('../models/account.model')
const mongoose  = require('mongoose')


async function createtransactions(req, res) {
    const { fromaccount, toaccount, amount, idempotencyKey } = req.body

    if (!fromaccount || !toaccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Necessary details are required"
        })
    }

    const fromuseraccount = await accountmodel.findOne({ _id: fromaccount })
    const touseraccount = await accountmodel.findOne({ _id: toaccount })

    if (!touseraccount || !fromuseraccount) {
        return res.status(400).json({
            message: "Invalid user"
        })
    }

    const existingtransaction = await transactionmodel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (existingtransaction) {
        if (existingtransaction.status === 'SUCCESSFULL') {
            return res.status(200).json({
                message: 'Transaction is completed already',
                transaction: existingtransaction
            })
        }
        if (existingtransaction.status === 'PENDING') {
            return res.status(200).json({
                message: 'Transaction is pending'
            })
        }
        if (existingtransaction.status === 'FAILED') {
            return res.status(200).json({
                message: 'Transaction is failed'
            })
        }
        if (existingtransaction.status === 'REVERSED') {
            return res.status(200).json({
                message: 'Transaction was reversed'
            })
        }
    }

    if (fromuseraccount.status !== 'ACTIVE' || touseraccount.status !== 'ACTIVE') {
        return res.status(400).json({
            message: 'Fromaccount or Toaccount is frozen'
        })
    }

    const balance = await fromaccount.getbalance()

    if (balance < amount){
        return res.status(400).json({
            message:"insufficiant balance"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionmodel.create({
        fromaccount,
        toaccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },{session})

    const DebitLedgerEntry = new ledgermodel.create({
        account:fromaccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session})

    const CreditLedgerEntry = new ledgermodel.create({
        account:toaccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session})

    transaction.status = 'SUCCESSFULL'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    await emailservice.sendTransacationEmail(req.user.email, req.user.name , req.user.amount , req.user.toaccount)
    return res.status(201).json({
        message:"transaction completed successfully",
        transaction:transaction
    })
}

module.exports = {createtransactions}