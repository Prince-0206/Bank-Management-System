const express = require('express')
const authRouter = require('./routes/auth.routes')
const cookieparser = require('cookie-parser')
const Accountrouter = require('./routes/account.routes')
const transactionrouter = require('./routes/transaction.routes')


const app = express()


app.use(express.json())
app.use(cookieparser())


app.use('/api/auth', authRouter)
app.use('/api/accounts', Accountrouter)
app.use('./api/transactions',transactionrouter)


module.exports = app

