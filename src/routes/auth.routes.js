 const express = require('express')
const authcontroller = require('../controller/auth.controller')
const loginauth= require('../controller/authlogin.controller')

 const router = express.Router()


router.post('/resister' , authcontroller.userResisterController)

router.post('/login' , loginauth.userLoginController)




 module.exports = router