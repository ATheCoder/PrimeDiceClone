const passwordRoute = require('express').Router()
const User = require('../models/UserModel')
const Helper = require('./helper')

passwordRoute.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

passwordRoute.post('/password', (req, res) => {
  let {accessToken, oldPassword, password, twoFAToken} = req.body
  if (accessToken && oldPassword && password) {
    Helper.getUserByAccessToken(accessToken, function (err, foundUser) {
      if (!foundUser) res.status(400).send('AccessToken is invalid')
      else {
        User.auth(foundUser.username, oldPassword, function (err, newAccessToken) {
          if (newAccessToken) {
            foundUser.changePassword(password, function (result) {
              if (result) {
                let endJSON = {}
                endJSON.newAccessToken = newAccessToken
                endJSON.message = 'Password changed successfully'
                res.status(200).json(endJSON)
              }
            })
          } else if (!newAccessToken) {
            res.status(400).send('Incorrect information')
          }
        }, twoFAToken)
      }
    })
  }
})

module.exports = passwordRoute
