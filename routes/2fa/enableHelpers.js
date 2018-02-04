const speakeasy = require('speakeasy')
const User = require('../../models/UserModel')

const generate2FASecret = (length) => {
  return speakeasy.generateSecret(({length: length})).base32
}

const save2FAKeyToDB = (username, twoFASecret, cb) => {
  User.findOne({username: username}, function (err, user) {
    user.update({$set: {twoFASecret: twoFASecret}}, function (err, newUser) {
      if (err) return cb(err)
      return cb(null, newUser)
    })
  })
}

const validate2FAToken = (twoFASecret, twoFAToken) => {
  return speakeasy.totp.verify({
    secret: twoFASecret,
    encoding: 'base32',
    token: twoFAToken
  })
}

module.exports = {generate2FASecret, save2FAKeyToDB, validate2FAToken}
