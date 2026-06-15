const express = require('express')
const logincheck = require('../middleware/authcheck.middleware')

const router = express.Router()


router.post('/', logincheck.logincheckerMiddleware)