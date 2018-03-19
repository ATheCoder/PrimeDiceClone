const faucet = require('express').Router()
const checkCaptcha = require('../utils/checkCaptcha')
const getUserByAccessToken = require('./helper').getUserByAccessToken

faucet.post('/faucet', async (req, res) => {
  let {accessToken, gRecaptchaResponse} = req.body
  let captchaAnswer = await checkCaptcha(gRecaptchaResponse)
  if (!captchaAnswer) {
    res.status(403).send('Captcha is not right!')
  } else {
    getUserByAccessToken(accessToken, function (err, user) {
      if (err) {
        res.status(400).send('AccessToken is invalid')
      } else if (!user) {
        res.status(400).send('AccessToken is invalid')
      } else {
        user.getFaucet(function (answer) {
          if (answer !== 'Done!') {
            res.status(400).send(answer)
          } else {
            res.status(200).send('Faucet added!')
          }
        })
      }
    })
  }
})

module.exports = faucet
