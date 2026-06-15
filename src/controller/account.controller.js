const accountmodel = require("../models/account.model");
const usermodel = require("../models/user.model");


async function createAccController(req , res) {
    const user = req.user;
    const account = await accountmodel.create({
        user:user._id
    })
    res.status(201).json({
        account
    })
}

module.exports = {createAccController}