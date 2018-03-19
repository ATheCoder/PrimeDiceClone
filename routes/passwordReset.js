const passwordReset = require('express').Router()
const sendPasswordResetEmail = require('../mail/sendPasswordResetEmail')
const moment = require('moment')
const aguid = require('aguid')
const User = require('../models/UserModel')

passwordReset.post('/passwordReset', (req, res) => {
  let {username, email} = req.body
  User.findOne({username: username, email: email}).exec((err, user) => {
    if (err) res.status(500).send('Internal Server Error')
    else if (!user) res.status(400).send('The Username and Email combination you entered was not found!')
    else {
      generatePasswordResetToken(user, (err, token) => {
        if (err) res.status(500).send('Internal Server Error')
        if (token) {
          sendPasswordResetEmail(user.email, token, (err) => {
            if (err) res.status(500).send('Internal Server Error')
            else res.status(200).send('Password reset email was just sent!')
          })
        }
      })
    }
  })
})

const generatePasswordResetToken = (user, done) => {
  let token = aguid().replace(/-/g, '')
  user.update({$set: {passwordResetToken: token, passwordResetDate: moment().add(12, 'h')}}, function (err) {
    if (err) {
      done(err)
    } else {
      done(false, token)
    }
  })
}

module.exports = passwordReset
