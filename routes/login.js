const login = require('express').Router();
const User = require('../models/UserModel');

login.post('/login', (req, res) => {
    if(req.body.username && req.body.password){
        let {username, password, twoFAToken} = req.body;
        User.auth(username, password, function(err, result){
            if(err) res.status(500).send('Internal Server Error');
            else if(!result){
                res.status(400).send('Incorrect information')
            }
            else{
                res.cookie('AccessToken', JSON.stringify(result));
                res.status(200).json(result);
            }
        }, twoFAToken)
    }
    else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.');
});

module.exports = login;