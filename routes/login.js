const login = require('express').Router()
const User = require('../models/UserModel')
const Helper = require('./helper')
const compression = require('compression')

login.use(compression())

login.post('/login', (req, res) => {
  if (req.body.username && req.body.password) {
    let {username, password, twoFAToken} = req.body
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
            result._doc.accessToken = accessToken
            res.cookie('AccessToken', JSON.stringify(accessToken))
            res.status(200).json(result)
          }
        })
      }
    }, twoFAToken)
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = login
