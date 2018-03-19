const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const AccessToken = require('./AccessTokenModel')
const twoFAHelper = require('../routes/2fa/enableHelpers')
const diffMinutes = require('../utils/diffMinutes')

let UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true, trim: true, lowercase: true},
  displayName: {type: String, trim: true, unique: true},
  password: {type: String, required: true},
  balance: {type: Number, required: true, default: 0},
  twoFASecret: {type: String},
  wagered: {type: Number, default: 0},
  numberOfBets: {type: Number, default: 0, get: v => Math.round(v), set: v => Math.round(v)},
  lastFaucet: {type: Date, default: Date.now()},
  passwordResetToken: {type: String, unique: true},
  passwordResetDate: {type: Date},
  email: {type: String, unique: true},
  createdAt: {type: Date, default: Date.now()}
})

const validatePassword = (userObject, password, cb) => {
  bcrypt.compare(password, userObject.password, function (err, result) {
    if (!result) return cb(false, false)
    AccessToken.createAccessToken(userObject, function (err, result) {
      if (err) console.log(err)
      return cb(null, result)
    })
  })
}

const getUserObject = (username, cb) => {
  User.findOne({username: username}).exec(function (err, user) {
    if (err) return cb(err)
    return cb(null, user)
  })
}

UserSchema.statics.findUserByAccessToken = (accessToken, cb) => {
  AccessToken.findOne({username: accessToken}, function (err, resultingToken) {
    if (err) cb(err)
    else if (!accessToken) return Error('Access Token Not Found!')
  })
}

UserSchema.statics.auth = function (username, password, cb, twoFAToken) {
  username = username.toLowerCase()
  getUserObject(username, function (err, userObject) {
    if (err) return console.log(err)
    else if (!userObject) return cb(null, null)
    switch (true) {
      case userObject.twoFASecret === undefined:
        validatePassword(userObject, password, function (err, newAccessToken) {
          if (err) return cb(err)
          cb(null, newAccessToken)
        })
        break
      case !!userObject.twoFASecret:
        if (twoFAHelper.validate2FAToken(userObject.twoFASecret, twoFAToken)) {
          validatePassword(userObject, password, function (err, newAccessToken) {
            if (err) return cb(err)
            return cb(null, newAccessToken)
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

UserSchema.methods.getFaucet = function (cb) {
  let user = this
  if (user.balance !== 0) {
    cb('Your balance needs to be zero in order to get a faucet')
  } else if (diffMinutes(Date.now(), user.lastFaucet.getTime()) <= 2) {
    console.log('Now date is: ' + Date.now())
    console.log('That date is: ' + user.lastFaucet.getTime())
    console.log('diff is: ' + diffMinutes(Date.now(), user.lastFaucet.getTime()))
    console.log('diff without function is: ' + ((+Date.now() - +user.lastFaucet.getTime())) / 1000)
    cb('You need to wait two minutes before you can get a faucet')
  } else {
    user.update({$set: {balance: user.balance + 0.00000010, lastFaucet: Date.now()}}, function (err) {
      if (err) cb('err')
      else cb('Done!')
    })
  }
}

UserSchema.methods.isBalanceEnough = function (checkAmount) {
  return this.balance >= checkAmount
}

UserSchema.pre('save', function (next) {
  let user = this
  if (!user.displayName) {
    user.displayName = user.username
  }
  user.username = user.username.toLowerCase()
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return console.log(err)
    user.password = hash
    next()
  })
})

let User = mongoose.models.User || mongoose.model('User', UserSchema)

module.exports = User
