const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const aguid = require('aguid')
const AccessToken = require('./AccessTokenModel')
const twoFAHelper = require('../routes/2fa/enableHelpers')

mongoose.connect('mongodb://arasharbabi.com:27017/primedice')

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number
  },
  twoFASecret: {
    type: String
  }
})

const validatePasswordAndMakeToken = (userObject, password, cb) => {
  bcrypt.compare(password, userObject.password, function (err, result) {
    if (!result) return cb(false, false)
    createAccessToken(userObject.username, function (err, result) {
      if (err) console.log(err)
      return cb(null, result)
    })
  })
}

const getUserObject = (username, cb) => {
  User.findOne({username: username}, function (err, user) {
    if (err) return cb(err)
    return cb(null, user)
  })
}

const createAccessToken = (username, cb) => {
  let guid = aguid()
  findAccessToken(username, function (err, accessToken) {
    if (err) cb(err)
    if (!accessToken) {
      AccessToken.create({user_id: username, accessToken: guid}, function (err, newAccess) {
        if (err) return cb(err)
        return cb(null, guid)
      })
    } else {
      accessToken.update({$set: {accessToken: guid}}, function (err, newAccess) {
        if (err) return cb(err)
        return cb(null, guid)
      })
    }
  })
}

const findAccessToken = (username, cb) => {
  AccessToken.findOne({user_id: username}, function (err, foundToken) {
    if (err) return cb(err)
    return cb(null, foundToken)
  })
}

UserSchema.statics.auth = function (username, password, cb, twoFAToken) {
  getUserObject(username, function (err, userObject) {
    if (err) return console.log(err)
    else if (!userObject) return cb(null, null)
    switch (true) {
      case userObject.twoFASecret === undefined:
        validatePasswordAndMakeToken(userObject, password, function (err, result) {
          if (err) return cb(err)
          cb(null, result)
        })
        break
      case !!userObject.twoFASecret:
        if (twoFAHelper.validate2FAToken(userObject.twoFASecret, twoFAToken)) {
          validatePasswordAndMakeToken(userObject, password, function (err, result) {
            if (err) return cb(err)
            return cb(null, result)
          })
        } else return cb(null, null)
    }
  })
}

UserSchema.methods.changePassword = function (newPassword, cb) {
  let user = this
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) console.log(err)
    user.update({$set: {password: hash}}, function (err, message) {
      if (err) console.log(err)
      cb(true)
    })
  })
}

UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return console.log(err)
    user.password = hash
    next()
  })
})

let User = mongoose.models.User || mongoose.model('User', UserSchema)

module.exports = User
