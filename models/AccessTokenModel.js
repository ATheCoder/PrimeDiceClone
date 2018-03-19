const mongoose = require('mongoose')
const agui = require('aguid')

let AccessTokenSchema = new mongoose.Schema({
  user_id: {type: String, unique: true, required: true, trim: true},
  accessToken: {type: String, required: true, unique: true}
})

AccessTokenSchema.statics.createAccessToken = function (UserObject, cb) {
  let username = UserObject.username
  let guid = agui()
  AccessToken.findOne({user_id: username}).exec((err, accessToken) => {
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
