const logout = require('express').Router()
const AccessToken = require('../models/AccessTokenModel')

logout.post('/logout', (req, res) => {
  if (req.body.accessToken) {
    let accessToken = req.body.accessToken
    AccessToken.logout(accessToken, function (result) {
      if (!result) {
        res.status(400).send('Logout Unsuccessful')
      } else {
        res.status(200).send('Logout successful')
      }
    })
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = logout
