 const express = require('express')
const authcontroller = require('../controller/auth.controller')

 const router = express.Router()


router.post('/resister' , authcontroller.userResisterController)






 module.exports = router