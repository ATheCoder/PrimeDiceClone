const login = require('express').Router();
const User = require('../models/UserModel');

login.post('/login', (req, res) => {
    if(req.body.username && req.body.password){
        let username = req.body.username;
        let password = req.body.password;
        User.auth(username, password, function(guid){
            if(!guid){
                res.send('Login Unsuccessful')
            }
            else{
                res.cookie('AccessToken', JSON.stringify(guid));
                res.send('Login Successful: ' + guid)
            }
        })
    }
});

module.exports = login;