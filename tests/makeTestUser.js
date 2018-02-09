const User = require('../models/UserModel')
const mongoose = require('mongoose')

async function makeTestUser (balanceAmount, cb) {
  mongoose.connect('mongodb://arasharbabi.com:27017/primedice', function () {
    mongoose.connection.db.dropDatabase().then(() => {
      User.create({username: 'NervousFiend', password: '76527652arash', displayName: 'NervousFiend'}, function (err, newUser) {
        if (err) console.log(err)
        User.auth(newUser.username, '76527652arash', function (err, accessToken) {
          if (err) console.log(err)
          cb(accessToken)
        })
      })
    })
  })
}

module.exports = makeTestUser
