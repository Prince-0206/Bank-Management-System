const express = require('express')
const logincheck = require('../middleware/authcheck.middleware')
const createAccount  = require('../controller/account.controller')



const router = express.Router()

router.post('/' , logincheck.logincheckerMiddleware,createAccount.createAccController)


module.exports = router