const register = require('express').Router()
const User = require('../models/UserModel')
const SeedPair = require('../models/SeedPairModel')

register.post('/register', (req, res) => {
  if (req.body.username && req.body.password) {
    let userData = {
      username: req.body.username,
      password: req.body.password,
      balance: 0
    }
    User.findOne({username: req.body.username}, function (err, result) {
      if (err) console.log(err)
      if (result) {
        res.status(400).send('Username already exists')
      } else {
        User.create(userData, (err, user) => {
          if (err) return res.send(err)
          SeedPair.createSeedPair(user.username, function () {
            return res.status(200).send('User created Successfully')
          })
        })
      }
    })
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = register
