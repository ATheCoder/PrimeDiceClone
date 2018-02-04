const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://arasharbabi.com:27017/primedice')

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

// AccessTokenSchema.pre('save', function(next) {
//     let user = this;
//     console.log(this.accessToken);
//     bcrypt.hash(user.accessToken, 10, (err, hash) => {
//         if(err) return console.log(err);
//         user.accessToken = hash;
//         next();
//     })
//
// });

let AccessToken = mongoose.models.AccessToken || mongoose.model('AccessToken', AccessTokenSchema)

module.exports = AccessToken
