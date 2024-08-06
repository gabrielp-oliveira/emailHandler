const express = require('express')
const checkEmail = require('../middlewares/validateEmail')

const {sendTextEmail} = require('../nodemailer/index')

const router = express.Router()
require('dotenv').config()

router.post('/text', checkEmail, async (req, res) => {
    try {
        const info = req.body
        const result = await sendTextEmail(info)
        res.send(result)
    } catch (error) {
        res.send({error: error})
    }
})

router.post((req, res) => {
    return res.send('ok')
})

module.exports = app => app.use('/sendEmail', router)