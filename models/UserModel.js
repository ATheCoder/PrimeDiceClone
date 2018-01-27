const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const aguid = require('aguid');
const AccessToken = require('./AccessTokenModel');

mongoose.connect('mongodb://arasharbabi.com:27017/primedice');

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
        type: Number,
    }
});

UserSchema.statics.auth = function (username, password, cb){
    User.findOne({username: username}).exec(function (err, user) {
        if(err) return console.log(err);
        else if(!user) return cb(false);
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                let guid = aguid();
                AccessToken.create({user_id: user.username, accessToken: guid}, function(err, newAccess){
                    if(err) return console.log(err);
                    if(newAccess){
                        return cb(guid)
                    }
                    else{
                        return cb(false);
                    }
                });
            }
            else{
                return cb(false)
            }
        })
    })
};

UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return console.log(err);
        user.password = hash;
        next();
    })
});

let User = mongoose.model('User', UserSchema);

module.exports = User;


