const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let AccessTokenSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  accessToken: {
    type: String,
    required: true,
    unique: true
  }
})

AccessTokenSchema.statics.logout = function (accessToken, cb) {
  AccessToken.remove({accessToken: accessToken}, function (err) {
    if (err) cb(false)
    else {
      cb(true)
    }
  })
}

let AccessToken = mongoose.models.AccessToken || mongoose.model('AccessToken', AccessTokenSchema)

module.exports = AccessToken
