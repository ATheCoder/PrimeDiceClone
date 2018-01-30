const User = require('../models/UserModel');
const AccessToken = require('../models/AccessTokenModel');

const getUserByAccessToken = (accessToken, cb) => {
    AccessToken.findOne({accessToken: accessToken}, function (err, resultToken) {
        if(err) return cb(err);
        if(!resultToken) return cb(null, null);
        User.findOne({username: resultToken.user_id}, function (err, resultUser) {
            if(err) cb(err);
            cb(null, resultUser)
        })
    })
}

module.exports = {getUserByAccessToken};