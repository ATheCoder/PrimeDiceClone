const email = require('express').Router()
const getUserByAccessToken = require('./helper').getUserByAccessToken

email.post('/email', (req, res) => {
  let {accessToken, email} = req.body
  getUserByAccessToken(accessToken, (err, user) => {
    if (err) res.status(500).send('Internal Server Error')
    else if (!user) res.status(400).send('AccessToken not found')
    else {
      user.update({$set: {email}}, function (err) {
        if (err) res.status(500).send('Internal Server Error')
        else res.status(200).send('Email has been set successfully')
      })
    }
  })
})

module.exports = email
