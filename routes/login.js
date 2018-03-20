const login = require('express').Router()
const User = require('../models/UserModel')
const Helper = require('./helper')
const checkCaptcha = require('../utils/checkCaptcha')
const compression = require('compression')
const config = require('../config')

login.use(compression())

login.post('/login', async (req, res) => {
  if (req.body.username && req.body.password) {
    let {username, password, twoFAToken, gRecaptchaResponse} = req.body
    let response = !config.isProduction() ? 'true' : await checkCaptcha(gRecaptchaResponse)
    if (!config.isProduction() || response) {
      User.auth(username, password, function (err, accessToken) {
        if (err) res.status(500).send('Internal Server Error')
        else if (!accessToken) {
          res.status(400).send('Incorrect information')
        } else {
          Helper.getUserByAccessToken(accessToken, function (err, result) {
            if (err) res.status(500).send('Internal server error')
            else {
              delete result._doc.password
              delete result._doc._id
              delete result._doc.passwordResetToken
              delete result._doc.passwordResetDate
              result._doc.accessToken = accessToken
              res.cookie('AccessToken', JSON.stringify(accessToken))
              res.status(200).json(result)
            }
          })
        }
      }, twoFAToken)
    } else {
      res.status(403).json('Invalid Captcha')
    }
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = login
