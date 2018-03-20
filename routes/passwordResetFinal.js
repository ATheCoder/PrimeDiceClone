const passwordResetFinal = require('express').Router()
const User = require('../models/UserModel')

passwordResetFinal.post('/passwordResetFinal', (req, res) => {
  let {passwordResetToken, newPassword} = req.body
  if (passwordResetToken && newPassword) {
    User.findOne({passwordResetToken, passwordResetDate: {$gt: Date.now()}}, function (err, user) {
      if (err) res.status(500).send('Internal Server Error')
      else if (!user) res.status(400).send('Password Reset Token is Invalid or expired')
      else {
        user.changePassword(newPassword, function (result) {
          if (result) res.status(200).send('Password was successfully changed!')
        })
      }
    })
  } else {
    res.status(400).send('Nothing happened!')
  }
})

module.exports = passwordResetFinal
