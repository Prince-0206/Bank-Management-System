const express = require('express')
const logincheck = require('../middleware/authcheck.middleware')
const transactioncontroller= require('../controller/transaction.controller')
const systemmiddlewaresuth = require('../middleware/authsystem.middleware')
const createInitialFunds = require('../controller/initialfund.controller')


const router = express.Router()


router.post('/', logincheck.logincheckerMiddleware , transactioncontroller.createtransactions)
router.post('/system/initial-funds' , systemmiddlewaresuth.authsystemusermiddleware , createInitialFunds.createInitialFundsTransaction)


module.exports = router

