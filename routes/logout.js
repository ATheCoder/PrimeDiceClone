const logout = require('express').Router();
const AccessToken = require('../models/AccessTokenModel');

logout.post('/logout', (req, res) => {
    if(req.body.username && req.body.accessToken){
        let accessToken = req.body.accessToken;
        let username = req.body.username;
        AccessToken.logout(username, accessToken, function (result) {
            if(!result){
                res.send('Logout Unsuccessful')
            }
            else{
                res.send('Logout Successful')
            }
        })
    }
});

module.exports = logout;