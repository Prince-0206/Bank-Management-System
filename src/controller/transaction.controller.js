const transactionmodel = require('../models/transaction.model')
const ledgermodel = require('../models/ledger.model')
const emailservice = require('../services/email.service')
const accountmodel = require('../models/account.model')

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
}