const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://arasharbabi.com:27017/primedice');

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
});

AccessTokenSchema.statics.logout = function(username, accessToken, cb){
    AccessToken.findOne({user_id: username}).exec(function (err, user){
        if(err) return console.log(err);
        if(!user) return cb(false);
        bcrypt.compare(accessToken, user.accessToken, function(err, result){
            if(err) return console.log(err)
            if(result === true){
                user.remove();
                let result = true;
                return cb(result)
            }
            else{
                let result = false;
                return cb(result);
            }
        })
    })
};

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

let AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = AccessToken;


