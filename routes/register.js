const register = require('express').Router()
const User = require('../models/UserModel')
const SeedPair = require('../models/SeedPairModel')
const Helper = require('./helper')

register.post('/register', (req, res) => {
  console.time('registerRequest')
  if (req.body.username && req.body.password) {
    let userData = {
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.username,
      balance: 0.00000010
    }
    User.findOne({username: req.body.username.toLowerCase()}, function (err, result) {
      if (err) console.log(err)
      if (result) {
        res.status(400).send('Username already exists')
      } else {
        User.create(userData, (err, user) => {
          if (err) return res.send(err)
          SeedPair.createSeedPair(user.username, function () {
            console.timeEnd('registerRequest')
            User.auth(req.body.username, req.body.password, function (err, accessToken) {
              if (err) res.status(500).send('Internal Server Error')
              else {
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
            })
          })
        })
      }
    })
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = register
