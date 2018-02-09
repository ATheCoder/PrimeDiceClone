const bcrypt = require('bcrypt')
const tapale = require('express').Router()
const User = require('../models/UserModel')

tapale.post('/tapale', function (req, res) {
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    res.status(200).json(foundUser)
  })
})

module.exports = tapale
